import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaJava, FaHtml5, FaJs } from 'react-icons/fa';
import {
  SiSpringboot,
  SiPostgresql,
  SiSpring,
  SiMysql,
  SiApachejmeter,
  SiJsonwebtokens,
  SiThymeleaf,
  SiSocketdotio,
  SiHibernate,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiFramer,
} from 'react-icons/si';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface Project {
  title: string;
  description: string;
  image?: string;
  technologies: {
    name: string;
    icon: React.ReactNode;
  }[];
  githubUrl: string;
  frontendUrl?: string;
  backendUrl?: string;
  features?: string[];
  category: 'backend' | 'frontend' | 'fullstack';
  demoUrl?: string;
  featured?: boolean;
}

const projects: Project[] = [
  {
    title: "LinkStream: URL Shortener",
    description: "A premium tool that converts long URLs into manageable links with real-time tracking, flow analytics, and a comprehensive user dashboard.",
    image: "/images/projects/url-shortener.png",
    featured: true,
    technologies: [
      { name: "Spring Boot", icon: <SiSpringboot className="w-4 h-4" /> },
      { name: "Spring Security", icon: <SiSpring className="w-4 h-4" /> },
      { name: "JWT", icon: <SiJsonwebtokens className="w-4 h-4" /> },
      { name: "MySQL", icon: <SiMysql className="w-4 h-4" /> },
      { name: "Thymeleaf", icon: <SiThymeleaf className="w-4 h-4" /> },
    ],
    githubUrl: "https://github.com/sumanbisunkhe/url-shortner-thymeleaf",
    category: 'backend',
    features: [
      "Custom short URLs",
      "Click analytics and tracking",
      "QR code generation",
      "Secure user dashboard",
      "Link expiration management"
    ]
  },
  {
    title: "RentEase: Room Finder",
    description: "A sophisticated platform connecting landlords and tenants with an interactive map-based search experience.",
    image: "/images/projects/room-finder.png",
    featured: true,
    technologies: [
      { name: "Spring Boot", icon: <SiSpringboot className="w-4 h-4" /> },
      { name: "PostgreSQL", icon: <SiPostgresql className="w-4 h-4" /> },
      { name: "Vite + React", icon: <FaJs className="w-4 h-4" /> },
      { name: "Tailwind CSS", icon: <SiTailwindcss className="w-4 h-4" /> },
    ],
    githubUrl: "https://github.com/sumanbisunkhe/room-finder-system-backend",
    frontendUrl: "https://github.com/sumanbisunkhe/room-finder-system-frontend",
    backendUrl: "https://github.com/sumanbisunkhe/room-finder-system-backend",
    category: 'fullstack',
    features: [
      "Interactive map search",
      "Advanced filtering system",
      "Real-time messaging",
      "Property management",
      "User verification"
    ]
  },
  {
    title: "Kurakani: Chat App",
    description: "A modern WebSocket-based messaging platform featuring real-time communication and secure end-to-end encryption.",
    image: "/images/projects/chat-app.png",
    featured: true,
    technologies: [
      { name: "Spring Boot", icon: <SiSpringboot className="w-4 h-4" /> },
      { name: "WebSocket", icon: <SiSocketdotio className="w-4 h-4" /> },
      { name: "JWT", icon: <SiJsonwebtokens className="w-4 h-4" /> },
      { name: "PostgreSQL", icon: <SiPostgresql className="w-4 h-4" /> },
    ],
    githubUrl: "https://github.com/sumanbisunkhe/Kurakani",
    category: 'backend',
    features: [
      "Real-time instant messaging",
      "Connection request system",
      "Online presence indicators",
      "Encrypted communications"
    ]
  },
  {
    title: "FinTrack: Expense Manager",
    description: "A minimalist dashboard for meticulous financial tracking, providing deep insights into spending habits.",
    image: "/images/projects/expense-tracker.png",
    featured: true,
    technologies: [
      { name: "Spring Boot", icon: <SiSpringboot className="w-4 h-4" /> },
      { name: "Spring Security", icon: <SiSpring className="w-4 h-4" /> },
      { name: "PostgreSQL", icon: <SiPostgresql className="w-4 h-4" /> },
      { name: "Maven", icon: <SiApachejmeter className="w-4 h-4" /> },
    ],
    githubUrl: "https://github.com/sumanbisunkhe/Expense-Tracker",
    category: 'backend',
    features: [
      "Categorized expense tracking",
      "Monthly spending visualization",
      "Budget goal setting",
      "Exportable financial reports"
    ]
  },
  {
    title: "Interactive Portfolio",
    description: "A modern, responsive portfolio built with Next.js 13, featuring sleek interactions and dark mode.",
    image: "/images/projects/portfolio.png",
    featured: true,
    technologies: [
      { name: "Next.js", icon: <SiNextdotjs className="w-4 h-4" /> },
      { name: "TypeScript", icon: <SiTypescript className="w-4 h-4" /> },
      { name: "Tailwind CSS", icon: <SiTailwindcss className="w-4 h-4" /> },
      { name: "Framer Motion", icon: <SiFramer className="w-4 h-4" /> },
    ],
    githubUrl: "https://github.com/sumanbisunkhe/professional-portfolio",
    category: 'frontend'
  },
  {
    title: "Inventory Control",
    description: "Intelligent real-time tracking of products and suppliers for enterprise-level inventory management.",
    image: "/images/projects/inventory.png",
    featured: true,
    technologies: [
      { name: "Spring Boot", icon: <SiSpringboot className="w-4 h-4" /> },
      { name: "Spring Security", icon: <SiSpring className="w-4 h-4" /> },
      { name: "JWT", icon: <SiJsonwebtokens className="w-4 h-4" /> },
      { name: "JPA", icon: <SiHibernate className="w-4 h-4" /> },
    ],
    githubUrl: "https://github.com/sumanbisunkhe/inventory-control-system",
    category: 'backend'
  },
  {
    title: "Content Management",
    description: "A robust, secure system for enterprise content creation, editing, and cross-platform management.",
    image: "/images/projects/cms.png",
    featured: true,
    technologies: [
      { name: "Java 17", icon: <FaJava className="w-4 h-4" /> },
      { name: "Spring Boot", icon: <SiSpringboot className="w-4 h-4" /> },
      { name: "PostgreSQL", icon: <SiPostgresql className="w-4 h-4" /> },
    ],
    githubUrl: "https://github.com/sumanbisunkhe/content-mgmt-system",
    category: 'backend'
  },
  {
    title: "Library Management",
    description: "Comprehensive solution for digital library resources, borrowing transactions, and user fines.",
    image: "/images/projects/library.png",
    featured: true,
    technologies: [
      { name: "Spring Boot", icon: <SiSpringboot className="w-4 h-4" /> },
      { name: "PostgreSQL", icon: <SiPostgresql className="w-4 h-4" /> },
      { name: "RESTful API", icon: <SiNextdotjs className="w-4 h-4" /> },
    ],
    githubUrl: "https://github.com/sumanbisunkhe/library-management-system",
    category: 'backend'
  },
  {
    title: "Pulse Auth API",
    description: "High-security authentication service providing OAuth2 integration, session management, and user data protection.",
    technologies: [
      { name: "Spring Security", icon: <SiSpring className="w-4 h-4" /> },
      { name: "Spring Boot", icon: <SiSpringboot className="w-4 h-4" /> },
      { name: "PostgreSQL", icon: <SiPostgresql className="w-4 h-4" /> },
      { name: "Thymeleaf", icon: <SiThymeleaf className="w-4 h-4" /> },
    ],
    githubUrl: "https://github.com/sumanbisunkhe/pulse-sercure-api",
    category: 'backend'
  },
  {
    title: "BlogEcho",
    description: "A backend web application designed for managing blogs and user accounts, emphasizing robust authentication.",
    technologies: [
      { name: "Spring Boot", icon: <SiSpringboot className="w-4 h-4" /> },
      { name: "Spring Security", icon: <SiSpring className="w-4 h-4" /> },
      { name: "PostgreSQL", icon: <SiPostgresql className="w-4 h-4" /> },
      { name: "JWT", icon: <SiJsonwebtokens className="w-4 h-4" /> },
    ],
    githubUrl: "https://github.com/sumanbisunkhe/BlogEcho",
    category: 'backend'
  },
  {
    title: "User Registration",
    description: "A web application designed for managing user accounts with functionalities for encryption and history.",
    technologies: [
      { name: "Spring Boot", icon: <SiSpringboot className="w-4 h-4" /> },
      { name: "Spring Security", icon: <SiSpring className="w-4 h-4" /> },
      { name: "Thymeleaf", icon: <SiThymeleaf className="w-4 h-4" /> },
    ],
    githubUrl: "https://github.com/sumanbisunkhe/User-Registration-System",
    category: 'backend'
  }
];

