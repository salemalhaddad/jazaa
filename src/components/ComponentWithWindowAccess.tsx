'use client';

import React, { useEffect, useState } from 'react';

const ComponentWithWindowAccess: React.FC = () => {
  const [windowWidth, setWindowWidth] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Set initial width
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      <p>Window width: {windowWidth ?? 'Loading...'}</p>
    </div>
  );
};

export default ComponentWithWindowAccess;
