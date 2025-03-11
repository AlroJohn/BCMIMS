"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/custom/theme/theme-toggle";
import { useLogin } from "@/hooks/useSignin-hooks";

const SigninWrapper = () => {
    const { formData, handleChange, handleSubmit, loading } = useLogin();

    return (
        <div className="flex items-center justify-center h-full w-full p-4">
            <Card className="w-full max-w-md shadow-lg relative bg-white">
                <div className="absolute top-4 right-4">
                    {/* <ThemeToggle 
                        iconColor="black" 
                        iconSize={18} 
                        variant="ghost"
                        className="hover:bg-gray-100"
                    /> */}
                </div>
                <CardHeader className="space-y-1 flex flex-col items-center">
                    <div className="flex flex-col items-center">
                        <img className="h-16 mb-2" src="/images/logo.png" alt="logo" />
                        <CardTitle className="text-xl font-semibold text-black">Account Sign-In</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="ml-1 text-black">Email</Label>
                            <Input 
                                id="email"
                                type="email" 
                                placeholder="Enter your email" 
                                value={formData.email}
                                onChange={handleChange}
                                required 
                                className="bg-white border-black/30 text-black"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="ml-1 text-black">Password</Label>
                            <Input 
                                id="password"
                                type="password" 
                                placeholder="Enter your password" 
                                value={formData.password}
                                onChange={handleChange}
                                required 
                                className="bg-white border-black/30 text-black"
                            />
                        </div>

                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-blue-950 text-white hover:bg-sky-800 duration-300 ease-in-out transition-all hover:text-accent-foreground mt-2"
                        >
                            {loading ? "Logging in..." : "LOGIN"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default SigninWrapper;
