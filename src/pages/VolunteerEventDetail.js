import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Users } from 'lucide-react';
import './Pages.css';

const VolunteerEventDetail = ({ events }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const event = events.find(e => e.id === parseInt(id));

    if (!event) return <div className="page-wrapper-cream">Event not found.</div>;

    return (
        <div className="page-wrapper-cream">
            <button className="btn-back-pill" onClick={() => navigate('/volunteer-timeline')}>
                <ArrowLeft size={16} /> Back to Timeline
            </button>

            <div className="detail-card">
                <div className="detail-header-teal">
                    <Heart size={40} color="white" />
                    <h1>{event.title}</h1>
                </div>

                <div className="detail-body">
                    <section className="detail-section">
                        <h3><Users size={18} /> Organizing Group</h3>
                        <p className="group-highlight">{event.group}</p>
                    </section>

                    <section className="detail-section">
                        <h3>Event Narrative</h3>
                        <p className="main-description">{event.description}</p>
                    </section>

                    <div className="impact-footer">
                        <div className="impact-stat">
                            <span className="label">Total Impact</span>
                            <span className="value">{event.impact}</span>
                        </div>
                        <div className="impact-stat">
                            <span className="label">Date</span>
                            <span className="value">{event.date}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VolunteerEventDetail;