import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Hero,
  Features,
  Explore as ExploreLanding,
  HowItWorks,
  YouTubeSection,
  Footer,
} from '../components/landing';
import { SignIn, SignUp } from '../components/auth';
import { fadeIn, staggerContainer} from '../utils/motionVariants';

const Landing = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    // Check if this is a Firebase auth action (password reset, email verification, etc.)
    const mode = searchParams.get('mode');
    const oobCode = searchParams.get('oobCode');

    if (mode === 'resetPassword' && oobCode) {
      // Redirect to reset password page with all parameters
      const params = new URLSearchParams(searchParams);
      navigate(`/reset-password?${params.toString()}`, { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <>
      {/* Main landing content with animations */}
      <motion.main
        initial="hidden"
        animate="show"
        viewport={{ once: true, amount: 0.25 }}
        variants={staggerContainer}
        className="min-h-screen w-full overflow-hidden"
      >
        {/* Hero Section */}
        <motion.section variants={fadeIn('up', 'tween', 0.1, 0.7)}>
          <Hero />
        </motion.section>

        {/* Features Section */}
        <motion.section
          variants={fadeIn('up', 'tween', 0.2, 0.7)}
          className="py-16 md:py-24"
        >
          <Features onOpenSignIn={() => setShowSignIn(true)} />
        </motion.section>

        {/* Explore Section */}
        <motion.section
          variants={fadeIn('up', 'tween', 0.3, 0.7)}
          className="py-16 md:py-24"
        >
          <ExploreLanding />
        </motion.section>

        {/* How It Works Section */}
        <motion.section
          variants={fadeIn('up', 'tween', 0.4, 0.7)}
          className="py-16 md:py-24"
        >
          <HowItWorks />
        </motion.section>

        {/* YouTube Section */}
        <motion.section
          variants={fadeIn('up', 'tween', 0.5, 0.7)}
          className="py-16 md:py-24"
        >
          <YouTubeSection />
        </motion.section>

        {/* Footer */}
        <motion.section variants={fadeIn('up', 'tween', 0.6, 0.7)}>
          <Footer onOpenSignIn={() => setShowSignIn(true)} />
        </motion.section>
      </motion.main>

      {/* Auth Modals (outside animation container) */}
      {showSignIn && (
        <SignIn
          onClose={() => setShowSignIn(false)}
          onSwitchToSignUp={() => {
            setShowSignIn(false);
            setShowSignUp(true);
          }}
        />
      )}

      {showSignUp && (
        <SignUp
          onClose={() => setShowSignUp(false)}
          onSwitchToSignIn={() => {
            setShowSignUp(false);
            setShowSignIn(true);
          }}
        />
      )}
    </>
  );
};

export default Landing;
