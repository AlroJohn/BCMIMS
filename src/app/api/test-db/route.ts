// app/api/test-db/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Try to count users
    const count = await prisma.user.count();
    
    // Return basic info about the database
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema='public'
    `;
    
    return NextResponse.json({ 
      success: true,
      message: "Database connection successful",
      userCount: count,
      tables
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json({ 
      success: false,
      error: "Database connection failed",
      details: (error as Error).message
    }, { status: 500 });
  }
}