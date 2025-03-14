// app/api/project-proposal/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase-client";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    // Parse form data from the request
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const postedById = formData.get("postedById") as string;
    const proposedDateStr = formData.get("proposedDate") as string;
    const budgetStr = formData.get("budget") as string;
    const committee = formData.get("committee") as string; // Get committee from form data
    const file = formData.get("file") as File;

    // Validate required fields
    if (!file) {
      return NextResponse.json(
        { message: "File is required" },
        { status: 400 }
      );
    }

    if (!proposedDateStr) {
      return NextResponse.json(
        { message: "Proposed date is required" },
        { status: 400 }
      );
    }

    if (!budgetStr) {
      return NextResponse.json(
        { message: "Budget is required" },
        { status: 400 }
      );
    }

    if (!committee) {
      return NextResponse.json(
        { message: "Committee is required" },
        { status: 400 }
      );
    }

    // Convert the proposedDate string to a Date object
    const proposedDate = new Date(proposedDateStr);
    if (isNaN(proposedDate.getTime())) {
      return NextResponse.json(
        { message: "Invalid proposed date" },
        { status: 400 }
      );
    }

    // Parse the budget to a number
    const budget = parseFloat(budgetStr);
    if (isNaN(budget)) {
      return NextResponse.json(
        { message: "Invalid budget value" },
        { status: 400 }
      );
    }

    // Convert the File (Blob) to a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    // Create a unique file name
    const fileName = `${Date.now()}-${file.name}`;

    // Upload the file to Supabase Storage (bucket: "project_files")
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("project_files")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json(
        { message: uploadError.message },
        { status: 500 }
      );
    }

    // Retrieve the public URL of the uploaded file
    const { data } = supabase.storage
      .from("project_files")
      .getPublicUrl(uploadData.path);
    const publicUrl = data.publicUrl;

    // Create a new project proposal record in the database using Prisma
    const proposal = await prisma.projectProposal.create({
      data: {
        title,
        description,
        fileUrl: publicUrl,
        postedById,
        proposedDate,
        budget,
        createdAt: new Date(),
        committee: committee as UserRole, // Now using the committee value from the form
      },
    });

    // Extract committee from form data for revalidation paths
    const committeeValue = committee as UserRole;
    const committeePath = `/committee/${committeeValue.toLowerCase().replace(/_/g, '-').replace('_committee', '')}`;

    // Revalidate the paths to update UI
    revalidatePath(committeePath);
    revalidatePath(`${committeePath}/project-proposals`);
    revalidatePath(`${committeePath}/project-proposals?status=pending`);
    revalidatePath(`${committeePath}/project-proposals?status=approved`);
    revalidatePath(`${committeePath}/project-proposals?status=rejected`);

    return NextResponse.json(proposal);
  } catch (error: any) {
    console.error("Error processing proposal:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// Add PUT method for updating existing proposals
export async function PUT(request: Request) {
  try {
    // Parse form data from the request
    const formData = await request.formData();
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const postedById = formData.get("postedById") as string;
    const proposedDateStr = formData.get("proposedDate") as string;
    const budgetStr = formData.get("budget") as string;
    const committee = formData.get("committee") as string;
    const file = formData.get("file") as File | null;

    if (!id) {
      return NextResponse.json(
        { message: "Project ID is required" },
        { status: 400 }
      );
    }

    // Verify the project exists and belongs to this user
    const existingProject = await prisma.projectProposal.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    if (existingProject.postedById !== postedById) {
      return NextResponse.json(
        { message: "You can only edit your own projects" },
        { status: 403 }
      );
    }

    if (!proposedDateStr) {
      return NextResponse.json(
        { message: "Proposed date is required" },
        { status: 400 }
      );
    }

    if (!budgetStr) {
      return NextResponse.json(
        { message: "Budget is required" },
        { status: 400 }
      );
    }

    if (!committee) {
      return NextResponse.json(
        { message: "Committee is required" },
        { status: 400 }
      );
    }

    // Convert the proposedDate string to a Date object
    const proposedDate = new Date(proposedDateStr);
    if (isNaN(proposedDate.getTime())) {
      return NextResponse.json(
        { message: "Invalid proposed date" },
        { status: 400 }
      );
    }

    // Parse the budget to a number
    const budget = parseFloat(budgetStr);
    if (isNaN(budget)) {
      return NextResponse.json(
        { message: "Invalid budget value" },
        { status: 400 }
      );
    }

    // Prepare the update data
    const updateData: any = {
      title,
      description,
      proposedDate,
      budget,
      committee,
    };

    // If a file was provided, handle the file upload
    if (file && file.size > 0) {
      // Convert the File (Blob) to a Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      // Create a unique file name
      const fileName = `${Date.now()}-${file.name}`;

      // Upload the file to Supabase Storage (bucket: "project_files")
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("project_files")
        .upload(fileName, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("Supabase upload error:", uploadError);
        return NextResponse.json(
          { message: uploadError.message },
          { status: 500 }
        );
      }

      // Retrieve the public URL of the uploaded file
      const { data } = supabase.storage
        .from("project_files")
        .getPublicUrl(uploadData.path);
      const publicUrl = data.publicUrl;

      // Add the new file URL to the update data
      updateData.fileUrl = publicUrl;
    }

    // Update the project proposal in the database
    const updatedProposal = await prisma.projectProposal.update({
      where: { id },
      data: updateData,
    });

    // Extract committee from form data for revalidation paths
    const committeeValue = committee as UserRole;
    const committeePath = `/committee/${committeeValue.toLowerCase().replace(/_/g, '-').replace('_committee', '')}`;

    // Revalidate the paths to update UI
    revalidatePath(committeePath);
    revalidatePath(`${committeePath}/project-proposals`);
    revalidatePath(`${committeePath}/project-proposals?status=pending`);
    revalidatePath(`${committeePath}/project-proposals?status=approved`);
    revalidatePath(`${committeePath}/project-proposals?status=rejected`);
    revalidatePath(`${committeePath}/project-proposals/${id}`);

    return NextResponse.json({
      message: "Project proposal updated successfully",
      project: updatedProposal
    });
  } catch (error: any) {
    console.error("Error updating proposal:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}