import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../lib/firebase';
import { doc, increment, onSnapshot, runTransaction } from 'firebase/firestore';

const VisitorCounter = () => {
    const [count, setCount] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const counterDoc = doc(db, 'analytics', 'visitor_count');
        const UNIQUE_VISITOR_KEY = 'portfolio_unique_id';
        const SESSION_CHECK_KEY = 'portfolio_processed_session';

        const trackVisitor = async () => {
            // Guard: don't run if we've already processed this session in this tab
            if (sessionStorage.getItem(SESSION_CHECK_KEY)) return;

            try {
                let uniqueId = localStorage.getItem(UNIQUE_VISITOR_KEY);

                if (!uniqueId) {
                    try {
                        const response = await fetch('https://api.ipify.org?format=json');
                        const data = await response.json();
                        uniqueId = data.ip;
                    } catch (e) {
                        uniqueId = 'visitor_' + Math.random().toString(36).substring(2, 15);
                    }
                    if (uniqueId) localStorage.setItem(UNIQUE_VISITOR_KEY, uniqueId);
                }

                if (!uniqueId) return;

                // Mark as processed BEFORE starting the transaction to prevent double-firing in same tab
                sessionStorage.setItem(SESSION_CHECK_KEY, 'true');

                const visitorRecordRef = doc(db, 'unique_visitors', uniqueId);

                await runTransaction(db, async (transaction) => {
                    const visitorSnap = await transaction.get(visitorRecordRef);
                    const globalSnap = await transaction.get(counterDoc);

                    // Update or set visitor record
                    if (!visitorSnap.exists()) {
                        transaction.set(visitorRecordRef, {
                            firstVisit: new Date().toISOString(),
                            lastVisit: new Date().toISOString(),
                            sessions: 1
                        });
                    } else {
                        transaction.update(visitorRecordRef, {
                            lastVisit: new Date().toISOString(),
                            sessions: increment(1)
                        });
                    }

                    // ALWAYS increment global count for a new session
                    if (!globalSnap.exists()) {
                        transaction.set(counterDoc, { count: 1 });
                    } else {
                        transaction.update(counterDoc, { count: increment(1) });
                    }
                });
            } catch (error) {
                // If it failed, allow a retry on next refresh
                sessionStorage.removeItem(SESSION_CHECK_KEY);
                console.error('Visitor Counter Error:', error);
            }
        };

        // Listen for real-time updates to show most current number
        const unsubscribe = onSnapshot(counterDoc, (doc) => {
            if (doc.exists()) {
                setCount(doc.data().count);
            }
            setLoading(false);
        });

        trackVisitor();

        return () => unsubscribe();
    }, []);

    if (loading && count === null) return null;

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="fixed bottom-4 left-4 z-[150] pointer-events-none visitor-counter"
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
                    <span className="text-[9px] text-accent-900 uppercase tracking-widest font-bold font-josefin opacity-80">Views</span>
                </div>
            </div>
        </motion.div>
    );
};

export default VisitorCounter;
