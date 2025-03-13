// src/components/SmsForm.tsx

import React, { useState } from 'react';

type SmsFormProps = {
  defaultFrom?: string;
};

export const SmsForm: React.FC<SmsFormProps> = ({ 
  defaultFrom = '+15162711066' // Your Twilio phone number
}) => {
  const [to, setTo] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          message,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('SMS sent successfully!');
        // Clear form after successful submission
        setTo('');
        setMessage('');
      } else {
        setStatus(`Error: ${data.message || 'Failed to send SMS'}`);
      }
    } catch (error) {
      setStatus('Error sending SMS. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Send SMS</h2>
      
      {/* Twilio info */}
      <div className="mb-4 p-3 bg-blue-50 text-blue-800 rounded-md text-sm">
        <p className="font-bold">Twilio SMS Service</p>
        <p className="mt-1">Messages will be sent from: {defaultFrom}</p>
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
            value={'+639630305154'}
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