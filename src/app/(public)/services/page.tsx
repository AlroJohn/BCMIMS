"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FileText, Clock, Calendar, CheckCircle, AlertCircle, Download, User, Landmark, Home, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState(null);
  
  const certificates = [
    {
      id: "barangay-clearance",
      title: "Barangay Clearance",
      description: "A certification issued to residents for various legal and official purposes, verifying residence and good standing within the barangay.",
      requirements: [
        "Valid ID (with address within the barangay)",
        "Fully accomplished application form",
        "Payment of processing fee",
        "Clear copy of previous clearance (for renewal)",
      ],
      processingTime: "1-2 working days",
      processingFee: "₱100.00",
      validityPeriod: "6 months from issuance",
      steps: [
        "Fill out the application form at the Barangay Office",
        "Submit required documents",
        "Pay the processing fee",
        "Return on the scheduled release date to claim the certificate"
      ]
    },
    {
      id: "certificate-of-residency",
      title: "Certificate of Residency",
      description: "A document certifying that an individual is a bona fide resident of the barangay, often required for employment, school enrollment, and other official purposes.",
      requirements: [
        "Valid ID (with address within the barangay)",
        "Fully accomplished application form",
        "Payment of processing fee",
        "Proof of residency (utility bills, etc.) if required"
      ],
      processingTime: "Same day release",
      processingFee: "₱50.00",
      validityPeriod: "6 months from issuance",
      steps: [
        "Fill out the application form at the Barangay Office",
        "Submit required documents",
        "Pay the processing fee",
        "Wait for the certificate to be processed and released"
      ]
    },
    {
      id: "business-clearance",
      title: "Business Clearance",
      description: "A certification needed for business permit applications, verifying that the business operation complies with barangay regulations.",
      requirements: [
        "DTI Registration/SEC Registration",
        "Proof of business location ownership or lease contract",
        "Barangay Business Application Form",
        "Valid ID of business owner",
        "Payment of processing fee",
        "Previous clearance (for renewal)"
      ],
      processingTime: "3-5 working days",
      processingFee: "₱500.00 (varies based on business type)",
      validityPeriod: "1 year from issuance",
      steps: [
        "Fill out the Business Application Form at the Barangay Office",
        "Submit required documents",
        "Pay the processing fee",
        "Inspection of business premises by barangay officials",
        "Return on the scheduled release date to claim the clearance"
      ]
    },
    {
      id: "barangay-id",
      title: "Barangay ID",
      description: "An official identification card issued to residents of the barangay for identification purposes and access to barangay services.",
      requirements: [
        "Proof of residency (utility bills, etc.)",
        "Birth Certificate or any valid government ID",
        "ID application form",
        "1x1 ID picture (colored, white background)",
        "Payment of processing fee"
      ],
      processingTime: "5-7 working days",
      processingFee: "₱75.00",
      validityPeriod: "5 years from issuance",
      steps: [
        "Fill out the ID application form at the Barangay Office",
        "Submit required documents and ID picture",
        "Pay the processing fee",
        "Return on the scheduled release date to claim the ID"
      ]
    },
    {
      id: "indigency-certificate",
      title: "Certificate of Indigency",
      description: "A document certifying that an individual or family belongs to the marginalized sector, often used to avail of discounts, social services, or medical assistance.",
      requirements: [
        "Valid ID (with address within the barangay)",
        "Fully accomplished application form",
        "Verification of economic status by barangay officials"
      ],
      processingTime: "1-2 working days",
      processingFee: "Free of charge",
      validityPeriod: "30 days from issuance",
      steps: [
        "Fill out the application form at the Barangay Office",
        "Submit required documents",
        "Home visitation/verification by barangay officials (if needed)",
        "Return on the scheduled release date to claim the certificate"
      ]
    }
  ];
  
  const programs = [
    {
      title: "Scholarship Program",
      category: "Education",
      description: "Financial assistance for deserving students in the barangay to support their education.",
      eligibility: "Residents with good academic standing (minimum GPA of 2.0 or 85%), with family income below the poverty threshold.",
      benefits: "Up to ₱5,000 per semester for college students; Up to ₱3,000 per year for high school students.",
      icon: <User className="h-10 w-10 text-blue-500" />
    },
    {
      title: "Livelihood Training Program",
      category: "Economic Development",
      description: "Skills development and training opportunities for residents to enhance employability or entrepreneurship.",
      eligibility: "Unemployed residents, women, out-of-school youth, and persons with disabilities.",
      benefits: "Free skills training, starter kits for small businesses, and job placement assistance.",
      icon: <Landmark className="h-10 w-10 text-green-500" />
    },
    {
      title: "Healthcare Assistance Program",
      category: "Health",
      description: "Financial and medical assistance for residents requiring healthcare services.",
      eligibility: "Indigent residents, senior citizens, PWDs, and those with serious medical conditions.",
      benefits: "Discounted or free medical consultations, assistance with laboratory fees, and medicine subsidies.",
      icon: <AlertCircle className="h-10 w-10 text-red-500" />
    },
    {
      title: "Solid Waste Management Program",
      category: "Environment",
      description: "Community-based waste segregation and recycling initiatives to promote environmental sustainability.",
      eligibility: "All barangay residents and establishments.",
      benefits: "Clean community environment, potential income from recyclables, and reduced garbage collection fees.",
      icon: <Home className="h-10 w-10 text-amber-500" />
    }
  ];
  
  const faqs = [
    {
      question: "What are the office hours of the Barangay Office?",
      answer: "The Barangay Office is open from Monday to Friday, 8:00 AM to 5:00 PM, and Saturday from 8:00 AM to 12:00 PM. The office is closed on Sundays and holidays."
    },
    {
      question: "How can I request for a Barangay Clearance online?",
      answer: "Currently, initial requests for Barangay Clearance must be made in person at the Barangay Office. However, renewal requests can be made through our online portal by creating an account and submitting the required documents digitally. Payment can be made through authorized payment channels, and the clearance can be picked up at the Barangay Office on the scheduled date."
    },
    {
      question: "What is the process for reporting barangay concerns or incidents?",
      answer: "You can report concerns or incidents by visiting the Barangay Office in person, calling our hotline at (02) 8123-4567, or using the 'Report a Concern' feature on our website. Please provide complete details of the incident, including location, time, and nature of the concern for prompt action."
    },
    {
      question: "How can I join barangay programs or volunteer activities?",
      answer: "To join barangay programs or volunteer activities, you can visit the Barangay Office to express your interest, contact our Community Affairs Office, or sign up through our website's 'Community Involvement' section. Regular announcements of programs and activities are also posted on our official social media pages and barangay bulletin boards."
    },
    {
      question: "How do I apply for financial assistance from the barangay?",
      answer: "To apply for financial assistance, visit the Barangay Office and speak with our Social Welfare Officer. Bring identification, proof of residency, and documentation related to your specific need (medical bills, etc.). Each request is evaluated based on established criteria and available resources."
    },
    {
      question: "Can non-residents avail of barangay services?",
      answer: "Most barangay services are primarily for residents. However, some services may be extended to non-residents under special circumstances, particularly emergency services. For document requests and other administrative services, residency within the barangay is generally required."
    }
  ];
  
  // Filter certificates based on search query
  const filteredCertificates = certificates.filter(cert => 
    cert.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    cert.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle FAQ expansion
  const toggleFaq = (index) => {
    if (expandedFaq === index) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(index);
    }
  };

  return (
    <div className="container mx-auto space-y-10 py-8">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Barangay Services</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Explore the various services, programs, and assistance offered by our barangay to support and improve the quality of life of our residents.
        </p>
      </div>

      {/* Services Tabs */}
      <Tabs defaultValue="certificates" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="certificates">Certificates & Clearances</TabsTrigger>
          <TabsTrigger value="programs">Programs & Assistance</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
        </TabsList>

        {/* Certificates & Clearances */}
        <TabsContent value="certificates" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Available Certificates & Clearances</h2>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Search certificates..." 
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCertificates.length > 0 ? (
              filteredCertificates.map((cert) => (
                <Card key={cert.id} className="overflow-hidden">
                  <CardHeader className="bg-blue-50 border-b">
                    <CardTitle>{cert.title}</CardTitle>
                    <CardDescription>{cert.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-500 mb-1 flex items-center">
                        <Clock className="h-4 w-4 mr-2" /> Processing Time
                      </h4>
                      <p>{cert.processingTime}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-500 mb-1 flex items-center">
                        <Calendar className="h-4 w-4 mr-2" /> Validity
                      </h4>
                      <p>{cert.validityPeriod}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-500 mb-1">Fee</h4>
                      <p>{cert.processingFee}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 px-6 py-3 border-t">
                    <Link href={`#${cert.id}`} className="text-blue-600 hover:underline text-sm">
                      View requirements and process →
                    </Link>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium">No certificates found</h3>
                <p className="text-gray-500">Try adjusting your search query</p>
              </div>
            )}
          </div>
          
          {/* Detailed Information Sections */}
          <div className="mt-12 space-y-12">
            {certificates.map((cert) => (
              <section key={cert.id} id={cert.id} className="bg-white border rounded-lg p-6 scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4">{cert.title}</h2>
                <p className="text-gray-700 mb-6">{cert.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-600" /> Requirements
                    </h3>
                    <ul className="list-disc pl-6 space-y-2">
                      {cert.requirements.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-blue-600" /> Process
                    </h3>
                    <ol className="list-decimal pl-6 space-y-2">
                      {cert.steps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-1">Processing Time</h4>
                    <p>{cert.processingTime}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-1">Processing Fee</h4>
                    <p>{cert.processingFee}</p>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-1">Validity Period</h4>
                    <p>{cert.validityPeriod}</p>
                  </div>
                </div>
                
                <div className="mt-8 pt-4 border-t flex justify-between items-center">
                  <p className="text-gray-500">For more information, visit the Barangay Office or call (02) 8123-4567.</p>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" /> Download Form
                  </Button>
                </div>
              </section>
            ))}
          </div>
        </TabsContent>

        {/* Programs & Assistance */}
        <TabsContent value="programs">
          <h2 className="text-2xl font-semibold mb-6">Barangay Programs & Assistance</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {programs.map((program, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="rounded-full bg-primary-50 p-2">
                    {program.icon}
                  </div>
                  <div>
                    <CardTitle>{program.title}</CardTitle>
                    <CardDescription>{program.category}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">{program.description}</p>
                  
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Eligibility:</h4>
                    <p className="text-gray-600">{program.eligibility}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Benefits:</h4>
                    <p className="text-gray-600">{program.benefits}</p>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 border-t">
                  <Button variant="outline" className="w-full">
                    Apply for Program
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {/* Application Process */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">How to Apply for Assistance Programs</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="border-2 border-blue-200">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                  <h4 className="font-semibold mb-2">Submit Application</h4>
                  <p className="text-sm text-gray-600">Visit the Barangay Office to fill out and submit the application form.</p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-blue-200">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                  <h4 className="font-semibold mb-2">Document Verification</h4>
                  <p className="text-sm text-gray-600">Barangay officials will verify submitted documents and eligibility.</p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-blue-200">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                  <h4 className="font-semibold mb-2">Assessment</h4>
                  <p className="text-sm text-gray-600">Applications are assessed based on established criteria and available resources.</p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-blue-200">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
                  <h4 className="font-semibold mb-2">Notification</h4>
                  <p className="text-sm text-gray-600">Applicants will be notified of the decision within 15 working days.</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-semibold flex items-center mb-2">
                <AlertCircle className="h-5 w-5 mr-2 text-yellow-600" /> Important Note
              </h4>
              <p className="text-gray-700">Program availability is subject to barangay budget allocation and may change without prior notice. Priority is given to indigent residents, senior citizens, persons with disabilities, and other vulnerable sectors. For inquiries, please contact our Community Services Office at (02) 8123-4568.</p>
            </div>
          </div>
        </TabsContent>

        {/* FAQs - Replaced Accordion with custom toggle implementation */}
        <TabsContent value="faqs">
          <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border rounded-md overflow-hidden">
                <button 
                  className="w-full px-4 py-4 text-left flex justify-between items-center font-medium hover:bg-gray-50 focus:outline-none"
                  onClick={() => toggleFaq(index)}
                >
                  {faq.question}
                  {expandedFaq === index ? 
                    <ChevronUp className="h-4 w-4 text-gray-500" /> : 
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  }
                </button>
                {expandedFaq === index && (
                  <div className="px-4 py-3 text-gray-700 bg-gray-50 border-t">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-10 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-xl font-semibold mb-4">Still have questions?</h3>
            <p className="mb-6">If you cannot find the answer to your question, feel free to contact our office directly.</p>
            <div className="flex flex-wrap gap-4">
              <Button>
                Contact Us
              </Button>
              <Button variant="outline">
                Visit Office
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}