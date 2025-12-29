import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { supabase } from './supabaseClient';

// Components & Pages
import PublicDashboard from './components/PublicDashboard';
import AdminPanel from './components/AdminPanel';
import DonationPage from './pages/DonationPage';
import EventRegistration from './pages/EventRegistration';
import LibraryArchive from './pages/LibraryArchive';
import LibraryItemDetail from './pages/LibraryItemDetail';
import MembershipRegistration from './pages/MembershipRegistration';
import VolunteerTimeline from './pages/VolunteerTimeline';
import VolunteerEventDetail from './pages/VolunteerEventDetail';

function App() {
    // 1. Supabase State (Real-time)
    const [financialData, setFinancialData] = useState({ current: 0, target: 0 });
    const [membershipCount, setMembershipCount] = useState(0);
    const [campaigns, setCampaigns] = useState([]);

    // 2. Mock Data State (Local only - no Supabase yet)
    const [libraryItems, setLibraryItems] = useState([
        { id: 1, title: "Old Kuala Lumpur Map (1920)", donor: "John Doe", category: "Cartography", date: "22 Dec 2025", description: "A rare hand-drawn map showing the colonial layout of central KL." }
    ]);
    const [volunteerEvents, setVolunteerEvents] = useState([
        { id: 1, title: "Cleanup Drive", group: "Corporate Team A", impact: "50kg Waste Removed", date: "15 Sep 2025", description: "Large-scale effort to clean heritage grounds." }
    ]);

    useEffect(() => {
        const fetchData = async () => {
            const { data: stats } = await supabase.from('site_stats').select('*').eq('id', 1).single();
            if (stats) {
                setFinancialData({ current: stats.financial_current, target: stats.financial_target });
                setMembershipCount(stats.membership_count);
            }
            const { data: campData } = await supabase.from('campaigns').select('*').order('created_at', { ascending: false });
            if (campData) setCampaigns(campData);
        };

        fetchData();

        const statsChannel = supabase.channel('realtime_stats')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'site_stats', filter: 'id=eq.1' }, (payload) => {
                setFinancialData({ current: payload.new.financial_current, target: payload.new.financial_target });
                setMembershipCount(payload.new.membership_count);
            }).subscribe();

        const campChannel = supabase.channel('realtime_campaigns')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'campaigns' }, (payload) => {
                if (payload.eventType === 'INSERT') setCampaigns(prev => [payload.new, ...prev]);
                else if (payload.eventType === 'UPDATE') setCampaigns(prev => prev.map(c => c.id === payload.new.id ? payload.new : c));
                else if (payload.eventType === 'DELETE') setCampaigns(prev => prev.filter(c => c.id !== payload.old.id));
            }).subscribe();

        return () => {
            supabase.removeChannel(statsChannel);
            supabase.removeChannel(campChannel);
        };
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={
                    <PublicDashboard 
                        campaigns={campaigns} 
                        libraryItems={libraryItems} 
                        volunteerEvents={volunteerEvents} 
                        membershipCount={membershipCount} 
                        financialData={financialData} 
                    />
                } />
                <Route path="/admin" element={
                    <AdminPanel 
                        campaigns={campaigns} 
                        libraryItems={libraryItems} setLibraryItems={setLibraryItems}
                        volunteerEvents={volunteerEvents} setVolunteerEvents={setVolunteerEvents}
                        financialData={financialData} 
                        membershipCount={membershipCount} 
                    />
                } />
                {/* ... other routes remain unchanged */}
                <Route path="/volunteer-timeline" element={<VolunteerTimeline events={volunteerEvents} />} />
                <Route path="/library-archive" element={<LibraryArchive items={libraryItems} />} />
                <Route path="/donate" element={<DonationPage financialData={financialData} />} />
                <Route path="/membership-registration" element={<MembershipRegistration membershipCount={membershipCount} />} />
                <Route path="/event-registration/:id" element={<EventRegistration />} />
            </Routes>
        </Router>
    );
}

export default App;