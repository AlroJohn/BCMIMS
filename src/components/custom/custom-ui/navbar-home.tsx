"use client";

import Link from "next/link";

const Navbar = () => {
    return (
        <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <img src="/images/logo.png" alt="Barangay Logo" className="h-10 mr-3" />
                        <h1 className="text-lg font-semibold text-gray-700">Barangay Taysan</h1>
                    </div>
                    <div className="flex space-x-6">
                        <Link href="/" className="text-gray-700 hover:text-blue-500">Home</Link>
                        <Link href="/officials" className="text-gray-700 hover:text-blue-500">Officials</Link>
                        <Link href="/services" className="text-gray-700 hover:text-blue-500">Services</Link>
                        <Link href="/contact" className="text-gray-700 hover:text-blue-500">Contact</Link>
                        <Link href="/about" className="text-gray-700 hover:text-blue-500">About</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
