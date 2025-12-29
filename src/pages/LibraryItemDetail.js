import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, User } from 'lucide-react';
import './Pages.css';

const LibraryItemDetail = ({ items }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const item = items.find(i => i.id === parseInt(id));

    if (!item) return <div className="page-wrapper-cream">Item not found.</div>;

    return (
        <div className="page-wrapper-cream">
            <button className="btn-back-pill" onClick={() => navigate('/library-archive')}>
                <ArrowLeft size={16} /> Back to Archive
            </button>

            <div className="detail-card">
                <div className="detail-header-teal">
                    <BookOpen size={40} color="white" />
                    <h1>{item.title}</h1>
                </div>

                <div className="detail-body">
                    <section className="detail-section">
                        <h3><User size={18} /> Donor Credit</h3>
                        <p className="credit-name">{item.donor}</p>
                        <p className="credit-description">
                            The BWM extends its deepest gratitude for this contribution to the national heritage archive.
                        </p>
                    </section>

                    <section className="detail-section">
                        <h3>Item Description</h3>
                        <p className="main-description">{item.description}</p>
                    </section>

                    <div className="detail-metadata">
                        <span><strong>Category:</strong> {item.category}</span>
                        <span><strong>Date Acquired:</strong> {item.date}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LibraryItemDetail;