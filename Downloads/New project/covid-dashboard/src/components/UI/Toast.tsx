import React, { useEffect } from 'react';

interface ToastProps {
    message: string;
    onClose: () => void;
    duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[100] animate-fade-in-down">
            <div className="bg-brand-900/90 backdrop-blur-md border border-white/10 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-status-active animate-pulse"></div>
                <span className="text-sm font-medium tracking-wide">{message}</span>
            </div>
        </div>
    );
};
