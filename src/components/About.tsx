import { motion } from 'framer-motion';
import {
  MapPinIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline';
import {
  SiSpringboot,
  SiPostgresql,
  SiSpring,
  SiMysql,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiNodedotjs,
  SiReact,
  SiDocker,
  SiGit
} from 'react-icons/si';
import { FaJava, FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';

const About = () => {
  const skills = [
    { icon: <FaJava className="w-5 h-5" />, name: 'Java' },
    { icon: <SiSpringboot className="w-5 h-5" />, name: 'Spring Boot' },
    { icon: <SiSpring className="w-5 h-5" />, name: 'Security' },
    { icon: <SiPostgresql className="w-5 h-5" />, name: 'PostgreSQL' },
    { icon: <SiMysql className="w-5 h-5" />, name: 'MySQL' },
    { icon: <SiReact className="w-5 h-5" />, name: 'React' },
    { icon: <SiNextdotjs className="w-5 h-5" />, name: 'Next.js' },
    { icon: <SiTypescript className="w-5 h-5" />, name: 'TypeScript' },
    { icon: <SiTailwindcss className="w-5 h-5" />, name: 'Tailwind' },
    { icon: <SiNodedotjs className="w-5 h-5" />, name: 'Node.js' },
    { icon: <SiDocker className="w-5 h-5" />, name: 'Docker' },
    { icon: <SiGit className="w-5 h-5" />, name: 'Git' },
  ];

  return (
    <section id="about" className="py-12 bg-black relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-accent-900/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-royal-900/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-oldenburg font-bold text-white mb-3">
            About <span className="text-accent-900">Me</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT COLUMN: Profile (Span 3) */}
          <div className="lg:col-span-3 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-primary-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-3 h-full flex flex-col"
            >
              <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden mb-4">
                <img
                  src="/images/pp.webp"
                  alt="Suman Bisunkhe"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              <div className="px-2 pb-2 text-center mt-auto">
                <h3 className="text-xl font-oldenburg text-white mb-1">Suman Bisunkhe</h3>
                <p className="text-accent-900/90 text-sm font-josefin tracking-wide uppercase mb-4">Java Developer</p>

                <div className="flex justify-center gap-3">
                  <a href="https://github.com/sumanbisunkhe" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white hover:text-accent-900 transition-colors">
                    <FaGithub className="w-5 h-5" />
                  </a>
                  <a href="https://www.linkedin.com/in/suman-bisunkhe-3a72032a2/" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white hover:text-accent-900 transition-colors">
                    <FaLinkedin className="w-5 h-5" />
                  </a>
                  <a href="https://www.instagram.com/suman_bisunkhe" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white hover:text-accent-900 transition-colors" title="Instagram">
                    <FaInstagram className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* CENTER COLUMN: Bio & Tech (Span 5) */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-primary-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 lg:p-8"
            >
              <h3 className="text-2xl font-oldenburg text-white mb-4">
                Scalable <span className="text-accent-900">Solutions</span>
              </h3>
              <div className="space-y-3 text-primary-200 font-josefin leading-relaxed text-[15px]">
                <p>
                  I'm a passionate Java enthusiast pursuing my BSc.CSIT. My journey is driven by curiosity and a desire to build robust systems.
                </p>
                <p>
                  Specializing in the <span className="text-accent-900">Java Ecosystem</span>, I focus on creating secure, high-performance backend architectures. I currently bridge the gap between complex backends and modern frontends like Next.js.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-primary-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 overflow-hidden relative"
            >
              <h4 className="text-white font-oldenburg text-lg mb-6 flex items-center gap-2 relative z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-900" />
                Technical Arsenal
              </h4>

              {/* Gradient Masks */}
              <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black/80 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black/80 to-transparent z-10 pointer-events-none" />

              <div className="flex overflow-hidden -mx-6">
                <motion.div
                  className="flex gap-4 px-6"
                  animate={{ x: "-50%" }}
                  transition={{
                    ease: "linear",
                    duration: 30,
                    repeat: Infinity,
                  }}
                >
                  {[...skills, ...skills].map((skill, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 border border-white/5 hover:border-accent-900/30 hover:bg-white/10 transition-colors group min-w-[140px]"
                    >
                      <div className="text-primary-400 group-hover:text-accent-900 transition-colors">
                        {skill.icon}
                      </div>
                      <span className="text-xs font-josefin text-primary-300 font-medium whitespace-nowrap">{skill.name}</span>
                    </div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Journey & Stats (Span 4) */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-primary-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 lg:p-8 h-full"
            >
              <h4 className="text-white font-oldenburg text-lg mb-6 flex items-center gap-2">
                <BriefcaseIcon className="w-5 h-5 text-accent-900" />
                My Journey
              </h4>

              <div className="space-y-8 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/10">
                <div className="relative pl-8">
                  <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-accent-900 bg-black" />
                  <span className="text-xs font-mono text-accent-900 block mb-1">Present</span>
                  <h5 className="text-white font-bold text-sm">Bachelor's in CSIT</h5>
                  <p className="text-primary-400 text-xs mt-1">Texas International College</p>
                  <p className="text-primary-500 text-[10px] mt-0.5">6th Semester</p>
                </div>

                <div className="relative pl-8">
                  <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-primary-600 bg-black" />
                  <span className="text-xs font-mono text-primary-400 block mb-1">2022</span>
                  <h5 className="text-white font-bold text-sm">Java Development</h5>
                  <p className="text-primary-400 text-xs mt-1">Started Journey</p>
                </div>

                <div className="pt-4 border-t border-white/10 mt-6">
                  <div className="flex items-center gap-3 text-primary-300">
                    <div className="p-2 rounded-lg bg-white/5 text-accent-900">
                      <MapPinIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-primary-500 uppercase tracking-widest">Based In</p>
                      <p className="text-white text-sm font-medium">Kathmandu, Nepal</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;