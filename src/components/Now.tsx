import React from 'react';
import { motion } from 'framer-motion';
import {
  BriefcaseIcon,
  AcademicCapIcon,
  ArrowUpRightIcon,
  CheckCircleIcon,
  CommandLineIcon,
  CpuChipIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: 'easeOut' }
};

const Now: React.FC = () => {
  return (
    <section id="now" className="relative min-h-screen pt-10 pb-20 lg:pb-32 bg-black overflow-hidden scroll-mt-2">


      <div className="relative z-10 container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          {...fadeUp}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-oldenburg font-bold text-white mb-6">
            Pioneering <span className="text-accent-900 italic">Robust</span> Backend Systems
          </h2>

          <p className="text-primary-300 font-josefin text-lg leading-relaxed">
            Crafting scalable, secure Java systems while pushing the limits of distributed architectures and advanced data structures.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(180px,auto)]">

          {/* Main Professional Card */}
          <motion.div
            {...fadeUp}
            className="md:col-span-8 relative group rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-2xl p-8 md:p-12 overflow-hidden hover:border-accent-900/20 transition-all duration-500"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <BriefcaseIcon className="w-32 h-32 text-accent-900" />
            </div>

            <div className="relative z-10 h-full flex flex-col">
              <div className="mb-auto">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent-900/10 mb-6">
                  <CommandLineIcon className="w-7 h-7 text-accent-900" />
                </div>
                <h3 className="text-3xl font-bold text-white font-oldenburg mb-2">
                  Junior Java Developer
                </h3>
                <p className="text-accent-900/80 font-josefin text-lg mb-8">
                  Qpixel · 2025 — Present
                </p>

                <div className="grid sm:grid-cols-2 gap-x-12 gap-y-6 mb-8">
                  <div className="space-y-4">
                    <h4 className="text-xs uppercase tracking-widest text-primary-400 font-bold">Key Focus Areas</h4>
                    <ul className="space-y-3">
                      {['Spring Boot 3 & Microservices', 'RESTful API Orchestration', 'PostgreSQL Optimization'].map((item) => (
                        <li key={item} className="flex items-center gap-3 text-primary-200 text-sm font-josefin">
                          <CheckCircleIcon className="w-5 h-5 text-accent-900" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xs uppercase tracking-widest text-primary-400 font-bold">Current Impact</h4>
                    <ul className="space-y-3">
                      {['E2E Security (JWT/OAuth2)', 'Clean Architecture (Layered)', 'TDD with JUnit/Mockito'].map((item) => (
                        <li key={item} className="flex items-center gap-3 text-primary-200 text-sm font-josefin">
                          <CheckCircleIcon className="w-5 h-5 text-accent-900" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <a
                href="#contact"
                className="inline-flex items-center text-accent-900 hover:text-white transition-colors gap-2 text-sm font-bold uppercase tracking-widest font-josefin self-start pt-6 border-t border-white/5 w-full"
              >
                Discuss my contribution
                <ArrowUpRightIcon className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Academic Journey Card */}
          <motion.div
            {...fadeUp}
            className="md:col-span-4 relative group rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-2xl p-8 hover:border-royal-400/20 transition-all duration-500"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-royal-900/20 mb-6">
              <AcademicCapIcon className="w-6 h-6 text-royal-400" />
            </div>
            <h3 className="text-2xl font-bold text-white font-oldenburg mb-2">
              BSc. CSIT
            </h3>
            <p className="text-primary-400 font-josefin text-sm mb-6 uppercase tracking-wider">
              7th Semester · Texas Intl. College
            </p>

            <div className="space-y-4 mb-8">
              <p className="text-primary-200 text-sm font-josefin leading-relaxed">
                Deepening mastery in distributed systems, network security, and advanced data structures, with a strong emphasis on analytical problem-solving, system-level thinking, and applying theoretical concepts to scalable, real-world software architectures.
              </p>
            </div>

            <div className="absolute bottom-8 left-8 right-8">
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '75%' }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-royal-400"
                />
              </div>
              <p className="mt-2 text-[10px] uppercase tracking-widest text-primary-500 font-bold">
                Program Completion: 75%
              </p>
            </div>
          </motion.div>

          {/* Core Tech Stack Section */}
          <motion.div
            {...fadeUp}
            className="md:col-span-4 relative rounded-3xl border border-white/5 bg-white/[0.02] p-8 hover:border-accent-900/20 transition-all group"
          >
            <div className="flex items-center gap-3 mb-6">
              <CpuChipIcon className="w-6 h-6 text-accent-900" />
              <h4 className="text-lg font-bold text-white font-oldenburg">Java Ecosystem</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Java 17+', 'Spring Boot', 'Spring Security', 'Hibernate', 'JPA', 'Maven', 'Lombok'].map((skill) => (
                <span key={skill} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary-300 text-xs font-josefin group-hover:border-accent-900/30 transition-colors">
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Modern Tooling */}
          <motion.div
            {...fadeUp}
            className="md:col-span-4 relative rounded-3xl border border-white/5 bg-white/[0.02] p-8 hover:border-accent-900/20 transition-all group"
          >
            <div className="flex items-center gap-3 mb-6">
              <SparklesIcon className="w-6 h-6 text-accent-900" />
              <h4 className="text-lg font-bold text-white font-oldenburg">Cloud & DevOps</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Docker', 'PostgreSQL', 'Redis', 'Git', 'CI/CD', 'AWS Fundamentals', 'Nexus'].map((skill) => (
                <span key={skill} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary-300 text-xs font-josefin group-hover:border-accent-900/30 transition-colors">
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Quick Stats/Philosophy */}
          <motion.div
            {...fadeUp}
            className="md:col-span-4 relative rounded-3xl border border-white/5 bg-accent-900/5 p-8 flex flex-col justify-center text-center group"
          >
            <p className="text-accent-900 font-oldenburg text-4xl font-bold mb-2 group-hover:scale-110 transition-transform">
              SOLID
            </p>
            <p className="text-white font-josefin text-xs uppercase tracking-[0.2em]">
              Principles I Live By
            </p>
            <div className="mt-6 text-primary-400 text-[10px] font-josefin uppercase tracking-widest leading-loose">
              Clean Code · DRY · KISS · YAGNI
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Now;
