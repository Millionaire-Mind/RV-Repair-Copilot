import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  BookOpen, 
  Send,
  Copy,
  Download,
  Share2,
  Save,
  Clock,
  Zap,
  FileText,
  Wrench,
  Zap as Lightning,
  Droplets,
  Snowflake,
  Truck,
  Shield,
  AlertTriangle,
  CheckCircle,
  Star,
  Mic,
  ChevronDown
} from 'lucide-react';

// Global type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface RVInfo {
  brand: string;
  model: string;
  year: string;
  type: string;
}

interface AIResponse {
  answer: string;
  sources?: string[];
  metadata: {
    question: string;
    processingTime: number;
    modelUsed: string;
    confidence: number;
  };
}

interface Manual {
  id: string;
  title: string;
  description: string;
  brand: string;
  year: string;
  type: 'service' | 'owner' | 'parts' | 'wiring';
  category: 'electrical' | 'plumbing' | 'hvac' | 'engine' | 'chassis' | 'interior' | 'safety';
  pages: number;
  lastUpdated: string;
  downloadUrl?: string;
  isPinned?: boolean;
}

interface Category {
  id: string;
  name: string;
  count: number;
  icon?: any;
}

const Dashboard: React.FC = () => {
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [rvInfo, setRvInfo] = useState<RVInfo>({
    brand: '',
    model: '',
    year: '',
    type: ''
  });
  const [isSearching, setIsSearching] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<AIResponse | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
  // New state for manuals
  const [manualSearchQuery, setManualSearchQuery] = useState('');
  const [selectedManual, setSelectedManual] = useState<Manual | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isManualDetailsOpen, setIsManualDetailsOpen] = useState(false);
  const [pinnedManuals, setPinnedManuals] = useState<Manual[]>([]);

  // Speech-to-text hooks for each field
  const brandSpeech = useSpeechToText();
  const modelSpeech = useSpeechToText();
  const yearSpeech = useSpeechToText();
  const typeSpeech = useSpeechToText();
  const searchSpeech = useSpeechToText();
  const manualSearchSpeech = useSpeechToText();

  // Update input values when speech recognition completes
  useEffect(() => {
    if (brandSpeech.transcript && !brandSpeech.listening) {
      setRvInfo(prev => ({ ...prev, brand: brandSpeech.transcript }));
      brandSpeech.resetTranscript();
    }
  }, [brandSpeech.transcript, brandSpeech.listening]);

  useEffect(() => {
    if (modelSpeech.transcript && !modelSpeech.listening) {
      setRvInfo(prev => ({ ...prev, model: modelSpeech.transcript }));
      modelSpeech.resetTranscript();
    }
  }, [modelSpeech.transcript, modelSpeech.listening]);

  useEffect(() => {
    if (yearSpeech.transcript && !yearSpeech.listening) {
      setRvInfo(prev => ({ ...prev, year: yearSpeech.transcript }));
      yearSpeech.resetTranscript();
    }
  }, [yearSpeech.transcript, yearSpeech.listening]);

  useEffect(() => {
    if (typeSpeech.transcript && !typeSpeech.listening) {
      setRvInfo(prev => ({ ...prev, type: typeSpeech.transcript }));
      typeSpeech.resetTranscript();
    }
  }, [typeSpeech.transcript, typeSpeech.listening]);

  useEffect(() => {
    if (searchSpeech.transcript && !searchSpeech.listening) {
      setSearchQuery(searchSpeech.transcript);
      searchSpeech.resetTranscript();
    }
  }, [searchSpeech.transcript, searchSpeech.listening]);

  useEffect(() => {
    if (manualSearchSpeech.transcript && !manualSearchSpeech.listening) {
      setManualSearchQuery(manualSearchSpeech.transcript);
      manualSearchSpeech.resetTranscript();
    }
  }, [manualSearchSpeech.transcript, manualSearchSpeech.listening]);

  // Load pinned manuals from local storage on component mount
  useEffect(() => {
    const savedPinnedManuals = localStorage.getItem('pinnedManuals');
    if (savedPinnedManuals) {
      try {
        setPinnedManuals(JSON.parse(savedPinnedManuals));
      } catch (error) {
        console.error('Error loading pinned manuals:', error);
      }
    }
  }, []);

  // Save pinned manuals to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('pinnedManuals', JSON.stringify(pinnedManuals));
  }, [pinnedManuals]);

  // Mock manuals data
  const manuals: Manual[] = [
    {
      id: '1',
      title: 'Winnebago Service Manual 2023',
      type: 'service',
      brand: 'Winnebago',
      year: '2023',
      category: 'chassis',
      description: 'Comprehensive service manual covering all major systems including engine, transmission, brakes, and electrical.',
      pages: 450,
      lastUpdated: '2023-12-01',
      isPinned: true,
      downloadUrl: '/manuals/winnebago-service-2023.pdf'
    },
    {
      id: '2',
      title: 'RV Electrical Systems Guide',
      type: 'service',
      brand: 'Generic',
      year: '2023',
      category: 'electrical',
      description: 'Complete guide to RV electrical systems including 12V and 120V systems, solar panels, and battery maintenance.',
      pages: 320,
      lastUpdated: '2023-11-15',
      isPinned: true,
      downloadUrl: '/manuals/rv-electrical-guide.pdf'
    },
    {
      id: '3',
      title: 'Propane Safety Handbook',
      type: 'service',
      brand: 'Generic',
      year: '2023',
      category: 'safety',
      description: 'Essential safety information for propane systems including leak detection, maintenance, and emergency procedures.',
      pages: 85,
      lastUpdated: '2023-10-20',
      isPinned: true,
      downloadUrl: '/manuals/propane-safety.pdf'
    },
    {
      id: '4',
      title: 'Dometic Refrigerator Manual',
      type: 'owner',
      brand: 'Dometic',
      year: '2023',
      category: 'hvac',
      description: 'Owner manual for Dometic RV refrigerators including operation, troubleshooting, and maintenance.',
      pages: 45,
      lastUpdated: '2023-09-10',
      isPinned: false,
      downloadUrl: '/manuals/dometic-refrigerator.pdf'
    },
    {
      id: '5',
      title: 'Slide-Out Mechanism Guide',
      type: 'service',
      brand: 'Generic',
      year: '2023',
      category: 'chassis',
      description: 'Service manual for slide-out mechanisms including maintenance, troubleshooting, and repair procedures.',
      pages: 120,
      lastUpdated: '2023-08-25',
      isPinned: false,
      downloadUrl: '/manuals/slide-out-guide.pdf'
    },
    {
      id: '6',
      title: 'RV Plumbing Systems',
      type: 'service',
      brand: 'Generic',
      year: '2023',
      category: 'plumbing',
      description: 'Complete guide to RV plumbing including water systems, waste systems, and winterization procedures.',
      pages: 180,
      lastUpdated: '2023-07-30',
      isPinned: false,
      downloadUrl: '/manuals/rv-plumbing.pdf'
    },
    {
      id: 'safety-1',
      title: 'Safety Guidelines & Procedures',
      description: 'Comprehensive safety protocols and emergency procedures for RV operations',
      brand: 'Generic',
      year: '2023',
      type: 'service',
      category: 'safety',
      pages: 45,
      lastUpdated: '2023-11-15'
    }
  ];

  const categories: Category[] = [
    { id: 'all', name: 'All Categories', icon: BookOpen, count: manuals.length },
    { id: 'electrical', name: 'Electrical', icon: Lightning, count: manuals.filter(m => m.category === 'electrical').length },
    { id: 'plumbing', name: 'Plumbing', icon: Droplets, count: manuals.filter(m => m.category === 'plumbing').length },
    { id: 'hvac', name: 'HVAC', icon: Snowflake, count: manuals.filter(m => m.category === 'hvac').length },
    { id: 'chassis', name: 'Chassis', icon: Truck, count: manuals.filter(m => m.category === 'chassis').length },
    { id: 'safety', name: 'Safety', icon: Shield, count: manuals.filter(m => m.category === 'safety').length }
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchHistory(prev => [searchQuery, ...prev.slice(0, 4)]); // Keep last 5 searches

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock AI response based on query
    const mockResponse: AIResponse = generateMockResponse(searchQuery, rvInfo);
    setCurrentResponse(mockResponse);
    setIsSearching(false);
  };

  const generateMockResponse = (query: string, rvInfo: RVInfo): AIResponse => {
    const responses = {
      'water pump': {
        answer: `## Water Pump Troubleshooting Guide

Based on your ${rvInfo.brand || 'RV'} ${rvInfo.model || 'model'}, here's how to resolve water pump issues:

### **Step 1: Safety Check**
- Ensure RV is parked on level ground
- Turn off water pump at the control panel
- Check for any visible water leaks

### **Step 2: Common Issues & Solutions**

**No Water Flow:**
- Check if water tank is full
- Verify pump fuse/breaker hasn't tripped
- Inspect water lines for kinks or blockages

**Pump Running But No Water:**
- Check water tank level
- Inspect inlet screen for debris
- Verify all faucets are closed

**Pump Won't Turn Off:**
- Check pressure switch adjustment
- Inspect for air leaks in system
- Verify pump relay operation

### **Step 3: Maintenance Tips**
- Clean inlet screen monthly
- Check pump pressure annually
- Inspect hoses for wear every 6 months

### **When to Seek Professional Help**
If the pump still doesn't work after these steps, or if you notice electrical issues, contact a certified RV technician.`,
        sources: [
          `${rvInfo.brand || 'RV'} Service Manual - ${rvInfo.year || 'Current'} Edition`,
          'RV Water Systems Guide',
          'Pump Maintenance Best Practices'
        ]
      },
      'battery': {
        answer: `## Battery Maintenance & Troubleshooting

For your ${rvInfo.brand || 'RV'} ${rvInfo.model || 'model'}, here's a comprehensive battery guide:

### **Battery Health Check**
- **Voltage Test**: Use multimeter to check voltage (should be 12.6V+ when fully charged)
- **Visual Inspection**: Look for corrosion, cracks, or bulging
- **Age Check**: RV batteries typically last 3-5 years

### **Common Battery Problems**

**Battery Won't Hold Charge:**
- Check water levels (if applicable)
- Clean corrosion from terminals
- Test alternator output
- Verify battery age

**Slow Engine Crank:**
- Check battery voltage
- Inspect cable connections
- Test starter motor
- Verify ground connections

### **Maintenance Schedule**
- **Monthly**: Check water levels, clean terminals
- **Quarterly**: Test battery voltage under load
- **Annually**: Professional battery inspection

### **Safety Reminders**
- Always disconnect negative terminal first
- Wear safety glasses when working with batteries
- Keep area well-ventilated
- Never smoke near batteries`,
        sources: [
          'RV Electrical Systems Manual',
          'Battery Maintenance Guide',
          'Safety Standards Handbook'
        ]
      },
      'ac': {
        answer: `## Air Conditioning Troubleshooting

For your ${rvInfo.brand || 'RV'} ${rvInfo.model || 'model'} AC system:

### **AC Won't Turn On**
1. **Check Power Source**
   - Verify shore power connection
   - Check generator status
   - Inspect circuit breakers

2. **Thermostat Issues**
   - Check battery in thermostat
   - Verify temperature setting
   - Clean thermostat contacts

### **AC Running But Not Cooling**
1. **Air Filter Check**
   - Replace dirty air filter
   - Clean evaporator coils
   - Check for blockages

2. **Refrigerant Issues**
   - Listen for unusual sounds
   - Check for ice buildup
   - Verify proper airflow

### **Performance Optimization**
- Keep air filters clean
- Ensure proper ventilation
- Regular professional maintenance
- Check ductwork for leaks

### **Emergency Procedures**
If AC fails during travel:
- Use fans for air circulation
- Park in shaded areas
- Consider portable AC units
- Monitor indoor temperature`,
        sources: [
          'RV HVAC Systems Guide',
          'AC Maintenance Manual',
          'Troubleshooting Best Practices'
        ]
      }
    };

    // Find best matching response
    const queryLower = query.toLowerCase();
    let bestMatch = responses['water pump']; // Default response

    if (queryLower.includes('battery') || queryLower.includes('power') || queryLower.includes('electrical')) {
      bestMatch = responses['battery'];
    } else if (queryLower.includes('ac') || queryLower.includes('air') || queryLower.includes('cooling')) {
      bestMatch = responses['ac'];
    } else if (queryLower.includes('water') || queryLower.includes('pump') || queryLower.includes('plumbing')) {
      bestMatch = responses['water pump'];
    }

    return {
      answer: bestMatch.answer,
      sources: bestMatch.sources,
      metadata: {
        question: query,
        processingTime: 1450,
        modelUsed: 'GPT-4',
        confidence: 0.89
      }
    };
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const popularQueries = [
    'Water pump not working',
    'AC troubleshooting',
    'Battery maintenance',
    'Propane system issues',
    'Slide-out problems',
    'Generator won\'t start'
  ];

  const handlePopularQuery = (query: string) => {
    setSearchQuery(query);
    // Auto-search for popular queries
    setTimeout(() => handleSearch(), 100);
  };

  // Manual filtering and search
  const filteredManuals = manuals.filter(manual => {
    const matchesSearch = manualSearchQuery === '' || 
      manual.title.toLowerCase().includes(manualSearchQuery.toLowerCase()) ||
      manual.description.toLowerCase().includes(manualSearchQuery.toLowerCase()) ||
      manual.brand.toLowerCase().includes(manualSearchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || manual.category === selectedCategory;
    
    // Debug logging for category filtering
    if (selectedCategory !== 'all') {
      console.log(`Manual: ${manual.title}, Category: ${manual.category}, Selected: ${selectedCategory}, Matches: ${matchesCategory}`);
    }
    
    return matchesSearch && matchesCategory;
  });

  const handleManualClick = (manual: Manual) => {
    setSelectedManual(manual);
    setIsManualDetailsOpen(true);
  };

  const toggleManualPin = (manualId: string) => {
    // In a real app, this would update the database
    console.log('Toggling pin for manual:', manualId);
  };

  const downloadManual = (manual: Manual) => {
    // Mock download functionality
    console.log(`Downloading ${manual.title}`);
    alert(`Download started for ${manual.title}`);
  };

  const togglePinManual = (manual: Manual) => {
    setPinnedManuals(prev => {
      const isPinned = prev.some(pinned => pinned.id === manual.id);
      if (isPinned) {
        return prev.filter(pinned => pinned.id !== manual.id);
      } else {
        return [...prev, manual];
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main Dashboard Layout */}
      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Sidebar - Manuals & Knowledge Base */}
        <AnimatePresence>
          {!isLeftSidebarCollapsed && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>Manuals & Knowledge</span>
                  </h2>
                  <button
                    onClick={() => setIsLeftSidebarCollapsed(true)}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors duration-200"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {/* Manual Search */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Search Manuals</h3>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={manualSearchQuery}
                        onChange={(e) => setManualSearchQuery(e.target.value)}
                        placeholder="Search manuals..."
                        className={`w-full pl-10 pr-12 py-2 text-sm border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                          manualSearchSpeech.listening 
                            ? 'border-blue-500 dark:border-blue-400' 
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                      />
                      <button
                        onClick={() => manualSearchSpeech.listening ? manualSearchSpeech.stopListening() : manualSearchSpeech.startListening()}
                        disabled={!manualSearchSpeech.isSupported}
                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors duration-200 ${
                          manualSearchSpeech.listening
                            ? 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20'
                            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                        } ${!manualSearchSpeech.isSupported ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        title={manualSearchSpeech.isSupported ? 'Voice input' : 'Speech-to-text not supported on this browser'}
                      >
                        <Mic className="h-3 w-3" />
                      </button>
                      {manualSearchSpeech.listening && (
                        <span className="absolute -bottom-6 left-0 text-xs text-blue-600 dark:text-blue-400">
                          Listening...
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Pinned Manuals */}
                  {pinnedManuals.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>Pinned Manuals</span>
                      </h3>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {pinnedManuals.map((manual) => (
                          <button
                            key={manual.id}
                            onClick={() => handleManualClick(manual)}
                            className="w-full p-2 text-left bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-gray-900 dark:text-white text-xs truncate">
                                {manual.title}
                              </h4>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePinManual(manual);
                                }}
                                className="p-1 text-yellow-500 hover:text-yellow-600 transition-colors duration-200"
                                title="Unpin manual"
                              >
                                <Star className="h-3 w-3 fill-current" />
                              </button>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                              {manual.brand} • {manual.year}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Categories */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Categories</h3>
                    <div className="relative">
                      <select
                        value={selectedCategory}
                        onChange={(e) => {
                          console.log('Category selected:', e.target.value);
                          setSelectedCategory(e.target.value);
                        }}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Filtered Manuals List */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      Manuals
                    </h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {filteredManuals.length > 0 ? (
                        filteredManuals.map((manual) => (
                          <button
                            key={manual.id}
                            onClick={() => handleManualClick(manual)}
                            className="w-full p-3 text-left bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                                {manual.title}
                              </h4>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePinManual(manual);
                                }}
                                className={`p-1 transition-colors duration-200 ${
                                  pinnedManuals.some(pinned => pinned.id === manual.id)
                                    ? 'text-yellow-500 hover:text-yellow-600'
                                    : 'text-gray-400 hover:text-yellow-500'
                                }`}
                                title={pinnedManuals.some(pinned => pinned.id === manual.id) ? 'Unpin manual' : 'Pin manual'}
                              >
                                <Star className={`h-3 w-3 ${pinnedManuals.some(pinned => pinned.id === manual.id) ? 'fill-current' : ''}`} />
                              </button>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                              {manual.brand} • {manual.year} • {manual.type}
                            </p>
                          </button>
                        ))
                      ) : (
                        <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                          <BookOpen className="h-8 w-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                          <p className="text-sm">No manuals found</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Pinned Manuals */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Pinned Manuals</h3>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      {manuals.filter(m => m.isPinned).map((manual) => (
                        <div key={manual.id} className="p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                          <div className="flex items-center justify-between">
                            <span className="truncate">{manual.title}</span>
                            <Star className="h-3 w-3 text-yellow-500" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Searches */}
                  {searchHistory.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">Recent Searches</h3>
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        {searchHistory.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => handlePopularQuery(search)}
                            className="w-full p-2 text-left bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Sidebar Toggle Button */}
          <div className="p-4 pb-2">
            <button 
              onClick={() => setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          {/* Search & Query Section */}
          <div className="px-6 pb-4">
            {/* RV Unit Information Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                RV Unit Information
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Brand"
                    value={rvInfo.brand}
                    onChange={(e) => setRvInfo(prev => ({ ...prev, brand: e.target.value }))}
                    className={`w-full px-3 py-2 text-sm border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      brandSpeech.listening 
                        ? 'border-blue-500 dark:border-blue-400' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  <button
                    onClick={() => brandSpeech.listening ? brandSpeech.stopListening() : brandSpeech.startListening()}
                    disabled={!brandSpeech.isSupported}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors duration-200 ${
                      brandSpeech.listening
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20'
                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                    } ${!brandSpeech.isSupported ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    title={brandSpeech.isSupported ? 'Voice input' : 'Speech-to-text not supported on this browser'}
                  >
                    <Mic className="h-3 w-3" />
                  </button>
                  {brandSpeech.listening && (
                    <span className="absolute -bottom-6 left-0 text-xs text-blue-600 dark:text-blue-400">
                      Listening...
                    </span>
                  )}
                </div>
                
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Model"
                    value={rvInfo.model}
                    onChange={(e) => setRvInfo(prev => ({ ...prev, model: e.target.value }))}
                    className={`w-full px-3 py-2 text-sm border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      modelSpeech.listening 
                        ? 'border-blue-500 dark:border-blue-400' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  <button
                    onClick={() => modelSpeech.listening ? modelSpeech.stopListening() : modelSpeech.startListening()}
                    disabled={!modelSpeech.isSupported}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors duration-200 ${
                      modelSpeech.listening
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20'
                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                    } ${!modelSpeech.isSupported ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    title={modelSpeech.isSupported ? 'Voice input' : 'Speech-to-text not supported on this browser'}
                  >
                    <Mic className="h-3 w-3" />
                  </button>
                  {modelSpeech.listening && (
                    <span className="absolute -bottom-6 left-0 text-xs text-blue-600 dark:text-blue-400">
                      Listening...
                    </span>
                  )}
                </div>
                
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Year"
                    value={rvInfo.year}
                    onChange={(e) => setRvInfo(prev => ({ ...prev, year: e.target.value }))}
                    className={`w-full px-3 py-2 text-sm border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      yearSpeech.listening 
                        ? 'border-blue-500 dark:border-blue-400' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  <button
                    onClick={() => yearSpeech.listening ? yearSpeech.stopListening() : yearSpeech.startListening()}
                    disabled={!yearSpeech.isSupported}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors duration-200 ${
                      yearSpeech.listening
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20'
                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                    } ${!yearSpeech.isSupported ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    title={yearSpeech.isSupported ? 'Voice input' : 'Speech-to-text not supported on this browser'}
                  >
                    <Mic className="h-3 w-3" />
                  </button>
                  {yearSpeech.listening && (
                    <span className="absolute -bottom-6 left-0 text-xs text-blue-600 dark:text-blue-400">
                      Listening...
                    </span>
                  )}
                </div>
                
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Type"
                    value={rvInfo.type}
                    onChange={(e) => setRvInfo(prev => ({ ...prev, type: e.target.value }))}
                    className={`w-full px-3 py-2 text-sm border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                      typeSpeech.listening 
                        ? 'border-blue-500 dark:border-blue-400' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  <button
                    onClick={() => typeSpeech.listening ? typeSpeech.stopListening() : typeSpeech.startListening()}
                    disabled={!typeSpeech.isSupported}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors duration-200 ${
                      typeSpeech.listening
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20'
                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                    } ${!typeSpeech.isSupported ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    title={typeSpeech.isSupported ? 'Voice input' : 'Speech-to-text not supported on this browser'}
                  >
                    <Mic className="h-3 w-3" />
                  </button>
                  {typeSpeech.listening && (
                    <span className="absolute -bottom-6 left-0 text-xs text-blue-600 dark:text-blue-400">
                      Listening...
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Ask RV Repair Copilot Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Ask RV Repair Copilot
              </h2>
              
              <div className="flex space-x-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Describe your RV repair issue..."
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      searchSpeech.listening 
                        ? 'border-blue-500 dark:border-blue-400' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    disabled={isSearching}
                  />
                  <button
                    onClick={() => searchSpeech.listening ? searchSpeech.stopListening() : searchSpeech.startListening()}
                    disabled={!searchSpeech.isSupported || isSearching}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors duration-200 ${
                      searchSpeech.listening
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20'
                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                    } ${!searchSpeech.isSupported || isSearching ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    title={searchSpeech.isSupported ? 'Voice input' : 'Speech-to-text not supported on this browser'}
                  >
                    <Mic className="h-4 w-4" />
                  </button>
                  {searchSpeech.listening && (
                    <span className="absolute -bottom-6 left-0 text-xs text-blue-600 dark:text-blue-400">
                      Listening...
                    </span>
                  )}
                </div>
                <button 
                  onClick={handleSearch}
                  disabled={!searchQuery.trim() || isSearching}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2"
                >
                  {isSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Ask Copilot</span>
                    </>
                  )}
                </button>
              </div>

              {/* Popular Queries */}
              <div className="mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Popular queries:</p>
                <div className="flex flex-wrap gap-2">
                  {popularQueries.map((query, index) => (
                    <button
                      key={index}
                      onClick={() => handlePopularQuery(query)}
                      className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      {query}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* AI Response Panel */}
          <div className="flex-1 px-6 pb-4 min-h-0">
            <AnimatePresence mode="wait">
              {isSearching ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-full"
                >
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-lg font-medium text-gray-900 dark:text-white">Searching for solutions...</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Analyzing your RV repair question</p>
                    </div>
                  </div>
                </motion.div>
              ) : currentResponse ? (
                <motion.div
                  key="response"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-full overflow-y-auto"
                >
                  {/* Response Header */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        AI Response
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {currentResponse.metadata.question}
                      </p>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => copyToClipboard(currentResponse.answer)}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        title="Copy to clipboard"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                        <Save className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Response Content */}
                  <div className="prose dark:prose-invert max-w-none mb-6">
                    <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {currentResponse.answer}
                    </div>
                  </div>

                  {/* Sources */}
                  {currentResponse.sources && currentResponse.sources.length > 0 && (
                    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Sources:</h4>
                      <div className="space-y-2">
                        {currentResponse.sources.map((source, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>{source}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{currentResponse.metadata.processingTime}ms</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Zap className="h-3 w-3" />
                        <span>{currentResponse.metadata.modelUsed}</span>
                      </span>
                    </div>
                    <span>Confidence: {(currentResponse.metadata.confidence * 100).toFixed(1)}%</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-full"
                >
                  <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                    <div className="text-center">
                      <Search className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                      <p className="text-lg font-medium">Ask a question above to get started</p>
                      <p className="text-sm mt-2">I can help with troubleshooting, repairs, and maintenance</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Task & Repair Log Panel */}
          <div className="px-6 pb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Task & Repair Log</span>
                </h2>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
                    Export
                  </button>
                  <button className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200">
                    New Task
                  </button>
                </div>
              </div>
              
              {/* Add New Note Input */}
              <div className="mb-4 relative">
                <input
                  type="text"
                  placeholder="Add a new note to the repair log..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => {
                    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                      const recognition = new ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)();
                      recognition.continuous = false;
                      recognition.interimResults = false;
                      recognition.lang = 'en-US';
                      recognition.onresult = (event: any) => {
                        const transcript = event.results[0][0].transcript;
                        // Here you would update the input value
                        console.log('Voice input for repair log:', transcript);
                      };
                      recognition.start();
                    }
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  title="Voice input"
                >
                  <Mic className="h-3 w-3" />
                </button>
              </div>

              <div className="space-y-3">
                {/* Sample Log Entries */}
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">Water Pump Issue - Winnebago 2023</h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Customer reported water pump not working. AI provided troubleshooting steps.
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded">
                      In Progress
                    </span>
                    <span>Technician: John D.</span>
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">AC Troubleshooting - Generic RV</h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400">1 day ago</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    AC system diagnostic completed. Parts ordered for replacement.
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 rounded">
                      Waiting Parts
                    </span>
                    <span>Technician: Sarah M.</span>
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">Battery Maintenance - Fleet Service</h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400">3 days ago</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Battery inspection and maintenance completed. All systems operational.
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded">
                      Completed
                    </span>
                    <span>Technician: Mike R.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Left Sidebar Toggle Button */}
      {isLeftSidebarCollapsed && (
        <button
          onClick={() => setIsLeftSidebarCollapsed(false)}
          className="fixed left-4 top-24 z-10 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        </button>
      )}

      {/* Manual Details Modal */}
      <AnimatePresence>
        {isManualDetailsOpen && selectedManual && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsManualDetailsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Manual Details
                  </h2>
                  <button
                    onClick={() => setIsManualDetailsOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {selectedManual.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedManual.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Type:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-400 capitalize">{selectedManual.type}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Brand:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">{selectedManual.brand}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Year:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">{selectedManual.year}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Pages:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">{selectedManual.pages}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Category:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-400 capitalize">{selectedManual.category}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Updated:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">{selectedManual.lastUpdated}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => togglePinManual(selectedManual)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                        pinnedManuals.some(pinned => pinned.id === selectedManual.id)
                          ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <Star className={`h-4 w-4 ${pinnedManuals.some(pinned => pinned.id === selectedManual.id) ? 'fill-current' : ''}`} />
                      <span>{pinnedManuals.some(pinned => pinned.id === selectedManual.id) ? 'Unpin' : 'Pin It'}</span>
                    </button>
                    
                    <button
                      onClick={() => downloadManual(selectedManual)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;