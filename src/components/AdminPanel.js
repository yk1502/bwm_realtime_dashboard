import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import {
    X, ClipboardList, BookCheck, DollarSign, Users,
    LogOut, Plus, Trash2
} from 'lucide-react';
import './Admin.css';

const AdminPanel = ({
    campaigns,
    libraryItems, 
    volunteerEvents, 
    financialData,
    membershipCount
}) => {
    const [currentView, setCurrentView] = useState('campaigns');
    const [showModal, setShowModal] = useState(false);
    const [showVolModal, setShowVolModal] = useState(false);
    
    const [newCampaign, setNewCampaign] = useState({ name: '', targetGoal: 0, image: '', status: 'Active' });
    const [newVolunteer, setNewVolunteer] = useState({ 
        title: '', group_name: '', impact: '', date: '', description: '' 
    });

    const [localMembership, setLocalMembership] = useState(membershipCount || 0);
    const [localFinancial, setLocalFinancial] = useState(financialData || { current: 0, target: 0 });

    useEffect(() => {
        if (membershipCount !== undefined) setLocalMembership(membershipCount);
        if (financialData) setLocalFinancial(financialData);
    }, [membershipCount, financialData]);

    const handleAddCampaign = async (e) => {
        e.preventDefault();
        const { error } = await supabase.from('campaigns').insert([{
            name: newCampaign.name,
            targetgoal: parseInt(newCampaign.targetGoal),
            image: newCampaign.image,
            status: 'Active',
            slotsfilled: 0
        }]);
        if (!error) {
            setShowModal(false);
            setNewCampaign({ name: '', targetGoal: 0, image: '', status: 'Active' });
        } else {
            alert("Campaign Error: " + error.message);
        }
    };

    const handleAddVolunteer = async (e) => {
        e.preventDefault();
        // NOTE: Ensure your table name is exactly 'volunteer_events' in Supabase
        const { error } = await supabase.from('volunteer_events').insert([newVolunteer]);
        
        if (!error) {
            setShowVolModal(false);
            setNewVolunteer({ title: '', group_name: '', impact: '', date: '', description: '' });
        } else {
            // This alert will tell you exactly why the button "isn't working"
            console.error("Supabase Error:", error);
            alert("Database Error: " + error.message + " (Check if table name is 'volunteer_events')");
        }
    };

    const handleDeleteVolunteer = async (id) => {
        if (window.confirm("Delete this volunteer event?")) {
            const { error } = await supabase.from('volunteer_events').delete().eq('id', id);
            if (error) alert("Delete Error: " + error.message);
        }
    };

    const updateFinancials = async (updates) => {
        setLocalFinancial(prev => ({ ...prev, ...updates }));
        await supabase.from('site_stats').update(updates).eq('id', 1);
    };

    const updateMembership = async (val) => {
        const newValue = val === '' ? 0 : parseInt(val);
        setLocalMembership(val);
        await supabase.from('site_stats').update({ membership_count: newValue }).eq('id', 1);
    };

    const renderView = () => {
        switch(currentView) {
            case 'campaigns':
                return (
                    <div className="view-container">
                        <button className="btn-add-main" onClick={() => setShowModal(true)}><Plus size={18} /> New Campaign</button>
                        <div className="table-wrapper">
                            <table className="admin-table">
                                <thead><tr><th>Image</th><th>Name</th><th>Progress</th><th>Status</th></tr></thead>
                                <tbody>
                                {campaigns.map(c => (
                                    <tr key={c.id}>
                                        <td><img src={c.image} alt="" className="table-thumb" /></td>
                                        <td><strong>{c.name}</strong></td>
                                        <td>{c.slotsfilled} / {c.targetgoal}</td>
                                        <td><span className="badge-active">{c.status}</span></td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'library': // Library Section Restored
                return (
                    <div className="view-container">
                        <div className="header-action-row">
                            <h2 className="section-title">Library Acquisitions Vetting</h2>
                            <button className="btn-manual">+ Log Manual Donation</button>
                        </div>
                        <div className="table-wrapper transparent">
                            <table className="admin-table styled">
                                <thead>
                                    <tr><th>Date</th><th>Book Title & Author</th><th>Donor Name</th><th>Status</th><th>Action</th></tr>
                                </thead>
                                <tbody>
                                    {libraryItems.map((item, i) => (
                                        <tr key={i} className="teal-row">
                                            <td>{item.date}</td><td>{item.title}</td><td>{item.donor}</td><td>Pending Review</td>
                                            <td className="action-cell">
                                                <button className="btn-table-approve">✅ Approve</button>
                                                <button className="btn-table-reject">❌ Reject</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'volunteer':
                return (
                    <div className="view-container">
                        <div className="header-action-row">
                            <h2 className="section-title">Volunteer Impact Logs</h2>
                            <button className="btn-manual" onClick={() => setShowVolModal(true)}>+ Log New Impact</button>
                        </div>
                        <div className="table-wrapper transparent">
                            <table className="admin-table styled">
                                <thead>
                                    <tr><th>Date</th><th>Group/Volunteer</th><th>Title</th><th>Outcome</th><th>Action</th></tr>
                                </thead>
                                <tbody>
                                    {volunteerEvents.map((ev) => (
                                        <tr key={ev.id} className="teal-row">
                                            <td>{ev.date}</td><td>{ev.group_name}</td><td>{ev.title}</td><td>{ev.impact}</td>
                                            <td><Trash2 size={18} className="pointer" color="#ef4444" onClick={() => handleDeleteVolunteer(ev.id)} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'financials':
                return (
                    <div className="view-container">
                        <div className="admin-grid-two">
                            <div className="admin-card-control">
                                <div className="card-badge finance">Finance</div>
                                <div className="input-group"><label>Goal (RM)</label><input type="number" value={localFinancial.target} onChange={(e) => updateFinancials({ financial_target: parseInt(e.target.value) })} /></div>
                                <div className="input-group"><label>Current (RM)</label><input type="number" value={localFinancial.current} onChange={(e) => updateFinancials({ financial_current: parseInt(e.target.value) })} /></div>
                            </div>
                            <div className="admin-card-control">
                                <div className="card-badge member">Membership</div>
                                <div className="input-group"><label>Current Active</label><input type="number" value={localMembership} onChange={(e) => updateMembership(e.target.value)} /></div>
                            </div>
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="admin-layout">
            <aside className="sidebar">
                <div className="sidebar-brand">BWM ADMIN</div>
                <nav className="sidebar-nav">
                    <button onClick={() => setCurrentView('campaigns')} className={`nav-item ${currentView === 'campaigns' ? 'active' : ''}`}><ClipboardList size={18} /> Campaigns</button>
                    {/* Library button added back to sidebar */}
                    <button onClick={() => setCurrentView('library')} className={`nav-item ${currentView === 'library' ? 'active' : ''}`}><BookCheck size={18} /> Library</button>
                    <button onClick={() => setCurrentView('volunteer')} className={`nav-item ${currentView === 'volunteer' ? 'active' : ''}`}><Users size={18} /> Volunteers</button>
                    <button onClick={() => setCurrentView('financials')} className={`nav-item ${currentView === 'financials' ? 'active' : ''}`}><DollarSign size={18} /> Finance</button>
                </nav>
                <a href="/" className="exit-link"><LogOut size={18} /> Public Site</a>
            </aside>
            <main className="admin-body">
                <header className="body-header"><h1>{currentView.toUpperCase()}</h1></header>
                {renderView()}
            </main>
            {/* Campaign Modal */}
            {showModal && (
                <div className="modal-bg">
                    <div className="modal-box">
                        <div className="modal-head"><h2>New Campaign</h2><X onClick={() => setShowModal(false)} className="pointer" /></div>
                        <form onSubmit={handleAddCampaign} className="modal-form">
                            <input placeholder="Name" required value={newCampaign.name} onChange={e => setNewCampaign({...newCampaign, name: e.target.value})} />
                            <input placeholder="Target Seats" type="number" required value={newCampaign.targetGoal} onChange={e => setNewCampaign({...newCampaign, targetGoal: e.target.value})} />
                            <input placeholder="Image URL" required value={newCampaign.image} onChange={e => setNewCampaign({...newCampaign, image: e.target.value})} />
                            <button type="submit" className="btn-add-main">Save Campaign</button>
                        </form>
                    </div>
                </div>
            )}
            {/* Volunteer Modal */}
            {showVolModal && (
                <div className="modal-bg">
                    <div className="modal-box">
                        <div className="modal-head"><h2>Log Volunteer Impact</h2><X onClick={() => setShowVolModal(false)} className="pointer" /></div>
                        <form onSubmit={handleAddVolunteer} className="modal-form">
                            <input placeholder="Event Title" required value={newVolunteer.title} onChange={e => setNewVolunteer({...newVolunteer, title: e.target.value})} />
                            <input placeholder="Group Name" required value={newVolunteer.group_name} onChange={e => setNewVolunteer({...newVolunteer, group_name: e.target.value})} />
                            <input placeholder="Impact (e.g., 50kg Waste)" required value={newVolunteer.impact} onChange={e => setNewVolunteer({...newVolunteer, impact: e.target.value})} />
                            <input type="date" required value={newVolunteer.date} onChange={e => setNewVolunteer({...newVolunteer, date: e.target.value})} />
                            <textarea placeholder="Event Narrative/Description" required value={newVolunteer.description} onChange={e => setNewVolunteer({...newVolunteer, description: e.target.value})} />
                            <button type="submit" className="btn-add-main">Save Impact Log</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;