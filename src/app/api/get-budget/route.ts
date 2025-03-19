import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const budgetData = await prisma.budgetOverview.findMany({
      include: { proposals: true },
      orderBy: { createdAt: 'asc' },
    });
    console.log('Fetched budget data:', budgetData);
    return NextResponse.json(budgetData);
  } catch (error) {
    console.error('Error fetching BudgetOverview data:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
