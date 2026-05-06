import React, { useState } from 'react';

const categories = [
    { id: 'Agri', en: 'Agriculture', ta: 'வேளாண்மை', color: '#16A34A', count: 184 },
    { id: 'Health', en: 'Health', ta: 'சுகாதாரம்', color: '#DC2626', count: 125 },
    { id: 'Edu', en: 'Education', ta: 'கல்வி', color: '#2563EB', count: 210 },
    { id: 'Women', en: 'Women & Child', ta: 'பெண்கள் & குழந்தைகள்', color: '#DB2777', count: 96 },
    { id: 'House', en: 'Housing', ta: 'வீட்டு வசதி', color: '#D97706', count: 42 },
    { id: 'Jobs', en: 'Employment', ta: 'வேலைவாய்ப்பு', color: '#7C3AED', count: 156 },
    { id: 'Social', en: 'Social Welfare', ta: 'சமூக நலம்', color: '#0891B2', count: 320 },
    { id: 'Finance', en: 'Finance', ta: 'நிதி', color: '#059669', count: 88 },
    { id: 'Trans', en: 'Transport', ta: 'போக்குவரத்து', color: '#EA580C', count: 34 },
    { id: 'Sports', en: 'Sports', ta: 'விளையாட்டு', color: '#4F46E5', count: 22 },
    { id: 'Culture', en: 'Culture', ta: 'கலாச்சாரம்', color: '#E11D48', count: 18 },
    { id: 'Science', en: 'Science', ta: 'அறிவியல்', color: '#0E7490', count: 15 }
];

const CategoryTabs = ({ lang }) => {
    const [activeTab, setActiveTab] = useState('categories');

    return (
        <section className="section-common bg-light">
            <div className="section-header">
                <h2 className="section-title-main">
                    {lang === 'en' ? 'Find Schemes For You' : 'உங்களுக்கான திட்டங்களை கண்டறியுங்கள்'}
                </h2>
                <p className="section-subtitle-main">
                    {lang === 'en' ? 'Browse schemes based on your preferences' : 'உங்கள் விருப்பங்களின் அடிப்படையில் திட்டங்களை உலாவவும்'}
                </p>
            </div>

            <div className="find-schemes-tabs">
                <div className="tab-nav">
                    <div 
                        className={`tab-item ${activeTab === 'categories' ? 'active' : ''}`}
                        onClick={() => setActiveTab('categories')}
                    >
                        {lang === 'en' ? 'Categories' : 'வகைகள்'}
                    </div>
                    <div 
                        className={`tab-item ${activeTab === 'states' ? 'active' : ''}`}
                        onClick={() => setActiveTab('states')}
                    >
                        {lang === 'en' ? 'States/UTs' : 'மாநிலங்கள்/யூனியன் பிரதேசங்கள்'}
                    </div>
                    <div 
                        className={`tab-item ${activeTab === 'ministries' ? 'active' : ''}`}
                        onClick={() => setActiveTab('ministries')}
                    >
                        {lang === 'en' ? 'Central Ministries' : 'மத்திய அமைச்சகங்கள்'}
                    </div>
                </div>

                <div className="tab-content">
                    {activeTab === 'categories' && (
                        <div className="category-grid">
                            {categories.map((cat, i) => (
                                <div key={cat.id} className="category-card" style={{ animationDelay: `${i * 60}ms` }}>
                                    <div className="cat-icon-box" style={{ backgroundColor: `${cat.color}15`, color: cat.color }}>
                                        {/* Simple dynamic SVG placeholder */}
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="3" width="18" height="18" rx="2" />
                                        </svg>
                                    </div>
                                    <span className="cat-name-en">{cat.en}</span>
                                    <span className="cat-name-ta tamil-text">{cat.ta}</span>
                                    <span className="scheme-count-badge">{cat.count} Schemes</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'states' && (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                            Selected states content here...
                        </div>
                    )}

                    {activeTab === 'ministries' && (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                            Central Ministries content here...
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default CategoryTabs;
