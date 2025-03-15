import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: Request) {
  try {
    // Parse the request body to extract the id and update data
    const body = await request.json();
    const { id, ...updateData } = body;

    // Ensure the id is provided
    if (!id) {
      return NextResponse.json(
        { message: 'ID is required for updating.' },
        { status: 400 }
      );
    }

    // Update the record and include related proposals if needed
    const updatedBudgetOverview = await prisma.budgetOverview.update({
      where: { id: id }, // Ensure id type matches your schema
      data: updateData,
      include: { proposals: true },
    });

    // Return the updated record as JSON
    return NextResponse.json(updatedBudgetOverview);
  } catch (error) {
    console.error('Error updating BudgetOverview data:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
