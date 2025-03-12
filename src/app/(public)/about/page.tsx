"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, Clock, Target, Users, Building, History, Heart } from "lucide-react";

export default function AboutPage() {
  // Mission and vision already defined in the UI

  const history = [
    {
      year: "1945",
      title: "Barangay Establishment",
      description: "Our barangay was officially established after World War II as part of the post-war reconstruction efforts."
    },
    {
      year: "1972",
      title: "First Community Hall",
      description: "The first community hall was built through the collective efforts of the residents, serving as the center for barangay activities."
    },
    {
      year: "1998",
      title: "Development Milestone",
      description: "Major infrastructure improvements including road networks and drainage systems were completed, significantly improving mobility and flood control."
    },
    {
      year: "2010",
      title: "Modernization Program",
      description: "The barangay launched its modernization program, focusing on digital governance and improved service delivery."
    },
    {
      year: "2022",
      title: "Smart Barangay Initiative",
      description: "Implementation of the Barangay Information System began, bringing barangay services closer to residents through technology."
    }
  ];

  const achievements = [
    {
      title: "Best Governed Barangay Award",
      year: "2023",
      description: "Recognized for excellence in governance, transparency, and public service delivery by the Department of Interior and Local Government."
    },
    {
      title: "Clean and Green Award",
      year: "2022",
      description: "Awarded for outstanding environmental programs and initiatives promoting sustainability and ecological balance."
    },
    {
      title: "Most Business-Friendly Barangay",
      year: "2021",
      description: "Recognized for creating a conducive environment for business growth and entrepreneurship development."
    },
    {
      title: "Disaster-Ready Community",
      year: "2020",
      description: "Awarded for comprehensive disaster risk reduction and management programs ensuring community resilience."
    }
  ];

  const coreValues = [
    {
      icon: <Users className="h-10 w-10 text-blue-600" />,
      title: "Inclusivity",
      description: "We ensure that all community members, regardless of background or status, have equal access to services and opportunities."
    },
    {
      icon: <Building className="h-10 w-10 text-green-600" />,
      title: "Transparency",
      description: "We maintain open communication and accountability in all our operations and decision-making processes."
    },
    {
      icon: <Target className="h-10 w-10 text-purple-600" />,
      title: "Excellence",
      description: "We strive for the highest standards in public service delivery and community development initiatives."
    },
    {
      icon: <Heart className="h-10 w-10 text-red-600" />,
      title: "Compassion",
      description: "We approach our work with empathy, understanding the diverse needs and challenges of our community members."
    }
  ];

  return (
    <div className="container mx-auto space-y-12 py-8">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to Barangay Taysan</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          A vibrant community dedicated to growth, sustainability, and unity.
        </p>
      </div>

      {/* Mission & Vision Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2 flex flex-col items-center">
            <div className="mb-4 text-blue-500">
              <Target className="h-12 w-12" />
            </div>
            <CardTitle className="text-center">Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 text-center">
              Our mission is to enhance barangay governance by fostering collaboration, transparency, and efficiency through a comprehensive committee system that serves the needs of the community.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardHeader className="pb-2 flex flex-col items-center">
            <div className="mb-4 text-purple-500">
              <Users className="h-12 w-12" />
            </div>
            <CardTitle className="text-center">Who We Are</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 text-center">
              We are a dedicated team working to empower the barangay through an organized committee system, ensuring efficient delivery of services and active citizen participation in governance.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2 flex flex-col items-center">
            <div className="mb-4 text-green-500">
              <Award className="h-12 w-12" />
            </div>
            <CardTitle className="text-center">Our Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 text-center">
              We envision a progressive barangay where every committee plays a vital role in achieving sustainable development, unity, and effective local governance.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Core Values Section */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreValues.map((value, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="mb-4 flex justify-center">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Tabs for History and Achievements */}
      <section>
        <Tabs defaultValue="history" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="history">Our History</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          {/* History Tab */}
          <TabsContent value="history">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <History className="h-6 w-6 mr-2 text-blue-600" />
                  Barangay History
                </h2>
                <p className="text-gray-700 mb-8">
                  Our barangay has a rich history dating back to the post-war era. Here are some key milestones in our development:
                </p>
                <div className="relative border-l-2 border-blue-500 pl-8 space-y-10 ml-4">
                  {history.map((event, index) => (
                    <div key={index} className="relative">
                      <div className="absolute -left-12 mt-1.5 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div className="absolute -left-[42px] mt-1 bg-white text-blue-600 font-bold px-2">
                        {event.year}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                      <p className="text-gray-600">{event.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <Award className="h-6 w-6 mr-2 text-amber-600" />
                  Notable Achievements
                </h2>
                <p className="text-gray-700 mb-8">
                  Our barangay has been recognized for excellence in various areas. Here are some of our recent achievements:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {achievements.map((achievement, index) => (
                    <Card key={index} className="border-l-4 border-amber-500">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold">{achievement.title}</h3>
                          <span className="bg-amber-100 text-amber-800 text-sm px-2 py-1 rounded">
                            {achievement.year}
                          </span>
                        </div>
                        <p className="text-gray-600">{achievement.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Demographics Section */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center">Barangay Demographics</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">12,456</div>
                <h3 className="text-lg font-medium">Total Population</h3>
                <p className="text-sm text-gray-500">As of January 2025</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">3,245</div>
                <h3 className="text-lg font-medium">Households</h3>
                <p className="text-sm text-gray-500">Registered in our barangay</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">2.1 km²</div>
                <h3 className="text-lg font-medium">Land Area</h3>
                <p className="text-sm text-gray-500">Total barangay coverage</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Age Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>0-14 years</span>
                      <span>24%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: "24%" }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>15-29 years</span>
                      <span>32%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: "32%" }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>30-44 years</span>
                      <span>26%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: "26%" }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>45-59 years</span>
                      <span>12%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: "12%" }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>60+ years</span>
                      <span>6%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: "6%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Employment & Education</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Employment Status</h4>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-xl font-semibold text-blue-600">68%</div>
                        <p className="text-sm">Employed</p>
                      </div>
                      <div className="bg-amber-50 p-3 rounded-lg">
                        <div className="text-xl font-semibold text-amber-600">12%</div>
                        <p className="text-sm">Self-employed</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-xl font-semibold text-gray-600">20%</div>
                        <p className="text-sm">Unemployed</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Education Level</h4>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="text-xl font-semibold text-green-600">28%</div>
                        <p className="text-sm">College Degree</p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <div className="text-xl font-semibold text-purple-600">42%</div>
                        <p className="text-sm">High School</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-xl font-semibold text-blue-600">30%</div>
                        <p className="text-sm">Elementary</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}