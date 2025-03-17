"use client";

import { useAuth } from "@/components/providers/auth-provider";
import Link from "next/link";
import LogoutWrapper from "./logout-button";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { user, loading, role } = useAuth();
  const isLoggedIn = !!user;

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <img
              src="/images/logo.png"
              alt="Barangay Logo"
              className="h-16 w-16 mr-3"
            />
            <h1 className="text-lg font-semibold text-gray-700">
              Barangay Taysan
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center">
            <div className="md:flex space-x-6 hidden items-center">
              <Link href="/" className="text-gray-700 hover:text-blue-500">
                Home
              </Link>
              <Link
                href="/officials"
                className="text-gray-700 hover:text-blue-500"
              >
                Officials
              </Link>
              {/* <Link href="/contact" className="text-gray-700 hover:text-blue-500">
                            Contact
                        </Link> */}
              <Link href="/about" className="text-gray-700 hover:text-blue-500">
                About
              </Link>

              {/* Show Events link only if user is logged in */}
              {isLoggedIn && (
                <Link
                  href="/events"
                  className="text-gray-700 hover:text-blue-500"
                >
                  Events
                </Link>
              )}

              {isLoggedIn && (
                <Link
                  href={
                    role === "Admin"
                      ? "/admin"
                      : `/committee/${role?.toLowerCase() || ""}`
                  }
                  className="text-gray-700 hover:text-blue-500"
                >
                  Dashboard
                </Link>
              )}
            </div>

            {/* Conditional login/logout button */}
            {!isLoggedIn ? (
              <Link
                href="/auth"
                className="ml-6 w-24 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Login
              </Link>
            ) : (
              <LogoutWrapper>
                <Button className="ml-6 w-24 inline-flex items-center justify-center px-3 py-0 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                  Logout
                </Button>
              </LogoutWrapper>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
