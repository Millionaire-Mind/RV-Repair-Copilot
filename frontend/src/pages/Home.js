import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { Wrench, Zap, Shield, Users, BookOpen, Smartphone, ArrowRight } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import AnswerCard from '../components/AnswerCard';
const Home = () => {
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
    return (_jsxs("div", { className: "min-h-screen", children: [_jsxs("section", { className: "relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 lg:py-32 overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-grid-pattern opacity-5" }), _jsxs("div", { className: "relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 }, className: "mb-8", children: [_jsxs("h1", { className: "text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6", children: ["RV Repair Made", _jsx("span", { className: "block gradient-text", children: "Simple & Smart" })] }), _jsx("p", { className: "text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8", children: "Get instant, expert repair guidance powered by AI. Access service manuals, troubleshooting guides, and step-by-step instructions for all RV components." })] }), _jsx(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.8, delay: 0.2 }, className: "max-w-4xl mx-auto mb-12", children: _jsx(SearchBar, {}) }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: 0.4 }, className: "flex flex-col sm:flex-row gap-4 justify-center items-center", children: [_jsxs("button", { className: "btn-primary btn-lg group", children: ["Start Repairing", _jsx(ArrowRight, { className: "ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" })] }), _jsx("button", { className: "btn-outline btn-lg", children: "Watch Demo" })] })] })] }), _jsx("section", { className: "py-16 bg-white dark:bg-gray-800", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsx(motion.div, { variants: containerVariants, initial: "hidden", whileInView: "visible", viewport: { once: true }, className: "grid grid-cols-2 md:grid-cols-4 gap-8", children: stats.map((stat, index) => (_jsxs(motion.div, { variants: itemVariants, className: "text-center", children: [_jsx("div", { className: "text-3xl md:text-4xl font-bold text-primary-600 mb-2", children: stat.value }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: stat.label })] }, stat.label))) }) }) }), _jsx("section", { className: "py-20 bg-gray-50 dark:bg-gray-900", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.8 }, className: "text-center mb-16", children: [_jsx("h2", { className: "text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6", children: "Why Choose RV Repair Copilot?" }), _jsx("p", { className: "text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto", children: "Our AI-powered platform combines cutting-edge technology with decades of RV repair expertise to provide you with the most accurate and helpful guidance." })] }), _jsx(motion.div, { variants: containerVariants, initial: "hidden", whileInView: "visible", viewport: { once: true }, className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: features.map((feature, index) => (_jsxs(motion.div, { variants: itemVariants, className: "bg-white dark:bg-gray-800 p-8 rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1", children: [_jsx("div", { className: "w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center mb-6", children: _jsx(feature.icon, { className: "h-6 w-6 text-primary-600" }) }), _jsx("h3", { className: "text-xl font-semibold text-gray-900 dark:text-white mb-4", children: feature.title }), _jsx("p", { className: "text-gray-600 dark:text-gray-300", children: feature.description })] }, feature.title))) })] }) }), _jsx("section", { className: "py-20 bg-white dark:bg-gray-800", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.8 }, className: "text-center mb-16", children: [_jsx("h2", { className: "text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6", children: "How It Works" }), _jsx("p", { className: "text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto", children: "Three simple steps to get expert repair guidance for your RV" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: [
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
                            ].map((item, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.8, delay: index * 0.2 }, className: "text-center", children: [_jsx("div", { className: "w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl", children: item.icon }), _jsxs("div", { className: "text-sm font-semibold text-primary-600 mb-2", children: ["Step ", item.step] }), _jsx("h3", { className: "text-xl font-semibold text-gray-900 dark:text-white mb-4", children: item.title }), _jsx("p", { className: "text-gray-600 dark:text-gray-300", children: item.description })] }, item.step))) })] }) }), _jsx("section", { className: "py-20 bg-gray-50 dark:bg-gray-900", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.8 }, className: "text-center mb-16", children: [_jsx("h2", { className: "text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6", children: "See It In Action" }), _jsx("p", { className: "text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto", children: "Here's an example of how our AI provides expert repair guidance" })] }), _jsx("div", { className: "max-w-4xl mx-auto", children: _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl shadow-soft p-6 mb-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-4", children: "Question: \"How do I troubleshoot a Dometic refrigerator that's not cooling?\"" }), _jsx(AnswerCard, { answer: "Here are the step-by-step troubleshooting steps for your Dometic refrigerator:\n\n1. **Check Power Supply**\n   - Ensure the RV is connected to shore power or generator\n   - Verify the circuit breaker hasn't tripped\n   - Check if the refrigerator is turned on\n\n2. **Inspect Temperature Settings**\n   - Set refrigerator to coldest setting\n   - Allow 24 hours for temperature stabilization\n   - Check if freezer is working properly\n\n3. **Clean Condenser Coils**\n   - Locate condenser coils (usually behind refrigerator)\n   - Remove dust and debris with soft brush\n   - Ensure proper airflow around coils\n\n4. **Check Door Seals**\n   - Inspect door gaskets for damage\n   - Clean seals with mild soap and water\n   - Ensure doors close completely\n\n5. **Verify Gas Operation (if applicable)**\n   - Check propane tank level\n   - Ensure gas valve is open\n   - Clean gas burner and orifice\n\n6. **Professional Service**\n   - If issues persist, contact authorized Dometic service center\n   - Do not attempt repairs on sealed system components", sources: [
                                            "Dometic Service Manual - Refrigerator Models",
                                            "RV Repair Guide - Cooling Systems",
                                            "Professional RV Technician Handbook"
                                        ], metadata: {
                                            question: "How do I troubleshoot a Dometic refrigerator that's not cooling?",
                                            searchResults: 3,
                                            processingTime: 2450,
                                            modelUsed: "gpt-4-1106-preview"
                                        } })] }) })] }) }), _jsx("section", { className: "py-20 bg-primary-600 text-white", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center", children: _jsxs(motion.div, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.8 }, children: [_jsx("h2", { className: "text-3xl md:text-4xl lg:text-5xl font-bold mb-6", children: "Ready to Fix Your RV?" }), _jsx("p", { className: "text-xl text-primary-100 mb-8 max-w-3xl mx-auto", children: "Join thousands of RV owners who trust our AI-powered repair guidance. Get started today and never be stranded with a broken RV again." }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center items-center", children: [_jsx("button", { className: "bg-white text-primary-600 hover:bg-gray-100 btn btn-lg font-semibold", children: "Start Your First Repair" }), _jsx("button", { className: "border-2 border-white text-white hover:bg-white hover:text-primary-600 btn btn-lg font-semibold transition-colors duration-200", children: "Learn More" })] })] }) }) })] }));
};
export default Home;
