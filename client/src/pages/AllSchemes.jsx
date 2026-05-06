import React, { useState } from 'react';

const AllSchemes = ({ lang, schemes, handleApplyClick }) => {
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');

    const categories = ['All', 'Agriculture', 'Health', 'Education', 'Women & Child', 'Housing', 'Employment', 'Social Welfare'];

    const filtered = schemes.filter(s => {
        const matchesSearch = s.nameEn.toLowerCase().includes(search.toLowerCase()) || s.nameTa.includes(search);
        const matchesCategory = filterCategory === 'All' || s.categoryEn === filterCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="main-container" style={{ display: 'flex', gap: '40px', padding: '40px 5%' }}>
            {/* Sidebar Filter */}
            <aside style={{ width: '280px', flexShrink: 0 }}>
                <div style={{ position: 'sticky', top: '100px', backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid var(--gray-100)' }}>
                    <h3 style={{ fontSize: '18px', marginBottom: '20px', color: 'var(--navy)' }}>Filters</h3>
                    
                    <div className="filter-group" style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Search</label>
                        <input 
                            type="text" 
                            placeholder="Scheme name..." 
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--gray-100)' }}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>Category</label>
                        {categories.map(cat => (
                            <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '14px', cursor: 'pointer' }}>
                                <input 
                                    type="radio" 
                                    name="category" 
                                    checked={filterCategory === cat} 
                                    onChange={() => setFilterCategory(cat)}
                                />
                                {cat}
                            </label>
                        ))}
                    </div>

                    <button className="btn-hero-apply" style={{ width: '100%', marginTop: '20px', fontSize: '14px', padding: '10px' }}>
                        Apply Filters
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '700' }}>
                        {lang === 'en' ? 'Available Schemes' : 'கிடைக்கும் திட்டங்கள்'}
                    </h2>
                    <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Showing {filtered.length} schemes</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {filtered.map((scheme, i) => (
                        <div key={scheme._id} className="scheme-card-featured" style={{ minWidth: 'auto', maxWidth: 'none' }}>
                            <div className="card-img-wrapper" style={{ height: '140px' }}>
                                <img src={`https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&q=80`} alt={scheme.nameEn} className="card-img" />
                                <div className="mini-tag-pill">{scheme.ministryEn}</div>
                            </div>
                            <div className="card-body">
                                <h3 className="card-scheme-name" style={{ fontSize: '15px', height: '40px' }}>{lang === 'en' ? scheme.nameEn : scheme.nameTa}</h3>
                                <div className="benefit-box" style={{ marginTop: '12px' }}>
                                    <span className="benefit-amt" style={{ fontSize: '16px' }}>{scheme.benefitEn}</span>
                                </div>
                                <div className="card-footer-btns" style={{ marginTop: '16px' }}>
                                    <a href={`/schemes/${scheme._id}`} className="link-know-more">Details →</a>
                                    <button className="btn-card-apply" onClick={() => handleApplyClick(scheme)}>Apply</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AllSchemes;
