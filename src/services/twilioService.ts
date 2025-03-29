// src/services/sms-service.ts

/**
 * Service for sending SMS notifications using Telerivet
 */
export const SmsService = {
  /**
   * Send an SMS notification
   * @param to Recipient phone number
   * @param message Message content
   * @returns Response from the SMS API
   */
  async sendSms(to: string, message: string) {
    try {
      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, message }),
      });

      return await response.json();
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw error;
    }
  },

  /**
   * Send a project proposal notification
   * @param data Project proposal data
   * @returns Response from the SMS API
   */
  async sendProjectProposalNotification(data: {
    title: string;
    budget: number | string;
    proposedDate: string | Date;
  }) {
    try {
      // Fetch admin users with phone numbers
      const response = await fetch('/api/users/admin', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { success, admins } = await response.json();

      if (!success || !admins || admins.length === 0) {
        console.warn('No admin users with phone numbers found');
        return { success: false, error: 'No admin recipients available' };
      }

      const formattedDate = typeof data.proposedDate === 'string'
        ? new Date(data.proposedDate).toLocaleDateString()
        : data.proposedDate.toLocaleDateString();

      const message = `New Project Proposal: "${data.title}" has been submitted with a budget of ₱${data.budget}. Proposed date: ${formattedDate}.`;

      // Send to all admins with phone numbers
      const results = await Promise.all(
        admins
          .filter((admin: any) => admin.phone) // Only send to admins with phone numbers
          .map((admin: any) => this.sendSms(admin.phone, message))
      );

      return {
        success: true,
        results
      };
    } catch (error) {
      console.error('Error in sendProjectProposalNotification:', error);
      return { success: false, error: 'Failed to send notifications' };
    }
  }
};

export default SmsService;