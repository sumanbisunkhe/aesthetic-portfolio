import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LocationData {
    city: string;
    country_name: string;
    country_code: string;
}

const VisitorLocation = () => {
    const [location, setLocation] = useState<LocationData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                // Using ipwho.is - fast, reliable, and better CORS support for local dev
                const response = await fetch('https://ipwho.is/');
                const data = await response.json();

                if (data && data.success) {
                    setLocation({
                        city: data.city || 'Somewhere',
                        country_name: data.country || 'Earth',
                        country_code: data.country_code || 'US'
                    });
                }
            } catch (error) {
                console.error('Error fetching visitor location:', error);
                // Silent fallback to avoid complete disappearance if API is blocked
            } finally {
                setLoading(false);
            }
        };

        fetchLocation();
    }, []);

    // If it's still loading and we have no data, wait.
    // If loading is done and we STILL have no data (API failed/blocked), we'll use a fallback.
    const displayData = location || { city: 'Visitor', country_name: 'Our Planet', country_code: 'UN' };

    if (loading && !location) return null;

    return (
        <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="fixed bottom-4 right-4 z-[100] pointer-events-none"
        >
            <div className="relative group pointer-events-auto">
                {/* Subtle outer glow to ensure visibility on all backgrounds */}
                <div className="absolute -inset-1 bg-royal-400/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative flex items-center gap-2.5 bg-black/80 backdrop-blur-xl border border-white/20 px-3 py-1.5 rounded-xl transition-all duration-500 shadow-2xl">
                    <span className="text-[9px] text-yellow-400 uppercase tracking-widest font-bold font-josefin opacity-90">Hello !</span>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white font-josefin tracking-tight">
                            {displayData.city}
                        </span>
                        {displayData.country_code !== 'UN' && (
                            <img
                                src={`https://flagcdn.com/w20/${displayData.country_code.toLowerCase()}.png`}
                                alt={displayData.country_name}
                                className="w-3.5 h-auto opacity-100 rounded-sm shadow-sm"
                            />
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default VisitorLocation;
