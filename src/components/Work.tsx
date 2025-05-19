import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaJava, FaHtml5, FaCss3Alt, FaJs } from 'react-icons/fa';
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
  SiNodedotjs,
  SiGooglefonts,
  SiFontawesome,
  SiX
} from 'react-icons/si';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface Project {
  title: string;
  description: string;
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
}

const projects: Project[] = [
  {
    title: "URL Shortener",
    description: "A tool that converts long, complex web addresses or URLs (Uniform Resource Locators) into shorter, more manageable links.",
    technologies: [
      { name: "Spring Boot", icon: <SiSpringboot className="w-5 h-5" /> },
      { name: "Spring Security", icon: <SiSpring className="w-5 h-5" /> },
      { name: "JWT", icon: <SiJsonwebtokens className="w-5 h-5" /> },
      { name: "MySQL", icon: <SiMysql className="w-5 h-5" /> },
      { name: "Thymeleaf", icon: <SiThymeleaf className="w-5 h-5" /> },
    ],
    githubUrl: "https://github.com/sumanbisunkhe/url-shortner-thymeleaf",
    category: 'backend'
  },
  {
    title: "Content Management System",
    description: "A robust, secure content management system built with Spring Boot that allows for easy content creation, editing, and management across different sections of your application.",
    technologies: [
      { name: "Java 17", icon: <FaJava className="w-5 h-5" /> },
      { name: "Spring Boot", icon: <SiSpringboot className="w-5 h-5" /> },
      { name: "Spring Security", icon: <SiSpring className="w-5 h-5" /> },
      { name: "PostgreSQL", icon: <SiPostgresql className="w-5 h-5" /> },
    ],
    githubUrl: "https://github.com/sumanbisunkhe/content-mgmt-system",
    category: 'backend'
  },
  {
    title: "Room Finder System",
    description: "A web-based platform designed to bridge the gap between landlords and individuals searching for rental properties.",
    technologies: [
      { name: "Spring Boot", icon: <SiSpringboot className="w-5 h-5" /> },
      { name: "Spring Security", icon: <SiSpring className="w-5 h-5" /> },
      { name: "PostgreSQL", icon: <SiPostgresql className="w-5 h-5" /> },
      { name: "Maven", icon: <SiApachejmeter className="w-5 h-5" /> },
    ],
    githubUrl: "https://github.com/sumanbisunkhe/room-finder-system-backend",
    frontendUrl: "https://github.com/sumanbisunkhe/room-finder-system-frontend",
    backendUrl: "https://github.com/sumanbisunkhe/room-finder-system-backend",
    category: 'fullstack'
  },
  {
    title: "Inventory Control System",
    description: "An inventory management application that revolutionizes inventory management through intelligent real-time tracking of products, suppliers, and orders.",
    technologies: [
      { name: "Spring Boot", icon: <SiSpringboot className="w-5 h-5" /> },
      { name: "Spring Security", icon: <SiSpring className="w-5 h-5" /> },
      { name: "JWT", icon: <SiJsonwebtokens className="w-5 h-5" /> },
      { name: "JPA", icon: <SiHibernate className="w-5 h-5" /> },
    ],
    githubUrl: "https://github.com/sumanbisunkhe/inventory-control-system",
    category: 'backend'
  },
  {
    title: "Library Management System",
    description: "A comprehensive solution for managing library resources, users, and transactions. It handles user registrations, book reservations, borrowing, notifications, fines, and reviews through secure RESTful APIs.",
    technologies: [
      { name: "Spring Boot", icon: <SiSpringboot className="w-5 h-5" /> },
      { name: "Spring Security", icon: <SiSpring className="w-5 h-5" /> },
      { name: "PostgreSQL", icon: <SiPostgresql className="w-5 h-5" /> },
      { name: "JWT", icon: <SiJsonwebtokens className="w-5 h-5" /> },
    ],
    githubUrl: "https://github.com/sumanbisunkhe/library-management-system",
    category: 'backend'
  },
  {
    title: "Pulse Application",
    description: "A backend web application focused on user authentication and management, featuring secure login and user data handling.",
    technologies: [
      { name: "Spring Boot", icon: <SiSpringboot className="w-5 h-5" /> },
      { name: "Spring Security", icon: <SiSpring className="w-5 h-5" /> },
      { name: "PostgreSQL", icon: <SiPostgresql className="w-5 h-5" /> },
      { name: "Thymeleaf", icon: <SiThymeleaf className="w-5 h-5" /> },
    ],
    githubUrl: "https://github.com/sumanbisunkhe/pulse-sercure-api",
    category: 'backend'
  },
  {
    title: "BlogEcho",
    description: "A backend web application designed for managing blogs and user accounts, emphasizing robust authentication and authorization mechanisms.",
    technologies: [
      { name: "Spring Boot", icon: <SiSpringboot className="w-5 h-5" /> },
      { name: "Spring Security", icon: <SiSpring className="w-5 h-5" /> },
      { name: "PostgreSQL", icon: <SiPostgresql className="w-5 h-5" /> },
      { name: "JWT", icon: <SiJsonwebtokens className="w-5 h-5" /> },
    ],
    githubUrl: "https://github.com/sumanbisunkhe/BlogEcho",
    category: 'backend'
  },
  {
    title: "KURAKANI: Chat Application",
    description: "A Spring Boot WebSocket chat application that allows users to register, send connection requests to each other, and chat once the request is accepted.",
    technologies: [
      { name: "Spring Boot", icon: <SiSpringboot className="w-5 h-5" /> },
      { name: "WebSocket", icon: <SiSocketdotio className="w-5 h-5" /> },
      { name: "PostgreSQL", icon: <SiPostgresql className="w-5 h-5" /> },
      { name: "JWT", icon: <SiJsonwebtokens className="w-5 h-5" /> },
    ],
    githubUrl: "https://github.com/sumanbisunkhe/Kurakani",
    category: 'backend'
  },
  {
    title: "Expense Tracker",
    description: "A Spring Boot-based project designed to help users manage their expenses efficiently. Supports user registration, authentication, and expense management.",
    technologies: [
      { name: "Spring Boot", icon: <SiSpringboot className="w-5 h-5" /> },
      { name: "Spring Security", icon: <SiSpring className="w-5 h-5" /> },
      { name: "PostgreSQL", icon: <SiPostgresql className="w-5 h-5" /> },
      { name: "Maven", icon: <SiApachejmeter className="w-5 h-5" /> },
    ],
    githubUrl: "https://github.com/sumanbisunkhe/Expense-Tracker",
    category: 'backend'
  },
  {
    title: "User Registration System",
    description: "A web application designed for managing user accounts with functionalities for viewing, creating, editing, and deleting user information.",
    technologies: [
      { name: "Spring Boot", icon: <SiSpringboot className="w-5 h-5" /> },
      { name: "Spring Security", icon: <SiSpring className="w-5 h-5" /> },
      { name: "Thymeleaf", icon: <SiThymeleaf className="w-5 h-5" /> },
    ],
    githubUrl: "https://github.com/sumanbisunkhe/User-Registration-System",
    category: 'backend'
  },
  {
    title: "Portfolio Website",
    description: "The Personal Portfolio Website is a meticulously crafted digital representation of my professional identity as a Java Developer. Designed with modern web technologies, this portfolio provides a comprehensive view of my skills, projects, and professional journey.",
    technologies: [
      { name: "HTML5", icon: <FaHtml5 className="w-5 h-5" /> },
      { name: "CSS3", icon: <FaCss3Alt className="w-5 h-5" /> },
      { name: "JavaScript", icon: <FaJs className="w-5 h-5" /> },
      { name: "Font Awesome", icon: <SiFontawesome className="w-5 h-5" /> },
      { name: "Google Fonts", icon: <SiGooglefonts className="w-5 h-5" /> },
    ],
    githubUrl: "https://github.com/sumanbisunkhe/portfolio",
    category: 'frontend'
  },
  {
    title: "Responsive Portfolio",
    description: "A modern, responsive portfolio website built with Next.js 13, TypeScript, and Tailwind CSS. This portfolio showcases my skills, projects, and professional experience with a sleek and interactive user interface. The site features smooth animations, dark/light mode, and a fully responsive design.",
    technologies: [
      { name: "Next.js", icon: <SiNextdotjs className="w-5 h-5" /> },
      { name: "TypeScript", icon: <SiTypescript className="w-5 h-5" /> },
      { name: "Tailwind CSS", icon: <SiTailwindcss className="w-5 h-5" /> },
      { name: "Framer Motion", icon: <SiFramer className="w-5 h-5" /> },
      { name: "Node.js", icon: <SiNodedotjs className="w-5 h-5" /> },
    ],
    githubUrl: "https://github.com/sumanbisunkhe/professional-portfolio",
    category: 'frontend'
  }
];

