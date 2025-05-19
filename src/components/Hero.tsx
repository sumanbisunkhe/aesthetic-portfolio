import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import javaLogoAnimation from '../assets/java-logo.webm';

interface StatItem {
  value: string;
  label: string;
  description?: string;
}

const stats: StatItem[] = [
  { 
    value: '10+', 
    label: 'Projects',
    description: 'Successfully Completed'
  },
  { 
    value: '200+', 
    label: 'Contributions',
    description: 'On GitHub'
  },
  { 
    value: '13+', 
    label: 'Skills',
    description: 'Technical Expertise'
  },
  { 
    value: '1+', 
    label: 'Year',
    description: 'Professional Experience'
  }
];

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, []);

  return (
    <section 
      id="home"
      className="relative min-h-screen bg-primary-900 overflow-hidden"
      aria-label="Introduction"
    >
      {/* Background gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-primary-900 via-primary-900/95 to-primary-900" 
        aria-hidden="true"
      />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between">
        {/* Top section with name and title */}
        <div className="flex-1 flex items-center pt-20 lg:pt-0">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Text content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="lg:col-span-7 text-center lg:text-left space-y-8"
              >
                <div className="space-y-4">
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-block text-lg text-primary-300 font-josefin"
                  >
                    Hi, I'm
                  </motion.span>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl sm:text-4xl lg:text-5xl font-oldenburg"
                  >
                    <span className="bg-gradient-to-r from-accent-900 via-accent-800 to-accent-700 bg-clip-text text-transparent">
                      Suman Bisunkhe
                    </span>
                  </motion.h1>
                  
                  <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl sm:text-2xl lg:text-3xl text-primary-200 font-josefin font-light"
                  >
                    Java Developer
                  </motion.h2>
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-base sm:text-lg text-primary-300 max-w-2xl lg:max-w-3xl font-josefin"
                >
                  Passionate Java enthusiast crafting robust and scalable solutions. Transforming complex problems into elegant, efficient code.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap gap-6 justify-center lg:justify-start pt-4"
                >
                  <motion.a
                    href="#work"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-accent-900 to-accent-800 text-primary-900 font-medium rounded-full shadow-lg shadow-accent-900/10 hover:shadow-accent-900/20 transition-all duration-200 text-base font-josefin"
                    aria-label="View my work portfolio"
                  >
                    View My Work
                  </motion.a>
                  <motion.a
                    href="#contact"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-primary-800/50 text-primary-50 font-medium rounded-full hover:bg-primary-700/50 transition-colors duration-200 backdrop-blur-sm border border-primary-700/50 text-base font-josefin"
                    aria-label="Contact me"
                  >
                    Contact Me
                  </motion.a>
                </motion.div>
              </motion.div>

              {/* Java Logo Animation */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="lg:col-span-5 flex justify-center items-center"
              >
                <div className="w-full max-w-xs mx-auto">
                  <div className="relative aspect-square w-[80%] mx-auto">
                    <video
                      ref={videoRef}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-contain"
                      aria-label="Animated Java logo"
                    >
                      <source src={javaLogoAnimation} type="video/webm" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom section with stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="w-full py-12 sm:py-16 bg-primary-800/20 backdrop-blur-sm border-t border-primary-700/20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-royal-900/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                  <div className="relative bg-primary-800/50 backdrop-blur-sm border border-primary-700/50 rounded-2xl p-6 h-full hover:border-accent-900/50 transition-colors duration-300">
                    <div className="text-center space-y-2">
                      <h3 className="text-3xl sm:text-4xl bg-gradient-to-r from-accent-900 to-accent-700 bg-clip-text text-transparent font-oldenburg">
                        {stat.value}
                      </h3>
                      <div className="space-y-1">
                        <p className="uppercase tracking-widest text-xs sm:text-sm text-primary-200 font-josefin">{stat.label}</p>
                        {stat.description && (
                          <p className="text-xs text-primary-400 font-josefin font-light">
                            {stat.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
 