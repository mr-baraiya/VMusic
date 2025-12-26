import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Github,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  CheckCircle,
  AlertCircle,
  X,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';

const Footer = ({ onOpenSignIn }) => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [showModal, setShowModal] = useState(false);

  const footerLinks = {
    product: [
      { name: 'Explore Music', href: '/explore' },
      { name: 'VibeTube', href: '/vibetube' },
      { name: 'Artists', href: '/artists' },
      { name: 'Playlists', href: '/playlists' },
      { name: 'About', href: '/about' },
    ],
    company: [{ name: 'Contact Us', href: '/contact' }],
    legal: [
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Terms of Service', href: '/terms-of-service' },
    ],
    resources: [
      { name: 'Spotify API', href: 'https://developer.spotify.com', external: true },
      { name: 'Google Cloud', href: 'https://console.cloud.google.com', external: true },
      { name: 'Firebase', href: 'https://console.firebase.google.com', external: true },
      { name: 'MongoDB Atlas', href: 'https://cloud.mongodb.com', external: true },
      { name: 'Jamendo API', href: 'https://developer.jamendo.com', external: true },
    ],
  };

  const socialLinks = [
    { icon: Github, href: 'https://github.com/mr-baraiya', label: 'GitHub' },
    { icon: Twitter, href: 'https://x.com/baraiya1014', label: 'Twitter' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/baraiya-vishalbhai/', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://www.instagram.com/vishalbaraiya_1014/', label: 'Instagram' },
  ];

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      setStatus({
        type: 'error',
        message: 'Please enter a valid email address',
      });
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      // Send newsletter subscription email
      const templateParams = {
        title: 'VMusic Newsletter Subscription',
        from_name: 'Newsletter Subscriber',
        from_email: email,
        subject: 'Newsletter Subscription',
        message: `New newsletter subscription from: ${email}`,
        phone: 'Not provided',
        name: email,
      };

      const result = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_USER_ID
      );

      console.log('Newsletter email sent:', result);

      // Save to Firestore (non-blocking - fire and forget)
      addDoc(collection(db, 'newsletter'), {
        email: email,
        subscribedAt: serverTimestamp(),
        status: 'active',
      }).catch((firestoreError) => {
        console.warn('Firestore save failed:', firestoreError);
      });

      // Update UI immediately
      setEmail('');
      setStatus({
        type: 'success',
        message: 'Successfully subscribed!',
      });
      setShowModal(true);
      setLoading(false);
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      setLoading(false);
      setStatus({
        type: 'error',
        message: 'Subscription failed. Please try again.',
      });
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    }
  };

  return (
    <>
      <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="bg-gradient-to-r from-green-400 to-blue-500 p-3 rounded-xl">
                <Play size={24} className="text-white" fill="white" />
              </div>
              <span className="text-2xl font-bold text-white">VMusic</span>
            </motion.div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Stream half a million royalty-free tracks from independent artists. Free, legal, and
              ad-free forever.
            </p>

            {/* Newsletter */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-white">Stay updated</p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 text-white placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.05 }}
                    whileTap={{ scale: loading ? 1 : 0.95 }}
                    className="px-4 py-2 bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <Mail size={20} />
                    )}
                  </motion.button>
                </div>

                {/* Status Message - Error only */}
                <AnimatePresence>
                  {status.message && status.type === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`flex items-center gap-2 text-xs p-2 rounded ${
                        status.type === 'success'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {status.type === 'success' ? (
                        <CheckCircle size={14} />
                      ) : (
                        <AlertCircle size={14} />
                      )}
                      <span>{status.message}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <motion.li key={index} whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-green-400 transition-colors"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-green-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  )}
                </motion.li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <motion.li key={index} whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-green-400 transition-colors"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-green-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  )}
                </motion.li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <motion.li key={index} whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-green-400 transition-colors"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-green-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  )}
                </motion.li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <motion.li key={index} whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-green-400 transition-colors"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-green-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  )}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Copyright */}
          <div className="text-gray-500 text-sm">© {currentYear} VMusic. All rights reserved.</div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 bg-gray-800 hover:bg-gradient-to-r hover:from-green-500 hover:to-blue-500 rounded-lg transition-all duration-300"
                >
                  <Icon size={20} />
                </motion.a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Newsletter Success Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 max-w-md w-full shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              {/* Icon */}
              <div className="flex justify-center mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="bg-green-500/20 rounded-full p-4"
                >
                  <CheckCircle size={48} className="text-green-400" />
                </motion.div>
              </div>

              {/* Content */}
              <h2 className="text-2xl font-bold text-white text-center mb-3">
                Successfully Subscribed!
              </h2>
              <p className="text-gray-300 text-center mb-6">
                Thank you for subscribing to our newsletter. You'll receive updates about new music and features.
              </p>

              {/* Button */}
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  </>
  );
};

export default Footer;
