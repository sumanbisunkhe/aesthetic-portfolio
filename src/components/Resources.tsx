import { motion } from 'framer-motion';
import { BriefcaseIcon, AcademicCapIcon, ArrowDownTrayIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const experiences = [
  {
    type: 'work',
    title: 'Java Programmer Intern',
    org: 'Qpixel',
    period: '2025 - Present',
    description: 'Working on Spring Boot applications and gaining hands-on experience with real-world Java development. Contributing to backend services and API development.',
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

const Resources = () => {
  return (
    <section id="resources" className="min-h-screen py-24 bg-black relative overflow-hidden flex items-center justify-center">
      <div className="container mx-auto px-4 relative z-10 w-full space-y-24">
        {/* Header for the entire section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="text-accent-900 font-josefin text-sm tracking-wider uppercase mb-3 block">
            Resources
          </span>
          <h2 className="text-4xl md:text-5xl font-oldenburg font-bold text-white mb-6">
            My <span className="text-accent-900">Experience</span> & Resume
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-accent-900 to-accent-700 mx-auto mb-8 rounded-full"></div>
          <p className="text-primary-300 font-josefin text-lg">
            Explore my professional journey and download my resume.
          </p>
        </motion.div>

        {/* Experience Section (Timeline) */}
        <div id="resources-experience" className="py-12">
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
             className="text-center max-w-3xl mx-auto mb-16"
           >
             <h3 className="text-3xl md:text-4xl font-oldenburg font-bold text-white mb-6">
               Professional <span className="text-accent-900">Timeline</span>
             </h3>
             <div className="w-20 h-1 bg-gradient-to-r from-accent-900 to-accent-700 mx-auto rounded-full"></div>
           </motion.div>

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
                  
                  <div className={`w-full max-w-sm bg-gradient-to-br from-primary-800/70 to-primary-900/80 backdrop-blur-lg border border-primary-700/40 rounded-2xl shadow-xl p-8 transition-all duration-300 hover:border-accent-900 hover:shadow-2xl ${idx % 2 === 0 ? 'lg:ml-8' : 'lg:mr-8'}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-accent-900/10 shrink-0">
                        {exp.icon}
                      </span>
                      <span className="px-4 py-1 rounded-full text-xs font-josefin uppercase tracking-wider bg-accent-900/20 text-accent-900 border border-accent-900/30">
                        {exp.period}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 font-josefin">
                      {exp.title}
                    </h3>
                    <h4 className="text-primary-300 font-josefin mb-3">
                      {exp.org}
                    </h4>
                    <p className="text-primary-200 font-josefin text-sm leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Resume Section */}
        <div id="resources-resume" className="py-12">
          <motion.div
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
             className="text-center max-w-3xl mx-auto mb-16"
           >
             <h3 className="text-3xl md:text-4xl font-oldenburg font-bold text-white mb-6">
               My <span className="text-accent-900">Resume</span>
             </h3>
             <div className="w-20 h-1 bg-gradient-to-r from-accent-900 to-accent-700 mx-auto rounded-full"></div>
           </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl w-full mx-auto bg-gradient-to-br from-primary-800/70 to-primary-900/80 backdrop-blur-lg border border-primary-700/40 rounded-2xl shadow-2xl p-8 sm:p-10 md:p-12 flex flex-col lg:flex-row items-center gap-10 lg:gap-16"
          >
            {/* Resume Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="w-full max-w-[280px] md:max-w-[320px] lg:max-w-[360px] shrink-0 aspect-[8.5/11] rounded-xl overflow-hidden border-2 border-primary-700/40 shadow-lg bg-black/80 flex items-center justify-center relative group"
            >
              <iframe
                src="/src/assets/sumanbisunkhe-resume.pdf#toolbar=0&navpanes=0&scrollbar=0"
                title="Suman Bisunkhe Resume Preview"
                className="w-full h-full min-h-[400px] bg-black/90 rounded-xl border-none transition-all duration-300 group-hover:scale-[1.01]"
                loading="lazy"
              />
            </motion.div>

            {/* Resume Actions */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex-1 flex flex-col items-center lg:items-start gap-6 lg:gap-8 text-center lg:text-left"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-white font-oldenburg mb-3">View or Download Resume</h3>
              <p className="text-primary-300 font-josefin mb-4 leading-relaxed">
                Explore my qualifications, skills, and professional background. You can view the interactive preview below or download the PDF for a complete record.
              </p>
              <motion.a
                href="/src/assets/sumanbisunkhe-resume.pdf"
                download
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(250, 204, 21, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-accent-900 to-accent-700 text-primary-900 font-bold shadow-lg shadow-accent-900/30 hover:from-accent-800 hover:to-accent-700 transition-all duration-300 text-lg font-josefin uppercase tracking-wide"
              >
                <ArrowDownTrayIcon className="w-6 h-6" />
                Download Resume
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Resources; 