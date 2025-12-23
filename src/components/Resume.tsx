import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ArrowDownTrayIcon, CheckBadgeIcon, DocumentTextIcon, SparklesIcon } from '@heroicons/react/24/outline';

const Resume = () => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useTransform(y, [-100, 100], [10, -10]);
    const rotateY = useTransform(x, [-100, 100], [-10, 10]);

    function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
        const rect = event.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set(event.clientX - centerX);
        y.set(event.clientY - centerY);
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }

    const highlights = [
        { title: 'ATS Optimized', desc: 'Crafted to pass automated screening.', icon: <CheckBadgeIcon className="w-5 h-5" /> },
        { title: 'Technical Focus', desc: 'Detailed breakdown of Java & Web stacks.', icon: <SparklesIcon className="w-5 h-5" /> },
        { title: 'Clean Architecture', desc: 'Reflecting my approach to code.', icon: <DocumentTextIcon className="w-5 h-5" /> },
    ];

    const handleDownload = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/sumanbisunkhe-resume.pdf');
            if (!response.ok) throw new Error('Failed to download file');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = "sumanbisunkhe-resume.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
            window.open('/sumanbisunkhe-resume.pdf', '_blank');
        }
    };

    return (
        <section id="resources-resume" className="relative min-h-screen pt-10 pb-20 lg:pb-32 bg-black overflow-hidden scroll-mt-0">

            <div className="container mx-auto px-4 relative z-10 w-full">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-oldenburg font-bold text-white mb-6">
                        Professional <span className="text-accent-900">Resume</span>
                    </h2>
                    <p className="text-primary-300 font-josefin text-lg">
                        A comprehensive overview of my technical expertise, professional experience, and academics.
                    </p>
                </motion.div>

                <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
                    {/* Left: Interactive Preview */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative group perspective-1000"
                        onMouseMove={handleMouse}
                        onMouseLeave={handleMouseLeave}
                        style={{ perspective: 1000 }}
                    >
                        <motion.div
                            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                            className="relative w-full max-w-[320px] md:max-w-[400px] aspect-[9/11] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-primary-900/50 backdrop-blur-sm"
                        >
                            <img
                                src="/images/resume-preview.png"
                                alt="Resume Preview"
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                            />

                            {/* Scanner Effect */}
                            <motion.div
                                className="absolute left-0 right-0 h-[2px] bg-accent-900 shadow-[0_0_15px_#ffd700] z-20 pointer-events-none"
                                animate={{ top: ["0%", "100%", "0%"] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            />

                            {/* Overlay info */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                                <span className="text-white font-oldenburg text-sm mb-1 uppercase tracking-tighter shadow-black">Interactive Preview</span>
                                <p className="text-primary-300 text-xs font-josefin">Hover to inspect the structure</p>
                            </div>
                        </motion.div>

                        {/* Floating elements behind */}
                        <div className="absolute -inset-4 bg-accent-900/5 rounded-3xl blur-2xl -z-10 group-hover:bg-accent-900/10 transition-colors duration-500" />
                    </motion.div>

                    {/* Right: Info & CTA */}
                    <div className="flex-1 max-w-lg text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6"
                        >
                            <div className="space-y-3">
                                <h3 className="text-xl md:text-2xl font-oldenburg text-white font-bold">Document Overview</h3>
                                <p className="text-primary-300 font-josefin text-sm leading-relaxed">
                                    My resume is designed to be clear and concise, highlighting my progression from a Java enthusiast to a professional developer. It includes detailed sections on:
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                                {highlights.map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        className="flex items-start gap-3 p-3.5 rounded-xl bg-primary-900/40 border border-white/5 hover:border-accent-900/20 transition-colors group"
                                        whileHover={{ x: 6 }}
                                    >
                                        <div className="p-2 rounded-lg bg-accent-900/10 text-accent-900 group-hover:bg-accent-900 group-hover:text-black transition-colors shrink-0">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-xs mb-0.5 font-oldenburg">{item.title}</h4>
                                            <p className="text-primary-400 text-[10px] font-josefin">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="pt-4">
                                <motion.button
                                    onClick={handleDownload}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group relative inline-flex items-center gap-3 px-7 py-3.5 bg-accent-900 text-black font-bold rounded-full overflow-hidden transition-all hover:pr-10"
                                >
                                    <span className="relative z-10 font-oldenburg text-sm uppercase tracking-wider">Download PDF</span>
                                    <ArrowDownTrayIcon className="w-4 h-4 relative z-10 group-hover:translate-x-2 transition-transform h-min" />

                                    {/* Button Shine effect */}
                                    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                                </motion.button>
                                <p className="mt-2 text-[9px] lg:px-6 text-primary-500 uppercase tracking-widest font-mono">
                                    Latest version: December 2025
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

        </section>
    );
};

export default Resume;