const Work = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject]);

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'backend', name: 'Backend' },
    { id: 'frontend', name: 'Frontend' },
    { id: 'fullstack', name: 'Full Stack' }
  ];

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter(project => project.category === selectedCategory);

  const featuredProjects = filteredProjects.filter(p => p.featured);
  const otherProjects = filteredProjects.filter(p => !p.featured);

  return (
    <section id="work" className="relative min-h-screen pt-10 pb-20 lg:pb-32 bg-black overflow-hidden scroll-mt-2">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-10 w-72 h-72 bg-accent-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-10 w-96 h-96 bg-accent-900/5 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-12 lg:mb-20 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-oldenburg font-bold text-white mb-4 sm:mb-6 leading-tight">
              Selected <span className="text-accent-900">Works</span>
            </h2>
            <p className="text-primary-300 font-josefin text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              Merging robust backend architecture with intuitive frontend experiences.
              Exploring the intersection of Java enterprise and modern web technologies.
            </p>
          </motion.div>

          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 sm:gap-3"
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`relative px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-josefin transition-all duration-300 ${selectedCategory === category.id
                  ? 'text-primary-900'
                  : 'text-primary-300 hover:text-white border border-primary-800'
                  }`}
              >
                {selectedCategory === category.id && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 bg-accent-900 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{category.name}</span>
              </button>
            ))}
          </motion.div>
        </div>

        {/* Featured Projects Section */}
        {featuredProjects.length > 0 && (
          <div className="mb-16 lg:mb-24">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-xl sm:text-2xl font-oldenburg text-white mb-6 sm:mb-10 flex items-center gap-4"
            >
              <span className="w-8 h-[2px] bg-accent-900"></span>
              Featured Projects
            </motion.h3>

            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              <AnimatePresence mode="popLayout">
                {featuredProjects.map((project, index) => (
                  <motion.div
                    key={project.title}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group cursor-pointer"
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-primary-900/40 border border-primary-800/50 group-hover:border-accent-900/30 transition-all duration-500 mb-4 sm:mb-6">
                      {project.image ? (
                        <motion.img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-900">
                          <FaJava className="text-4xl text-gray-700" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="px-5 py-2 sm:px-6 sm:py-3 bg-accent-900 text-primary-900 text-sm sm:text-base font-bold rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          View Case Study
                        </span>
                      </div>
                    </div>

                    <div className="px-2">
                      <div className="flex items-center gap-3 mb-2 sm:mb-3">
                        <span className="text-accent-900 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                          {project.category}
                        </span>
                        <div className="h-px flex-1 bg-primary-800/50"></div>
                      </div>
                      <h4 className="text-lg sm:text-xl font-oldenburg font-bold text-white mb-2 group-hover:text-accent-900 transition-colors">
                        {project.title}
                      </h4>
                      <p className="text-primary-400 font-josefin text-xs sm:text-sm leading-relaxed line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Other Projects Section */}
        {otherProjects.length > 0 && (
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-xl sm:text-2xl font-oldenburg text-white mb-6 sm:mb-10 flex items-center gap-4"
            >
              <span className="w-8 h-[2px] bg-accent-900"></span>
              Other Noteworthy Projects
            </motion.h3>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <AnimatePresence mode="popLayout">
                {otherProjects.map((project, index) => (
                  <motion.div
                    key={project.title}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="p-5 sm:p-6 rounded-2xl bg-primary-800/20 border border-primary-800/50 hover:bg-primary-800/40 hover:border-accent-900/30 transition-all duration-300 cursor-pointer group"
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="flex justify-between items-start mb-4 sm:mb-6">
                      <div className="p-2.5 sm:p-3 rounded-lg bg-primary-800/50 text-accent-900 group-hover:bg-accent-900 group-hover:text-primary-900 transition-colors duration-300">
                        {project.category === 'backend' ? <SiSpringboot className="w-5 h-5 sm:w-6 sm:h-6" /> : <FaHtml5 className="w-5 h-5 sm:w-6 sm:h-6" />}
                      </div>
                      <div className="flex gap-3">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-400 hover:text-white transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FaGithub className="w-4 h-4 sm:w-5 sm:h-5" />
                          </a>
                        )}
                        <FaExternalLinkAlt className="w-4 h-4 sm:w-5 sm:h-5 text-primary-400 group-hover:text-accent-900 transition-colors" />
                      </div>
                    </div>

                    <h4 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-accent-900 transition-colors font-oldenburg">
                      {project.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-primary-400 font-josefin mb-4 sm:mb-6 line-clamp-3">
                      {project.description}
                    </p>

                    <ul className="flex flex-wrap gap-2 mt-auto">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <li key={tech.name} className="text-[10px] sm:text-xs text-primary-500 font-josefin">
                          {tech.name}
                        </li>
                      ))}
                      {project.technologies.length > 3 && (
                        <li className="text-[10px] sm:text-xs text-primary-500 font-josefin">
                          +{project.technologies.length - 3}
                        </li>
                      )}
                    </ul>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl"
              onClick={() => setSelectedProject(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl max-h-[85vh] md:max-h-[90vh] bg-primary-900/50 border border-primary-800 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 z-50 p-2 md:p-3 rounded-full bg-black/50 text-white hover:bg-accent-900 hover:text-primary-900 transition-all duration-300"
              >
                <XMarkIcon className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              {/* Left Side: Media */}
              <div className="w-full md:w-1/2 lg:w-3/5 bg-black h-[200px] sm:h-[250px] md:h-auto relative overflow-hidden flex-shrink-0">
                {selectedProject.image ? (
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-900 to-black">
                    <SiSpringboot className="w-16 h-16 md:w-24 md:h-24 text-primary-800/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-transparent to-transparent md:hidden" />
              </div>

              {/* Right Side: Info */}
              <div className="w-full md:w-1/2 lg:w-2/5 p-6 md:p-8 lg:p-10 overflow-y-auto custom-scrollbar bg-primary-900/40 flex flex-col">
                <div className="flex items-center gap-2 mb-4 md:mb-6">
                  <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold text-accent-900">
                    {selectedProject.category}
                  </span>
                  <div className="w-8 md:w-12 h-[1px] bg-primary-800" />
                </div>

                <h3 className="text-xl md:text-2xl lg:text-3xl font-oldenburg font-bold text-white mb-4 md:mb-6">
                  {selectedProject.title}
                </h3>

                <p className="text-primary-300 font-josefin text-sm md:text-base leading-relaxed mb-6 md:mb-8">
                  {selectedProject.description}
                </p>

                {/* Features */}
                {selectedProject.features && (
                  <div className="mb-6 md:mb-8">
                    <h4 className="text-white text-sm md:text-base font-bold mb-3 md:mb-4 flex items-center gap-2">
                      <div className="w-1 md:w-1.5 h-4 md:h-6 bg-accent-900 rounded-full" />
                      Key Features
                    </h4>
                    <ul className="space-y-2 md:space-y-3">
                      {selectedProject.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 md:gap-3 text-primary-300 text-xs md:text-sm font-josefin">
                          <span className="text-accent-900 mt-1">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tech Stack */}
                <div className="mb-6 md:mb-8">
                  <h4 className="text-white text-sm md:text-base font-bold mb-3 md:mb-4 flex items-center gap-2">
                    <div className="w-1 md:w-1.5 h-4 md:h-6 bg-accent-900 rounded-full" />
                    Tech Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech) => (
                      <div
                        key={tech.name}
                        className="flex items-center gap-1.5 md:gap-2 px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg bg-primary-800/50 border border-primary-700/50 text-primary-200 text-[10px] md:text-xs"
                      >
                        {tech.icon}
                        <span>{tech.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-4 border-t border-primary-800/30">
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent-900 text-primary-900 text-sm font-bold hover:bg-white transition-all duration-300"
                  >
                    <FaGithub className="w-4 h-4 md:w-5 md:h-5" />
                    <span>Source</span>
                  </a>
                  {selectedProject.demoUrl && (
                    <a
                      href={selectedProject.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary-800 text-white text-sm font-bold hover:bg-primary-700 transition-all duration-300"
                    >
                      <FaExternalLinkAlt className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Work;