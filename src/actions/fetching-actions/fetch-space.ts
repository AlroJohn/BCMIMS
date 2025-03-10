'use server'

import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export type SpaceWithBookingCount = {
  id: string;
  name: string;
  description: string | null;
  capacity: number;
  pricePerHour: number;
  image: string | null;
  isAvailable: boolean;
  bookingCount: number;
}

/**
 * Fetches all spaces from the database
 * @param includeBookingCount Whether to include a count of bookings for each space
 * @param onlyAvailable Whether to only fetch spaces that are available
 * @returns An array of spaces
 */
export async function fetchSpaces({
  includeBookingCount = false,
  onlyAvailable = false
}: {
  includeBookingCount?: boolean;
  onlyAvailable?: boolean;
} = {}): Promise<SpaceWithBookingCount[]> {
  try {
    // Define the type for the spaces with _count
    type SpaceWithCount = Prisma.SpaceGetPayload<{
      include: { _count: { select: { bookings: true } } }
    }>;
    
    // Type for spaces without _count
    type SpaceWithoutCount = Prisma.SpaceGetPayload<{}>;
    
    // Base query
    let spaces;
    
    if (includeBookingCount) {
      spaces = await prisma.space.findMany({
        where: onlyAvailable ? { isAvailable: true } : undefined,
        orderBy: { name: 'asc' },
        include: {
          _count: {
            select: { bookings: true }
          }
        }
      }) as SpaceWithCount[];
      
      // Transform the data to include booking count
      return spaces.map(space => ({
        id: space.id,
        name: space.name,
        description: space.description,
        capacity: space.capacity,
        pricePerHour: Number(space.pricePerHour), // Convert Decimal to Number
        image: space.image,
        isAvailable: space.isAvailable,
        bookingCount: space._count.bookings
      }));
    } else {
      spaces = await prisma.space.findMany({
        where: onlyAvailable ? { isAvailable: true } : undefined,
        orderBy: { name: 'asc' },
      }) as SpaceWithoutCount[];
      
      // Transform the data without booking count
      return spaces.map(space => ({
        id: space.id,
        name: space.name,
        description: space.description,
        capacity: space.capacity,
        pricePerHour: Number(space.pricePerHour), // Convert Decimal to Number
        image: space.image,
        isAvailable: space.isAvailable,
        bookingCount: 0
      }));
    }
  } catch (error) {
    console.error('Error fetching spaces:', error);
    throw new Error('Failed to fetch spaces');
  }
}

/**
 * Fetches a single space by its ID
 * @param id The ID of the space to fetch
 * @param includeBookings Whether to include bookings for the space
 * @returns The space if found, or null if not found
 */
export async function fetchSpaceById(
  id: string,
  includeBookings: boolean = false
) {
  try {
    // Define type for space with bookings
    type SpaceWithBookings = Prisma.SpaceGetPayload<{
      include: { bookings: true }
    }>;
    
    // Define type for space without bookings
    type SpaceWithoutBookings = Prisma.SpaceGetPayload<{}>;
    
    let space;
    
    if (includeBookings) {
      space = await prisma.space.findUnique({
        where: { id },
        include: {
          bookings: {
            orderBy: { startTime: 'desc' },
            take: 10 // Limit to 10 most recent bookings
          }
        }
      }) as SpaceWithBookings | null;
    } else {
      space = await prisma.space.findUnique({
        where: { id }
      }) as SpaceWithoutBookings | null;
    }

    if (!space) return null;

    return {
      ...space,
      pricePerHour: Number(space.pricePerHour) // Convert Decimal to Number
    };
  } catch (error) {
    console.error(`Error fetching space with ID ${id}:`, error);
    throw new Error('Failed to fetch space');
  }
}