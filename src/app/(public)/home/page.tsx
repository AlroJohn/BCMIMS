"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, Newspaper, Calendar, Users, FileText, MapPin } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container mx-auto space-y-12 py-8">
      {/* Hero Section */}
      <section className="relative">
        <div className="bg-[url('/images/barangay-header.jpg')] bg-cover bg-center h-96 w-full rounded-xl relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-900/40 rounded-xl flex flex-col justify-center p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Welcome to Barangay <span className="text-yellow-400">Monitoring System</span>
            </h1>
            <p className="text-lg md:text-xl text-white max-w-2xl mb-8">
              Efficient management and monitoring of barangay activities, projects, and services for better community governance.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                View Services
              </Button>
              <Button size="lg" variant="outline" className="text-black border-white hover:bg-white/10">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      {/* <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Latest Announcements</h2>
          <Link href="/announcements" className="flex items-center text-blue-600 hover:text-blue-800">
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-48 bg-gray-200 relative">
                <div className="absolute top-0 left-0 bg-blue-600 text-white px-3 py-1 text-sm">
                  March {i + 9}, 2025
                </div>
                <img 
                  src={`/images/announcement-${i}.jpg`} 
                  alt="Announcement" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Handle image error by showing a placeholder
                    (e.target as HTMLImageElement).src = "/api/placeholder/400/200";
                  }}
                />
              </div>
              <CardHeader className="p-4 pb-0">
                <CardTitle className="text-xl">Community Clean-up Drive</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <p className="text-gray-600 mb-3">
                  Join us for the monthly community clean-up drive this Saturday at 7 AM. Please bring gloves and wear appropriate clothing.
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Read More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section> */}

      {/* Quick Links */}
      {/* <section>
        <h2 className="text-3xl font-bold mb-6">Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Newspaper className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Latest News</h3>
              <p className="text-gray-500 mb-4">Stay updated with the latest barangay news and developments</p>
              <Button variant="ghost" className="text-blue-600 hover:text-blue-800">View News</Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Events Calendar</h3>
              <p className="text-gray-500 mb-4">Check upcoming events and activities in our barangay</p>
              <Button variant="ghost" className="text-green-600 hover:text-green-800">View Calendar</Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Officials</h3>
              <p className="text-gray-500 mb-4">Meet your barangay officials and committee members</p>
              <Button variant="ghost" className="text-purple-600 hover:text-purple-800">View Officials</Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Documents</h3>
              <p className="text-gray-500 mb-4">Access and download important barangay documents</p>
              <Button variant="ghost" className="text-amber-600 hover:text-amber-800">View Documents</Button>
            </CardContent>
          </Card>
        </div>
      </section> */}

      {/* Projects Overview */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Ongoing Projects</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[
            {
              title: "Road Improvement Project",
              status: "In Progress",
              completion: 65,
              committee: "Public Works",
              description: "Repairing and improving the main roads within the barangay",
            },
            {
              title: "Community Garden Initiative",
              status: "In Progress",
              completion: 40,
              committee: "Environment",
              description: "Creating community gardens to promote sustainable food production",
            },
          ].map((project, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription>Committee: {project.committee}</CardDescription>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {project.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">{project.description}</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{project.completion}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500" 
                      style={{ width: `${project.completion}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <Button>View All Projects</Button>
        </div>
      </section>
      
      {/* Location Section */}
{/* Location Section */}
<section>
  <h2 className="text-3xl font-bold mb-6">Find Us</h2>
  <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center relative overflow-hidden">
    <div className="absolute inset-0">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3869.965933518854!2d123.74494231533854!3d13.11304799047676!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a1000000000000%3A0x0000000000000000!2sBarangay%2056-Taysan%2C%20Albay%2C%20Philippines!5e0!3m2!1sen!2sph!4v1712345678901!5m2!1sen!2sph"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
      ></iframe>
    </div>
    
    {/* Custom Map Marker */}
    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
      <div className="flex flex-col items-center">
        <div className="w-6 h-6 rounded-full bg-red-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold">
          B
        </div>
        <div className="w-2 h-2 bg-red-600 rotate-45 -mt-1"></div>
      </div>
    </div>
    
    <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-4 backdrop-blur-sm">
      <div className="flex items-start gap-4">
        <MapPin className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
        <div>
          <h3 className="font-semibold text-lg">Barangay Taysan Office</h3>
          <p className="text-gray-700">Barangay 56-Taysan, Albay, Bicol Region, Philippines</p>
          <p className="text-gray-700">(02) 8123-4567 | taysan@barangay.gov.ph</p>
        </div>
      </div>
    </div>
  </div>
</section>
    </div>
  );
}