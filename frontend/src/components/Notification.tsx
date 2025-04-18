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
        <div className="fixed bottom-4 left-4 bg-green-500 text-white p-3 rounded-md shadow-lg z-50">
            {message}
        </div>
    );
};

export default Notification;