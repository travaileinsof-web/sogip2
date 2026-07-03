import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default LoadingSpinner;
