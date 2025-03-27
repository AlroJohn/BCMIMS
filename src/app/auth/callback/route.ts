// app/auth/callback/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  // Get URL to parse query parameters
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const type = url.searchParams.get("type");
  
  // Check if this is an email change confirmation
  if (code && type === "email_change") {
    try {
      // Initialize Supabase client
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      
      // Exchange auth code for session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error || !data.user) {
        return NextResponse.redirect(new URL('/auth/error?message=Invalid+or+expired+link', url.origin));
      }
      
      // Find user in the database
      const user = await prisma.user.findFirst({
        where: {
          // This depends on how you map Supabase IDs to your Prisma schema
          // You might use a supabaseId field or similar
          id: data.user.id,
        },
      });
      
      if (user && data.user.email) {
        // Update the main email in Prisma
        await prisma.user.update({
          where: { id: user.id },
          data: {
            email: data.user.email,
            updatedAt: new Date(),
          },
        });
      }
      
      // Redirect to success page
      return NextResponse.redirect(
        new URL('/profile?emailVerified=true', url.origin)
      );
    } catch (error) {
      console.error('Error handling email verification:', error);
      return NextResponse.redirect(
        new URL('/auth/error?message=Verification+failed', url.origin)
      );
    }
  }
  
  // For other auth callbacks, redirect to appropriate page
  return NextResponse.redirect(new URL('/', url.origin));
}