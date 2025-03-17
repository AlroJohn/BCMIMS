// "use server";


// import { prisma } from "@/lib/prisma";
// import { supabase } from "@/lib/supabase-client";
// import bcrypt from "bcryptjs";

// interface SignupData {
//   name: string;
//   email: string;
//   phone: string;
//   password: string;
// }

// export async function signupUser(data: SignupData) {
//   try {
//     // 1️⃣ Register user in Supabase Auth
//     const { data: supabaseUser, error: authError } = await supabase.auth.signUp({
//       email: data.email,
//       password: data.password, // Supabase handles password hashing
//     });

//     if (authError) {
//       return { success: false, message: authError.message };
//     }

//     const userId = supabaseUser?.user?.id;
//     if (!userId) {
//       return { success: false, message: "User ID not found." };
//     }

//     // 2️⃣ Hash the password (not needed for Supabase, but for Prisma storage)
//     const hashedPassword = await bcrypt.hash(data.password, 10);

//     // 3️⃣ Insert user into Prisma, using Supabase's ID
//     const newUser = await prisma.user.create({
//       data: {
//         id: userId, // Use Supabase Auth user ID
//         name: data.name,
//         email: data.email,
//         phone: data.phone,
//         password: hashedPassword, // Store hashed password
//         role: "CLIENT",
//       },
//     });

//     return { success: true, message: "Signup successful!", user: newUser };
//   } catch (error) {
//     console.error("Signup error:", error);
//     return { success: false, message: "Signup failed. Try again." };
//   }
// }
