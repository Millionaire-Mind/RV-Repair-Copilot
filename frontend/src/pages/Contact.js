import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, MessageCircle, Send, CheckCircle, AlertCircle } from 'lucide-react';
const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: 'general'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState('idle');
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            // Reset form
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: '',
                type: 'general'
            });
            setSubmitStatus('success');
            setTimeout(() => setSubmitStatus('idle'), 5000);
        }
        catch (error) {
            setSubmitStatus('error');
            setTimeout(() => setSubmitStatus('idle'), 5000);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const contactInfo = [
        {
            icon: Mail,
            title: 'Email Support',
            value: 'support@rvrepaircopilot.com',
            description: 'Get help with technical issues or questions',
            color: 'text-blue-600 dark:text-blue-400'
        },
        {
            icon: Phone,
            title: 'Phone Support',
            value: '+1 (555) 123-4567',
            description: 'Speak directly with our support team',
            color: 'text-green-600 dark:text-green-400'
        },
        {
            icon: MapPin,
            title: 'Office Location',
            value: '123 Tech Street, Innovation City, IC 12345',
            description: 'Visit our headquarters for in-person support',
            color: 'text-purple-600 dark:text-purple-400'
        },
        {
            icon: Clock,
            title: 'Support Hours',
            value: 'Mon-Fri: 9AM-6PM EST',
            description: 'We\'re here when you need us',
            color: 'text-orange-600 dark:text-orange-400'
        }
    ];
    const supportTopics = [
        {
            title: 'Technical Support',
            description: 'Help with platform usage, API integration, or technical issues',
            icon: MessageCircle,
            color: 'text-blue-600 dark:text-blue-400'
        },
        {
            title: 'Account & Billing',
            description: 'Questions about your account, subscription, or billing',
            icon: MessageCircle,
            color: 'text-green-600 dark:text-green-400'
        },
        {
            title: 'Feature Requests',
            description: 'Suggest new features or improvements to the platform',
            icon: MessageCircle,
            color: 'text-purple-600 dark:text-purple-400'
        },
        {
            title: 'Partnership Inquiries',
            description: 'Business partnerships, integrations, or enterprise solutions',
            icon: MessageCircle,
            color: 'text-orange-600 dark:text-orange-400'
        }
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
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-background via-background to-gray-50 dark:to-gray-900", children: [_jsx("section", { className: "relative py-20 px-4 sm:px-6 lg:px-8", children: _jsx("div", { className: "max-w-7xl mx-auto", children: _jsxs(motion.div, { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 }, className: "text-center", children: [_jsxs("h1", { className: "text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6", children: ["Get in", ' ', _jsx("span", { className: "bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent", children: "Touch" })] }), _jsx("p", { className: "text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed", children: "Have questions, need support, or want to learn more? We're here to help you get the most out of RV Repair Copilot." })] }) }) }), _jsx("section", { className: "py-16 px-4 sm:px-6 lg:px-8", children: _jsx("div", { className: "max-w-7xl mx-auto", children: _jsx(motion.div, { variants: containerVariants, initial: "hidden", whileInView: "visible", viewport: { once: true }, className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8", children: contactInfo.map((info, index) => (_jsxs(motion.div, { variants: itemVariants, className: "bg-white dark:bg-gray-800 rounded-xl p-6 shadow-soft border border-gray-200 dark:border-gray-700 text-center hover:shadow-lg transition-all duration-300", children: [_jsx("div", { className: `${info.color} mb-4 flex justify-center`, children: _jsx(info.icon, { className: "h-12 w-12" }) }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-2", children: info.title }), _jsx("p", { className: "text-primary-600 dark:text-primary-400 font-medium mb-2", children: info.value }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: info.description })] }, index))) }) }) }), _jsx("section", { className: "py-16 px-4 sm:px-6 lg:px-8", children: _jsx("div", { className: "max-w-7xl mx-auto", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-16", children: [_jsx(motion.div, { initial: { opacity: 0, x: -30 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true }, transition: { duration: 0.8 }, children: _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-xl p-8 shadow-soft border border-gray-200 dark:border-gray-700", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-6", children: "Send us a Message" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "name", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Full Name *" }), _jsx("input", { type: "text", id: "name", name: "name", value: formData.name, onChange: handleInputChange, required: true, className: "input w-full", placeholder: "Your full name" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Email Address *" }), _jsx("input", { type: "email", id: "email", name: "email", value: formData.email, onChange: handleInputChange, required: true, className: "input w-full", placeholder: "your.email@example.com" })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "type", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Inquiry Type *" }), _jsxs("select", { id: "type", name: "type", value: formData.type, onChange: handleInputChange, required: true, className: "input w-full", children: [_jsx("option", { value: "general", children: "General Inquiry" }), _jsx("option", { value: "support", children: "Technical Support" }), _jsx("option", { value: "feedback", children: "Feedback & Suggestions" }), _jsx("option", { value: "partnership", children: "Partnership & Business" })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "subject", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Subject *" }), _jsx("input", { type: "text", id: "subject", name: "subject", value: formData.subject, onChange: handleInputChange, required: true, className: "input w-full", placeholder: "Brief description of your inquiry" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "message", className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Message *" }), _jsx("textarea", { id: "message", name: "message", value: formData.message, onChange: handleInputChange, required: true, rows: 6, className: "input w-full resize-none", placeholder: "Please provide detailed information about your inquiry..." })] }), submitStatus === 'success' && (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, className: "flex items-center space-x-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg", children: [_jsx(CheckCircle, { className: "h-5 w-5 text-green-600 dark:text-green-400" }), _jsx("span", { className: "text-green-800 dark:text-green-200", children: "Thank you! Your message has been sent successfully." })] })), submitStatus === 'error' && (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, className: "flex items-center space-x-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg", children: [_jsx(AlertCircle, { className: "h-5 w-5 text-red-600 dark:text-red-400" }), _jsx("span", { className: "text-red-800 dark:text-red-200", children: "Something went wrong. Please try again or contact us directly." })] })), _jsx("button", { type: "submit", disabled: isSubmitting, className: "btn btn-primary btn-lg w-full flex items-center justify-center space-x-2", children: isSubmitting ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "animate-spin rounded-full h-5 w-5 border-b-2 border-white" }), _jsx("span", { children: "Sending..." })] })) : (_jsxs(_Fragment, { children: [_jsx(Send, { className: "h-5 w-5" }), _jsx("span", { children: "Send Message" })] })) })] })] }) }), _jsxs(motion.div, { initial: { opacity: 0, x: 30 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true }, transition: { duration: 0.8 }, className: "space-y-8", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-6", children: "How Can We Help?" }), _jsx("div", { className: "space-y-4", children: supportTopics.map((topic, index) => (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, delay: index * 0.1 }, className: "bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300", children: _jsxs("div", { className: "flex items-start space-x-3", children: [_jsx("div", { className: `${topic.color} mt-1`, children: _jsx(topic.icon, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900 dark:text-white mb-1", children: topic.title }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: topic.description })] })] }) }, index))) })] }), _jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-6", children: "Frequently Asked Questions" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700", children: [_jsx("h3", { className: "font-semibold text-gray-900 dark:text-white mb-2", children: "How accurate are the AI-generated repair instructions?" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Our AI is trained on verified OEM service manuals and technical documentation, ensuring high accuracy. However, always follow safety protocols and consult professionals for complex repairs." })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700", children: [_jsx("h3", { className: "font-semibold text-gray-900 dark:text-white mb-2", children: "What RV brands do you support?" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "We support 50+ major RV brands including Airstream, Winnebago, Fleetwood, Thor, Forest River, and many more. Our database is continuously expanding." })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700", children: [_jsx("h3", { className: "font-semibold text-gray-900 dark:text-white mb-2", children: "Can I upload my own service manuals?" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Currently, we only support our curated database of verified sources. This ensures quality and accuracy. Contact us if you have specific documentation needs." })] })] }), _jsx("div", { className: "mt-6 text-center", children: _jsx("button", { className: "btn btn-secondary", children: "View All FAQs" }) })] })] })] }) }) }), _jsx("section", { className: "py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800", children: _jsx("div", { className: "max-w-4xl mx-auto text-center", children: _jsxs(motion.div, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.8 }, children: [_jsx("h2", { className: "text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6", children: "Still Have Questions?" }), _jsx("p", { className: "text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto", children: "Our support team is here to help you get the most out of RV Repair Copilot. Don't hesitate to reach out!" }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [_jsx("button", { className: "btn btn-primary btn-lg", children: "Contact Support" }), _jsx("button", { className: "btn btn-secondary btn-lg", children: "Schedule a Demo" })] })] }) }) })] }));
};
export default Contact;
