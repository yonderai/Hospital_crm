import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/mongoose";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                console.log("Authorize called with:", credentials?.email);
                if (!credentials?.email || !credentials?.password) {
                    console.log("Missing credentials");
                    throw new Error("Missing email or password");
                }

                await dbConnect();

                const user = await User.findOne({
                    $or: [
                        { email: credentials.email },
                        { employeeId: credentials.email }
                    ]
                }).select('+password'); // Ensure password is selected

                if (!user) {
                    console.log("User not found for:", credentials.email);
                    throw new Error("No active user found with this email/ID");
                }

                if (!user.isActive) {
                    console.log("User inactive:", user.email);
                    throw new Error("User account is inactive");
                }

                console.log("User found:", user.email, "Role:", user.role, "Hash:", user.password ? "Present" : "Missing");

                const isValid = await bcrypt.compare(credentials.password, user.password);

                if (!isValid) {
                    console.log("Password invalid for:", user.email);
                    throw new Error("Invalid password");
                }

                console.log("Login successful for:", user.email);

                return {
                    id: user._id.toString(),
                    email: user.email,
                    role: user.role,
                    name: `${user.firstName} ${user.lastName}`,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as { role: string }).role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                (session.user as { role: string }).role = token.role as string;
                (session.user as { id: string }).id = token.id as string;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
};
