import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
// Page transition variants
const pageVariants = {
    initial: {
        opacity: 0,
        y: 20,
    },
    in: {
        opacity: 1,
        y: 0,
    },
    out: {
        opacity: 0,
        y: -20,
    },
};
const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4,
};
function AppContent() {
    const location = useLocation();
    return (_jsxs("div", { className: "min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col", children: [!location.pathname.startsWith('/dashboard') && _jsx(Header, {}), _jsx("main", { className: "flex-1", children: _jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.div, { initial: "initial", animate: "in", exit: "out", variants: pageVariants, transition: pageTransition, className: "min-h-full", children: _jsxs(Routes, { location: location, children: [_jsx(Route, { path: "/", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "/home", element: _jsx(Home, {}) }), _jsx(Route, { path: "/about", element: _jsx(About, {}) }), _jsx(Route, { path: "/contact", element: _jsx(Contact, {}) }), _jsx(Route, { path: "*", element: _jsx(NotFound, {}) })] }) }, location.pathname) }) }), !location.pathname.startsWith('/dashboard') && _jsx(Footer, {})] }));
}
function App() {
    return _jsx(AppContent, {});
}
export default App;
