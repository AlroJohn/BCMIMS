import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const token = req.cookies.get("sb-access-token")?.value || "";
  
  // Allow access to the root path (/) - since login is there
  // This is important to prevent redirect loops
  if (req.nextUrl.pathname === '/auth') {
    return res;
  }

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const { data: userData, error } = await supabase.auth.getUser();

  if (error || !userData?.user) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  // Fetch user role from Prisma
  const user = await prisma.user.findUnique({
    where: { id: userData.user.id },
    select: { role: true },
  });

  if (!user) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  const role = user.role;
  const pathname = req.nextUrl.pathname;

  // Role-based access control
  if (pathname.startsWith("/admin") && role !== "SUPERADMIN" && role !== "STAFF") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname.startsWith("/client") && role !== "CLIENT") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (
    (pathname.startsWith("/admin/bookings") || pathname.startsWith("/admin/payments")) && 
    role !== "SUPERADMIN" && 
    role !== "STAFF"
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return res;
}

// Protect routes, but NOT the root route
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/client/:path*"],
};