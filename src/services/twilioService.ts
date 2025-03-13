// src/services/sms-service.ts

/**
 * Service for sending SMS notifications
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
   * @param recipientNumber Recipient phone number
   * @returns Response from the SMS API
   */
  async sendProjectProposalNotification(data: {
    title: string;
    budget: number | string;
    proposedDate: string | Date;
  }, recipientNumber = '+639630305154') {
    const formattedDate = typeof data.proposedDate === 'string'
      ? new Date(data.proposedDate).toLocaleDateString()
      : data.proposedDate.toLocaleDateString();

    const message = `New Project Proposal: "${data.title}" has been submitted with a budget of $${data.budget}. Proposed date: ${formattedDate}.`;

    return this.sendSms(recipientNumber, message);
  }
};