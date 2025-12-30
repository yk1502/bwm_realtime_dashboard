// src/components/AdminPanel.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import {
    X, ClipboardList, BookCheck, DollarSign, Users,
    LogOut, Plus, Trash2
} from 'lucide-react';
import './Admin.css';

// Added onLogout to props
const AdminPanel = ({ campaigns, libraryItems, volunteerEvents, financialData, membershipCount, onLogout }) => {
    const [currentView, setCurrentView] = useState('campaigns');
    const [showModal, setShowModal] = useState(false);
    const [showVolModal, setShowVolModal] = useState(false);
    const [showLibModal, setShowLibModal] = useState(false);
    
    const [newCampaign, setNewCampaign] = useState({ name: '', targetGoal: 0, image: '', status: 'Active' });
    const [newVolunteer, setNewVolunteer] = useState({ title: '', groupname: '', impact: '', date: '', description: '' });
    const [newLibraryItem, setNewLibraryItem] = useState({ title: '', donor: '', category: '', date: '', description: '' });

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
        if (!error) { setShowModal(false); setNewCampaign({ name: '', targetGoal: 0, image: '', status: 'Active' }); }
        else { alert("Campaign Error: " + error.message); }
    };

    const handleAddVolunteer = async (e) => {
        e.preventDefault();
        const { error } = await supabase.from('volunteer_events').insert([newVolunteer]);
        if (!error) { setShowVolModal(false); setNewVolunteer({ title: '', groupname: '', impact: '', date: '', description: '' }); }
        else { alert("Volunteer Error: " + error.message); }
    };

    const handleAddLibraryItem = async (e) => {
        e.preventDefault();
        const { error } = await supabase.from('library_items').insert([newLibraryItem]);
        if (!error) {
            setShowLibModal(false);
            setNewLibraryItem({ title: '', donor: '', category: '', date: '', description: '' });
        } else {
            alert("Library Error: " + error.message + " (Ensure table name is 'library_items')");
        }
    };

    const handleDeleteLibrary = async (id) => {
        if (window.confirm("Delete this library item?")) {
            const { error } = await supabase.from('library_items').delete().eq('id', id);
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
                                <thead><tr><th>Image</th><th>Name</th><th>Progress</th></tr></thead>
                                <tbody>
                                {campaigns.map(c => (
                                    <tr key={c.id}><td><img src={c.image} alt="" className="table-thumb" /></td><td><strong>{c.name}</strong></td><td>{c.slotsfilled} / {c.targetgoal}</td></tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'library':
                return (
                    <div className="view-container">
                        <div className="header-action-row">
                            <h2 className="section-title">Library Acquisitions</h2>
                            <button className="btn-manual" onClick={() => setShowLibModal(true)}>+ Add New Item</button>
                        </div>
                        <div className="table-wrapper transparent">
                            <table className="admin-table styled">
                                <thead><tr><th>Date</th><th>Title</th><th>Donor</th><th>Category</th><th>Action</th></tr></thead>
                                <tbody>
                                    {libraryItems.map((item) => (
                                        <tr key={item.id} className="teal-row">
                                            <td>{item.date}</td><td>{item.title}</td><td>{item.donor}</td><td>{item.category}</td>
                                            <td><Trash2 size={18} className="pointer" color="#ef4444" onClick={() => handleDeleteLibrary(item.id)} /></td>
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
                                <thead><tr><th>Date</th><th>Group</th><th>Title</th><th>Action</th></tr></thead>
                                <tbody>
                                    {volunteerEvents.map((ev) => (
                                        <tr key={ev.id} className="teal-row"><td>{ev.date}</td><td>{ev.groupname}</td><td>{ev.title}</td><td><Trash2 size={18} className="pointer" color="#ef4444" onClick={() => {}} /></td></tr>
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
                            <div className="admin-card-control"><div className="card-badge member">Membership</div><div className="input-group"><label>Current Active</label><input type="number" value={localMembership} onChange={(e) => updateMembership(e.target.value)} /></div></div>
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
                    <button onClick={() => setCurrentView('library')} className={`nav-item ${currentView === 'library' ? 'active' : ''}`}><BookCheck size={18} /> Library</button>
                    <button onClick={() => setCurrentView('volunteer')} className={`nav-item ${currentView === 'volunteer' ? 'active' : ''}`}><Users size={18} /> Volunteers</button>
                    <button onClick={() => setCurrentView('financials')} className={`nav-item ${currentView === 'financials' ? 'active' : ''}`}><DollarSign size={18} /> Finance</button>
                </nav>
                {/* Changed from <a> to <button> to handle logout state */}
                <button onClick={onLogout} className="exit-link" style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                    <LogOut size={18} /> Logout
                </button>
            </aside>
            <main className="admin-body">
                <header className="body-header"><h1>{currentView.toUpperCase()}</h1></header>
                {renderView()}
            </main>
            {showModal && (
                <div className="modal-bg"><div className="modal-box"><div className="modal-head"><h2>New Campaign</h2><X onClick={() => setShowModal(false)} className="pointer" /></div><form onSubmit={handleAddCampaign} className="modal-form"><input placeholder="Name" required value={newCampaign.name} onChange={e => setNewCampaign({...newCampaign, name: e.target.value})} /><input placeholder="Target Seats" type="number" required value={newCampaign.targetGoal} onChange={e => setNewCampaign({...newCampaign, targetGoal: e.target.value})} /><input placeholder="Image URL" required value={newCampaign.image} onChange={e => setNewCampaign({...newCampaign, image: e.target.value})} /><button type="submit" className="btn-add-main">Save Campaign</button></form></div></div>
            )}
            {showVolModal && (
                <div className="modal-bg"><div className="modal-box"><div className="modal-head"><h2>Log Volunteer Impact</h2><X onClick={() => setShowVolModal(false)} className="pointer" /></div><form onSubmit={handleAddVolunteer} className="modal-form"><input placeholder="Title" required value={newVolunteer.title} onChange={e => setNewVolunteer({...newVolunteer, title: e.target.value})} /><input placeholder="Group" required value={newVolunteer.groupname} onChange={e => setNewVolunteer({...newVolunteer, groupname: e.target.value})} /><input placeholder="Impact" required value={newVolunteer.impact} onChange={e => setNewVolunteer({...newVolunteer, impact: e.target.value})} /><input type="date" required value={newVolunteer.date} onChange={e => setNewVolunteer({...newVolunteer, date: e.target.value})} /><textarea placeholder="Description" required value={newVolunteer.description} onChange={e => setNewVolunteer({...newVolunteer, description: e.target.value})} /><button type="submit" className="btn-add-main">Save Impact</button></form></div></div>
            )}
            {showLibModal && (
                <div className="modal-bg"><div className="modal-box"><div className="modal-head"><h2>Add Library Item</h2><X onClick={() => setShowLibModal(false)} className="pointer" /></div><form onSubmit={handleAddLibraryItem} className="modal-form"><input placeholder="Title" required value={newLibraryItem.title} onChange={e => setNewLibraryItem({...newLibraryItem, title: e.target.value})} /><input placeholder="Donor Name" required value={newLibraryItem.donor} onChange={e => setNewLibraryItem({...newLibraryItem, donor: e.target.value})} /><input placeholder="Category" required value={newLibraryItem.category} onChange={e => setNewLibraryItem({...newLibraryItem, category: e.target.value})} /><input type="date" required value={newLibraryItem.date} onChange={e => setNewLibraryItem({...newLibraryItem, date: e.target.value})} /><textarea placeholder="Item Description" required value={newLibraryItem.description} onChange={e => setNewLibraryItem({...newLibraryItem, description: e.target.value})} /><button type="submit" className="btn-add-main">Save Item</button></form></div></div>
            )}
        </div>
    );
};

export default AdminPanel;