// app/api/send-sms/route.ts

import NotificationService from '@/services/project-notification-service';
import { NextResponse } from 'next/server';


export async function POST(request: Request) {
    try {
        const { to, message } = await request.json();

        // Validate input
        if (!to || !message) {
            return NextResponse.json(
                { error: 'Phone number and message are required' },
                { status: 400 }
            );
        }

        // Send SMS
        const result = await NotificationService.sendSMS(to, message);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error || 'Failed to send SMS' },
                { status: 500 }
            );
        }

        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        console.error('Error in send-sms API:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}