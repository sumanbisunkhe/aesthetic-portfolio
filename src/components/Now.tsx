import React from 'react';
import { motion } from 'framer-motion';
import { 
  BriefcaseIcon, 
  AcademicCapIcon, 
  ArrowRightIcon,
  ClockIcon,
  CodeBracketIcon,
  BookOpenIcon,
  ServerIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  hover: {
    y: -5,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

const Now: React.FC = () => {
  return (
    <section id="now" className="min-h-screen py-16 bg-black relative overflow-hidden flex items-center justify-center">
      <div className="container mx-auto px-4 relative z-10 w-full -mt-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block"
          >
            <span className="text-accent-900 font-josefin text-sm tracking-wider uppercase mb-3 block relative">
              <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-accent-900 animate-pulse" />
              Current Focus
              <span className="absolute -right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-accent-900 animate-pulse" />
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-3xl md:text-4xl font-oldenburg font-bold text-white mb-6 relative"
          >
            <span className="relative inline-block">
              What I'm <span className="text-accent-900 relative">
                Doing Now
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="absolute -bottom-2 left-0 h-0.5 bg-accent-900"
                />
              </span>
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-primary-300 font-josefin text-lg"
          >
            A snapshot of my current professional journey and academic pursuits.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Professional Work */}
            <motion.div
              variants={cardVariants}
              initial="initial"
              whileInView="animate"
              whileHover="hover"
              viewport={{ once: true }}
              className="group relative bg-gradient-to-br from-primary-800/40 to-primary-900/40 backdrop-blur-xl border border-primary-700/20 rounded-2xl p-8 shadow-xl hover:border-accent-900/30 transition-all duration-300 overflow-hidden"
            >
              {/* Card Background Effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent-900/0 via-accent-900/5 to-accent-900/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
              
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <motion.span
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent-900/10 shrink-0 relative overflow-hidden group-hover:bg-accent-900/20 transition-colors duration-300"
                  >
                    <BriefcaseIcon className="w-6 h-6 text-accent-900 relative z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-accent-900/0 via-accent-900/20 to-accent-900/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  </motion.span>
                  <div>
                    <h3 className="text-xl font-bold text-white font-josefin">Professional Work</h3>
                    <p className="text-primary-300 font-josefin text-sm">Java Programmer Intern at Qpixel</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-primary-300 font-josefin text-sm">
                    <ClockIcon className="w-4 h-4 text-accent-900" />
                    <span>Duration: 2025 - Present</span>
                  </div>

                  <div className="space-y-4">
                    <p className="text-primary-200 font-josefin text-sm leading-relaxed">
                      Currently working on Spring Boot projects at{' '}
                      <a
                        href="https://theqpixel.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent-900 hover:text-accent-700 transition-colors duration-200 inline-flex items-center gap-1 group/link"
                      >
                        Qpixel
                        <ArrowRightIcon className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform duration-200" />
                      </a>
                      , focusing on:
                    </p>
                    
                    <div className="grid gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-accent-900 font-josefin text-sm">
                          <ShieldCheckIcon className="w-5 h-5" />
                          <span>Security & Authentication</span>
                        </div>
                        <ul className="space-y-2 pl-7">
                          {[
                            'Implementing JWT-based authentication',
                            'Role-based access control systems',
                            'Secure password hashing and validation'
                          ].map((item, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.4, delay: index * 0.1 }}
                              className="flex items-center gap-2 text-primary-200 font-josefin text-sm group/item"
                            >
                              <span className="w-1 h-1 rounded-full bg-accent-900 group-hover/item:scale-150 transition-transform duration-300" />
                              {item}
                            </motion.li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-accent-900 font-josefin text-sm">
                          <ServerIcon className="w-5 h-5" />
                          <span>Backend Development</span>
                        </div>
                        <ul className="space-y-2 pl-7">
                          {[
                            'Building RESTful APIs with Spring Boot',
                            'Implementing robust exception handling',
                            'Database integration and optimization'
                          ].map((item, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.4, delay: index * 0.1 }}
                              className="flex items-center gap-2 text-primary-200 font-josefin text-sm group/item"
                            >
                              <span className="w-1 h-1 rounded-full bg-accent-900 group-hover/item:scale-150 transition-transform duration-300" />
                              {item}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Academic Journey */}
            <motion.div
              variants={cardVariants}
              initial="initial"
              whileInView="animate"
              whileHover="hover"
              viewport={{ once: true }}
              className="group relative bg-gradient-to-br from-primary-800/40 to-primary-900/40 backdrop-blur-xl border border-primary-700/20 rounded-2xl p-8 shadow-xl hover:border-accent-900/30 transition-all duration-300 overflow-hidden"
            >
              {/* Card Background Effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent-900/0 via-accent-900/5 to-accent-900/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
              
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <motion.span
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent-900/10 shrink-0 relative overflow-hidden group-hover:bg-accent-900/20 transition-colors duration-300"
                  >
                    <AcademicCapIcon className="w-6 h-6 text-accent-900 relative z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-accent-900/0 via-accent-900/20 to-accent-900/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  </motion.span>
                  <div>
                    <h3 className="text-xl font-bold text-white font-josefin">Academic Journey</h3>
                    <p className="text-primary-300 font-josefin text-sm">BSc.CSIT at Texas International College</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-primary-300 font-josefin text-sm">
                    <ClockIcon className="w-4 h-4 text-accent-900" />
                    <span>5th Semester (2023 - Present)</span>
                  </div>

                  <div className="space-y-4">
                    <p className="text-primary-200 font-josefin text-sm leading-relaxed">
                      Currently pursuing my Bachelor's degree with focus on:
                    </p>
                    
                    <div className="grid gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-accent-900 font-josefin text-sm">
                          <CodeBracketIcon className="w-5 h-5" />
                          <span>Software Development</span>
                        </div>
                        <ul className="space-y-2 pl-7">
                          {[
                            'Advanced programming concepts and patterns',
                            'Software architecture and design principles',
                            'Full-stack development methodologies'
                          ].map((item, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.4, delay: index * 0.1 }}
                              className="flex items-center gap-2 text-primary-200 font-josefin text-sm group/item"
                            >
                              <span className="w-1 h-1 rounded-full bg-accent-900 group-hover/item:scale-150 transition-transform duration-300" />
                              {item}
                            </motion.li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-accent-900 font-josefin text-sm">
                          <BookOpenIcon className="w-5 h-5" />
                          <span>Core Subjects</span>
                        </div>
                        <ul className="space-y-2 pl-7">
                          {[
                            'Database Management Systems',
                            'Computer Networks and Security',
                            'Operating Systems and Architecture'
                          ].map((item, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.4, delay: index * 0.1 }}
                              className="flex items-center gap-2 text-primary-200 font-josefin text-sm group/item"
                            >
                              <span className="w-1 h-1 rounded-full bg-accent-900 group-hover/item:scale-150 transition-transform duration-300" />
                              {item}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Now; 