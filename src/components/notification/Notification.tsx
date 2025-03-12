// src/components/notification/Notification.tsx

import React, { useState, useEffect } from 'react';

type SmsFormProps = {
  phoneNumber?: string;
  messageText?: string;
  autoSubmit?: boolean;
  onSendComplete?: (success: boolean, message: string) => void;
};

export const NotificationForm: React.FC<SmsFormProps> = ({ 
  phoneNumber = '',
  messageText = '',
  autoSubmit = false,
  onSendComplete
}) => {
  const [to, setTo] = useState(phoneNumber);
  const [message, setMessage] = useState(messageText);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Update state when props change
  useEffect(() => {
    if (phoneNumber) setTo(phoneNumber);
  }, [phoneNumber]);
  
  useEffect(() => {
    if (messageText) setMessage(messageText);
  }, [messageText]);
  
  // Auto-submit logic
  useEffect(() => {
    const submitForm = async () => {
      // Only auto-submit if we have both a phone number and message
      if (autoSubmit && phoneNumber && messageText && !loading) {
        console.log('Auto-submitting SMS form with:', { phoneNumber, messageLength: messageText.length });
        await sendSms();
      }
    };
    
    submitForm();
  }, [autoSubmit, phoneNumber, messageText]);
  
  // Extract SMS sending logic to reuse it
  const sendSms = async () => {
    if (!to || !message) {
      const errorMsg = 'Phone number and message are required';
      setStatus(`Error: ${errorMsg}`);
      if (onSendComplete) onSendComplete(false, errorMsg);
      return;
    }
    
    setLoading(true);
    setStatus(null);

    try {
      // Format phone with country code if needed
      const formattedPhone = to.startsWith('+') ? to : `+${to.replace(/^0+/, '')}`;
      
      console.log('Sending SMS to:', formattedPhone);
      
      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: formattedPhone,
          message,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const successMsg = 'SMS sent successfully!';
        setStatus(successMsg);
        console.log(successMsg, data);
        
        // Notify parent component
        if (onSendComplete) onSendComplete(true, successMsg);
        
        // Only clear form if not auto-submitted
        if (!autoSubmit) {
          setTo('');
          setMessage('');
        }
      } else {
        const errorMsg = `Error: ${data.error || 'Failed to send SMS'}`;
        setStatus(errorMsg);
        console.error(errorMsg, data);
        
        if (onSendComplete) onSendComplete(false, errorMsg);
      }
    } catch (error: any) {
      const errorMsg = `Error: ${error.message || 'Failed to send SMS'}`;
      setStatus(errorMsg);
      console.error(errorMsg, error);
      
      if (onSendComplete) onSendComplete(false, errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendSms();
  };

  // Allow hiding the form when auto-submitting
  if (autoSubmit && !status) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-gray-500">Sending notification...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Send SMS</h2>
      
      {/* Twilio info */}
      <div className="mb-4 p-3 bg-blue-50 text-blue-800 rounded-md text-sm">
        <p className="font-bold">Twilio SMS Service</p>
        <p className="mt-1">Messages will be sent from: {phoneNumber}</p>
        <p className="mt-1 text-xs">Note: With Twilio trial accounts, messages can only be sent to verified phone numbers.</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="to" className="block mb-1 font-medium">
            Recipient Phone Number
          </label>
          <input
            id="to"
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="+639XXXXXXXXX"
            required
            className="w-full p-2 border rounded"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter phone number with country code (e.g., +639XXXXXXXXX)
          </p>
        </div>

        <div className="mb-4">
          <label htmlFor="message" className="block mb-1 font-medium">
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your message here"
            required
            rows={4}
            className="w-full p-2 border rounded"
          />
          <p className="text-xs text-gray-500 mt-1">
            {message.length} characters
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? 'Sending...' : 'Send SMS'}
        </button>

        {status && (
          <div
            className={`mt-4 p-2 rounded ${
              status.startsWith('Error')
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {status}
          </div>
        )}
      </form>
    </div>
  );
};