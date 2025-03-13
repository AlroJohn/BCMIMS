// 'use server'

// import { prisma } from "@/lib/prisma"
// import { BookingType } from "@prisma/client"

// export type BookingChartData = {
//   date: string;
//   walkin: number;
//   scheduled: number;
// }

// export async function getBookingsChartData(): Promise<BookingChartData[]> {
//   // Get the current date
//   const currentDate = new Date()
  
//   // Calculate the date 12 months ago
//   const twelveMonthsAgo = new Date(currentDate)
//   twelveMonthsAgo.setMonth(currentDate.getMonth() - 11) // Go back 11 months to get a total of 12 months including current
//   twelveMonthsAgo.setDate(1) // Start from the 1st day of that month
//   twelveMonthsAgo.setHours(0, 0, 0, 0) // Start of day
  
//   // Fetch all bookings for the last 12 months
//   const bookings = await prisma.booking.findMany({
//     where: {
//       startTime: {
//         gte: twelveMonthsAgo,
//         lte: currentDate,
//       },
//     },
//     select: {
//       startTime: true,
//       type: true,
//     },
//   })

//   // Initialize monthly data with zeros for all 12 months
//   const monthlyData: Record<string, { walkin: number; scheduled: number }> = {}
  
//   // Loop through all 12 months to ensure we have data for each month
//   for (let i = 0; i < 12; i++) {
//     const date = new Date(currentDate)
//     date.setMonth(currentDate.getMonth() - 11 + i) // Start 11 months ago and move forward
//     date.setDate(1) // First day of the month
    
//     const monthStr = date.toISOString().substring(0, 7) // Format: YYYY-MM
//     monthlyData[monthStr] = { walkin: 0, scheduled: 0 }
//   }

//   // Group bookings by month and type
//   bookings.forEach((booking: { startTime: { toISOString: () => string; }; type: any; }) => {
//     const monthStr = booking.startTime.toISOString().substring(0, 7) // Get YYYY-MM format
    
//     // Make sure the month exists in our data (in case of older bookings)
//     if (monthlyData[monthStr]) {
//       if (booking.type === BookingType.WALKIN) {
//         monthlyData[monthStr].walkin += 1
//       } else {
//         monthlyData[monthStr].scheduled += 1
//       }
//     }
//   })

//   // Convert to array format required by the chart
//   const result: BookingChartData[] = Object.entries(monthlyData)
//     .map(([date, data]) => ({
//       date,
//       walkin: data.walkin,
//       scheduled: data.scheduled,
//     }))
//     .sort((a, b) => a.date.localeCompare(b.date)) // Sort by date

//   return result
// }