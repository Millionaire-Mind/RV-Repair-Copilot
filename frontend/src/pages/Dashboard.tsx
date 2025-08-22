import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center">
      <div className="text-white text-center">
        <h1 className="text-4xl font-bold mb-4">Dashboard Test</h1>
        <p className="text-xl">If you can see this, React is working!</p>
        <div className="mt-8 p-4 bg-white bg-opacity-20 rounded-lg">
          <p className="text-sm">Current time: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;