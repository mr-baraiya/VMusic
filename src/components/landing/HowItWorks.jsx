import { motion } from 'framer-motion';
import { UserPlus, Youtube, ListMusic, Play, Sparkles } from 'lucide-react';
import { fadeIn, staggerContainer, hoverScale } from '../../utils/motionVariants';

const steps = [
  {
    icon: UserPlus,
    number: '01',
    title: 'Sign Up / Log In',
    description:
      'Create your free account with email or Google. Quick and easy setup to get started with VMusic.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Youtube,
    number: '02',
    title: 'Connect YouTube',
    description:
      'Click "Connect with Google" in VibeTube. Authorize VMusic to access your YouTube playlists. One-time setup, instant access.',
    gradient: 'from-red-500 to-pink-500',
  },
  {
    icon: ListMusic,
    number: '03',
    title: 'Import Playlists',
    description:
      'All your YouTube playlists automatically appear in VMusic. Browse, search, and organize your collections seamlessly.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Play,
    number: '04',
    title: 'Play Anywhere',
    description:
      'Stream your YouTube playlists directly in VMusic. No switching apps. Enjoy all your music in one place, ad-free.',
    gradient: 'from-green-500 to-emerald-500',
  },
];
const ConnectingLine = ({ index }) => (
  <motion.div
    initial={{ scaleX: 0, opacity: 0 }}
    whileInView={{ scaleX: 1, opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay: index * 0.3 + 0.5 }}
    className="hidden lg:block absolute top-1/2 -right-16 w-32 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700"
  />
);

const HowItWorks = () => {
  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      className="py-20 px-4 bg-gradient-to-b from-black via-blue-950/30 to-black"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          variants={fadeIn('up', 'tween', 0.1, 0.7)}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Import Your YouTube Playlists
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Get started with VMusic in four simple steps. Connect your YouTube account and access
            all your playlists instantly.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Horizontal connecting line (for desktop) */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 -translate-y-1/2"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={index}
                  variants={fadeIn('up', 'spring', index * 0.2, 0.8)}
                  className="relative"
                >
                  {/* Animated step card */}
                  <motion.div
                    variants={hoverScale}
                    whileHover="whileHover"
                    className="relative bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 border-2 border-gray-200 dark:border-gray-700 hover:border-transparent hover:shadow-2xl transition-all duration-300 group h-full"
                  >
                    {/* Pulsing step number */}
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        boxShadow: [
                          '0 0 0 0 rgba(147, 51, 234, 0)',
                          '0 0 0 10px rgba(147, 51, 234, 0.3)',
                          '0 0 0 0 rgba(147, 51, 234, 0)'
                        ]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "loop",
                        delay: index * 0.5
                      }}
                      className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl flex items-center justify-center text-3xl font-bold text-gray-300 dark:text-gray-600 border-4 border-gray-200 dark:border-gray-700 shadow-lg z-20"
                    >
                      {step.number}
                    </motion.div>

                    {/* Icon with rotation */}
                    <div className="relative inline-block">
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        animate={{
                          rotate: [0, 5, -5, 0],
                          transition: {
                            duration: 3,
                            repeat: Infinity,
                            repeatType: "reverse",
                            delay: index * 0.3
                          }
                        }}
                        className={`inline-flex p-6 rounded-2xl bg-gradient-to-r ${step.gradient} mb-6 mt-4`}
                      >
                        <Icon className="text-white" size={36} />
                      </motion.div>
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Gradient border effect */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${step.gradient} rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10`}
                    />
                  </motion.div>

                  {/* Animated arrow for desktop */}
                  {index < steps.length - 1 && (
                    <motion.div
                      className="hidden lg:block absolute top-1/2 -right-12 transform -translate-y-1/2 z-10"
                      animate={{
                        x: [0, 15, 0],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.3
                      }}
                    >
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 48 48"
                        fill="none"
                        className="text-purple-500 dark:text-purple-400"
                      >
                        <path
                          d="M20 12L32 24L20 36"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default HowItWorks;
