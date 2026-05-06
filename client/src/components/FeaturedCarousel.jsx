import React, { useRef, useState, useEffect } from 'react';

const FeaturedCarousel = ({ lang, schemes, onApplyClick }) => {
    const scrollRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (isHovered) return;
        const interval = setInterval(() => {
            if (scrollRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
                if (scrollLeft + clientWidth >= scrollWidth - 10) {
                    scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    scrollRef.current.scrollBy({ left: 324, behavior: 'smooth' });
                }
            }
        }, 4000);
        return () => clearInterval(interval);
    }, [isHovered]);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const amount = direction === 'left' ? -324 : 324;
            scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
        }
    };

    const getImageUrl = (index) => {
        const images = [
            "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&q=80",
            "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80",
            "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80",
            "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&q=80",
            "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80",
            "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&q=80"
        ];
        return images[index % images.length];
    };

    return (
        <section className="section-common" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <div className="featured-header">
                <h2 className="section-title-main">
                    {lang === 'en' ? 'Featured Schemes' : 'முக்கிய திட்டங்கள்'}
                </h2>
                <a href="/schemes" className="view-all-link">
                    {lang === 'en' ? 'View All →' : 'அனைத்தையும் பார்க்க →'}
                </a>
            </div>

            <div className="carousel-container">
                <button 
                    className="carousel-btn left" 
                    onClick={() => scroll('left')}
                >&#10094;</button>
                
                <div className="carousel-scroll" ref={scrollRef}>
                    {schemes.slice(0, 10).map((scheme, i) => (
                        <div key={scheme._id} className="scheme-card-featured">
                            <div className="card-img-wrapper">
                                <img src={getImageUrl(i)} alt={scheme.nameEn} className="card-img" loading="lazy" />
                                <div className="mini-tag-pill">{scheme.ministryEn || 'Ministry'}</div>
                                {i < 3 && <div className="new-badge">NEW</div>}
                            </div>
                            <div className="card-body">
                                <h3 className="card-scheme-name">{lang === 'en' ? scheme.nameEn : scheme.nameTa}</h3>
                                <p className="cat-name-ta tamil-text">{scheme.nameTa}</p>
                                
                                <div className="benefit-box">
                                    <span className="benefit-amt">{scheme.benefitEn || 'Financial Support'}</span>
                                    <span className="benefit-lbl">BENEIFIT AMOUNT</span>
                                </div>

                                <div className="card-footer-btns">
                                    <a href={`/schemes/${scheme._id}`} className="link-know-more">Know More →</a>
                                    <button className="btn-card-apply" onClick={() => onApplyClick(scheme)}>
                                        {lang === 'en' ? 'Apply' : 'விண்ணப்பிக்க'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button 
                    className="carousel-btn right" 
                    onClick={() => scroll('right')}
                >&#10095;</button>
            </div>

            <style>{`
                .carousel-btn {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 44px;
                    height: 44px;
                    background: white;
                    border: 1px solid var(--gray-100);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    z-index: 10;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    transition: var(--transition);
                }
                .carousel-btn:hover { background: var(--navy); color: white; border-color: var(--navy); }
                .carousel-btn.left { left: -22px; }
                .carousel-btn.right { right: -22px; }
            `}</style>
        </section>
    );
};

export default FeaturedCarousel;
