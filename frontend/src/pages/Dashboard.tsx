import React, { useState } from 'react';
import {
  SearchQueryBar,
  AIResponsePanel,
  ManualsSidebar,
  RepairLogPanel,
  QuickAccessSidebar,
  UserProfileDropdown
} from '../components/dashboard';

interface RVInfo {
  brand: string;
  model: string;
  year: string;
  type: string;
}

interface AIResponse {
  answer: string;
  sources: string[];
  metadata: {
    question: string;
    searchResults: number;
    processingTime: number;
    modelUsed: string;
    confidence: number;
  };
}

const Dashboard: React.FC = () => {
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);
  const [isRepairLogExpanded, setIsRepairLogExpanded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<AIResponse | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query: string, rvInfo: RVInfo) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock response - in real app this would come from the API
    const mockResponse: AIResponse = {
      answer: `Based on your ${rvInfo.brand} ${rvInfo.model} ${rvInfo.year} ${rvInfo.type}, here's how to resolve the issue:

## Step-by-Step Solution

1. **Safety First**: Ensure the RV is parked on level ground and the parking brake is engaged.

2. **Initial Inspection**: 
   - Check for any visible damage or loose connections
   - Verify all switches are in the correct position
   - Inspect fuses and circuit breakers

3. **Troubleshooting Process**:
   - Start with the most common causes
   - Work systematically through each component
   - Document your findings for future reference

4. **Testing**: After making any adjustments, test the system thoroughly before considering the repair complete.

## Common Causes for This Issue

- Loose electrical connections
- Blown fuses or tripped circuit breakers
- Corroded battery terminals
- Faulty switches or controls

## When to Seek Professional Help

If you're unable to resolve the issue after following these steps, or if you encounter any safety concerns, contact a certified RV technician immediately.

## Prevention Tips

- Regular maintenance and inspections
- Keep connections clean and tight
- Monitor battery health regularly
- Follow manufacturer guidelines for care and maintenance`,
      sources: [
        `${rvInfo.brand} Service Manual - ${rvInfo.year} Edition`,
        'RV Electrical Systems Guide',
        'Troubleshooting Best Practices Manual'
      ],
      metadata: {
        question: query,
        searchResults: 3,
        processingTime: 1850,
        modelUsed: 'GPT-4',
        confidence: 0.87
      }
    };

    setCurrentResponse(mockResponse);
    setIsLoading(false);
  };

  const handleSaveSolution = () => {
    // In real app, this would save to user's saved solutions
    console.log('Saving solution...');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              RV Repair Copilot
            </h1>
            <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
              Dashboard
            </span>
          </div>
          
          <UserProfileDropdown 
            isDarkMode={isDarkMode}
            onToggleDarkMode={toggleDarkMode}
          />
        </div>
      </div>

      {/* Main Dashboard Layout */}
      <div className="flex h-[calc(100vh-88px)]">
        {/* Left Sidebar - Manuals & Knowledge Base */}
        <ManualsSidebar 
          isCollapsed={isLeftSidebarCollapsed}
          onToggleCollapse={() => setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Section - Search & Query Bar */}
          <div className="p-6 pb-4">
            <SearchQueryBar 
              onSearch={handleSearch}
              isLoading={isLoading}
            />
          </div>

          {/* Main Panel - AI Response */}
          <div className="flex-1 px-6 pb-4 min-h-0">
            <AIResponsePanel 
              response={currentResponse}
              isLoading={isLoading}
              onSaveSolution={handleSaveSolution}
            />
          </div>

          {/* Bottom Panel - Repair Log */}
          <RepairLogPanel 
            isExpanded={isRepairLogExpanded}
            onToggleExpand={() => setIsRepairLogExpanded(!isRepairLogExpanded)}
          />
        </div>

        {/* Right Sidebar - Quick Access Widgets */}
        <QuickAccessSidebar 
          isCollapsed={isRightSidebarCollapsed}
          onToggleCollapse={() => setIsRightSidebarCollapsed(!isRightSidebarCollapsed)}
        />
      </div>

      {/* Responsive Mobile Overlay */}
      <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" style={{ display: 'none' }}>
        {/* Mobile menu would go here */}
      </div>
    </div>
  );
};

export default Dashboard;