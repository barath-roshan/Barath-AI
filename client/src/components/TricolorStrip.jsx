import React, { useState, useEffect } from 'react';

const TricolorStrip = () => {
    const [scrollDepth, setScrollDepth] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollDepth(Math.min(window.scrollY, 200));
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const heightScale = 6 - (scrollDepth / 200) * 2; // Scales from 6px to 4px

    return (
        <div className="tricolor-strip-container" style={{ height: `${heightScale}px` }}>
            <div className="strip-section strip-orange"></div>
            <div className="strip-section strip-white"></div>
            <div className="strip-section strip-green"></div>
        </div>
    );
};

export default TricolorStrip;
