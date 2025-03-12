// app/api/project-proposal/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    // Parse form data from the request
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const postedById = formData.get("postedById") as string;
    const proposedDateStr = formData.get("proposedDate") as string;
    const budgetStr = formData.get("budget") as string;
    const file = formData.get("file") as File;

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
        proposedDate, // required field
        budget,       // new budget field
      },
    });

    return NextResponse.json(proposal);
  } catch (error: any) {
    console.error("Error processing proposal:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