const Work = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'backend', name: 'Backend' },
    { id: 'frontend', name: 'Frontend' },
    { id: 'fullstack', name: 'Full Stack' }
  ];

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  return (
    <section id="work" className="min-h-screen py-24 bg-gradient-to-b from-primary-900 via-primary-900 to-primary-800">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-accent-900 font-josefin text-sm tracking-wider uppercase mb-3 block">
            My Works
          </span>
          <h2 className="text-4xl md:text-5xl font-oldenburg font-bold text-white mb-6">
            Featured <span className="text-accent-900">Projects</span>
          </h2>
          <div className="w-24 h-1 bg-accent-900 mx-auto mb-8"></div>
          <p className="text-primary-300 font-josefin text-lg">
            A collection of my projects showcasing expertise in Java, Spring Boot, and enterprise application development.
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-josefin transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-accent-900 text-primary-900'
                  : 'bg-primary-800/50 text-primary-200 hover:bg-primary-700/50'
              }`}
            >
              {category.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          <AnimatePresence mode="wait">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-primary-800/50 rounded-2xl overflow-hidden backdrop-blur-sm border border-primary-700/50 hover:border-accent-900/50 transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                {/* Card Header with Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-accent-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="p-6 relative z-10">
                  {/* Project Title */}
                  <h3 className="text-xl font-josefin font-semibold text-white mb-3 group-hover:text-accent-900 transition-colors duration-300">
                    {project.title}
                  </h3>

                  {/* Project Description */}
                  <p className="text-primary-300 mb-6 font-josefin text-sm line-clamp-3 group-hover:text-primary-200 transition-colors duration-300">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-6 min-h-[80px]">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <motion.div
                        key={tech.name}
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-primary-700/50 text-primary-200 hover:bg-primary-600/50 hover:text-accent-900 transition-all duration-200"
                      >
                        {tech.icon}
                        <span className="text-xs font-josefin">{tech.name}</span>
                      </motion.div>
                    ))}
                    {project.technologies.length > 4 && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-primary-700/50 text-primary-200">
                        <span className="text-xs font-josefin">+{project.technologies.length - 4} more</span>
                      </div>
                    )}
                  </div>

                  {/* View Project Button */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-900/20 text-accent-900 hover:bg-accent-900/30 transition-all duration-200 w-full justify-center group"
                  >
                    <FaGithub className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
                    <span className="font-josefin">View Project</span>
                  </motion.div>
                </div>

                {/* Hover Effect Corner Decorations */}
                <div className="absolute top-0 left-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute top-0 left-0 w-1 h-8 bg-accent-900/50 transform -rotate-45"></div>
                  <div className="absolute top-0 left-0 h-1 w-8 bg-accent-900/50 transform -rotate-45"></div>
                </div>
                <div className="absolute bottom-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 right-0 w-1 h-8 bg-accent-900/50 transform -rotate-45"></div>
                  <div className="absolute bottom-0 right-0 h-1 w-8 bg-accent-900/50 transform -rotate-45"></div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Project Detail Modal */}
        <AnimatePresence>
          {selectedProject && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] overflow-y-auto"
                onClick={() => setSelectedProject(null)}
              >
                <div className="min-h-screen w-full flex items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="w-full max-w-5xl relative z-[9999]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="relative bg-gradient-to-b from-primary-800 to-primary-900 rounded-2xl shadow-2xl border border-primary-700/50">
                      {/* Decorative Elements */}
                      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-accent-900 via-accent-800 to-accent-700 rounded-t-2xl" />
                      <div className="absolute -top-3 -left-3 w-20 h-20 border-t-2 border-l-2 border-accent-900/50 rounded-tl-2xl" />
                      <div className="absolute -bottom-3 -right-3 w-20 h-20 border-b-2 border-r-2 border-accent-900/50 rounded-br-2xl" />

                      {/* Close Button */}
                      <button
                        onClick={() => setSelectedProject(null)}
                        className="absolute top-4 right-4 p-2 rounded-lg bg-primary-800/50 text-accent-900 hover:bg-primary-700/50 transition-colors duration-200"
                        aria-label="Close project details"
                      >
                        <XMarkIcon className="w-6 h-6" />
                      </button>

                      {/* Project Content */}
                      <div className="p-8 md:p-10">
                        {/* Header Section */}
                        <div className="mb-8">
                          <div className="flex items-center gap-3 mb-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-josefin uppercase tracking-wider ${
                              selectedProject.category === 'backend' 
                                ? 'bg-blue-900/30 text-blue-400' 
                                : selectedProject.category === 'frontend'
                                ? 'bg-purple-900/30 text-purple-400'
                                : 'bg-green-900/30 text-green-400'
                            }`}>
                              {selectedProject.category}
                            </span>
                            {selectedProject.demoUrl && (
                              <span className="px-3 py-1 rounded-full text-xs font-josefin uppercase tracking-wider bg-accent-900/30 text-accent-400">
                                Live Demo Available
                              </span>
                            )}
                          </div>
                          <h3 className="text-3xl md:text-4xl font-oldenburg text-white mb-4">
                            {selectedProject.title}
                          </h3>
                          <p className="text-primary-300 font-josefin text-lg leading-relaxed">
                            {selectedProject.description}
                          </p>
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid md:grid-cols-2 gap-8">
                          {/* Left Column */}
                          <div className="space-y-8">
                            {/* Technologies Section */}
                            <div className="bg-primary-800/50 rounded-xl p-6 border border-primary-700/50">
                              <h4 className="text-xl font-josefin text-white mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-accent-900/20 flex items-center justify-center">
                                  <FaJava className="w-4 h-4 text-accent-900" />
                                </span>
                                Technologies Used
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {selectedProject.technologies.map((tech) => (
                                  <motion.div
                                    key={tech.name}
                                    whileHover={{ scale: 1.05 }}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary-700/50 text-primary-200 hover:bg-primary-600/50 hover:text-accent-900 transition-all duration-200"
                                  >
                                    {tech.icon}
                                    <span className="text-sm font-josefin">{tech.name}</span>
                                  </motion.div>
                                ))}
                              </div>
                            </div>

                            {/* Features Section */}
                            {selectedProject.features && (
                              <div className="bg-primary-800/50 rounded-xl p-6 border border-primary-700/50">
                                <h4 className="text-xl font-josefin text-white mb-4 flex items-center gap-2">
                                  <span className="w-8 h-8 rounded-lg bg-accent-900/20 flex items-center justify-center">
                                    <FaExternalLinkAlt className="w-4 h-4 text-accent-900" />
                                  </span>
                                  Key Features
                                </h4>
                                <ul className="space-y-3">
                                  {selectedProject.features.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-3 text-primary-300 font-josefin">
                                      <span className="w-5 h-5 rounded-full bg-accent-900/20 flex items-center justify-center mt-0.5">
                                        <span className="text-accent-900 text-sm">{index + 1}</span>
                                      </span>
                                      {feature}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          {/* Right Column */}
                          <div className="space-y-8">
                            {/* Project Links */}
                            <div className="bg-primary-800/50 rounded-xl p-6 border border-primary-700/50">
                              <h4 className="text-xl font-josefin text-white mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-accent-900/20 flex items-center justify-center">
                                  <FaGithub className="w-4 h-4 text-accent-900" />
                                </span>
                                Project Links
                              </h4>
                              <div className="space-y-4">
                                {selectedProject.frontendUrl && selectedProject.backendUrl ? (
                                  <>
                                    <motion.a
                                      href={selectedProject.frontendUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-accent-900/20 text-accent-900 hover:bg-accent-900/30 transition-all duration-200 group"
                                    >
                                      <FaGithub className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
                                      <span className="font-josefin">Frontend Code</span>
                                    </motion.a>
                                    <motion.a
                                      href={selectedProject.backendUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-accent-900/20 text-accent-900 hover:bg-accent-900/30 transition-all duration-200 group"
                                    >
                                      <FaGithub className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
                                      <span className="font-josefin">Backend Code</span>
                                    </motion.a>
                                  </>
                                ) : (
                                  <motion.a
                                    href={selectedProject.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-accent-900/20 text-accent-900 hover:bg-accent-900/30 transition-all duration-200 group"
                                  >
                                    <FaGithub className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
                                    <span className="font-josefin">View Source Code</span>
                                  </motion.a>
                                )}
                                {selectedProject.demoUrl && (
                                  <motion.a
                                    href={selectedProject.demoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-700/50 text-primary-200 hover:bg-primary-600/50 hover:text-accent-900 transition-all duration-200 group"
                                  >
                                    <FaExternalLinkAlt className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
                                    <span className="font-josefin">Visit Live Demo</span>
                                  </motion.a>
                                )}
                              </div>
                            </div>

                            {/* Additional Info Section */}
                            <div className="bg-primary-800/50 rounded-xl p-6 border border-primary-700/50">
                              <h4 className="text-xl font-josefin text-white mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-accent-900/20 flex items-center justify-center">
                                  <FaExternalLinkAlt className="w-4 h-4 text-accent-900" />
                                </span>
                                Project Details
                              </h4>
                              <div className="space-y-4">
                                <div className="flex items-center justify-between py-2 border-b border-primary-700/50">
                                  <span className="text-primary-300 font-josefin">Category</span>
                                  <span className="text-white font-josefin capitalize">{selectedProject.category}</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-primary-700/50">
                                  <span className="text-primary-300 font-josefin">Technologies</span>
                                  <span className="text-white font-josefin">{selectedProject.technologies.length}</span>
                                </div>
                                {selectedProject.features && (
                                  <div className="flex items-center justify-between py-2">
                                    <span className="text-primary-300 font-josefin">Features</span>
                                    <span className="text-white font-josefin">{selectedProject.features.length}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Work; 