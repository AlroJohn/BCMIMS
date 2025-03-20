// src/types/user.ts

export enum UserRole {
    Admin = "Admin",
    Education = "Education",
    Environment = "Environment",
    Finance = "Finance",
    HealthServices = "HealthServices",
    PeaceOrder = "PeaceOrder",
    PublicWorks = "PublicWorks",
    Women = "Women"
}

export interface User {
    id: string;
    email: string;
    name: string;
    phone: string | null;
    profile: string | null; // Base64 encoded image
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProfileUpdateData {
    name: string;
    phone: string | null;
    profile: string | null;
}