"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, MapPin, Clock, Mail, Facebook, Globe, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("");
  const [submitted, setSubmitted] = useState(false);
  
  const contactInfo = {
    address: "123 Main Street, Barangay Example, Manila, Philippines",
    phone: "(02) 8123-4567",
    mobile: "+63 912 345 6789",
    email: "example@barangay.gov.ph",
    facebook: "facebook.com/barangayexample",
    website: "www.barangayexample.gov.ph",
    officeHours: [
      { days: "Monday - Friday", hours: "8:00 AM - 5:00 PM" },
      { days: "Saturday", hours: "8:00 AM - 12:00 PM" },
      { days: "Sunday", hours: "Closed" }
    ]
  };
  
  const faqCategories = [
    { value: "certificates", label: "Certificates & Clearances" },
    { value: "programs", label: "Programs & Assistance" },
    { value: "events", label: "Events & Activities" },
    { value: "complaints", label: "Complaints & Concerns" },
    { value: "others", label: "Other Inquiries" }
  ];
  
  const emergencyContacts = [
    { title: "Barangay Emergency Hotline", contact: "(02) 8123-4567" },
    { title: "Barangay Patrol", contact: "+63 912 345 6789" },
    { title: "Nearest Police Station", contact: "(02) 8123-4568" },
    { title: "Fire Department", contact: "(02) 8123-4569" },
    { title: "Health Center", contact: "(02) 8123-4570" }
  ];
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would handle form submission here
    // For demo purposes, we'll just set a submitted state
    setSubmitted(true);
    
    // Reset form fields after submission
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setCategory("");
    
    // Reset submitted state after 5 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <div className="container mx-auto space-y-12 py-8">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Reach out to our barangay office for inquiries, concerns, or assistance. We are here to help our community members.
        </p>
      </div>

      {/* Contact Information & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Information */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Address</h3>
                  <p className="text-gray-600">{contactInfo.address}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p className="text-gray-600">{contactInfo.phone}</p>
                  <p className="text-gray-600">{contactInfo.mobile}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-gray-600">{contactInfo.email}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Facebook className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Social Media</h3>
                  <p className="text-gray-600">{contactInfo.facebook}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold">Office Hours</h3>
                  <div className="space-y-1 text-gray-600">
                    {contactInfo.officeHours.map((schedule, index) => (
                      <div key={index}>
                        <span className="font-medium">{schedule.days}:</span> {schedule.hours}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contacts */}
          <Card className="bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                Emergency Contacts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className="flex justify-between items-center pb-2 border-b border-red-100">
                    <span className="font-medium">{contact.title}</span>
                    <span className="text-red-700 font-semibold">{contact.contact}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              {submitted && (
                <Alert className="mb-6 bg-green-50 border-green-200">
                  <AlertCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle>Thank you for your message!</AlertTitle>
                  <AlertDescription>
                    We have received your inquiry and will respond as soon as possible.
                  </AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input 
                      id="name" 
                      placeholder="Juan Dela Cruz" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="juan@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Inquiry Category</Label>
                    <Select
                      value={category}
                      onValueChange={setCategory}
                      required
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {faqCategories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input 
                      id="subject" 
                      placeholder="Brief subject of your inquiry" 
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Your Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Please provide details of your inquiry or concern..." 
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" className="px-8">
                    Send Message
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Map Section */}
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
      
      {/* FAQ Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Contact Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-2">What if my concern requires immediate attention?</h3>
              <p className="text-gray-700">For urgent matters, please call our emergency hotline at (02) 8123-4567, which is available 24/7. For medical emergencies, please contact the nearest hospital directly.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-2">How long will it take to get a response?</h3>
              <p className="text-gray-700">We aim to respond to all inquiries within 24-48 hours during business days. Complex matters may require additional time for investigation and resolution.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-2">Can I schedule a meeting with a specific barangay official?</h3>
              <p className="text-gray-700">Yes, you can request an appointment by calling our office or using the contact form. Please provide details about the purpose of your meeting to help us schedule appropriately.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-2">How can I follow up on my previously submitted concern?</h3>
              <p className="text-gray-700">You can follow up by providing your reference number through our contact form, visiting the office in person, or calling our contact number during office hours.</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}