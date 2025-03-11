"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar-home"; // ✅ Import the actual Navbar component

const NavbarWrapper = () => {
    const pathname = usePathname();

    // Hide Navbar on the `/auth` page
    if (pathname.startsWith('/auth')) return null;

    return <Navbar />;
};

export default NavbarWrapper;
