import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Search, 
  BookOpen, 
  Shield, 
  Zap, 
  Users, 
  TrendingUp,
  CheckCircle,
  Star,
  Award,
  Lightbulb,
  Cog
} from 'lucide-react';

const About: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Intelligence',
      description: 'Advanced GPT-4 technology provides accurate, contextual repair guidance based on your specific RV model and issue.',
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: Search,
      title: 'Smart Search & Retrieval',
      description: 'Vector-based search finds the most relevant repair information from thousands of service manuals and technical documents.',
      color: 'text-green-600 dark:text-green-400'
    },
    {
      icon: BookOpen,
      title: 'Comprehensive Knowledge Base',
      description: 'Access to OEM service manuals, technical specifications, and expert repair procedures for all major RV brands.',
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      icon: Shield,
      title: 'Trusted Information',
      description: 'All sources are verified and from reputable manufacturers, ensuring you get accurate, safe repair guidance.',
      color: 'text-red-600 dark:text-red-400'
    },
    {
      icon: Zap,
      title: 'Instant Answers',
      description: 'Get step-by-step repair instructions in seconds, not hours of manual searching through documentation.',
      color: 'text-yellow-600 dark:text-yellow-400'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Built by RV technicians and enthusiasts, continuously improved with real-world feedback and use cases.',
      color: 'text-indigo-600 dark:text-indigo-400'
    }
  ];

  const stats = [
    { label: 'RV Brands Supported', value: '50+', icon: TrendingUp },
    { label: 'Service Manuals', value: '10,000+', icon: BookOpen },
    { label: 'Repair Procedures', value: '100,000+', icon: Cog },
    { label: 'Happy Users', value: '5,000+', icon: Users }
  ];

  const benefits = [
    'Save hours of manual research time',
    'Reduce repair costs with accurate guidance',
    'Access professional-grade technical information',
    'Get instant answers to complex repair questions',
    'Learn from verified OEM documentation',
    'Improve repair success rates',
    'Stay updated with latest technical information',
    'Reduce dependency on expensive service calls'
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-gray-50 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              About{' '}
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                RV Repair Copilot
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Revolutionizing RV repair with AI-powered intelligence, comprehensive knowledge, and instant access to professional-grade technical guidance.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              To democratize access to professional RV repair knowledge by leveraging cutting-edge AI technology, 
              making complex technical information accessible, understandable, and actionable for RV owners and technicians worldwide.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-soft border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
              >
                <div className={`${feature.color} mb-4`}>
                  <feature.icon className="h-12 w-12" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Platform Statistics
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Trusted by thousands of RV enthusiasts and professionals
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <div className="text-primary-600 dark:text-primary-400 mb-3 flex justify-center">
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose RV Repair Copilot?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Experience the future of RV repair with our comprehensive AI-powered platform
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex items-start space-x-3"
              >
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powered by Advanced Technology
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Built on cutting-edge AI and machine learning technologies for the best possible user experience
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div
              variants={itemVariants}
              className="text-center p-6"
            >
              <div className="text-blue-600 dark:text-blue-400 mb-4">
                <Brain className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                OpenAI GPT-4
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                State-of-the-art language model for understanding complex repair queries and generating accurate responses.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="text-center p-6"
            >
              <div className="text-green-600 dark:text-green-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Vector Search
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Pinecone vector database for semantic search across thousands of technical documents and manuals.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="text-center p-6"
            >
              <div className="text-purple-600 dark:text-purple-400 mb-4">
                <Lightbulb className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Smart Processing
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Advanced text processing and chunking algorithms for optimal information retrieval and context understanding.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to Transform Your RV Repair Experience?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of RV owners and technicians who are already saving time and money with AI-powered repair guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-primary btn-lg">
                Start Searching Now
              </button>
              <button className="btn btn-secondary btn-lg">
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;