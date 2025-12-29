import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Smile, ChevronLeft, ChevronRight, HeartHandshake, Coins } from 'lucide-react';
import './Dashboard.css';

const PublicDashboard = ({ campaigns, libraryItems, volunteerEvents, membershipCount, financialData }) => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-slide logic for the Campaign Carousel
    useEffect(() => {
        if (campaigns && campaigns.length > 0) {
            const timer = setInterval(() => nextSlide(), 5000);
            return () => clearInterval(timer);
        }
    }, [currentIndex, campaigns]);

    const nextSlide = () => setCurrentIndex((prev) => (prev === campaigns.length - 1 ? 0 : prev + 1));
    const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? campaigns.length - 1 : prev - 1));

    return (
        <div className="dashboard-container">
            {/* --- Header Section --- */}
            <header className="dashboard-header">
                <h1 className="title">Community Impact Dashboard</h1>
                <div className="header-actions">
                    <nav className="header-nav">
                        <span onClick={() => navigate('/volunteer-timeline')}>Volunteer Logs</span>
                        <span onClick={() => navigate('/library-archive')}>Library Acquisitions</span>
                    </nav>
                    <LogOut
                        className="logout-icon"
                        size={24}
                        color="#374151"
                        onClick={() => navigate('/admin')}
                        title="Admin Panel"
                    />
                </div>
            </header>

            <div className="main-layout-grid">
                {/* --- Left Column: Campaigns Carousel --- */}
                <div className="left-column">
                    <section className="card carousel-container">
                        <h2 className="card-header">Live Campaigns & Events</h2>
                        <div className="carousel-view">
                            <div className="carousel-track" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                                {campaigns.map((c, idx) => (
                                    <div key={c.id || idx} className="carousel-slide">
                                        <div className="campaign-body">
                                            <div className="progress-wrapper">
                                                <div className="progress-label">
                                                    <span>{c.name}</span>
                                                    {/* Updated to match Supabase field names */}
                                                    <span><strong>{c.slotsfilled || 0} / {c.targetgoal || 0}</strong> Seats</span>
                                                </div>
                                                <div className="progress-bg">
                                                    <div 
                                                        className="progress-fill-orange" 
                                                        style={{ width: `${(c.slotsfilled / (c.targetgoal || 1)) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <button className="btn-register" onClick={() => navigate(`/event-registration/${c.id}`)}>
                                                Register Now
                                            </button>
                                        </div>
                                        <div className="internal-image-frame">
                                            <img src={c.image} alt={c.name} className="internal-hero-image" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {campaigns.length > 1 && (
                                <>
                                    <button className="nav-btn prev" onClick={prevSlide}><ChevronLeft size={30} /></button>
                                    <button className="nav-btn next" onClick={nextSlide}><ChevronRight size={30} /></button>
                                </>
                            )}
                        </div>
                    </section>
                </div>

                {/* --- Right Column: Gauges and Activity Lists --- */}
                <div className="right-column">
                    <section className="card stats-card">
                        <div className="gauge-row-container">
                            <div className="gauge-section">
                                <HeartHandshake size={24} color="#0f766e" />
                                <h3 className="gauge-title">Membership</h3>
                                <div className="stat-value">{membershipCount}</div>
                                <div className="mini-progress-bg">
                                    <div className="progress-fill-teal" style={{ width: `${(membershipCount / 500) * 100}%` }}></div>
                                </div>
                            </div>
                            <div className="gauge-divider-vertical"></div>
                            <div className="gauge-section">
                                <Coins size={24} color="#b45309" />
                                <h3 className="gauge-title">Donations</h3>
                                <div className="stat-value financial">RM {financialData.current.toLocaleString()}</div>
                                <div className="mini-progress-bg">
                                    <div className="progress-fill-gold" style={{ width: `${(financialData.current / (financialData.target || 1)) * 100}%` }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="gauge-footer-actions">
                            <button className="btn-register" onClick={() => navigate('/membership-registration')}>Join Us</button>
                            <button className="btn-donate" onClick={() => navigate('/donate')}>Donate</button>
                        </div>
                    </section>

                    <section className="card list-card">
                        <div className="card-sidebar">
                            <Smile size={32} color="#0f766e" />
                            <button className="btn-history" onClick={() => navigate('/library-archive')}>History</button>
                        </div>
                        <div className="card-list-content">
                            <h3 className="list-title">New Library Acquisitions</h3>
                            {libraryItems.slice(0, 3).map((item, idx) => (
                                <div key={idx} className="item-entry" onClick={() => navigate(`/library-detail/${item.id}`)} style={{cursor: 'pointer'}}>
                                    <p className="item-title-text">{item.title}</p>
                                    <p className="item-meta">Donor: {item.donor} <span>{item.date}</span></p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="card list-card">
                        <div className="card-sidebar">
                            <Smile size={32} color="#0f766e" />
                            <button className="btn-history" onClick={() => navigate('/volunteer-timeline')}>History</button>
                        </div>
                        <div className="card-list-content">
                            <h3 className="list-title">Volunteer Impact Timeline</h3>
                            {volunteerEvents.slice(0, 2).map((event, idx) => (
                                <div key={idx} className="item-entry" onClick={() => navigate(`/volunteer-detail/${event.id}`)} style={{cursor: 'pointer'}}>
                                    <p className="item-title-text">{event.title}</p>
                                    <p className="item-meta">{event.impact} <span>{event.date}</span></p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PublicDashboard;