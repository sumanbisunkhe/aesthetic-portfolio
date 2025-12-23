import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaInstagram, FaFacebookF, FaPaperPlane } from 'react-icons/fa6';
import { useState } from 'react';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';
import {
  ChatBubbleBottomCenterTextIcon,
  MapPinIcon,
  EnvelopeIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

// Initialize EmailJS
emailjs.init("VXCt9Zz9CXdcj9zIF");

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: 'easeOut' }
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

      // Show success modal instead of toast
      setShowSuccessModal(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error(
        () => (
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-oldenburg font-bold text-sm text-white mb-0.5">Failed to Send</p>
              <p className="font-josefin text-xs text-gray-400">Please try again or email me directly.</p>
            </div>
          </div>
        ),
        {
          duration: 4000,
          position: 'top-center',
          style: {
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%), rgba(17, 17, 17, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '16px',
            padding: '16px 20px',
            boxShadow: '0 8px 32px rgba(239, 68, 68, 0.25), 0 0 0 1px rgba(239, 68, 68, 0.1)',
            maxWidth: '420px',
          },
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    {
      name: 'LinkedIn',
      icon: FaLinkedin,
      url: 'https://www.linkedin.com/in/sumanbisunkhe',
      color: 'hover:text-[#0077b5]'
    },
    {
      name: 'GitHub',
      icon: FaGithub,
      url: 'https://github.com/sumanbisunkhe',
      color: 'hover:text-white'
    },
    {
      name: 'Instagram',
      icon: FaInstagram,
      url: 'https://www.instagram.com/suman_bisunkhe/',
      color: 'hover:text-[#e1306c]'
    },
    {
      name: 'Facebook',
      icon: FaFacebookF,
      url: 'https://www.facebook.com/profile.php?id=100071784111261',
      color: 'hover:text-[#1877f2]'
    }
  ];

  return (
    <>
      {/* Success Modal */}
      {showSuccessModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          onClick={() => setShowSuccessModal(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-md w-full"
          >
            {/* Floating particles effect */}
            <div className="absolute -inset-10 overflow-hidden pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 0, opacity: 0 }}
                  animate={{
                    y: [-20, -80, -140],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                  className="absolute"
                  style={{
                    left: `${Math.random() * 100}%`,
                    bottom: '0',
                  }}
                >
                  <SparklesIcon className="w-4 h-4 text-accent-900" />
                </motion.div>
              ))}
            </div>

            {/* Card */}
            <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-3xl p-8 shadow-2xl">
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2, duration: 0.6 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30"
              >
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <h3 className="text-2xl font-oldenburg font-bold text-white mb-3">
                  Message Delivered! 🎉
                </h3>
                <p className="text-primary-300 font-josefin text-base mb-2">
                  Thanks for reaching out! I've received your message and I'm excited to read it.
                </p>
                <p className="text-primary-400 font-josefin text-sm mb-6">
                  I'll get back to you <span className="text-accent-900 font-bold">within 24 hours</span> via email.
                </p>

                {/* Social Connect CTA */}
                <div className="pt-6 border-t border-white/10">
                  <p className="text-xs text-primary-500 uppercase tracking-widest font-bold font-josefin mb-4">
                    Meanwhile, let's connect
                  </p>
                  <div className="flex justify-center gap-3">
                    <motion.a
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      href="https://www.linkedin.com/in/sumanbisunkhe"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary-400 hover:text-[#0077b5] hover:bg-white/10 transition-all"
                    >
                      <FaLinkedin className="w-5 h-5" />
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      href="https://github.com/sumanbisunkhe"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <FaGithub className="w-5 h-5" />
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      href="https://www.instagram.com/suman_bisunkhe/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary-400 hover:text-[#e1306c] hover:bg-white/10 transition-all"
                    >
                      <FaInstagram className="w-5 h-5" />
                    </motion.a>
                  </div>
                </div>
              </motion.div>

              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSuccessModal(false)}
                className="mt-6 w-full py-3 bg-accent-900 hover:bg-white text-black font-oldenburg font-bold rounded-xl transition-all shadow-lg"
              >
                Awesome, Got It!
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <section id="contact" className="relative min-h-screen pt-10 pb-20 lg:pb-32 bg-black overflow-hidden scroll-mt-2">
        {/* Background Ambience */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-900/5 rounded-full blur-[160px]" />
        </div>

        <div className="relative z-10 container mx-auto px-6">
          {/* Section Header */}
          <motion.div
            {...fadeUp}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <div className="flex items-center justify-center gap-2 mb-4 text-accent-900 uppercase tracking-[0.3em] text-xs font-josefin font-bold">
              <SparklesIcon className="w-4 h-4" />
              <span>Available for Opportunities</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-oldenburg font-bold text-white mb-6">
              Let's <span className="text-accent-900 italic">Build</span> Your Next Vision
            </h2>
            <p className="text-primary-300 font-josefin text-lg leading-relaxed">
              Interested in working together or just want to say hi? I'm always open to discussing new projects,
              creative ideas, or opportunities to be part of your visions.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
            {/* Left Side: Contact Info & Philosophy (4 columns) */}
            <motion.div
              {...fadeUp}
              className="lg:col-span-5 space-y-6"
            >
              {/* Quick Contact Card */}
              <div className="relative group rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-2xl p-8 hover:border-accent-900/20 transition-all duration-500">
                <h3 className="text-xl font-bold text-white font-oldenburg mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <a href="mailto:sumanbisunkhe304@gmail.com" className="flex items-center gap-4 group/item">
                    <div className="w-12 h-12 rounded-2xl bg-accent-900/10 flex items-center justify-center group-hover/item:bg-accent-900 transition-all duration-300">
                      <EnvelopeIcon className="w-6 h-6 text-accent-900 group-hover/item:text-black" />
                    </div>
                    <div>
                      <p className="text-primary-500 text-xs uppercase tracking-widest font-bold font-josefin">Email</p>
                      <p className="text-primary-100 font-josefin group-hover/item:text-accent-900 transition-colors">sumanbisunkhe304@gmail.com</p>
                    </div>
                  </a>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-royal-900/10 flex items-center justify-center">
                      <MapPinIcon className="w-6 h-6 text-royal-400" />
                    </div>
                    <div>
                      <p className="text-primary-500 text-xs uppercase tracking-widest font-bold font-josefin">Location</p>
                      <p className="text-primary-100 font-josefin">Kathmandu, Nepal</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Socials Card */}
              <div className="rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-2xl p-8">
                <h3 className="text-lg font-bold text-white font-oldenburg mb-6">Digital Ecosystem</h3>
                <div className="grid grid-cols-4 gap-4">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -5 }}
                      className={`aspect-square rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-primary-400 transition-all duration-300 ${social.color} hover:bg-white/10 hover:border-white/10`}
                      aria-label={social.name}
                    >
                      <social.icon className="w-6 h-6" />
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Availability Badge */}
              <div className="rounded-3xl border border-white/5 bg-accent-900/5 p-6 flex items-center gap-4">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-900 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-900"></span>
                </div>
                <p className="text-accent-900 font-josefin text-sm font-bold tracking-wide uppercase">
                  Available for Java Developer Roles
                </p>
              </div>
            </motion.div>

            {/* Right Side: Contact Form (7 columns) */}
            <motion.div
              {...fadeUp}
              className="lg:col-span-7 relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-accent-900/20 to-royal-900/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative rounded-[2rem] border border-white/5 bg-white/[0.03] backdrop-blur-3xl p-8 md:p-12 overflow-hidden shadow-2xl">
                <div className="flex items-center gap-3 mb-10">
                  <ChatBubbleBottomCenterTextIcon className="w-8 h-8 text-accent-900" />
                  <h3 className="text-2xl font-bold text-white font-oldenburg">Send a Message</h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2 group/field">
                      <label className="text-xs uppercase tracking-widest text-primary-300 font-bold font-josefin ml-1">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-6 py-4 text-white font-josefin outline-none focus:border-accent-900/50 focus:bg-white/[0.08] transition-all placeholder:text-primary-500"
                      />
                    </div>
                    <div className="space-y-2 group/field">
                      <label className="text-xs uppercase tracking-widest text-primary-300 font-bold font-josefin ml-1">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-6 py-4 text-white font-josefin outline-none focus:border-accent-900/50 focus:bg-white/[0.08] transition-all placeholder:text-primary-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-primary-300 font-bold font-josefin ml-1">Message</label>
                    <textarea
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell me about your project or just say hi..."
                      rows={5}
                      className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-6 py-4 text-white font-josefin outline-none focus:border-accent-900/50 focus:bg-white/[0.08] transition-all placeholder:text-primary-500 resize-none"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                    className="w-full group/btn relative py-5 bg-accent-900 rounded-2xl font-oldenburg font-bold text-black overflow-hidden transition-all hover:bg-white shadow-[0_0_20px_rgba(255,215,0,0.1)] active:shadow-none"
                  >
                    <div className="relative z-10 flex items-center justify-center gap-3">
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Initiate Conversation</span>
                          <FaPaperPlane className="text-sm group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </div>
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;