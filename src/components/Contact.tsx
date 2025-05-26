import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaInstagram, FaFacebookF, FaEnvelope } from 'react-icons/fa6';
import { useState } from 'react';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';

// Initialize EmailJS
emailjs.init("VXCt9Zz9CXdcj9zIF");

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await emailjs.send(
        'service_erfg3dm',
        'template_galc3xd',
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_email: 'sumanbisunkhe304@gmail.com'
        }
      );

      toast.success('Message sent! I\'ll get back to you soon.', {
        icon: '✨',
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        },
      });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send message. Please try again.', {
        icon: '⚠️',
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
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
    <section id="contact" className="relative min-h-screen py-16 sm:py-20 md:py-24 bg-black">
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-black text-white text-xs sm:text-sm font-medium mb-3 sm:mb-4 border border-white/20"
            >
              Get in Touch
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-accent-900 via-accent-800 to-accent-700 bg-clip-text text-transparent"
            >
              Let's Create Something Amazing Together
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-base sm:text-lg text-primary-200 max-w-2xl mx-auto px-4"
            >
              Whether you have a question or just want to say hi, I'll try my best to get back to you!
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="bg-primary-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-primary-800 shadow-xl h-full">
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-primary-200 mb-1.5 sm:mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-primary-800 border border-primary-700 rounded-xl text-primary-100 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-900 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-primary-200 mb-1.5 sm:mb-2">
                        Your Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-primary-800 border border-primary-700 rounded-xl text-primary-100 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-900 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-primary-200 mb-1.5 sm:mb-2">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-primary-800 border border-primary-700 rounded-xl text-primary-100 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-900 focus:border-transparent transition-all duration-200 resize-none text-sm sm:text-base"
                      placeholder="Hello! I'd like to talk about..."
                      required
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-yellow-400 text-black font-medium rounded-xl hover:shadow-lg hover:shadow-yellow-400/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                        Sending...
                      </div>
                    ) : (
                      'Send Message'
                    )}
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
              className="flex flex-col gap-4 sm:gap-6 md:gap-8"
            >
              {/* Email Card */}
              <div className="bg-primary-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-primary-800 shadow-xl">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 rounded-xl bg-yellow-400">
                    <FaEnvelope className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-medium text-primary-200 mb-1 sm:mb-2">Email Me</h3>
                    <a
                      href="mailto:sumanbisunkhe304@gmail.com"
                      className="text-sm sm:text-base text-primary-400 hover:text-accent-900 transition-colors duration-200"
                    >
                      sumanbisunkhe304@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Social Links Card */}
              <div className="bg-primary-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-primary-800 shadow-xl flex-grow">
                <h3 className="text-base sm:text-lg font-medium text-primary-200 mb-4 sm:mb-6">Connect with me</h3>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-3 sm:p-4 rounded-xl bg-gradient-to-br ${social.color} text-white hover:shadow-lg hover:shadow-accent/20 transition-all duration-200 flex items-center gap-2 sm:gap-3`}
                      aria-label={`Visit my ${social.name} profile`}
                    >
                      <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-xs sm:text-sm font-medium">{social.name}</span>
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