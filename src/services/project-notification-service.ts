// src/services/notification-service.ts

import { prisma } from '@/lib/prisma';
import telerivet from 'telerivet';

// Helper function to format phone number
function formatPhoneNumber(phone: string): string {
    // Remove any non-digit characters except the + sign at the beginning
    const formattedPhone = phone.trim();

    // If it already starts with +63, return as is
    if (formattedPhone.startsWith('+63')) {
        return formattedPhone;
    }

    // Remove any non-digit characters
    const digitsOnly = formattedPhone.replace(/\D/g, '');

    // If starting with 0, replace with +63
    if (digitsOnly.startsWith('0') && digitsOnly.length === 11) {
        return `+63${digitsOnly.substring(1)}`;
    }

    // If it's just a 10-digit number (assuming Philippines)
    if (digitsOnly.length === 10) {
        return `+63${digitsOnly}`;
    }

    // If it starts with 63 already but without +
    if (digitsOnly.startsWith('63')) {
        return `+${digitsOnly}`;
    }

    // If unknown format, add +63 anyway
    return `+63${digitsOnly}`;
}

/**
 * Service for sending notifications
 */
export const NotificationService = {
    /**
     * Send an SMS notification using Telerivet
     * @param to Recipient phone number
     * @param message Message content
     * @returns Response with success status and message id
     */
    async sendSMS(to: string, message: string) {
        try {
            // Get Telerivet credentials from environment variables
            const apiKey = process.env.TELERIVET_API_KEY;
            const projectId = process.env.TELERIVET_PROJECT_ID;

            // Check if Telerivet credentials are available
            if (!apiKey || !projectId) {
                console.error('Missing Telerivet credentials');
                return {
                    success: false,
                    error: 'SMS service is not properly configured'
                };
            }

            // Format phone number
            const formattedPhone = formatPhoneNumber(to);

            // Initialize Telerivet client
            const tr = new telerivet.API(apiKey);
            const project = tr.initProjectById(projectId);

            // Send the SMS using a Promise wrapper
            const result: { id: string } = await new Promise((resolve, reject) => {
                project.sendMessage({
                    content: message,
                    to_number: formattedPhone
                }, function (err: any, message: any) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(message);
                    }
                });
            });

            console.log('SMS sent successfully via Telerivet:', result);

            // Log the notification in the database
            const notification = await prisma.notification.create({
                data: {
                    phone: formattedPhone,
                    message: message,
                    status: 'SENT',
                    bookingNumber: result.id
                }
            });

            return {
                success: true,
                messageId: result.id,
                notificationId: notification.id
            };
        } catch (error: any) {
            console.error('Telerivet error:', error);

            // Log failed notification attempt
            try {
                const notification = await prisma.notification.create({
                    data: {
                        phone: formatPhoneNumber(to),
                        message: message,
                        status: 'FAILED',
                    }
                });

                return {
                    success: false,
                    error: error.message || 'Failed to send SMS',
                    notificationId: notification.id
                };
            } catch (logError) {
                console.error('Failed to log notification:', logError);
                return {
                    success: false,
                    error: error.message || 'Failed to send SMS'
                };
            }
        }
    },

    /**
     * Get project information from its ID
     * @param proposalId Project ID
     * @returns Project data with user information
     */
    async getProjectDetails(proposalId: string) {
        return prisma.projectProposal.findUnique({
            where: { id: proposalId },
            include: {
                postedBy: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        email: true
                    }
                }
            }
        });
    },

    /**
     * Send a notification about project status change
     * @param proposalId The ID of the project proposal
     * @param status The new status (Approved, Rejected, etc.)
     * @param comment Optional comment about the status change
     * @returns Result of the notification attempt
     */
    async sendProjectStatusNotification(proposalId: string, status: string, comment?: string) {
        try {
            // Get project details
            const project = await this.getProjectDetails(proposalId);

            if (!project) {
                return { success: false, error: 'Project not found' };
            }

            if (!project.postedBy.phone) {
                return { success: false, error: 'No phone number available for notification' };
            }

            // Create notification message
            const statusText = status.toLowerCase();
            const commentText = comment ? `\nComment: ${comment}` : '';

            const message = `Your project proposal "${project.title}" has been ${statusText} by the Admin.${commentText}\nCheck details at: https://barangay56taysan.vercel.app/auth`;

            // Send the notification
            return await this.sendSMS(project.postedBy.phone, message);
        } catch (error: any) {
            console.error('Error sending project status notification:', error);
            return {
                success: false,
                error: error.message || 'Failed to send notification'
            };
        }
    }
};

export default NotificationService;