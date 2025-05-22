import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaInstagram, FaFacebookF, FaEnvelope } from 'react-icons/fa6';

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  const socialLinks = [
    {
      name: 'Instagram',
      icon: FaInstagram,
      url: 'https://www.instagram.com/suman_bisunkhe/',
      color: 'from-pink-600 to-purple-600'
    },
    {
      name: 'Facebook',
      icon: FaFacebookF,
      url: 'https://www.facebook.com/profile.php?id=100071784111261',
      color: 'from-blue-600 to-blue-800'
    },
    {
      name: 'LinkedIn',
      icon: FaLinkedin,
      url: 'https://www.linkedin.com/in/sumanbisunkhe',
      color: 'from-blue-500 to-blue-700'
    },
    {
      name: 'GitHub',
      icon: FaGithub,
      url: 'https://github.com/sumanbisunkhe',
      color: 'from-gray-800 to-gray-900'
    }
  ];

  return (
    <section id="contact" className="relative min-h-screen py-24 bg-black">
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <div className="text-center mb-20">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-block px-4 py-2 rounded-full bg-black text-white text-sm font-medium mb-4 border border-white/20"
            >
              Get in Touch
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl sm:text-3xl font-bold mb-6 bg-gradient-to-r from-accent-900 via-accent-800 to-accent-700 bg-clip-text text-transparent"
            >
              Let's Create Something Amazing Together
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg text-primary-200 max-w-2xl mx-auto"
            >
              Whether you have a question or just want to say hi, I'll try my best to get back to you!
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="bg-primary-900 rounded-3xl p-8 border border-primary-800 shadow-xl h-full">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-primary-200 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="w-full px-4 py-3 bg-primary-800 border border-primary-700 rounded-xl text-primary-100 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-900 focus:border-transparent transition-all duration-200"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-primary-200 mb-2">
                        Your Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full px-4 py-3 bg-primary-800 border border-primary-700 rounded-xl text-primary-100 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-900 focus:border-transparent transition-all duration-200"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-primary-200 mb-2">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="w-full px-4 py-3 bg-primary-800 border border-primary-700 rounded-xl text-primary-100 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-900 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="Hello! I'd like to talk about..."
                      required
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full px-6 py-4 bg-yellow-400 text-black font-medium rounded-xl hover:shadow-lg hover:shadow-yellow-400/20 transition-all duration-200"
                  >
                    Send Message
                  </motion.button>
                </form>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col gap-8"
            >
              {/* Email Card */}
              <div className="bg-primary-900 rounded-3xl p-8 border border-primary-800 shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-yellow-400">
                    <FaEnvelope className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-primary-200 mb-2">Email Me</h3>
                    <a
                      href="mailto:sumanbisunkhe304@gmail.com"
                      className="text-primary-400 hover:text-accent-900 transition-colors duration-200"
                    >
                      sumanbisunkhe304@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Social Links Card */}
              <div className="bg-primary-900 rounded-3xl p-8 border border-primary-800 shadow-xl flex-grow">
                <h3 className="text-lg font-medium text-primary-200 mb-6">Connect with me</h3>
                <div className="grid grid-cols-2 gap-4">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-xl bg-gradient-to-br ${social.color} text-white hover:shadow-lg hover:shadow-accent/20 transition-all duration-200 flex items-center gap-3`}
                      aria-label={`Visit my ${social.name} profile`}
                    >
                      <social.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{social.name}</span>
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact; 