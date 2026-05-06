import React, { useState, useEffect } from 'react';

const slides = [
    {
        id: 1,
        titleEn: "PM-KISAN Samman Nidhi",
        titleTa: "பிரதமர் கிசான் சம்மன் நிதி",
        ministryEn: "Ministry of Agriculture",
        benefitEn: "₹6,000 per year",
        descEn: "Financial support to all landholding farmers' families in the country.",
        img: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1600&q=80"
    },
    {
        id: 2,
        titleEn: "Ayushman Bharat PM-JAY",
        titleTa: "ஆயுஷ்மான் பாரத திட்டம்",
        ministryEn: "Ministry of Health",
        benefitEn: "₹5 Lakh insurance cover",
        descEn: "The world's largest health insurance scheme for low-income families.",
        img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&q=80"
    },
    {
        id: 3,
        titleEn: "Pradhan Mantri Awas Yojana",
        titleTa: "பிரதமர் மந்திரி ஆவாஸ் யோஜனா",
        ministryEn: "Ministry of Housing",
        benefitEn: "Subsidy for Home Loans",
        descEn: "Housing for all in urban and rural areas by 2024.",
        img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=80"
    },
    {
        id: 4,
        titleEn: "Startup India Initiative",
        titleTa: "ஸ்டார்ட் அப் இந்தியா திட்டம்",
        ministryEn: "Ministry of Commerce",
        benefitEn: "Tax Exemptions & Support",
        descEn: "Catalyzing startup culture and building a strong ecosystem in India.",
        img: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1600&q=80"
    },
    {
        id: 5,
        titleEn: "Beti Bachao Beti Padhao",
        titleTa: "பெண் குழந்தைகளை காப்போம்",
        ministryEn: "Women and Child Development",
        benefitEn: "Educational Support",
        descEn: "Ensuring survival, protection and education of the girl child.",
        img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1600&q=80"
    },
    {
        id: 6,
        titleEn: "PMEGP Scheme",
        titleTa: "பி.எம்.இ.ஜி.பி திட்டம்",
        ministryEn: "Ministry of MSME",
        benefitEn: "Up to 35% Subsidy",
        descEn: "Generating employment opportunities for youth in rural and urban areas.",
        img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1600&q=80"
    }
];

const Hero = ({ lang, onApplyClick }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
            setProgress(0);
        }, 5000);

        const progressInterval = setInterval(() => {
            setProgress((prev) => Math.min(prev + (100 / 50), 100)); // Update every 100ms
        }, 100);

        return () => {
            clearInterval(interval);
            clearInterval(progressInterval);
        };
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setProgress(0);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
        setProgress(0);
    };

    return (
        <section className="hero-slider">
            {slides.map((slide, index) => (
                <div key={slide.id} className={`slide ${index === currentSlide ? 'active' : ''}`}>
                    <img src={slide.img} alt={slide.titleEn} className="slide-bg" loading="lazy" />
                    <div className="slide-overlay"></div>
                    <div className="slide-content">
                        <span className="ministry-tag">{slide.ministryEn}</span>
                        <h2 className="scheme-name-hero">{lang === 'en' ? slide.titleEn : slide.titleTa}</h2>
                        <p className="tamil-subtitle-hero">{slide.titleTa}</p>
                        <div className="benefit-amount-hero">{slide.benefitEn}</div>
                        <p className="scheme-desc-hero">{slide.descEn}</p>
                        <div className="hero-actions">
                            <button className="btn-hero-apply" onClick={() => onApplyClick(slide)}>
                                {lang === 'en' ? 'Apply Now' : 'இப்போது விண்ணப்பிக்க'}
                            </button>
                            <button className="btn-hero-learn">
                                {lang === 'en' ? 'Learn More' : 'மேலும் அறிக'}
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            <div className="hero-progress-container">
                <div className="hero-progress-bar" style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}></div>
            </div>

            <button className="slider-arrow left" onClick={prevSlide} style={{ left: '20px' }}>&#10094;</button>
            <button className="slider-arrow right" onClick={nextSlide} style={{ right: '20px' }}>&#10095;</button>

            <div className="slider-dots">
                {slides.map((_, i) => (
                    <div 
                        key={i} 
                        className={`dot ${i === currentSlide ? 'active' : ''}`}
                        onClick={() => { setCurrentSlide(i); setProgress(0); }}
                    ></div>
                ))}
            </div>

            <style>{`
                .slider-arrow {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    font-size: 24px;
                    cursor: pointer;
                    z-index: 10;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }
                .slider-arrow:hover { background: white; color: var(--navy); }
                
                .slider-dots {
                    position: absolute;
                    bottom: 30px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    gap: 12px;
                    z-index: 10;
                }
                .dot {
                    width: 10px;
                    height: 10px;
                    background: rgba(255,255,255,0.4);
                    border-radius: 50%;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .dot.active {
                    width: 24px;
                    border-radius: 5px;
                    background: var(--saffron);
                }
            `}</style>
        </section>
    );
};

export default Hero;
