"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/custom/theme/theme-toggle";
import { useLogin } from "@/hooks/useSignin-hooks";


const SigninWrapper = ({ onToggle }: { onToggle: () => void }) => {
    const { formData, handleChange, handleSubmit, loading } = useLogin();

    return (
        <div className="flex items-center justify-center h-full w-full p-4">
            <Card className="w-full max-w-md shadow-lg relative bg-white">
                <div className='absolute top-4 right-4'>
                    <ThemeToggle 
                        iconColor="black" 
                        iconSize={18} 
                        variant="ghost"
                        className="hover:bg-gray-100"
                    />
                </div>
                <CardHeader className="space-y-1 flex flex-col items-center">
                    <div className="flex flex-col items-center">
                        <img className="h-16 mb-2" src="/images/logo.png" alt="logo" />
                        <CardTitle className="text-xl font-semibold text-black">Ctrl Alt Work</CardTitle>
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
                                className='bg-white border-black/30 text-black'
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
                                className='bg-white border-black/30 text-black'
                            />
                        </div>

                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-black text-white hover:bg-secondary duration-300 ease-in-out transition-all hover:text-accent-foreground mt-2"
                        >
                            {loading ? "Logging in..." : "LOGIN"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center w-full pt-4">
                    <p className="text-center text-black text-sm">
                        Don&apos;t have an account?{" "}
                        <button 
                            onClick={onToggle} 
                            className="text-blue-500 hover:text-blue-600 font-medium cursor-pointer"
                        >
                            Sign up
                        </button>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default SigninWrapper;
