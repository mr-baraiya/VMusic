import { motion } from 'framer-motion';
import { Play, Github, Twitter, Linkedin, Instagram, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Explore Music', href: '/explore' },
      { name: 'Search', href: '/search' },
      { name: 'About', href: '/about' },
    ],
    company: [
      { name: 'Contact Us', href: '/contact' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#privacy' },
      { name: 'Terms of Service', href: '#terms' },
    ],
    resources: [
      { name: 'API Documentation', href: 'https://developer.jamendo.com', external: true },
      { name: 'Jamendo Music', href: 'https://www.jamendo.com', external: true },
    ],
  };

  const socialLinks = [
    { icon: Github, href: 'https://github.com/mr-baraiya', label: 'GitHub' },
    { icon: Twitter, href: 'https://x.com/baraiya1014', label: 'Twitter' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/baraiya-vishalbhai/', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://www.instagram.com/vishalbaraiya_1014/', label: 'Instagram' },
  ];

  return (
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
              Stream half a million royalty-free tracks from independent artists. 
              Free, legal, and ad-free forever.
            </p>
            
            {/* Newsletter */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-white">Stay updated</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 text-white placeholder-gray-500"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  <Mail size={20} />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
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
                    <Link to={link.href} className="text-gray-400 hover:text-green-400 transition-colors">
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
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
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
                    <Link to={link.href} className="text-gray-400 hover:text-green-400 transition-colors">
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
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
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
                    <Link to={link.href} className="text-gray-400 hover:text-green-400 transition-colors">
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
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <a href={link.href} className="text-gray-400 hover:text-green-400 transition-colors">
                    {link.name}
                  </a>
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
          <div className="text-gray-500 text-sm">
            © {currentYear} VMusic. All rights reserved. 
            <span className="ml-2 text-gray-600">
              Powered by <a href="https://www.jamendo.com" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300">Jamendo API</a>
            </span>
          </div>

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

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-gray-600">
            Built with ❤️ using React, Vite, Tailwind CSS, and Framer Motion
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
