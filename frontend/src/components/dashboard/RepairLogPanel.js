import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Edit3, Save, X, Download, Share2, Wrench, Calendar, User } from 'lucide-react';
const RepairLogPanel = ({ isExpanded, onToggleExpand }) => {
    const [editingNote, setEditingNote] = useState(null);
    const [noteText, setNoteText] = useState('');
    const [selectedEntry, setSelectedEntry] = useState(null);
    // Mock data - in real app this would come from API
    const repairLogs = [
        {
            id: '1',
            timestamp: '2024-01-15 14:30',
            question: 'Water pump not working - no pressure',
            answer: 'Check electrical connections, verify fuse, inspect pump motor...',
            rvInfo: { brand: 'Winnebago', model: 'View', year: '2023' },
            technicianNotes: 'Replaced fuse, tested pump operation. Working normally now.',
            status: 'completed',
            priority: 'high'
        },
        {
            id: '2',
            timestamp: '2024-01-15 11:15',
            question: 'AC not cooling properly',
            answer: 'Check refrigerant levels, clean condenser coils, verify thermostat...',
            rvInfo: { brand: 'Airstream', model: 'Interstate', year: '2022' },
            technicianNotes: 'Added refrigerant, cleaned coils. Temperature now at 68°F.',
            status: 'completed',
            priority: 'medium'
        },
        {
            id: '3',
            timestamp: '2024-01-15 09:45',
            question: 'Battery draining overnight',
            answer: 'Check for parasitic draws, inspect battery connections, test alternator...',
            rvInfo: { brand: 'Fleetwood', model: 'Bounder', year: '2021' },
            technicianNotes: 'Found parasitic draw from aftermarket stereo. Disconnected for now.',
            status: 'in-progress',
            priority: 'high'
        }
    ];
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
            case 'in-progress':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
            case 'pending':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
            case 'low':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };
    const startEditingNote = (entryId, currentNote) => {
        setEditingNote(entryId);
        setNoteText(currentNote);
    };
    const saveNote = (entryId) => {
        // In real app, this would save to backend
        console.log('Saving note for entry:', entryId, noteText);
        setEditingNote(null);
        setNoteText('');
    };
    const cancelEdit = () => {
        setEditingNote(null);
        setNoteText('');
    };
    const exportLog = () => {
        // In real app, this would generate and download PDF/text
        console.log('Exporting repair log');
    };
    const shareLog = () => {
        // In real app, this would share the log
        console.log('Sharing repair log');
    };
    if (!isExpanded) {
        return (_jsx("div", { className: "bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4", children: _jsxs("button", { onClick: onToggleExpand, className: "flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200", children: [_jsx(Clock, { className: "h-4 w-4" }), _jsxs("span", { children: ["Repair Log (", repairLogs.length, ")"] }), _jsx(motion.div, { animate: { rotate: 0 }, transition: { duration: 0.2 }, children: _jsx(Calendar, { className: "h-4 w-4" }) })] }) }));
    }
    return (_jsxs("div", { className: "bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700", children: [_jsx("div", { className: "p-4 border-b border-gray-200 dark:border-gray-700", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsxs("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2", children: [_jsx(Clock, { className: "h-5 w-5 text-primary-600" }), _jsx("span", { children: "Repair Log" })] }), _jsxs("span", { className: "text-sm text-gray-500 dark:text-gray-400", children: [repairLogs.length, " entries"] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs("button", { onClick: exportLog, className: "flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors duration-200", children: [_jsx(Download, { className: "h-4 w-4" }), _jsx("span", { children: "Export" })] }), _jsxs("button", { onClick: shareLog, className: "flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors duration-200", children: [_jsx(Share2, { className: "h-4 w-4" }), _jsx("span", { children: "Share" })] }), _jsx("button", { onClick: onToggleExpand, className: "p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200", children: _jsx(X, { className: "h-5 w-5" }) })] })] }) }), _jsx("div", { className: "max-h-96 overflow-y-auto", children: _jsx("div", { className: "divide-y divide-gray-200 dark:divide-gray-700", children: repairLogs.map((entry) => (_jsxs("div", { className: `p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer ${selectedEntry === entry.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`, onClick: () => setSelectedEntry(entry.id === selectedEntry ? null : entry.id), children: [_jsx("div", { className: "flex items-start justify-between mb-3", children: _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [_jsx("span", { className: "text-sm font-medium text-gray-900 dark:text-white", children: entry.timestamp }), _jsx("span", { className: `px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(entry.status)}`, children: entry.status.replace('-', ' ') }), _jsx("span", { className: `px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(entry.priority)}`, children: entry.priority })] }), _jsx("h4", { className: "text-sm font-medium text-gray-900 dark:text-white mb-1", children: entry.question }), _jsxs("div", { className: "flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400", children: [_jsxs("span", { className: "flex items-center space-x-1", children: [_jsx(Wrench, { className: "h-3 w-3" }), _jsxs("span", { children: [entry.rvInfo.brand, " ", entry.rvInfo.model] })] }), _jsxs("span", { className: "flex items-center space-x-1", children: [_jsx(Calendar, { className: "h-3 w-3" }), _jsx("span", { children: entry.rvInfo.year })] })] })] }) }), _jsx("div", { className: "mb-3", children: _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 line-clamp-2", children: entry.answer }) }), _jsx("div", { className: "border-t border-gray-200 dark:border-gray-700 pt-3", children: _jsx("div", { className: "flex items-start justify-between", children: _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [_jsx(User, { className: "h-4 w-4 text-gray-500" }), _jsx("span", { className: "text-xs font-medium text-gray-700 dark:text-gray-300", children: "Technician Notes" })] }), editingNote === entry.id ? (_jsxs("div", { className: "space-y-2", children: [_jsx("textarea", { value: noteText, onChange: (e) => setNoteText(e.target.value), className: "w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200", rows: 3, placeholder: "Add technician notes..." }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs("button", { onClick: () => saveNote(entry.id), className: "px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium rounded-md transition-colors duration-200 flex items-center space-x-1", children: [_jsx(Save, { className: "h-3 w-3" }), _jsx("span", { children: "Save" })] }), _jsxs("button", { onClick: cancelEdit, className: "px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-md transition-colors duration-200 flex items-center space-x-1", children: [_jsx(X, { className: "h-3 w-3" }), _jsx("span", { children: "Cancel" })] })] })] })) : (_jsxs("div", { className: "flex items-start justify-between", children: [_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 flex-1", children: entry.technicianNotes || 'No notes added yet.' }), _jsx("button", { onClick: (e) => {
                                                            e.stopPropagation();
                                                            startEditingNote(entry.id, entry.technicianNotes);
                                                        }, className: "p-1 text-gray-400 hover:text-primary-600 dark:text-gray-500 dark:hover:text-primary-400 transition-colors duration-200 ml-2", children: _jsx(Edit3, { className: "h-4 w-4" }) })] }))] }) }) })] }, entry.id))) }) })] }));
};
export default RepairLogPanel;
