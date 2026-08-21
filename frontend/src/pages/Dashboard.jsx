import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Package,
    MoveRight,
    Wrench,
    AlertTriangle,
    MapPin,
    Search,
    Plus,
    CheckCircle,
    FileText,
    Trash2,
    Pencil,
    X,
    Loader2,
    PieChart,
    ArrowRightLeft,
    Clock,
    Check,
    Filter,
    HelpCircle,
    ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UserManagement from '../components/UserManagement';

export default function Dashboard() {
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('otech_user') || '{}');
    const [currentTab, setCurrentTab] = useState('dashboard');
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [kits, setKits] = useState([]);
    const [transferrableKits, setTransferrableKits] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Interactive Donut segment hover state
    const [hoveredSegment, setHoveredSegment] = useState(null);

    // Interactive Map region hover state
    const [hoveredRegion, setHoveredRegion] = useState(null);

    // Asset Registry Modal & Form state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingKitId, setEditingKitId] = useState(null);
    const [newKit, setNewKit] = useState({
        kitId: '',
        serialNumber: '',
        machineType: 'Laptop',
        zone: '',
        city: '',
        officer: '',
        status: 'Active'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mock Transfer Data & Modal State
    const [transfers, setTransfers] = useState([
        { id: 'TR-1001', kitId: 'NID-0001', fromZone: 'East Oromia', toZone: 'West Oromia', date: '2026-07-20', status: 'Completed' },
        { id: 'TR-1002', kitId: 'NID-0002', fromZone: 'North Oromia', toZone: 'South Oromia', date: '2026-07-22', status: 'Pending' },
    ]);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [newTransfer, setNewTransfer] = useState({
        kitId: '',
        fromZone: '',
        toZone: '',
        date: new Date().toISOString().split('T')[0]
    });

    // Mock Maintenance Data & Modal State
    const [maintenance, setMaintenance] = useState([
        { id: 'MN-9081', kitId: 'NID-0002', issue: 'Fingerprint sensor unresponsive', date: '2026-07-18', priority: 'High', status: 'In Progress' },
        { id: 'MN-9082', kitId: 'NID-0003', issue: 'Camera lens scratch replacement', date: '2026-07-21', priority: 'Medium', status: 'Resolved' },
    ]);
    const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
    const [newMaintenance, setNewMaintenance] = useState({
        kitId: '',
        issue: '',
        priority: 'Medium',
        date: new Date().toISOString().split('T')[0]
    });

    // Fetch kits from API
    const fetchKits = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/kits');
            if (!response.ok) {
                throw new Error('Failed to fetch kits from API');
            }
            const data = await response.json();
            setKits(data);
        } catch (err) {
            console.error('Error fetching kits:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTranferrableKits = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/kits?status=Active');
            if (!response.ok) {
                throw new Error('Failed to fetch kits from API');
            }
            const data = await response.json();
            setTransferrableKits(data);
        } catch (err) {
            console.error('Error fetching kits:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchKits();
        fetchTranferrableKits();
    }, []);

    // Create or Update a kit
    const handleSubmitKit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const url = editingKitId ? `/api/kits/${editingKitId}` : '/api/kits';
            const method = editingKitId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newKit),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || `Failed to ${editingKitId ? 'update' : 'create'} kit`);
            }

            // Refresh list
            await fetchKits();
            setIsModalOpen(false);
            setEditingKitId(null);
            // Reset form
            setNewKit({
                kitId: '',
                serialNumber: '',
                machineType: 'Laptop',
                zone: '',
                city: '',
                officer: '',
                status: 'Active'
            });
        } catch (err) {
            alert(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Trigger Edit Mode
    const startEditKit = (kit) => {
        setEditingKitId(kit.id);
        setNewKit({
            kitId: kit.kitId,
            serialNumber: kit.serialNumber,
            machineType: kit.machineType,
            zone: kit.zone || '',
            city: kit.city || '',
            officer: kit.officer || '',
            status: kit.status
        });
        setIsModalOpen(true);
    };

    // Trigger Create Mode
    const startCreateKit = () => {
        setEditingKitId(null);
        setNewKit({
            kitId: '',
            serialNumber: '',
            machineType: 'Laptop',
            zone: '',
            city: '',
            officer: '',
            status: 'Active'
        });
        setIsModalOpen(true);
    };

    // Delete a kit
    const handleDeleteKit = async (id) => {
        if (!window.confirm('Are you sure you want to delete this kit?')) {
            return;
        }

        try {
            const response = await fetch(`/api/kits/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete kit');
            }

            // Remove from state
            setKits(prev => prev.filter(k => k.id !== id));
        } catch (err) {
            alert(err.message);
        }
    };

    // Initiate Transfer Submission
    const handleInitiateTransfer = (e) => {
        e.preventDefault();
        const id = `TR-${Math.floor(1000 + Math.random() * 9000)}`;
        setTransfers(prev => [
            {
                id,
                kitId: newTransfer.kitId,
                fromZone: newTransfer.fromZone,
                toZone: newTransfer.toZone,
                date: newTransfer.date,
                status: 'Pending'
            },
            ...prev
        ]);
        setIsTransferModalOpen(false);
        setNewTransfer({
            kitId: '',
            fromZone: '',
            toZone: '',
            date: new Date().toISOString().split('T')[0]
        });
    };

    // File Repair Order Submission
    const handleFileRepairOrder = (e) => {
        e.preventDefault();
        const id = `MN-${Math.floor(9000 + Math.random() * 1000)}`;
        setMaintenance(prev => [
            {
                id,
                kitId: newMaintenance.kitId,
                issue: newMaintenance.issue,
                priority: newMaintenance.priority,
                date: newMaintenance.date,
                status: 'In Progress'
            },
            ...prev
        ]);
        setIsMaintenanceModalOpen(false);
        setNewMaintenance({
            kitId: '',
            issue: '',
            priority: 'Medium',
            date: new Date().toISOString().split('T')[0]
        });
    };

    // Dynamic search terms highlighting helper
    const renderHighlightedText = (text, search) => {
        if (!text) return '';
        if (!search) return text;
        const regex = new RegExp(`(${search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
        const parts = text.split(regex);
        return parts.map((part, index) => 
            regex.test(part) 
                ? <mark key={index} className="bg-yellow-100 text-slate-900 rounded px-0.5 font-semibold">{part}</mark> 
                : part
        );
    };

    // Compute metrics dynamically from backend kits
    const totalCount = kits.length;
    const activeCount = kits.filter(k => k.status === 'Active').length;
    const maintenanceCount = kits.filter(k => k.status === 'Under Maintenance').length;
    const lostCount = kits.filter(k => k.status === 'Lost' || k.status === 'Stolen').length;

    const stats = [
        { label: 'Total Kits', count: totalCount.toLocaleString(), icon: Package, color: 'bg-blue-500 shadow-blue-500/20' },
        { label: 'Active Kits', count: activeCount.toLocaleString(), icon: CheckCircle, color: 'bg-green-500 shadow-green-500/20' },
        { label: 'Under Maintenance', count: maintenanceCount.toLocaleString(), icon: Wrench, color: 'bg-amber-500 shadow-amber-500/20' },
        { label: 'Lost / Stolen', count: lostCount.toLocaleString(), icon: AlertTriangle, color: 'bg-red-500 shadow-red-500/20' },
    ];

    // Chart calculations
    const chartTotal = activeCount + maintenanceCount + lostCount || 1;
    const pctActive = (activeCount / chartTotal) * 100;
    const pctMaint = (maintenanceCount / chartTotal) * 100;
    const pctLost = (lostCount / chartTotal) * 100;

    const radius = 35;
    const circumference = 2 * Math.PI * radius; // ~219.91

    const activeLength = (pctActive / 100) * circumference;
    const maintLength = (pctMaint / 100) * circumference;
    const lostLength = (pctLost / 100) * circumference;

    const activeRotation = -90;
    const maintRotation = -90 + (pctActive / 100) * 360;
    const lostRotation = -90 + ((pctActive + pctMaint) / 100) * 360;

    // Filtered kits mapping
    const filteredKits = kits.filter(kit => {
        const matchesSearch = 
            (kit.kitId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (kit.serialNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (kit.city || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (kit.officer || '').toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesType = typeFilter === 'All' || kit.machineType === typeFilter;
        const matchesStatus = statusFilter === 'All' || kit.status === statusFilter;

        return matchesSearch && matchesType && matchesStatus;
    });

    // Mock Regional counts for Interactive Ethiopia Map
    const regions = [
        { id: 'oromia', name: 'Oromia Region', path: 'M 10 40 L 40 20 L 70 35 L 80 70 L 50 85 L 20 75 Z', color: 'fill-emerald-500/20 hover:fill-emerald-500/40', count: kits.filter(k => (k.zone || '').includes('Oromia')).length },
        { id: 'amhara', name: 'Amhara Region', path: 'M 25 15 L 45 5 L 60 15 L 50 35 L 35 25 Z', color: 'fill-blue-500/20 hover:fill-blue-500/40', count: kits.filter(k => (k.zone || '').includes('Amhara')).length },
        { id: 'somali', name: 'Somali Region', path: 'M 70 35 L 95 45 L 85 80 L 75 75 Z', color: 'fill-amber-500/20 hover:fill-amber-500/40', count: kits.filter(k => (k.zone || '').includes('Somali')).length },
        { id: 'tigray', name: 'Tigray Region', path: 'M 35 5 L 45 2 L 50 10 L 40 12 Z', color: 'fill-red-500/20 hover:fill-red-500/40', count: kits.filter(k => (k.zone || '').includes('Tigray')).length }
    ];

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-800">

            {/* SIDEBAR NAVIGATION */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between shadow-2xl z-10">
                <div>
                    <div className="p-5 border-b border-slate-800 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-red-500 flex items-center justify-center font-black text-xl shadow-lg shadow-red-500/20">
                            O
                        </div>
                        <div>
                            <h1 className="font-extrabold text-sm leading-tight tracking-tight">OTech Solutions</h1>
                            <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Asset Registry</p>
                        </div>
                    </div>

                    <nav className="p-4 space-y-1.5">
                        <button
                            onClick={() => setCurrentTab('dashboard')}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                currentTab === 'dashboard' 
                                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/25 scale-[1.02]' 
                                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
                            }`}
                        >
                            <LayoutDashboard size={18} /> Dashboard
                        </button>
                        <button
                            onClick={() => setCurrentTab('inventory')}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                currentTab === 'inventory' 
                                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/25 scale-[1.02]' 
                                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
                            }`}
                        >
                            <Package size={18} /> Asset Registry
                        </button>
                        <button
                            onClick={() => setCurrentTab('transfers')}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                currentTab === 'transfers' 
                                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/25 scale-[1.02]' 
                                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
                            }`}
                        >
                            <MoveRight size={18} /> Kit Transfers
                        </button>
                        <button
                            onClick={() => setCurrentTab('maintenance')}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                currentTab === 'maintenance' 
                                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/25 scale-[1.02]' 
                                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
                            }`}
                        >
                            <Wrench size={18} /> Maintenance
                        </button>
                        {currentUser.role === 'admin' && <button
                            onClick={() => setCurrentTab('users')}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                currentTab === 'users'
                                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/25 scale-[1.02]'
                                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
                            }`}
                        >
                            <ShieldCheck size={18} /> Users & Roles
                        </button>}
                    </nav>
                </div>

                <div className="p-4 border-t border-slate-800/40 text-[10px] text-slate-500 text-center uppercase tracking-wider font-semibold">
                    v1.2 • OTech Engineering
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col overflow-y-auto">

                {/* TOP BAR Header */}
                <header className="bg-white border-b border-slate-200/80 h-16 flex items-center justify-between px-8 shadow-sm">
                    <div className="flex items-center gap-3 bg-slate-100/80 px-3.5 py-2 rounded-xl w-80 border border-slate-200/40 focus-within:border-slate-300 transition-all">
                        <Search size={16} className="text-slate-400" />
                        <input
                            type="text"
                            placeholder="Global Search (Kit ID, Serial, Officer...)"
                            className="bg-transparent text-sm w-full focus:outline-none placeholder-slate-400 text-slate-700"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-xs bg-emerald-100/70 text-emerald-800 px-3 py-1 rounded-full font-semibold border border-emerald-200/50">
                          Gateway Connected
                        </span>
                                                <div className="w-8.5 h-8.5 rounded-full bg-slate-200/80 flex items-center justify-center font-bold text-sm text-slate-700 border border-slate-300" title={currentUser.email}>
                                                    {(currentUser.name || currentUser.email || 'U').slice(0, 2).toUpperCase()}
                        </div>
                                                <button onClick={() => { localStorage.removeItem('otech_user'); navigate('/login', { replace: true }); }} className="text-xs bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1.5 rounded-xl font-semibold transition border border-red-100/50 cursor-pointer">
                          Logout
                        </button>
                    </div>
                </header>

                {/* DYNAMIC TAB CONTROLLER */}
                <div className="p-8 max-w-7xl w-full mx-auto space-y-8 animate-fade-in">

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl text-sm flex items-center justify-between shadow-md">
                            <span className="flex items-center gap-2.5">
                                <AlertTriangle size={20} className="text-red-500" />
                                <strong>Gateway Error:</strong> {error}
                            </span>
                            <button onClick={fetchKits} className="bg-red-100 hover:bg-red-200 text-red-900 px-3 py-1.5 rounded-xl text-xs font-bold transition">
                                Re-sync Endpoint
                            </button>
                        </div>
                    )}

                    {currentTab === 'users' && currentUser.role === 'admin' && <UserManagement currentUser={currentUser} />}

                    {currentTab === 'dashboard' && (
                        <>
                            {/* Metrics Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                {stats.map((stat, i) => (
                                    <div 
                                        key={i} 
                                        className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between hover:-translate-y-1 hover:shadow-md transition-all duration-300 group"
                                    >
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{stat.label}</p>
                                            <p className="text-3xl font-extrabold mt-1.5 text-slate-900 tracking-tight">
                                                {isLoading && kits.length === 0 ? '...' : stat.count}
                                            </p>
                                        </div>
                                        <div className={`p-3.5 rounded-xl text-white shadow-lg ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                                            <stat.icon size={22} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Regional Map, Chart & Quick Actions Layout */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                
                                {/* Map */}
                                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm h-96 flex flex-col justify-between relative group">
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                            <MapPin size={18} className="text-red-500" /> Live Regional Grid
                                        </h3>
                                        <span className="text-[10px] bg-slate-100 text-slate-500 font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">Ethiopian Zones</span>
                                    </div>
                                    
                                    {/* Vector representation of Ethiopia regions */}
                                    <div className="flex-1 flex items-center justify-center p-2 relative bg-slate-950 rounded-xl overflow-hidden mt-3 border border-slate-800">
                                        <svg viewBox="0 0 100 100" className="w-full h-full max-h-[220px]">
                                            {regions.map((region) => (
                                                <path
                                                    key={region.id}
                                                    d={region.path}
                                                    className={`cursor-pointer transition-all duration-300 stroke-slate-800 stroke-[0.8] ${region.color}`}
                                                    onMouseEnter={() => setHoveredRegion(region)}
                                                    onMouseLeave={() => setHoveredRegion(null)}
                                                />
                                            ))}
                                        </svg>

                                        {/* Overlay tooltips */}
                                        <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur border border-slate-850 px-3.5 py-2 rounded-lg text-left transition-all duration-300 text-xs">
                                            {hoveredRegion ? (
                                                <div>
                                                    <p className="font-bold text-slate-100">{hoveredRegion.name}</p>
                                                    <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">{hoveredRegion.count} Active Kits Registered</p>
                                                </div>
                                            ) : (
                                                <span className="text-slate-500 text-[10px] flex items-center gap-1.5 uppercase tracking-wider font-semibold">
                                                    <HelpCircle size={12} /> Hover regions to view allocation
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Status Distribution Chart */}
                                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm h-96 flex flex-col justify-between">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                            <PieChart size={18} className="text-blue-500" /> System Allocation
                                        </h3>
                                    </div>

                                    {/* Donut Chart Visualizer with Hover States */}
                                    <div className="flex-1 flex items-center justify-center relative my-3">
                                        {totalCount === 0 ? (
                                            <div className="text-sm text-slate-400">No data loaded</div>
                                        ) : (
                                            <>
                                                <svg width="150" height="150" viewBox="0 0 100 100" className="transform -rotate-90">
                                                    <circle
                                                        cx="50"
                                                        cy="50"
                                                        r={radius}
                                                        fill="transparent"
                                                        stroke="#f8fafc"
                                                        strokeWidth="11"
                                                    />

                                                    {/* Active Kits Segment */}
                                                    {activeCount > 0 && (
                                                        <circle
                                                            cx="50"
                                                            cy="50"
                                                            r={radius}
                                                            fill="transparent"
                                                            stroke="#22c55e"
                                                            strokeWidth={hoveredSegment === 'active' ? '14' : '11'}
                                                            strokeDasharray={`${activeLength} ${circumference}`}
                                                            className="cursor-pointer transition-all duration-300"
                                                            onMouseEnter={() => setHoveredSegment('active')}
                                                            onMouseLeave={() => setHoveredSegment(null)}
                                                            style={{
                                                                transformOrigin: '50px 50px',
                                                                transform: `rotate(${activeRotation}deg)`,
                                                            }}
                                                        />
                                                    )}

                                                    {/* Under Maintenance Segment */}
                                                    {maintenanceCount > 0 && (
                                                        <circle
                                                            cx="50"
                                                            cy="50"
                                                            r={radius}
                                                            fill="transparent"
                                                            stroke="#f59e0b"
                                                            strokeWidth={hoveredSegment === 'maint' ? '14' : '11'}
                                                            strokeDasharray={`${maintLength} ${circumference}`}
                                                            className="cursor-pointer transition-all duration-300"
                                                            onMouseEnter={() => setHoveredSegment('maint')}
                                                            onMouseLeave={() => setHoveredSegment(null)}
                                                            style={{
                                                                transformOrigin: '50px 50px',
                                                                transform: `rotate(${maintRotation}deg)`,
                                                            }}
                                                        />
                                                    )}

                                                    {/* Lost/Stolen Segment */}
                                                    {lostCount > 0 && (
                                                        <circle
                                                            cx="50"
                                                            cy="50"
                                                            r={radius}
                                                            fill="transparent"
                                                            stroke="#ef4444"
                                                            strokeWidth={hoveredSegment === 'lost' ? '14' : '11'}
                                                            strokeDasharray={`${lostLength} ${circumference}`}
                                                            className="cursor-pointer transition-all duration-300"
                                                            onMouseEnter={() => setHoveredSegment('lost')}
                                                            onMouseLeave={() => setHoveredSegment(null)}
                                                            style={{
                                                                transformOrigin: '50px 50px',
                                                                transform: `rotate(${lostRotation}deg)`,
                                                            }}
                                                        />
                                                    )}
                                                </svg>

                                                <div className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-300">
                                                    {hoveredSegment === 'active' ? (
                                                        <>
                                                            <span className="text-xl font-black text-green-600">{activeCount}</span>
                                                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Active</span>
                                                        </>
                                                    ) : hoveredSegment === 'maint' ? (
                                                        <>
                                                            <span className="text-xl font-black text-amber-500">{maintenanceCount}</span>
                                                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Repair</span>
                                                        </>
                                                    ) : hoveredSegment === 'lost' ? (
                                                        <>
                                                            <span className="text-xl font-black text-red-500">{lostCount}</span>
                                                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Lost</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="text-2xl font-black text-slate-900">{totalCount}</span>
                                                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Total</span>
                                                        </>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Interactive Legend with highlights */}
                                    <div className="grid grid-cols-3 gap-1 pt-3 border-t border-slate-100 text-[10px]">
                                        <button 
                                            onMouseEnter={() => setHoveredSegment('active')}
                                            onMouseLeave={() => setHoveredSegment(null)}
                                            className={`text-center py-1 rounded-lg transition-colors ${hoveredSegment === 'active' ? 'bg-green-50' : ''}`}
                                        >
                                            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1 align-middle"></span>
                                            <span className="text-slate-600 font-bold">{pctActive.toFixed(0)}% Active</span>
                                        </button>
                                        <button 
                                            onMouseEnter={() => setHoveredSegment('maint')}
                                            onMouseLeave={() => setHoveredSegment(null)}
                                            className={`text-center py-1 rounded-lg transition-colors ${hoveredSegment === 'maint' ? 'bg-amber-50' : ''}`}
                                        >
                                            <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-1 align-middle"></span>
                                            <span className="text-slate-600 font-bold">{pctMaint.toFixed(0)}% Repair</span>
                                        </button>
                                        <button 
                                            onMouseEnter={() => setHoveredSegment('lost')}
                                            onMouseLeave={() => setHoveredSegment(null)}
                                            className={`text-center py-1 rounded-lg transition-colors ${hoveredSegment === 'lost' ? 'bg-red-50' : ''}`}
                                        >
                                            <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1 align-middle"></span>
                                            <span className="text-slate-600 font-bold">{pctLost.toFixed(0)}% Lost</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Quick Operations */}
                                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm h-96 flex flex-col justify-between">
                                    <h3 className="font-bold text-slate-900 mb-4">Operational Shortcuts</h3>
                                    <div className="space-y-3 flex-1">
                                        <button onClick={() => { setCurrentTab('inventory'); startCreateKit(); }} className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl text-sm border border-slate-200/50 hover:border-slate-300 transition-all text-left group">
                                            <span className="font-semibold text-slate-700">Register New Asset Profile</span>
                                            <Plus size={16} className="text-slate-400 group-hover:text-slate-900 group-hover:rotate-90 transition-all duration-300" />
                                        </button>
                                        <button onClick={() => { setCurrentTab('transfers'); setIsTransferModalOpen(true); }} className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl text-sm border border-slate-200/50 hover:border-slate-300 transition-all text-left group">
                                            <span className="font-semibold text-slate-700">Initiate relocation request</span>
                                            <MoveRight size={16} className="text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                                        </button>
                                        <button onClick={() => { setCurrentTab('maintenance'); setIsMaintenanceModalOpen(true); }} className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl text-sm border border-slate-200/50 hover:border-slate-300 transition-all text-left group">
                                            <span className="font-semibold text-slate-700">Submit Fault Diagnostics Report</span>
                                            <Wrench size={16} className="text-slate-400 group-hover:text-slate-900 group-hover:rotate-12 transition-all" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {currentTab === 'inventory' && (
                        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                            
                            {/* Table Filters Header bar */}
                            <div className="p-6 border-b border-slate-200 flex flex-col gap-4">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h2 className="font-extrabold text-lg text-slate-900">National ID Asset Registry</h2>
                                        <p className="text-xs text-slate-400 mt-0.5">Real-time allocation log of biometric kits.</p>
                                    </div>
                                    <button 
                                        onClick={startCreateKit}
                                        className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-md shadow-slate-900/10"
                                    >
                                        <Plus size={16} /> Register Asset Kit
                                    </button>
                                </div>

                                {/* Filter Controls */}
                                <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
                                    <div className="flex items-center gap-1.5 text-slate-400 font-semibold uppercase tracking-wider mr-2">
                                        <Filter size={14} /> Filter Set:
                                    </div>
                                    
                                    {/* Type filters */}
                                    <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200/40">
                                        {['All', 'Laptop', 'Fingerprint Scanner', 'Iris Scanner', 'Camera'].map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => setTypeFilter(type)}
                                                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                                                    typeFilter === type 
                                                        ? 'bg-white text-slate-900 shadow-sm font-bold' 
                                                        : 'text-slate-500 hover:text-slate-800'
                                                }`}
                                            >
                                                {type}s
                                            </button>
                                        ))}
                                    </div>

                                    {/* Status filters */}
                                    <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200/40">
                                        {['All', 'Active', 'Under Maintenance', 'Lost', 'Stolen'].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => setStatusFilter(status)}
                                                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                                                    statusFilter === status 
                                                        ? 'bg-white text-slate-900 shadow-sm font-bold' 
                                                        : 'text-slate-500 hover:text-slate-800'
                                                }`}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-sm">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                                            <th className="p-4 pl-6">Kit ID</th>
                                            <th className="p-4">Serial Number</th>
                                            <th className="p-4">Machine Type</th>
                                            <th className="p-4">Region/Zone</th>
                                            <th className="p-4">City</th>
                                            <th className="p-4">Assigned Officer</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4 pr-6 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {isLoading && kits.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="p-12 text-center text-slate-500">
                                                    <span className="flex items-center justify-center gap-2.5 font-medium">
                                                        <Loader2 className="animate-spin text-red-500" size={20} />
                                                        Synchronizing asset datastore...
                                                    </span>
                                                </td>
                                            </tr>
                                        ) : filteredKits.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="p-12 text-center text-slate-400 font-medium">
                                                    No assets match current filter criteria.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredKits.map((kit) => (
                                                <tr key={kit.id} className="hover:bg-slate-50/50 transition-colors group">
                                                    <td className="p-4 pl-6 font-bold text-slate-900">{renderHighlightedText(kit.kitId, searchTerm)}</td>
                                                    <td className="p-4 text-slate-600 font-mono text-xs">{renderHighlightedText(kit.serialNumber, searchTerm)}</td>
                                                    <td className="p-4 text-slate-700 font-semibold">{kit.machineType}</td>
                                                    <td className="p-4 text-slate-600">{kit.zone || 'N/A'}</td>
                                                    <td className="p-4 text-slate-600 font-medium">{renderHighlightedText(kit.city, searchTerm)}</td>
                                                    <td className="p-4 text-slate-700 font-semibold">{renderHighlightedText(kit.officer, searchTerm)}</td>
                                                    <td className="p-4">
                                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                                                            kit.status === 'Active' ? 'bg-green-150 text-green-800' :
                                                            kit.status === 'Under Maintenance' ? 'bg-amber-150 text-amber-800' :
                                                            'bg-red-150 text-red-800'
                                                        }`}>
                                                            <span className={`w-1 h-1 rounded-full ${
                                                                kit.status === 'Active' ? 'bg-green-500' :
                                                                kit.status === 'Under Maintenance' ? 'bg-amber-500' :
                                                                'bg-red-500'
                                                            }`} />
                                                            {kit.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 pr-6 text-right">
                                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button 
                                                                onClick={() => startEditKit(kit)}
                                                                className="text-slate-500 hover:text-slate-800 hover:bg-slate-100 p-1.5 rounded-lg transition-colors cursor-pointer"
                                                                title="Edit Asset Details"
                                                            >
                                                                <Pencil size={14} />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteKit(kit.id)}
                                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                                                                title="Delete Asset"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {currentTab === 'transfers' && (
                        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                                <div>
                                    <h2 className="font-extrabold text-lg text-slate-900">Zone Transfer Registry</h2>
                                    <p className="text-xs text-slate-400 mt-0.5">Relocation records for regional tracking.</p>
                                </div>
                                <button 
                                    onClick={() => setIsTransferModalOpen(true)}
                                    className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-md shadow-slate-900/10"
                                >
                                    <ArrowRightLeft size={16} /> Initiate Zone Transfer
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-sm">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                                            <th className="p-4 pl-6">Transfer Request</th>
                                            <th className="p-4">Kit ID</th>
                                            <th className="p-4">Origin Location</th>
                                            <th className="p-4">Destination Location</th>
                                            <th className="p-4">Transfer Date</th>
                                            <th className="p-4 pr-6">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {transfers.map((tr) => (
                                            <tr key={tr.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="p-4 pl-6 font-bold text-slate-900">{tr.id}</td>
                                                <td className="p-4 font-semibold text-slate-700">{tr.kitId}</td>
                                                <td className="p-4 text-slate-600">{tr.fromZone}</td>
                                                <td className="p-4 text-slate-600 font-semibold">{tr.toZone}</td>
                                                <td className="p-4 text-slate-400">{tr.date}</td>
                                                <td className="p-4 pr-6">
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 ${
                                                        tr.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-855'
                                                    }`}>
                                                        {tr.status === 'Completed' ? <Check size={11} /> : <Clock size={11} />}
                                                        {tr.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {currentTab === 'maintenance' && (
                        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                                <div>
                                    <h2 className="font-extrabold text-lg text-slate-900">Incident & Repair Logs</h2>
                                    <p className="text-xs text-slate-400 mt-0.5">Submit repair orders and monitor faults.</p>
                                </div>
                                <button 
                                    onClick={() => setIsMaintenanceModalOpen(true)}
                                    className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-md shadow-slate-900/10"
                                >
                                    <Wrench size={16} /> File incident Order
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-sm">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                                            <th className="p-4 pl-6">Ticket ID</th>
                                            <th className="p-4">Kit ID</th>
                                            <th className="p-4">Issue Reported</th>
                                            <th className="p-4">Priority</th>
                                            <th className="p-4">Filing Date</th>
                                            <th className="p-4 pr-6">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {maintenance.map((mn) => (
                                            <tr key={mn.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="p-4 pl-6 font-bold text-slate-900">{mn.id}</td>
                                                <td className="p-4 font-semibold text-slate-700">{mn.kitId}</td>
                                                <td className="p-4 text-slate-600 max-w-xs truncate font-medium" title={mn.issue}>{mn.issue}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                                        mn.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'
                                                    }`}>
                                                        {mn.priority}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-slate-400">{mn.date}</td>
                                                <td className="p-4 pr-6">
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 ${
                                                        mn.status === 'Resolved' ? 'bg-green-150 text-green-800' : 'bg-amber-150 text-amber-800'
                                                    }`}>
                                                        {mn.status === 'Resolved' ? <Check size={11} /> : <Loader2 size={11} className="animate-spin" />}
                                                        {mn.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* REGISTER / EDIT KIT MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                                <Package className="text-red-600" size={20} /> 
                                {editingKitId ? 'Edit Asset Kit' : 'Register New Asset Kit'}
                            </h3>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitKit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Kit ID *</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="e.g. NID-0005"
                                        value={newKit.kitId}
                                        onChange={(e) => setNewKit(prev => ({ ...prev, kitId: e.target.value }))}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-655 focus:bg-white transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Serial Number *</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="e.g. SN-883921"
                                        value={newKit.serialNumber}
                                        onChange={(e) => setNewKit(prev => ({ ...prev, serialNumber: e.target.value }))}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-655 focus:bg-white transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Machine Type *</label>
                                <select 
                                    value={newKit.machineType}
                                    onChange={(e) => setNewKit(prev => ({ ...prev, machineType: e.target.value }))}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-655 focus:bg-white transition-colors"
                                >
                                    <option value="Laptop">Laptop</option>
                                    <option value="Fingerprint Scanner">Fingerprint Scanner</option>
                                    <option value="Iris Scanner">Iris Scanner</option>
                                    <option value="Camera">Camera</option>
                                    <option value="All-in-One Station">All-in-One Station</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Region / Zone</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. East Oromia"
                                        value={newKit.zone}
                                        onChange={(e) => setNewKit(prev => ({ ...prev, zone: e.target.value }))}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-655 focus:bg-white transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">City</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Adama"
                                        value={newKit.city}
                                        onChange={(e) => setNewKit(prev => ({ ...prev, city: e.target.value }))}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-655 focus:bg-white transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Assigned Officer</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Gizaw Bogale"
                                    value={newKit.officer}
                                    onChange={(e) => setNewKit(prev => ({ ...prev, officer: e.target.value }))}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-655 focus:bg-white transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Initial Status</label>
                                <select 
                                    value={newKit.status}
                                    onChange={(e) => setNewKit(prev => ({ ...prev, status: e.target.value }))}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-655 focus:bg-white transition-colors"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Under Maintenance">Under Maintenance</option>
                                    <option value="Lost">Lost</option>
                                    <option value="Stolen">Stolen</option>
                                </select>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium flex items-center gap-2 disabled:bg-slate-400 transition-colors"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            {editingKitId ? 'Updating...' : 'Registering...'}
                                        </>
                                    ) : (
                                        editingKitId ? 'Update Kit' : 'Register Kit'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* INITIATE TRANSFER MODAL */}
            {isTransferModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                                <ArrowRightLeft className="text-blue-600" size={20} /> Initiate Zone Transfer
                            </h3>
                            <button 
                                onClick={() => setIsTransferModalOpen(false)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleInitiateTransfer} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Select Kit ID *</label>
                                <select
                                    required
                                    value={newTransfer.kitId}
                                    onChange={(e) => {
                                        const selected = transferrableKits.find(k => k.kitId === e.target.value);
                                        setNewTransfer(prev => ({
                                            ...prev,
                                            kitId: e.target.value,
                                            fromZone: selected ? (selected.zone || 'Head Office') : 'Head Office'
                                        }));
                                    }}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                                >
                                    <option value="">-- Choose registered Kit --</option>
                                    {transferrableKits.map(k => (
                                        <option key={k.id} value={k.kitId}>{k.kitId} ({k.machineType} - {k.serialNumber})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">From Zone</label>
                                    <input 
                                        type="text" 
                                        readOnly
                                        value={newTransfer.fromZone}
                                        className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">To Destination Zone *</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="e.g. West Oromia"
                                        value={newTransfer.toZone}
                                        onChange={(e) => setNewTransfer(prev => ({ ...prev, toZone: e.target.value }))}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Transfer Request Date</label>
                                <input 
                                    type="date"
                                    value={newTransfer.date}
                                    onChange={(e) => setNewTransfer(prev => ({ ...prev, date: e.target.value }))}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                                />
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                                <button 
                                    type="button"
                                    onClick={() => setIsTransferModalOpen(false)}
                                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-colors"
                                >
                                    Request Transfer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* FILE MAINTENANCE INCIDENT MODAL */}
            {isMaintenanceModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                                <Wrench className="text-amber-600" size={20} /> File Repair / Incident Order
                            </h3>
                            <button 
                                onClick={() => setIsMaintenanceModalOpen(false)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleFileRepairOrder} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Select Faulty Kit *</label>
                                <select
                                    required
                                    value={newMaintenance.kitId}
                                    onChange={(e) => setNewMaintenance(prev => ({ ...prev, kitId: e.target.value }))}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-600 focus:bg-white transition-colors"
                                >
                                    <option value="">-- Choose registered Kit --</option>
                                    {kits.map(k => (
                                        <option key={k.id} value={k.kitId}>{k.kitId} ({k.machineType} - {k.serialNumber})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Issue Description *</label>
                                <textarea
                                    required
                                    rows="3"
                                    placeholder="Explain fault details (e.g. fingerprint scan window scratched, battery swelling...)"
                                    value={newMaintenance.issue}
                                    onChange={(e) => setNewMaintenance(prev => ({ ...prev, issue: e.target.value }))}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-600 focus:bg-white transition-colors resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Priority</label>
                                    <select
                                        value={newMaintenance.priority}
                                        onChange={(e) => setNewMaintenance(prev => ({ ...prev, priority: e.target.value }))}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-600 focus:bg-white transition-colors"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Report Date</label>
                                    <input 
                                        type="date"
                                        value={newMaintenance.date}
                                        onChange={(e) => setNewMaintenance(prev => ({ ...prev, date: e.target.value }))}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-600 focus:bg-white transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                                <button 
                                    type="button"
                                    onClick={() => setIsMaintenanceModalOpen(false)}
                                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-colors"
                                >
                                    File incident
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
