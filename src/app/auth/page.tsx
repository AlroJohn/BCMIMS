'use client';

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import SigninWrapper from "../../components/custom/auth-component/signin-form";
import SignupWrapper from "../../components/custom/auth-component/signup-form";


const carouselItems = [
    '/images/static/1a.jpg',
    '/images/static/2a.jpg',
    '/images/static/3a.jpg',
    '/images/static/4a.jpg',
    '/images/static/5a.jpg',
    '/images/static/6a.jpg',
];

const Auth = () => {
    const [api, setApi] = useState<any>();
    const [current, setCurrent] = useState(0);
    const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

    // Toggle between signin and signup
    const toggleAuthMode = () => {
        setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
    };

    useEffect(() => {
        if (!api) return;

        // Set up auto-sliding
        const interval = setInterval(() => {
            api.scrollNext();
        }, 5000);

        return () => clearInterval(interval);
    }, [api]);

    // Handle slide changes
    const handleSelect = () => {
        if (!api) return;
        setCurrent(api.selectedScrollSnap());
    };

    useEffect(() => {
        if (!api) return;

        api.on("select", handleSelect);

        return () => {
            api.off("select", handleSelect);
        };
    }, [api, handleSelect]);

    return (
        <div className="w-full h-screen flex flex-col md:flex-row dark:bg-gray-900 bg-gray-200">
            {/* Left: Fullscreen Carousel */}
            <div className="hidden md:block w-full h-full bg-muted relative overflow-hidden">
                <div className="absolute w-full h-full z-50 bg-gradient-to-r dark:from-gray-900/30 dark:via-gray-900/50
                 dark:to-gray-900 from-gray-200/10 via-gray-200/40 to-gray-200"></div>
                <Carousel
                    setApi={setApi}
                    className="w-full h-full"
                    opts={{
                        loop: true,
                        align: "center",
                    }}
                >
                    <CarouselContent className="h-screen w-full m-0">
                        {carouselItems.map((item, index) => (
                            <CarouselItem key={index} className="h-full w-full p-0">
                                <div className="h-full w-full">
                                    <Card className="h-full w-full rounded-none border-0 p-0">
                                        <CardContent className="h-full w-full p-0 flex items-center justify-center">
                                            {/* Full background image */}
                                            <img src={item} className="h-full w-full object-cover" alt="" />
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>

            {/* Right: Auth Section (Signin or Signup) */}
            <div className="w-full h-full flex items-center justify-center">
                {authMode === 'signin' ? (
                    <SigninWrapper onToggle={toggleAuthMode} />
                ) : (
                    <SignupWrapper onToggle={toggleAuthMode} />
                )}
            </div>
        </div>
    );
};

export default Auth;