"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Facebook, Mail, Phone } from "lucide-react";

export default function OfficialsPage() {
  const officials = [
    {
      name: "Hon. Juan Dela Cruz",
      position: "Barangay Chairperson",
      image: "/images/officials/chairperson.jpg",
      bio: "Hon. Juan Dela Cruz has been serving as the Barangay Chairperson since 2019. He has implemented numerous successful programs focused on community development, environmental sustainability, and public safety.",
      email: "juan.delacruz@barangay.gov.ph",
      phone: "(02) 8123-4567",
      facebook: "facebook.com/juandelacruz",
      term: "2022-2025"
    },
    {
      name: "Hon. Maria Santos",
      position: "Barangay Kagawad (Education Committee)",
      image: "/images/officials/kagawad1.jpg",
      bio: "Hon. Maria Santos heads the Education Committee and has been instrumental in improving educational facilities and opportunities in the barangay.",
      email: "maria.santos@barangay.gov.ph",
      phone: "(02) 8123-4568",
      facebook: "facebook.com/mariasantos",
      term: "2022-2025"
    },
    {
      name: "Hon. Juan Cruz",
      position: "Barangay Kagawad (Environment Committee)",
      image: "/images/officials/kagawad2.jpg",
      bio: "Hon. Juan Cruz leads the Environment Committee, focusing on sustainable practices and environmental conservation projects.",
      email: "juan.cruz@barangay.gov.ph",
      phone: "(02) 8123-4569",
      facebook: "facebook.com/juancruz",
      term: "2022-2025"
    },
    {
      name: "Hon. Pedro Reyes",
      position: "Barangay Kagawad (Finance Committee)",
      image: "/images/officials/kagawad3.jpg",
      bio: "Hon. Pedro Reyes heads the Finance Committee, ensuring transparent and efficient management of barangay funds.",
      email: "pedro.reyes@barangay.gov.ph",
      phone: "(02) 8123-4570",
      facebook: "facebook.com/pedroreyes",
      term: "2022-2025"
    },
    {
      name: "Hon. Ana Garcia",
      position: "Barangay Kagawad (Health Services Committee)",
      image: "/images/officials/kagawad4.jpg",
      bio: "Hon. Ana Garcia leads the Health Services Committee, implementing health programs and medical missions for residents.",
      email: "ana.garcia@barangay.gov.ph",
      phone: "(02) 8123-4571",
      facebook: "facebook.com/anagarcia",
      term: "2022-2025"
    },
    {
      name: "Hon. Ramon Diaz",
      position: "Barangay Kagawad (Peace & Order Committee)",
      image: "/images/officials/kagawad5.jpg",
      bio: "Hon. Ramon Diaz oversees the Peace & Order Committee, working closely with law enforcement to maintain community safety.",
      email: "ramon.diaz@barangay.gov.ph",
      phone: "(02) 8123-4572",
      facebook: "facebook.com/ramondiaz",
      term: "2022-2025"
    },
    {
      name: "Hon. Elena Lim",
      position: "Barangay Kagawad (Public Works Committee)",
      image: "/images/officials/kagawad6.jpg",
      bio: "Hon. Elena Lim heads the Public Works Committee, supervising infrastructure development and maintenance projects.",
      email: "elena.lim@barangay.gov.ph",
      phone: "(02) 8123-4573",
      facebook: "facebook.com/elenalim",
      term: "2022-2025"
    },
    {
      name: "Hon. Sofia Mendoza",
      position: "Barangay Kagawad (Women Committee)",
      image: "/images/officials/kagawad7.jpg",
      bio: "Hon. Sofia Mendoza leads the Women Committee, championing women's rights and implementing programs for their empowerment.",
      email: "sofia.mendoza@barangay.gov.ph",
      phone: "(02) 8123-4574",
      facebook: "facebook.com/sofiamendoza",
      term: "2022-2025"
    }
  ];

  const staff = [
    {
      name: "Roberto Gomez",
      position: "Barangay Secretary",
      image: "/images/officials/secretary.jpg",
      bio: "Roberto Gomez manages all official barangay records and documentation."
    },
    {
      name: "Carmen Velasquez",
      position: "Barangay Treasurer",
      image: "/images/officials/treasurer.jpg",
      bio: "Carmen Velasquez handles the barangay's finances and budget allocation."
    },
    {
      name: "Ferdinand Marcos",
      position: "Barangay Tanod Chief",
      image: "/images/officials/tanod-chief.jpg",
      bio: "Ferdinand Marcos coordinates the barangay's security personnel and operations."
    }
  ];

  const committees = [
    {
      name: "Education Committee",
      chair: "Hon. Maria Santos",
      members: ["Jose Rizal", "Andres Bonifacio", "Emilio Aguinaldo"],
      description: "Oversees educational programs and facilities in the barangay."
    },
    {
      name: "Environment Committee",
      chair: "Hon. Juan Cruz",
      members: ["Gabriela Silang", "Diego Silang", "Lapu-Lapu"],
      description: "Manages environmental conservation and waste management initiatives."
    },
    {
      name: "Finance Committee",
      chair: "Hon. Pedro Reyes",
      members: ["Antonio Luna", "Gregorio Del Pilar", "Apolinario Mabini"],
      description: "Handles budget planning and financial oversight for the barangay."
    },
    {
      name: "Health Services Committee",
      chair: "Hon. Ana Garcia",
      members: ["Melchora Aquino", "Marcelo H. Del Pilar", "Graciano Lopez Jaena"],
      description: "Implements health programs and medical services for residents."
    },
    {
      name: "Peace & Order Committee",
      chair: "Hon. Ramon Diaz",
      members: ["Miguel Malvar", "Mariano Ponce", "Juan Luna"],
      description: "Works to maintain safety and security within the barangay."
    },
    {
      name: "Public Works Committee",
      chair: "Hon. Elena Lim",
      members: ["Felipe Agoncillo", "Mariano Trias", "Artemio Ricarte"],
      description: "Oversees infrastructure development and maintenance projects."
    },
    {
      name: "Women Committee",
      chair: "Hon. Sofia Mendoza",
      members: ["Teresa Magbanua", "Trinidad Tecson", "Josefa Llanes Escoda"],
      description: "Focuses on women's rights, welfare, and empowerment programs."
    }
  ];

  return (
    <div className="container mx-auto space-y-10 py-8">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Barangay Officials</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Meet the dedicated public servants working to improve our barangay through effective governance and community service.
        </p>
      </div>

      {/* Officials Tabs */}
      <Tabs defaultValue="officials" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="officials">Elected Officials</TabsTrigger>
          <TabsTrigger value="staff">Administrative Staff</TabsTrigger>
          <TabsTrigger value="committees">Committees</TabsTrigger>
        </TabsList>

        {/* Elected Officials */}
        <TabsContent value="officials" className="space-y-8">
          {/* Chairperson */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-8 text-center">Barangay Chairperson</h2>
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
                <p className="text-gray-700 mb-6">{officials[0].bio}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <span>{officials[0].email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <span>{officials[0].phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Facebook className="h-5 w-5 text-gray-500" />
                    <span>{officials[0].facebook}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <span className="font-semibold">Term of Office:</span> {officials[0].term}
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
                    <p className="text-gray-700 mb-4">{official.bio}</p>
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
                    <div className="mt-3 pt-3 border-t text-sm">
                      <span className="font-semibold">Term of Office:</span> {official.term}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Administrative Staff */}
        <TabsContent value="staff">
          <h2 className="text-2xl font-semibold mb-8 text-center">Administrative Staff</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staff.map((person, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={person.image} 
                    alt={person.name} 
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/api/placeholder/400/200";
                    }}
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle>{person.name}</CardTitle>
                  <CardDescription>{person.position}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{person.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Committees */}
        <TabsContent value="committees">
          <h2 className="text-2xl font-semibold mb-8 text-center">Barangay Committees</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {committees.map((committee, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{committee.name}</CardTitle>
                  <CardDescription>Chairperson: {committee.chair}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{committee.description}</p>
                  <div>
                    <h4 className="font-semibold mb-2">Committee Members:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {committee.members.map((member, i) => (
                        <li key={i}>{member}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Organizational Chart */}
      <section className="mt-16">
        <h2 className="text-2xl font-semibold text-center mb-8">Organizational Structure</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="max-w-3xl mx-auto overflow-x-auto">
            <div className="min-w-[800px]">
              {/* This would be better with a proper chart component or SVG, but for now, using divs with borders */}
              <div className="flex flex-col items-center">
                {/* Chairperson */}
                <div className="w-64 p-4 border-2 border-blue-500 rounded-lg bg-blue-50 text-center mb-4">
                  <div className="font-bold">Barangay Chairperson</div>
                  <div>{officials[0].name}</div>
                </div>
                {/* Connector */}
                <div className="w-1 h-8 bg-gray-400"></div>
                {/* Administrative Staff */}
                <div className="w-64 p-4 border-2 border-purple-500 rounded-lg bg-purple-50 text-center mb-4">
                  <div className="font-bold">Barangay Secretary</div>
                  <div>{staff[0].name}</div>
                </div>
                {/* Connector */}
                <div className="w-1 h-8 bg-gray-400"></div>
                {/* Kagawads & Committees */}
                <div className="grid grid-cols-4 gap-4">
                  {officials.slice(1, 5).map((official, index) => (
                    <div key={index} className="w-64 p-4 border-2 border-green-500 rounded-lg bg-green-50 text-center">
                      <div className="font-bold">Barangay Kagawad</div>
                      <div>{official.name}</div>
                      <div className="text-sm text-gray-600 mt-1">{official.position.split('(')[1]?.replace(')', '') || ''}</div>
                    </div>
                  ))}
                </div>
                {/* More Kagawads */}
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {officials.slice(5).map((official, index) => (
                    <div key={index} className="w-64 p-4 border-2 border-green-500 rounded-lg bg-green-50 text-center">
                      <div className="font-bold">Barangay Kagawad</div>
                      <div>{official.name}</div>
                      <div className="text-sm text-gray-600 mt-1">{official.position.split('(')[1]?.replace(')', '') || ''}</div>
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