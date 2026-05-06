import React from 'react';
import Hero from '../components/Hero';
import StatsBar from '../components/StatsBar';
import { HowItWorks } from '../components/Common';
import CategoryTabs from '../components/CategoryTabs';
import FeaturedCarousel from '../components/FeaturedCarousel';
import EligibilityRedesign from '../components/EligibilityRedesign';

const Home = ({ 
    lang, 
    schemes, 
    eligibility, 
    handleEligChange, 
    checkEligibility, 
    handleApplyClick 
}) => {
    return (
        <main>
            <Hero lang={lang} onApplyClick={handleApplyClick} />
            <StatsBar lang={lang} />
            <HowItWorks lang={lang} />
            <CategoryTabs lang={lang} />
            <FeaturedCarousel lang={lang} schemes={schemes} onApplyClick={handleApplyClick} />
            <EligibilityRedesign 
                lang={lang} 
                formData={eligibility} 
                onChange={handleEligChange} 
                onSubmit={checkEligibility} 
            />
        </main>
    );
};

export default Home;
