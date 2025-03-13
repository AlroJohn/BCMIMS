// src/app/api/send-sms/route.ts

import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

// Function to send SMS using Twilio
async function sendSMS(to: string, message: string) {
  try {
    // Get Twilio credentials from environment variables
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    // Check if Twilio credentials are available
    if (!accountSid || !authToken || !fromNumber) {
      console.error('Missing Twilio credentials');
      return { 
        success: false, 
        error: 'SMS service is not properly configured' 
      };
    }

    // Initialize Twilio client
    const client = twilio(accountSid, authToken);

    // Send the SMS
    const result = await client.messages.create({
      body: message,
      from: fromNumber,
      to: to
    });

    console.log('SMS sent successfully:', result.sid);
    return { 
      success: true, 
      sid: result.sid
    };
  } catch (error: any) {
    console.error('Twilio error:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to send SMS'
    };
  }
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
          sid: result.sid
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