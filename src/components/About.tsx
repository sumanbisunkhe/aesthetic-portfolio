import { motion } from 'framer-motion';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { BookOpenIcon, AcademicCapIcon, BriefcaseIcon } from '@heroicons/react/24/outline';

const About = () => {
  return (
    <section id="about" className="min-h-screen py-24 bg-gradient-to-b from-black to-black relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-12 w-24 h-24 bg-accent-900/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-1/4 -right-12 w-32 h-32 bg-royal-900/5 rounded-full blur-xl"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-accent-900 font-josefin text-sm tracking-wider uppercase mb-3 block">
            About Me
          </span>
          <h2 className="text-4xl md:text-5xl font-oldenburg font-bold text-white mb-6">
            Get to <span className="text-accent-900">Know Me</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-accent-900 to-accent-700 mx-auto mb-8 rounded-full"></div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Profile Photo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3 lg:sticky lg:top-24"
          >
            <div className="relative max-w-[280px] mx-auto">
              {/* Decorative elements */}
              <div className="absolute -top-3 -left-3 w-16 h-16 border-t-2 border-l-2 border-accent-900/50"></div>
              <div className="absolute -bottom-3 -right-3 w-16 h-16 border-b-2 border-r-2 border-accent-900/50"></div>
              
              {/* Image container */}
              <div className="relative overflow-hidden rounded-xl aspect-[3.6/5] bg-gradient-to-b from-accent-900/10 to-transparent p-1">
                <img
                  src="/src/assets/images/pp.webp"
                  alt="Suman Bisunkhe"
                  className="w-full h-full object-cover object-center rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 to-transparent opacity-50"></div>
              </div>

              {/* Quick Info Cards */}
              <div className="mt-6 space-y-3">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-primary-800/50 backdrop-blur-sm border border-primary-700/30 rounded-lg p-3 flex items-center gap-3 hover:border-accent-900/30 transition-colors duration-300"
                >
                  <BriefcaseIcon className="w-5 h-5 text-accent-900" />
                  <span className="text-sm font-josefin text-primary-200">Suman Bisunkhe - Java Developer</span>
                </motion.div>
                
              </div>
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-9 space-y-8"
          >
            {/* Bio */}
            <div className="space-y-6">
              <div className="relative">
                <div className="absolute -left-4 top-0 h-full w-0.5 bg-gradient-to-b from-accent-900 to-transparent"></div>
                <div className="space-y-6 text-primary-200 font-josefin leading-relaxed">
                  <p className="first-letter:text-3xl first-letter:font-oldenburg first-letter:text-accent-900 first-letter:mr-1">
                    Hi there! I'm Suman Bisunkhe, a passionate Java enthusiast currently pursuing a BSc.CSIT in my fifth semester. With a keen interest in building robust and scalable applications, I am driven by an unwavering desire to learn and innovate throughout my software development journey.
                  </p>
                  <p>
                    I started my programming journey with a fascination for how software could solve real-world problems. Currently, I'm pursuing my B.Sc. CSIT at Texas International College while gaining practical experience through my Java development internship.
                  </p>
                  <p>
                    I believe in writing clean, maintainable code that stands the test of time. My approach combines technical excellence with a deep understanding of business needs, resulting in solutions that deliver real value.
                  </p>
                </div>
              </div>
            </div>

            {/* Education */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-8 border-t border-primary-700/30"
            >
              <h3 className="text-2xl font-oldenburg text-white mb-6 flex items-center gap-3">
                <AcademicCapIcon className="w-6 h-6 text-accent-900" />
                Education
              </h3>
              
              <div className="bg-gradient-to-r from-primary-800/50 to-primary-800/30 backdrop-blur-sm rounded-2xl p-6 border border-primary-700/30 hover:border-accent-900/30 transition-all duration-300 group">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-2">
                    <h4 className="text-xl font-josefin text-white group-hover:text-accent-900 transition-colors duration-300">BSc.CSIT</h4>
                    <p className="text-primary-300 font-josefin flex items-center gap-2">
                      <BookOpenIcon className="w-4 h-4" />
                      Texas International College, Kathmandu
                    </p>
                  </div>
                  <span className="px-4 py-2 rounded-full bg-accent-900/10 text-accent-900 text-sm font-josefin border border-accent-900/20">
                    2022 - Present
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About; 