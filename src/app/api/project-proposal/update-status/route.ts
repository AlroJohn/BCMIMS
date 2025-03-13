// app/api/project-proposal/update-status/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

// Initialize the Supabase client for realtime updates
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { projectId, status, userId, comment } = body;

    // Validation
    if (!projectId) {
      return NextResponse.json(
        { message: "Project ID is required" },
        { status: 400 }
      );
    }

    if (!status || !["Approved", "Rejected"].includes(status)) {
      return NextResponse.json(
        { message: "Valid status (Approved or Rejected) is required" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { message: "Admin user ID is required" },
        { status: 400 }
      );
    }

    // Verify the user is an admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    if (user.role !== "Admin") {
      return NextResponse.json(
        { message: "Only admin users can update project status" },
        { status: 403 }
      );
    }

    // Verify the project exists
    const project = await prisma.projectProposal.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    // Create or update the ApprovedBy record for the admin
    let approvalStatus;
    if (status === "Approved") {
      approvalStatus = "Approved";
    } else {
      approvalStatus = "Rejected";
    }

    // Check if there's an existing approval entry from this admin
    const existingApproval = await prisma.approvedBy.findFirst({
      where: {
        userId,
        proposalId: projectId,
      },
    });

    // Update or create the approval record
    if (existingApproval) {
      await prisma.approvedBy.update({
        where: { id: existingApproval.id },
        data: {
          status: approvalStatus,
          comment: comment || null,
        },
      });
    } else {
      await prisma.approvedBy.create({
        data: {
          userId,
          proposalId: projectId,
          status: approvalStatus,
          comment: comment || null,
        },
      });
    }

    // Optionally, you could update the Vote record as well if needed
    // Since we're using ApprovedBy for status tracking, this may not be necessary

    // Return the updated project with its related entries
    const updatedProject = await prisma.projectProposal.findUnique({
      where: { id: projectId },
      include: {
        postedBy: true,
        approvedBy: {
          include: {
            approvedBy: true,
          },
        },
        votes: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: `Project ${status.toLowerCase()} successfully`,
      project: updatedProject,
    });
  } catch (error: any) {
    console.error("Error updating project status:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}