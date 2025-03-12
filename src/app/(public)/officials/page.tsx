"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone } from "lucide-react";

export default function OfficialsPage() {
  const officials = [
    {
      name: "Benjamin D. Rosin",
      position: "Barangay Captain",
      image: "/images/officials/chairperson.jpg",
      email: "Captain@barangay.gov.ph",
      phone: "09154059163",
      role: "Captain"
    },
    {
      name: "Baberly A. De Baguio",
      position: "Committee on Education and Culture",
      image: "/images/officials/kagawad1.jpg",
      email: "Education@barangay.gov.ph",
      phone: "09630305154",
      role: "Committee on Education and Culture"
    },
    {
      name: "Roderick A. Madronio",
      position: "Committee on Public Work and Infrastructure",
      image: "/images/officials/kagawad2.jpg",
      email: "Publicwork@barangay.gov.ph",
      phone: "09564182754",
      role: "Committee on Public Work and Infrastructure"
    },
    {
      name: "Francis Alejo",
      position: "Committee on Peace and Order",
      image: "/images/officials/kagawad3.jpg",
      email: "Peace@barangay.gov.ph",
      phone: "09915171977",
      role: "Committee on Peace and Order"
    },
    {
      name: "Emma M. Jadie",
      position: "Committee on Finance, Budget and Appropriations",
      image: "/images/officials/kagawad4.jpg",
      email: "Finance@barangay.gov.ph",
      phone: "09925609960",
      role: "Committee on Finance, Budget and Appropriations"
    },
    {
      name: "Edna J. Padre",
      position: "Committee on Health and Services",
      image: "/images/officials/kagawad5.jpg",
      email: "Health@barangay.gov.ph",
      phone: "09564182754",
      role: "Committee on Health and Services"
    },
    {
      name: "Emma M. Jadie",
      position: "Committee on Women, Children and Family",
      image: "/images/officials/kagawad6.jpg",
      email: "Women@barangay.gov.ph",
      phone: "09630305154",
      role: "Committee on Women, Children and family"
    },
    {
      name: "Wilfranz B. Correa",
      position: "Committee on Environment",
      image: "/images/officials/kagawad7.jpg",
      email: "Environment@barangay.gov.ph",
      phone: "09813878957",
      role: "Committee on Environment"
    }
  ];

  return (
    <div className="container mx-auto space-y-10 py-8">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Barangay Taysan Officials</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Meet our dedicated public servants working to improve Barangay Taysan through effective governance and community service.
        </p>
      </div>

      {/* Barangay Captain */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-8 text-center">Barangay Captain</h2>
        <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
          <div className="w-64 h-64 rounded-full overflow-hidden flex-shrink-0 border-4 border-blue-500">
            <img 
              src={officials[0].image} 
              alt={officials[0].name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/api/placeholder/240/240";
              }}
            />
          </div>
          <div className="flex-1">
            <h3 className="text-3xl font-bold mb-1">{officials[0].name}</h3>
            <p className="text-xl text-blue-600 mb-4">{officials[0].position}</p>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <span>{officials[0].email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-500" />
                <span>{officials[0].phone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Kagawads */}
      <div>
        <h2 className="text-2xl font-semibold mb-8 text-center">Barangay Kagawads</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {officials.slice(1).map((official, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={official.image} 
                  alt={official.name} 
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/api/placeholder/400/400";
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
      </div>

      {/* Organizational Chart */}
      <section className="mt-16">
        <h2 className="text-2xl font-semibold text-center mb-8">Organizational Structure</h2>
        <div className="bg-white p-6 rounded-lg shadow-md w-full">
          <div className="w-full overflow-x-auto">
            <div className="min-w-full">
              <div className="flex flex-col items-center">
                {/* Captain */}
                <div className="w-64 p-4 border-2 border-blue-500 rounded-lg bg-blue-50 text-center mb-4">
                  <div className="font-bold">Barangay Captain</div>
                  <div>{officials[0].name}</div>
                </div>
                {/* Connector */}
                <div className="w-1 h-8 bg-gray-400"></div>
                {/* Kagawads & Committees */}
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-7 gap-4 w-full">
                  {officials.slice(1).map((official, index) => (
                    <div key={index} className="w-full p-4 border-2 border-green-500 rounded-lg bg-green-50 text-center">
                      <div className="font-bold">Barangay Kagawad</div>
                      <div>{official.name}</div>
                      <div className="text-sm text-gray-600 mt-1">{official.position}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}