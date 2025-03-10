// app/api/users/user-role/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    console.log("User role API called with userId:", userId);

    if (!userId) {
      console.error("User role API: Missing userId parameter");
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    try {
      // Try to find the user in the database
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, role: true, email: true },
      });

      if (!user) {
        console.error(`User role API: User not found for ID: ${userId}`);
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      console.log(`User role API: Found user with role: ${user.role}`);
      return NextResponse.json({ role: user.role });
    } catch (dbError) {
      console.error("User role API: Database error:", dbError);
      return NextResponse.json(
        { error: "Database error", details: (dbError as Error).message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("User role API: Unexpected error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user role", details: (error as Error).message },
      { status: 500 }
    );
  }
}