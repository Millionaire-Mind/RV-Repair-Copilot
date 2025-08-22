import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { BookOpen, Search, Pin, PinOff, ChevronLeft, ChevronRight, Filter, Download } from 'lucide-react';
const ManualsSidebar = ({ isCollapsed, onToggleCollapse }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedBrand, setSelectedBrand] = useState('all');
    // Mock data - in real app this would come from API
    const manuals = [
        {
            id: '1',
            title: 'Winnebago View Service Manual',
            brand: 'Winnebago',
            model: 'View',
            year: '2023',
            type: 'Class C',
            category: 'Electrical',
            isPinned: true,
            lastAccessed: '2 hours ago',
            size: '15.2 MB'
        },
        {
            id: '2',
            title: 'Airstream Interstate Manual',
            brand: 'Airstream',
            model: 'Interstate',
            year: '2022',
            type: 'Class B',
            category: 'Plumbing',
            isPinned: true,
            lastAccessed: '1 day ago',
            size: '12.8 MB'
        },
        {
            id: '3',
            title: 'Fleetwood Bounder Guide',
            brand: 'Fleetwood',
            model: 'Bounder',
            year: '2021',
            type: 'Class A',
            category: 'Mechanical',
            isPinned: false,
            lastAccessed: '3 days ago',
            size: '18.5 MB'
        }
    ];
    const categories = ['all', 'Electrical', 'Plumbing', 'Mechanical', 'HVAC', 'Safety'];
    const brands = ['all', 'Winnebago', 'Airstream', 'Fleetwood', 'Thor', 'Forest River'];
    const filteredManuals = manuals.filter(manual => {
        const matchesSearch = manual.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            manual.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
            manual.model.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || manual.category === selectedCategory;
        const matchesBrand = selectedBrand === 'all' || manual.brand === selectedBrand;
        return matchesSearch && matchesCategory && matchesBrand;
    });
    const togglePin = (manualId) => {
        // In real app, this would update the backend
        console.log('Toggle pin for manual:', manualId);
    };
    const openManual = (manualId) => {
        // In real app, this would open the manual
        console.log('Open manual:', manualId);
    };
    if (isCollapsed) {
        return (_jsxs("div", { className: "bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-4", children: [_jsx("button", { onClick: onToggleCollapse, className: "p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200", "aria-label": "Expand sidebar", children: _jsx(ChevronRight, { className: "h-5 w-5" }) }), _jsxs("div", { className: "mt-4 space-y-3", children: [_jsx("button", { className: "p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200", children: _jsx(BookOpen, { className: "h-5 w-5" }) }), _jsx("button", { className: "p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200", children: _jsx(Pin, { className: "h-5 w-5" }) })] })] }));
    }
    return (_jsxs("div", { className: "bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-80 flex flex-col", children: [_jsxs("div", { className: "p-4 border-b border-gray-200 dark:border-gray-700", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsxs("h2", { className: "text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2", children: [_jsx(BookOpen, { className: "h-5 w-5 text-primary-600" }), _jsx("span", { children: "Manuals & KB" })] }), _jsx("button", { onClick: onToggleCollapse, className: "p-1 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200", "aria-label": "Collapse sidebar", children: _jsx(ChevronLeft, { className: "h-5 w-5" }) })] }), _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }), _jsx("input", { type: "text", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), placeholder: "Search manuals...", className: "w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200" })] })] }), _jsxs("div", { className: "p-4 border-b border-gray-200 dark:border-gray-700 space-y-3", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Filter, { className: "h-4 w-4 text-gray-500" }), _jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Filters" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("select", { value: selectedCategory, onChange: (e) => setSelectedCategory(e.target.value), className: "w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200", children: categories.map(category => (_jsx("option", { value: category, children: category === 'all' ? 'All Categories' : category }, category))) }), _jsx("select", { value: selectedBrand, onChange: (e) => setSelectedBrand(e.target.value), className: "w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200", children: brands.map(brand => (_jsx("option", { value: brand, children: brand === 'all' ? 'All Brands' : brand }, brand))) })] })] }), _jsxs("div", { className: "p-4 border-b border-gray-200 dark:border-gray-700", children: [_jsxs("h3", { className: "text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center space-x-2", children: [_jsx(Pin, { className: "h-4 w-4 text-yellow-500" }), _jsx("span", { children: "Pinned Manuals" })] }), _jsx("div", { className: "space-y-2", children: manuals.filter(m => m.isPinned).map(manual => (_jsx("div", { className: "p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors duration-200 cursor-pointer", onClick: () => openManual(manual.id), children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h4", { className: "text-sm font-medium text-gray-900 dark:text-white truncate", children: manual.title }), _jsxs("p", { className: "text-xs text-gray-600 dark:text-gray-400 mt-1", children: [manual.brand, " ", manual.model, " \u2022 ", manual.year] }), _jsxs("p", { className: "text-xs text-gray-500 dark:text-gray-500 mt-1", children: [manual.category, " \u2022 ", manual.size] })] }), _jsx("button", { onClick: (e) => {
                                            e.stopPropagation();
                                            togglePin(manual.id);
                                        }, className: "p-1 text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300 transition-colors duration-200", children: _jsx(Pin, { className: "h-4 w-4" }) })] }) }, manual.id))) })] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-4", children: [_jsxs("h3", { className: "text-sm font-medium text-gray-900 dark:text-white mb-3", children: ["All Manuals (", filteredManuals.length, ")"] }), _jsx("div", { className: "space-y-2", children: filteredManuals.map(manual => (_jsx("div", { className: "p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer", onClick: () => openManual(manual.id), children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h4", { className: "text-sm font-medium text-gray-900 dark:text-white truncate", children: manual.title }), _jsxs("p", { className: "text-xs text-gray-600 dark:text-gray-400 mt-1", children: [manual.brand, " ", manual.model, " \u2022 ", manual.year] }), _jsxs("div", { className: "flex items-center space-x-2 mt-2", children: [_jsx("span", { className: "text-xs text-gray-500 dark:text-gray-500", children: manual.lastAccessed }), _jsx("span", { className: "text-xs text-gray-500 dark:text-gray-500", children: manual.size })] })] }), _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx("button", { onClick: (e) => {
                                                    e.stopPropagation();
                                                    togglePin(manual.id);
                                                }, className: "p-1 text-gray-400 hover:text-yellow-600 dark:text-gray-500 dark:hover:text-yellow-400 transition-colors duration-200", children: manual.isPinned ? (_jsx(Pin, { className: "h-4 w-4 text-yellow-500" })) : (_jsx(PinOff, { className: "h-4 w-4" })) }), _jsx("button", { onClick: (e) => {
                                                    e.stopPropagation();
                                                    // Download action
                                                }, className: "p-1 text-gray-400 hover:text-primary-600 dark:text-gray-500 dark:hover:text-primary-400 transition-colors duration-200", children: _jsx(Download, { className: "h-4 w-4" }) })] })] }) }, manual.id))) })] })] }));
};
export default ManualsSidebar;
