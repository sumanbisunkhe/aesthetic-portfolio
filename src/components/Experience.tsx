import { motion } from 'framer-motion';
import { BriefcaseIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

const experiences = [
    {
        type: 'work',
        title: 'Java Developer',
        org: 'Qpixel',
        period: 'July 2025  - present',
        description: 'Developing and maintaining production-ready Java applications, contributing to backend services, and API development.',
        icon: <BriefcaseIcon className="w-6 h-6 text-accent-900" />,
    },
    {
        type: 'work',
        title: 'Java Developer Intern',
        org: 'Qpixel',
        period: 'April 2025  - June 2025',
        description: 'Worked on Spring Boot applications and gaining hands-on experience with real-world Java development. Contributed to backend services and API development.',
        icon: <BriefcaseIcon className="w-6 h-6 text-accent-900" />,
    },
    {
        type: 'education',
        title: 'B.Sc. CSIT Student',
        org: 'Texas International College',
        period: '2023 - Present',
        description: 'Pursuing a Bachelor\'s degree in Computer Science and Information Technology, focusing on software development, algorithms, and data structures.',
        icon: <AcademicCapIcon className="w-6 h-6 text-accent-900" />,
    },
    {
        type: 'education',
        title: '+2 Student',
        org: "St. Xavier's College",
        period: '2019 - 2022',
        description: 'Completed higher secondary education with a focus on science and mathematics, building a strong foundation for further studies in computer science.',
        icon: <AcademicCapIcon className="w-6 h-6 text-accent-900" />,
    },
];

const Experience = () => {
    return (
        <section id="resources-experience" className="min-h-screen py-12 bg-black relative overflow-hidden flex items-center justify-center">
            <div className="container mx-auto px-4 relative z-10 w-full">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    {/* <span className="text-accent-900 font-josefin text-sm tracking-wider uppercase mb-3 block">
                        Experience
                    </span> */}
                    <h2 className="text-3xl md:text-4xl font-oldenburg font-bold text-white mb-6">
                        Professional <span className="text-accent-900">Timeline</span>
                    </h2>
                    {/* <div className="w-24 h-1 bg-gradient-to-r from-accent-900 to-accent-700 mx-auto mb-8 rounded-full"></div> */}
                    <p className="text-primary-300 font-josefin text-lg">
                        My journey through work and education.
                    </p>
                </motion.div>

                {/* Timeline */}
                <div className="relative max-w-4xl mx-auto">
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-accent-900/50 to-primary-700/30 z-0 rounded-full lg:block hidden" />
                    <div className="space-y-16 relative z-10">
                        {experiences.map((exp, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: idx % 2 === 0 ? 50 : -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.7, delay: idx * 0.15 }}
                                className={`relative flex items-center ${idx % 2 === 0 ? 'lg:justify-end' : 'lg:justify-start'} justify-center`}
                            >
                                {/* Timeline Dot (Desktop Only) */}
                                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary-900 border-4 border-accent-900 z-20 shadow-lg group-hover:scale-125 transition-transform duration-300 hidden lg:block" />

                                <motion.div
                                    whileHover={{ scale: 1.05, translateY: -5 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                    className={`w-full max-w-sm bg-gradient-to-br from-primary-800/70 to-primary-900/80 backdrop-blur-lg border border-primary-700/40 rounded-2xl shadow-xl p-8 transition-all duration-300 hover:border-accent-900/50 hover:shadow-accent-900/10 hover:shadow-2xl cursor-default group ${idx % 2 === 0 ? 'lg:ml-8' : 'lg:mr-8'}`}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-accent-900/10 shrink-0 group-hover:scale-110 transition-transform duration-300">
                                            {exp.icon}
                                        </span>
                                        <span className="px-4 py-1 rounded-full text-xs font-josefin uppercase tracking-wider bg-accent-900/20 text-accent-900 border border-accent-900/30 group-hover:bg-accent-900/30 transition-colors duration-300">
                                            {exp.period}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2 font-josefin group-hover:text-accent-900 transition-colors duration-300">
                                        {exp.title}
                                    </h3>
                                    <h4 className="text-primary-300 font-josefin mb-3">
                                        {exp.org}
                                    </h4>
                                    <p className="text-primary-200 font-josefin text-sm leading-relaxed">
                                        {exp.description}
                                    </p>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Experience;
