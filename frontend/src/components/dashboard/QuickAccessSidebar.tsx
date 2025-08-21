import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Package, 
  CheckSquare, 
  AlertTriangle, 
  Wrench,
  Zap,
  Droplets
} from 'lucide-react';

interface QuickAccessSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface SafetyAlert {
  id: string;
  type: 'recall' | 'warning' | 'info';
  title: string;
  description: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
}

const QuickAccessSidebar: React.FC<QuickAccessSidebarProps> = ({ 
  isCollapsed, 
  onToggleCollapse 
}) => {
  const [activeTab, setActiveTab] = useState<'parts' | 'checklists' | 'alerts'>('parts');

  // Mock data - in real app this would come from API
  const safetyAlerts: SafetyAlert[] = [
    {
      id: '1',
      type: 'recall',
      title: 'Propane System Safety Recall',
      description: 'Voluntary recall for 2022-2023 models due to potential gas leak risk.',
      date: '2024-01-10',
      priority: 'high'
    },
    {
      id: '2',
      type: 'warning',
      title: 'Battery Terminal Corrosion',
      description: 'Increased reports of battery terminal corrosion in humid climates.',
      date: '2024-01-08',
      priority: 'medium'
    },
    {
      id: '3',
      type: 'info',
      title: 'Winter Storage Guidelines',
      description: 'Updated guidelines for winter storage and maintenance.',
      date: '2024-01-05',
      priority: 'low'
    }
  ];

  const commonChecklists = [
    {
      title: 'Pre-Trip Inspection',
      items: [
        'Tire pressure and condition',
        'Fluid levels (oil, coolant, brake)',
        'Battery connections',
        'Propane system check',
        'Electrical systems test'
      ]
    },
    {
      title: 'Monthly Maintenance',
      items: [
        'Check all seals and gaskets',
        'Inspect slide-out mechanisms',
        'Test smoke and CO detectors',
        'Clean AC filters',
        'Check water system for leaks'
      ]
    },
    {
      title: 'Seasonal Preparation',
      items: [
        'Winterize water systems',
        'Check heating systems',
        'Inspect roof and seals',
        'Test generator',
        'Update emergency kit'
      ]
    }
  ];

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case 'recall':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <AlertTriangle className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20';
      case 'low':
        return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20';
      default:
        return 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/20';
    }
  };

  if (isCollapsed) {
    return (
      <div className="bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col items-center py-4">
        <button
          onClick={onToggleCollapse}
          className="p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200"
          aria-label="Expand sidebar"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        <div className="mt-4 space-y-3">
          <button className="p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200">
            <Package className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200">
            <CheckSquare className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200">
            <AlertTriangle className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 w-80 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <Wrench className="h-5 w-5 text-primary-600" />
            <span>Quick Access</span>
          </h2>
          <button
            onClick={onToggleCollapse}
            className="p-1 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200"
            aria-label="Collapse sidebar"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('parts')}
            className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-all duration-200 ${
              activeTab === 'parts'
                ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Package className="h-4 w-4 mx-auto mb-1" />
            Parts
          </button>
          <button
            onClick={() => setActiveTab('checklists')}
            className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-all duration-200 ${
              activeTab === 'checklists'
                ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <CheckSquare className="h-4 w-4 mx-auto mb-1" />
            Checklists
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-all duration-200 ${
              activeTab === 'alerts'
                ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <AlertTriangle className="h-4 w-4 mx-auto mb-1" />
            Alerts
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'parts' && (
            <motion.div
              key="parts"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="p-4"
            >
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Parts Lookup
              </h3>
              
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search parts..."
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                
                <div className="space-y-2">
                  <button className="w-full p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">Electrical Parts</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Fuses, switches, wiring</div>
                      </div>
                    </div>
                  </button>
                  
                  <button className="w-full p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <Droplets className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">Plumbing Parts</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Pumps, valves, fittings</div>
                      </div>
                    </div>
                  </button>
                  
                  <button className="w-full p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <Wrench className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">Mechanical Parts</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Bearings, belts, filters</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'checklists' && (
            <motion.div
              key="checklists"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="p-4"
            >
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Common Checklists
              </h3>
              
              <div className="space-y-3">
                {commonChecklists.map((checklist, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center space-x-2">
                      <CheckSquare className="h-4 w-4 text-primary-600" />
                      <span>{checklist.title}</span>
                    </h4>
                    <ul className="space-y-1">
                      {checklist.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-xs text-gray-600 dark:text-gray-400 flex items-start space-x-2">
                          <div className="w-2 h-2 bg-gray-300 dark:bg-gray-500 rounded-full mt-1.5 flex-shrink-0"></div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'alerts' && (
            <motion.div
              key="alerts"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="p-4"
            >
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Safety Alerts & Recalls
              </h3>
              
              <div className="space-y-3">
                {safetyAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border ${getPriorityColor(alert.priority)}`}
                  >
                    <div className="flex items-start space-x-2 mb-2">
                      {getAlertTypeIcon(alert.type)}
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {alert.title}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {alert.description}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            {alert.date}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            alert.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                            alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                            'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          }`}>
                            {alert.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuickAccessSidebar;