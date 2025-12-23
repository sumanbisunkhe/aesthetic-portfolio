import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../lib/firebase';
import { doc, getDoc, updateDoc, increment, setDoc, onSnapshot } from 'firebase/firestore';

const VisitorCounter = () => {
    const [count, setCount] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const counterDoc = doc(db, 'analytics', 'visitor_count');
        const SESSION_KEY = 'portfolio_visitor_session';

        const updateCounter = async () => {
            try {
                // Check if this session has already been counted
                const hasVisited = sessionStorage.getItem(SESSION_KEY);

                if (!hasVisited) {
                    // This is a new session - increment the counter
                    const docSnap = await getDoc(counterDoc);

                    if (!docSnap.exists()) {
                        // Initialize if it doesn't exist
                        await setDoc(counterDoc, { count: 1 });
                    } else {
                        // Increment in Firestore
                        await updateDoc(counterDoc, {
                            count: increment(1)
                        });
                    }

                    // Mark this session as counted
                    sessionStorage.setItem(SESSION_KEY, 'true');
                }
                // If hasVisited is true, we skip the increment (just display current count)
            } catch (error) {
                console.error('Error updating visitor count:', error);
                // If it fails, we'll still try to read the current value
            }
        };

        // Listen for real-time updates to show most current number
        const unsubscribe = onSnapshot(counterDoc, (doc) => {
            if (doc.exists()) {
                setCount(doc.data().count);
            }
            setLoading(false);
        });

        updateCounter();

        return () => unsubscribe();
    }, []);

    if (loading && count === null) return null;

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="fixed bottom-4 left-4 z-[40] pointer-events-none"
        >
            <div className="relative group pointer-events-auto">
                <div className="relative flex items-center gap-2.5 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl transition-all duration-500 shadow-lg">
                    <div className="flex items-center gap-1.5">
                        <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </div>
                        <span className="text-xs font-bold text-white font-josefin tracking-tight">
                            {count?.toLocaleString() || '...'}
                        </span>
                    </div>
                    <span className="text-[9px] text-accent-900 uppercase tracking-widest font-bold font-josefin opacity-80">Visits</span>
                </div>
            </div>
        </motion.div>
    );
};

export default VisitorCounter;
