import React, { useState, useEffect } from 'react';

interface NotificationProps {
    message: string | null;
    onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                onClose();       // Notify the parent to clear the message
            }, 3000);
            return () => clearTimeout(timer); // Cleanup on unmount or message change
        } else {
            setIsVisible(false);
        }
    }, [message, onClose]);

    if (!isVisible || !message) {
        return null;
    }

    return (
        <div className="fixed bottom-6 left-6 z-50 rounded-2xl border border-cream-border bg-ink px-5 py-3 font-sans text-sm font-medium text-cream shadow-[0_12px_32px_rgba(28,25,23,0.25)]">
            {message}
        </div>
    );
};

export default Notification;