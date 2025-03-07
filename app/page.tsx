'use client';

import { usePrivy } from '@privy-io/react-auth';
import { FaLock, FaTrophy, FaMapMarkerAlt, FaChartBar, FaTwitter, FaDiscord, FaQuoteLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';
import ThemeToggle from './components/ThemeToggle';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 dark:from-zinc-900 dark:to-zinc-800">
      <ThemeToggle />
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-700 to-brown-600 dark:from-amber-500 dark:to-amber-300 text-transparent bg-clip-text">
            Track Your Shits. Earn Rewards. Embrace the Blockchain.
          </h1>
          <p className="text-lg md:text-xl mb-8 text-zinc-700 dark:text-zinc-300">
            A decentralized way to document your bathroom adventures and earn NFT achievements.
          </p>
          <LoginButton />
        </div>

        {/* How It Works Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="bg-white dark:bg-zinc-800 rounded-lg p-6 shadow-lg">
                <div className="text-2xl font-bold mb-2 text-amber-600 dark:text-amber-500">
                  Step {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Highlights Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-24"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Feature Highlights</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white dark:bg-zinc-800 rounded-lg p-6 shadow-lg"
              >
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="flex items-center justify-center w-12 h-12 mb-4 
                            bg-amber-100 dark:bg-amber-900 rounded-full"
                >
                  <feature.icon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-24"
        >
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white dark:bg-zinc-800 rounded-lg p-6 shadow-lg relative"
              >
                <FaQuoteLeft className="text-amber-200 dark:text-amber-900 text-4xl absolute top-4 left-4 opacity-50" />
                <div className="pt-8">
                  <p className="text-zinc-600 dark:text-zinc-400 italic mb-4">
                    {testimonial.quote}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-200 dark:bg-amber-900 rounded-full flex items-center justify-center">
                      <span className="font-bold text-amber-800 dark:text-amber-200">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">{testimonial.title}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Footer Section */}
        <footer className="mt-24 border-t border-zinc-200 dark:border-zinc-700 pt-12 pb-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <h3 className="font-semibold mb-4 text-lg">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <motion.li 
                    key={index}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <a 
                      href={link.href} 
                      className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-lg">Connect With Us</h3>
              <div className="flex gap-4">
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors"
                >
                  <FaTwitter className="text-amber-600 dark:text-amber-400" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  href="https://discord.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors"
                >
                  <FaDiscord className="text-amber-600 dark:text-amber-400" />
                </motion.a>
              </div>
            </div>
            <div className="flex flex-col justify-between">
              <p className="text-sm text-zinc-600 dark:text-zinc-400 italic">
                &quot;Built with love and a little bit of sh*t.&quot;
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-4">
                © {new Date().getFullYear()} ShitTracker. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

const steps = [
  {
    title: "Log Your Shit",
    description: "Record your sessions and sign them on-chain."
  },
  {
    title: "Earn Achievements",
    description: "Unlock NFT badges for your dedication."
  },
  {
    title: "Climb the Leaderboard",
    description: "Compete weekly and monthly for ultimate bragging rights."
  },
  {
    title: "Get Rewarded",
    description: "Earn custom tokens for every session."
  }
];

const features = [
  {
    icon: FaLock,
    title: "On-Chain Shit Sessions",
    description: "Immutable records of your activity stored securely on the blockchain."
  },
  {
    icon: FaTrophy,
    title: "Achievement NFTs",
    description: "Unique digital trophies for every milestone you reach."
  },
  {
    icon: FaMapMarkerAlt,
    title: "Geo-Stamped Logs",
    description: "Optionally mark and track your shitting locations."
  },
  {
    icon: FaChartBar,
    title: "Community Leaderboard",
    description: "See how you rank among fellow shitters in real-time."
  }
];

const testimonials = [
  {
    quote: "Finally, a blockchain app that truly understands my daily routine. The NFT achievements make every visit memorable!",
    name: "Anonymous Alpha",
    title: "Power User"
  },
  {
    quote: "I've earned more sitting on the throne than I ever did trading crypto. This is the future!",
    name: "Crypto Chad",
    title: "Early Adopter"
  },
  {
    quote: "The geo-stamping feature has turned my world travels into a unique collection of achievements.",
    name: "Digital Nomad",
    title: "Globe Trotter"
  }
];

const quickLinks = [
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" }
];

function LoginButton() {
  const { ready, authenticated, login } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && authenticated) {
      router.push('/dashboard');
    }
  }, [ready, authenticated, router]);

  return (
    <button
      onClick={login}
      disabled={!ready}
      className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-full 
                font-semibold text-lg transition-all transform hover:scale-105
                disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg"
    >
      Connect Wallet
    </button>
  );
}
