import React from "react";

const AnimatedLoader = ({ className = "" }) => {
    return (
        <div className={`flex justify-center ${className}`}>
            <div
                className="animate-spin w-12 h-12 border-4 border-purple-600
                          border-t-transparent rounded-full"
            ></div>
        </div>
    );
};

export default AnimatedLoader;
