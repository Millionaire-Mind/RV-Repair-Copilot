import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Pin, 
  PinOff, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Download
} from 'lucide-react';

interface Manual {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: string;
  type: string;
  category: string;
  isPinned: boolean;
  lastAccessed: string;
  size: string;
}

interface ManualsSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const ManualsSidebar: React.FC<ManualsSidebarProps> = ({ 
  isCollapsed, 
  onToggleCollapse 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');

  // Mock data - in real app this would come from API
  const manuals: Manual[] = [
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

  const togglePin = (manualId: string) => {
    // In real app, this would update the backend
    console.log('Toggle pin for manual:', manualId);
  };

  const openManual = (manualId: string) => {
    // In real app, this would open the manual
    console.log('Open manual:', manualId);
  };

  if (isCollapsed) {
    return (
      <div className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-4">
        <button
          onClick={onToggleCollapse}
          className="p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200"
          aria-label="Expand sidebar"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        
        <div className="mt-4 space-y-3">
          <button className="p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200">
            <BookOpen className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200">
            <Pin className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-80 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-primary-600" />
            <span>Manuals & KB</span>
          </h2>
          <button
            onClick={onToggleCollapse}
            className="p-1 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search manuals..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-3">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters</span>
        </div>
        
        <div className="space-y-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
          
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          >
            {brands.map(brand => (
              <option key={brand} value={brand}>
                {brand === 'all' ? 'All Brands' : brand}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pinned Manuals */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
          <Pin className="h-4 w-4 text-yellow-500" />
          <span>Pinned Manuals</span>
        </h3>
        <div className="space-y-2">
          {manuals.filter(m => m.isPinned).map(manual => (
            <div
              key={manual.id}
              className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors duration-200 cursor-pointer"
              onClick={() => openManual(manual.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {manual.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {manual.brand} {manual.model} • {manual.year}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {manual.category} • {manual.size}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePin(manual.id);
                  }}
                  className="p-1 text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300 transition-colors duration-200"
                >
                  <Pin className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Manuals */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          All Manuals ({filteredManuals.length})
        </h3>
        <div className="space-y-2">
          {filteredManuals.map(manual => (
            <div
              key={manual.id}
              className="p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
              onClick={() => openManual(manual.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {manual.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {manual.brand} {manual.model} • {manual.year}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      {manual.lastAccessed}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      {manual.size}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePin(manual.id);
                    }}
                    className="p-1 text-gray-400 hover:text-yellow-600 dark:text-gray-500 dark:hover:text-yellow-400 transition-colors duration-200"
                  >
                    {manual.isPinned ? (
                      <Pin className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <PinOff className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Download action
                    }}
                    className="p-1 text-gray-400 hover:text-primary-600 dark:text-gray-500 dark:hover:text-primary-400 transition-colors duration-200"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManualsSidebar;