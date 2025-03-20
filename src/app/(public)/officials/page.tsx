"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Phone } from "lucide-react";

import { UserRole } from "@prisma/client";
import { fetchUsers } from "@/actions/update-user/route";

// Map UserRole to position titles
const positionTitles = {
  [UserRole.Admin]: "Barangay Captain",
  [UserRole.Education]: "Committee on Education and Culture",
  [UserRole.Environment]: "Committee on Environment",
  [UserRole.Finance]: "Committee on Finance, Budget and Appropriations",
  [UserRole.HealthServices]: "Committee on Health and Services",
  [UserRole.PeaceOrder]: "Committee on Peace and Order",
  [UserRole.PublicWorks]: "Committee on Public Work and Infrastructure",
  [UserRole.Women]: "Committee on Women, Children and Family",
};

// Map UserRole to standard email domains
const emailMap = {
  [UserRole.Admin]: "Captain@barangay.gov.ph",
  [UserRole.Education]: "Education@barangay.gov.ph",
  [UserRole.Environment]: "Environment@barangay.gov.ph",
  [UserRole.Finance]: "Finance@barangay.gov.ph",
  [UserRole.HealthServices]: "Health@barangay.gov.ph",
  [UserRole.PeaceOrder]: "Peace@barangay.gov.ph",
  [UserRole.PublicWorks]: "Publicwork@barangay.gov.ph",
  [UserRole.Women]: "Women@barangay.gov.ph",
};

export default function OfficialsPage() {
  const [officials, setOfficials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOfficials = async () => {
      try {
        const users = await fetchUsers();
        if (users && Array.isArray(users)) {
          // Process the users to match the format needed for officials display
          const formattedOfficials = users.map((user) => ({
            id: user.id,
            name: user.name || "Unknown Name",
            position: user.role
              ? positionTitles[user.role]
              : "Committee Member",
            image: user.profile || "/api/placeholder/400/400", // Use profile image or placeholder
            email:
              user.email ||
              (user.role ? emailMap[user.role] : "contact@barangay.gov.ph"),
            phone: user.phone || "N/A",
            role: user.role,
          }));

          // Sort officials to ensure Captain is first if present
          const sortedOfficials = formattedOfficials.sort((a, b) => {
            if (a.role === UserRole.Admin) return -1;
            if (b.role === UserRole.Admin) return 1;
            return 0;
          });

          setOfficials(sortedOfficials);
        } else {
          setError("Failed to load officials data");
        }
      } catch (error) {
        console.error("Error loading officials:", error);
        setError("Error loading officials. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadOfficials();
  }, []);

  // Find the captain (if present)
  const captain = officials.find(
    (official) => official.role === UserRole.Admin
  );
  // Get all kagawads (everyone except admin/captain)
  const kagawads = officials.filter(
    (official) => official.role !== UserRole.Admin
  );

  if (loading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-lg">Loading officials data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-10 py-8">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Barangay Taysan Officials</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Meet our dedicated public servants working to improve Barangay Taysan
          through effective governance and community service.
        </p>
      </div>

      {/* Barangay Captain */}
      {captain && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-8 text-center">
            Barangay Captain
          </h2>
          <div className="flex justify-center">
            <Card className="w-full max-w-sm overflow-hidden">
              <div className="aspect-square overflow-hidden">
                <img
                  src={captain.image}
                  alt={captain.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "images/logo.jpeg";
                  }}
                />
              </div>
              <CardHeader className="pb-2">
                <CardTitle>{captain.name} </CardTitle>
                <CardDescription>{captain.position}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{captain.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{captain.phone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Kagawads */}
      {kagawads.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mb-8 text-center">
            Barangay Kagawads
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kagawads.map((official) => (
              <Card key={official.id} className="overflow-hidden py-0 pb-4">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={official.image}
                    alt={official.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "images/logo.jpeg";
                    }}
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle>{official.name}</CardTitle>
                  <CardDescription>{official.position}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{official.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{official.phone}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Organizational Chart */}
      <section className="mt-16">
        <h2 className="text-2xl font-semibold text-center mb-8">
          Organizational Structure
        </h2>
        <div className="bg-white p-6 rounded-lg shadow-md w-full">
          <div className="w-full overflow-x-auto">
            <div className="min-w-full">
              <div className="flex flex-col items-center">
                {/* Captain */}
                {captain && (
                  <>
                    <div className="w-64 p-4 border-2 border-blue-500 rounded-lg bg-blue-50 text-center mb-4">
                      <div className="font-bold">Barangay Captain</div>
                      <div>{captain.name}</div>
                    </div>
                    {/* Connector */}
                    <div className="w-1 h-8 bg-gray-400"></div>
                  </>
                )}

                {/* Kagawads & Committees */}
                {kagawads.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-7 gap-4 w-full">
                    {kagawads.map((official) => (
                      <div
                        key={official.id}
                        className="w-full p-4 border-2 border-green-500 rounded-lg bg-green-50 text-center"
                      >
                        <div className="font-bold">Barangay Kagawad</div>
                        <div>{official.name}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {official.position}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
