// src/app/api/send-sms/route.ts

import { NextRequest, NextResponse } from 'next/server';
import telerivet from 'telerivet';

// Function to send SMS using Telerivet
async function sendSMS(to: string, message: string) {
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
    return {
      success: true,
      messageId: result.id
    };
  } catch (error: any) {
    console.error('Telerivet error:', error);
    return {
      success: false,
      error: error.message || 'Failed to send SMS'
    };
  }
}

// Helper function to format phone number
function formatPhoneNumber(phone: string): string {
  // Remove any non-digit characters except the + sign at the beginning
  let formattedPhone = phone.trim();

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, message } = body;

    // Validate required fields
    if (!to || !message) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: to and message' },
        { status: 400 }
      );
    }

    // Send the SMS
    const result = await sendSMS(to, message);

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          message: 'SMS sent successfully',
          messageId: result.messageId
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to send SMS',
          error: result.error
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Server error',
        error: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}