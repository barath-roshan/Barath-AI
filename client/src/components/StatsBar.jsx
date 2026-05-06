import React, { useRef, useState, useEffect } from 'react';
import { useCountUp } from '../hooks/useCountUp';

const StatItem = ({ end, label, suffix = "", decimals = 0 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const count = useCountUp(isVisible ? end : 0, 2000, 0, decimals);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) setIsVisible(true);
        }, { threshold: 0.1 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div className="stat-item" ref={ref}>
            <span className="stat-number">{count}{suffix}</span>
            <span className="stat-label">{label}</span>
        </div>
    );
};

const StatsBar = ({ lang }) => {
    return (
        <section className="stats-bar">
            <div className="stats-container">
                <StatItem 
                    end={1200} 
                    label={lang === 'en' ? 'Schemes / திட்டங்கள்' : 'திட்டங்கள் / Schemes'} 
                    suffix="+" 
                />
                <StatItem 
                    end={28} 
                    label={lang === 'en' ? 'Ministries / அமைச்சகங்கள்' : 'அமைச்சகங்கள் / Ministries'} 
                />
                <StatItem 
                    end={36} 
                    label={lang === 'en' ? 'States & UTs / மாநிலங்கள்' : 'மாநிலங்கள் / States & UTs'} 
                />
                <StatItem 
                    end={14.5} 
                    decimals={1}
                    label={lang === 'en' ? 'Beneficiaries / பயனாளிகள்' : 'பயனாளிகள் / Beneficiaries'} 
                    suffix=" Cr+" 
                />
            </div>
        </section>
    );
};

export default StatsBar;
