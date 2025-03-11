'use client';

import SigninWrapper from "../../components/custom/auth-component/signin-form";

const Auth = () => {
    return (
        <div className="relative w-full h-screen flex">
            {/* Fullscreen Background Image */}
            <div className="absolute inset-0">
                <img 
                    src="/images/hall.jpg" 
                    alt="Background"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Dark Overlay for readability */}
            <div className="absolute inset-0 bg-black/50"></div>

            {/* Right Side: Sign-in Form */}
            <div className="relative z-10 w-full md:w-1/3 h-full flex items-center justify-center ml-auto">
                <div className="rounded-lg shadow-lg w-[90%] max-w-md">
                    <SigninWrapper />
                </div>
            </div>
        </div>
    );
};

export default Auth;
