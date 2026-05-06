import React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

export const FadeInSection = ({ children, delay = '0s', className = "" }) => {
    const [ref, isVisible] = useIntersectionObserver();
    return (
        <div 
            ref={ref} 
            className={`fade-in-section ${isVisible ? 'visible' : ''} ${className}`}
            style={{ transitionDelay: delay }}
        >
            {children}
        </div>
    );
};

export const HowItWorks = ({ lang }) => {
    const steps = [
        { 
            id: 1, 
            en: 'Enter Details', 
            ta: 'விவரங்கள் உள்ளிடுக',
            descEn: 'Provide your basic profile details',
            descTa: 'உங்கள் அடிப்படை சுயவிவர விவரங்களை வழங்கவும்',
            icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
            )
        },
        { 
            id: 2, 
            en: 'Find Schemes', 
            ta: 'திட்டங்கள் கண்டறி',
            descEn: 'Our engine matches you with schemes',
            descTa: 'எங்கள் இயந்திரம் உங்களை திட்டங்களுடன் பொருத்தப்படுத்துகிறது',
            icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
            )
        },
        { 
            id: 3, 
            en: 'Apply & Track', 
            ta: 'விண்ணப்பி & கண்காணி',
            descEn: 'Apply easily and track your status',
            descTa: 'எளிதாக விண்ணப்பிக்கவும் மற்றும் உங்கள் நிலையை கண்காணிக்கவும்',
            icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 11.08 12 19 9 16"/><path d="M22 4L12 14.01 9 11.01"/><circle cx="12" cy="12" r="10"/>
                </svg>
            )
        }
    ];

    return (
        <section className="section-common">
            <div className="section-header">
                <h2 className="section-title-main">
                    {lang === 'en' ? 'How it Works' : 'இது எவ்வாறு செயல்படுகிறது'}
                </h2>
                <p className="section-subtitle-main">
                    {lang === 'en' ? 'Three simple steps to access your benefits' : 'உங்கள் நன்மைகளை அணுக மூன்று எளிய படிகள்'}
                </p>
            </div>

            <div className="steps-container">
                {steps.map((step, i) => (
                    <FadeInSection key={step.id} delay={`${i * 0.2}s`} className="step-card">
                        <div className="step-number">{step.id}</div>
                        <div className="step-icon-circle">
                            {step.icon}
                        </div>
                        <h3 className="step-title">{lang === 'en' ? step.en : step.ta}</h3>
                        <p className="step-desc">{lang === 'en' ? step.descEn : step.descTa}</p>
                    </FadeInSection>
                ))}
            </div>
        </section>
    );
};
