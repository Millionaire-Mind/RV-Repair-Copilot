import React from 'react';
import { motion } from 'framer-motion';
import { 
  Wrench, 
  Zap, 
  Shield, 
  Users, 
  BookOpen, 
  Smartphone,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import SearchBar from '../components/SearchBar';
import AnswerCard from '../components/AnswerCard';
import CitationList from '../components/CitationList';

const Home: React.FC = () => {
  const features = [
    {
      icon: Zap,
      title: 'Instant AI Responses',
      description: 'Get expert repair guidance in seconds using our advanced AI technology.',
    },
    {
      icon: BookOpen,
      title: 'Comprehensive Manuals',
      description: 'Access thousands of RV service manuals and technical documents.',
    },
    {
      icon: Shield,
      title: 'Trusted Information',
      description: 'All content comes from verified OEM sources and certified technicians.',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Learn from experienced RV owners and professional mechanics.',
    },
    {
      icon: Smartphone,
      title: 'Mobile First',
      description: 'Optimized for use on any device, perfect for on-the-go repairs.',
    },
    {
      icon: Wrench,
      title: 'Step-by-Step Guides',
      description: 'Detailed instructions with safety warnings and tool requirements.',
    },
  ];

  const stats = [
    { label: 'RV Models Supported', value: '500+' },
    { label: 'Service Manuals', value: '10,000+' },
    { label: 'Happy Users', value: '50,000+' },
    { label: 'Repair Solutions', value: '100,000+' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              RV Repair Made
              <span className="block gradient-text">Simple & Smart</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Get instant, expert repair guidance powered by AI. Access service manuals, 
              troubleshooting guides, and step-by-step instructions for all RV components.
            </p>
          </motion.div>

          {/* Search Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto mb-12"
          >
            <SearchBar />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button className="btn-primary btn-lg group">
              Start Repairing
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            <button className="btn-outline btn-lg">
              Watch Demo
            </button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
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

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Why Choose RV Repair Copilot?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our AI-powered platform combines cutting-edge technology with decades of 
              RV repair expertise to provide you with the most accurate and helpful guidance.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Three simple steps to get expert repair guidance for your RV
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Ask Your Question',
                description: 'Describe your RV repair issue in plain English. Be as specific as possible for better results.',
                icon: '💬',
              },
              {
                step: '2',
                title: 'AI Analyzes & Searches',
                description: 'Our AI searches through thousands of service manuals and technical documents to find relevant solutions.',
                icon: '🔍',
              },
              {
                step: '3',
                title: 'Get Expert Guidance',
                description: 'Receive step-by-step repair instructions with safety warnings, tool requirements, and expert tips.',
                icon: '✅',
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                  {item.icon}
                </div>
                <div className="text-sm font-semibold text-primary-600 mb-2">
                  Step {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Example Response Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              See It In Action
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Here's an example of how our AI provides expert repair guidance
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Question: "How do I troubleshoot a Dometic refrigerator that's not cooling?"
              </h3>
              <AnswerCard
                answer="Here are the step-by-step troubleshooting steps for your Dometic refrigerator:

1. **Check Power Supply**
   - Ensure the RV is connected to shore power or generator
   - Verify the circuit breaker hasn't tripped
   - Check if the refrigerator is turned on

2. **Inspect Temperature Settings**
   - Set refrigerator to coldest setting
   - Allow 24 hours for temperature stabilization
   - Check if freezer is working properly

3. **Clean Condenser Coils**
   - Locate condenser coils (usually behind refrigerator)
   - Remove dust and debris with soft brush
   - Ensure proper airflow around coils

4. **Check Door Seals**
   - Inspect door gaskets for damage
   - Clean seals with mild soap and water
   - Ensure doors close completely

5. **Verify Gas Operation (if applicable)**
   - Check propane tank level
   - Ensure gas valve is open
   - Clean gas burner and orifice

6. **Professional Service**
   - If issues persist, contact authorized Dometic service center
   - Do not attempt repairs on sealed system components"
                sources={[
                  "Dometic Service Manual - Refrigerator Models",
                  "RV Repair Guide - Cooling Systems",
                  "Professional RV Technician Handbook"
                ]}
                metadata={{
                  question: "How do I troubleshoot a Dometic refrigerator that's not cooling?",
                  searchResults: 3,
                  processingTime: 2450,
                  modelUsed: "gpt-4-1106-preview"
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Fix Your RV?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Join thousands of RV owners who trust our AI-powered repair guidance. 
              Get started today and never be stranded with a broken RV again.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-white text-primary-600 hover:bg-gray-100 btn btn-lg font-semibold">
                Start Your First Repair
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-primary-600 btn btn-lg font-semibold transition-colors duration-200">
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;