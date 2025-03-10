'use client';

import { Loader } from "lucide-react";

const GuradLoader = () => {
    return (
        <div className="h-screen w-full flex items-center justify-center dark:bg-gray-900 dark:text-white bg-background text-gray-900 text-5xl">
            <Loader className="animate-spin" size={56} />
        </div>
    );
};

export default GuradLoader;