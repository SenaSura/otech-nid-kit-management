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
    X,
    Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const navigate = useNavigate();
    const [currentTab, setCurrentTab] = useState('dashboard');
    const [searchTerm, setSearchTerm] = useState('');
    const [kits, setKits] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
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

    useEffect(() => {
        fetchKits();
    }, []);

    // Create a new kit
    const handleCreateKit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/kits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newKit),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Failed to create kit');
            }

            // Refresh list
            await fetchKits();
            setIsModalOpen(false);
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

    // Compute metrics dynamically from backend kits
    const totalCount = kits.length;
    const activeCount = kits.filter(k => k.status === 'Active').length;
    const maintenanceCount = kits.filter(k => k.status === 'Under Maintenance').length;
    const lostCount = kits.filter(k => k.status === 'Lost' || k.status === 'Stolen').length;

    const stats = [
        { label: 'Total Kits', count: totalCount.toLocaleString(), icon: Package, color: 'bg-blue-500' },
        { label: 'Active Kits', count: activeCount.toLocaleString(), icon: CheckCircle, color: 'bg-green-500' },
        { label: 'Under Maintenance', count: maintenanceCount.toLocaleString(), icon: Wrench, color: 'bg-amber-500' },
        { label: 'Lost / Stolen', count: lostCount.toLocaleString(), icon: AlertTriangle, color: 'bg-red-500' },
    ];

    const filteredKits = kits.filter(kit =>
        (kit.kitId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (kit.serialNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (kit.city || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (kit.officer || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-800">

            {/* SIDEBAR NAVIGATION */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between">
                <div>
                    <div className="p-5 border-b border-slate-800 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-bold text-lg">O</div>
                        <div>
                            <h1 className="font-bold text-sm leading-tight">OTech Solutions</h1>
                            <p className="text-xs text-slate-400">Asset Management</p>
                        </div>
                    </div>

                    <nav className="p-4 space-y-1">
                        <button
                            onClick={() => setCurrentTab('dashboard')}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${currentTab === 'dashboard' ? 'bg-red-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                        >
                            <LayoutDashboard size={18} /> Dashboard
                        </button>
                        <button
                            onClick={() => setCurrentTab('inventory')}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${currentTab === 'inventory' ? 'bg-red-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                        >
                            <Package size={18} /> Asset Registry
                        </button>
                        <button
                            onClick={() => setCurrentTab('transfers')}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${currentTab === 'transfers' ? 'bg-red-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                        >
                            <MoveRight size={18} /> Kit Transfers
                        </button>
                        <button
                            onClick={() => setCurrentTab('maintenance')}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${currentTab === 'maintenance' ? 'bg-red-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                        >
                            <Wrench size={18} /> Maintenance
                        </button>
                    </nav>
                </div>

                <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
                    v1.0 • OTech Engineering
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col overflow-y-auto">

                {/* TOP BAR Header */}
                <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shadow-sm">
                    <div className="flex items-center gap-3 bg-slate-100 px-3 py-1.5 rounded-lg w-80">
                        <Search size={16} className="text-slate-400" />
                        <input
                            type="text"
                            placeholder="Global Search (Kit ID, Serial...)"
                            className="bg-transparent text-sm w-full focus:outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-medium">Head Office Active</span>
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-semibold text-sm text-slate-700">GB</div>
                        <button onClick={() => navigate('/login')} className="text-xs bg-red-100 text-red-800 px-2.5 py-1 rounded-full font-medium cursor-pointer">Logout</button>
                    </div>
                </header>

                {/* DYNAMIC TAB CONTROLLER */}
                <div className="p-8 max-w-7xl w-full mx-auto space-y-8">

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-sm flex items-center justify-between shadow-sm">
                            <span className="flex items-center gap-2">
                                <AlertTriangle size={18} className="text-red-500" />
                                <strong>Error:</strong> {error}
                            </span>
                            <button onClick={fetchKits} className="bg-red-100 hover:bg-red-200 text-red-900 px-3 py-1 rounded-lg text-xs font-semibold transition">
                                Retry
                            </button>
                        </div>
                    )}

                    {currentTab === 'dashboard' && (
                        <>
                            {/* Metrics Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                                {stats.map((stat, i) => (
                                    <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                                            <p className="text-2xl font-bold mt-1 text-slate-900">
                                                {isLoading && kits.length === 0 ? '...' : stat.count}
                                            </p>
                                        </div>
                                        <div className={`p-3 rounded-lg text-white ${stat.color}`}>
                                            <stat.icon size={22} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Map & Quick Actions Layout */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-96 flex flex-col justify-between">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-semibold text-slate-900 flex items-center gap-2"><MapPin size={18} className="text-red-500" /> Regional Kit Distribution Map</h3>
                                        <span className="text-xs text-slate-500">23 Cities / 21 Zones</span>
                                    </div>
                                    {/* Mock Map Viewport */}
                                    <div className="bg-slate-100 flex-1 rounded-lg mt-4 border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-sm">
                                        Interactive Map Canvas (Google Maps SDK Link Ready)
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                                    <h3 className="font-semibold text-slate-900 mb-4">Quick Operations</h3>
                                    <div className="space-y-3 flex-1">
                                        <button onClick={() => { setCurrentTab('inventory'); setIsModalOpen(true); }} className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm border border-slate-200 transition-colors text-left">
                                            <span className="font-medium">Register New Asset Kit</span>
                                            <Plus size={16} className="text-slate-500" />
                                        </button>
                                        <button onClick={() => setCurrentTab('transfers')} className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm border border-slate-200 transition-colors text-left">
                                            <span className="font-medium">Initiate Zone Transfer</span>
                                            <MoveRight size={16} className="text-slate-500" />
                                        </button>
                                        <button onClick={() => setCurrentTab('maintenance')} className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm border border-slate-200 transition-colors text-left">
                                            <span className="font-medium">File Incident / Repair Order</span>
                                            <Wrench size={16} className="text-slate-500" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {currentTab === 'inventory' && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h2 className="font-bold text-lg text-slate-900">National ID Asset Registry</h2>
                                    <p className="text-xs text-slate-500 mt-0.5">Real-time status tracking of all hardware profiles.</p>
                                </div>
                                <button 
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-800 transition-colors"
                                >
                                    <Plus size={16} /> Register Asset Kit
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-sm">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                                            <th className="p-4">Kit ID</th>
                                            <th className="p-4">Serial Number</th>
                                            <th className="p-4">Machine Type</th>
                                            <th className="p-4">Region/Zone</th>
                                            <th className="p-4">City</th>
                                            <th className="p-4">Officer</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading && kits.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="p-8 text-center text-slate-500">
                                                    <span className="flex items-center justify-center gap-2">
                                                        <Loader2 className="animate-spin text-slate-400" size={18} />
                                                        Loading National ID kits...
                                                    </span>
                                                </td>
                                            </tr>
                                        ) : filteredKits.length === 0 ? (
                                            <tr>
                                                <td colSpan={8} className="p-8 text-center text-slate-500">
                                                    No asset kits found. Try registering one!
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredKits.map((kit) => (
                                                <tr key={kit.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                                                    <td className="p-4 font-medium text-slate-900">{kit.kitId}</td>
                                                    <td className="p-4 text-slate-700">{kit.serialNumber}</td>
                                                    <td className="p-4 text-slate-700">{kit.machineType}</td>
                                                    <td className="p-4 text-slate-700">{kit.zone}</td>
                                                    <td className="p-4 text-slate-700">{kit.city}</td>
                                                    <td className="p-4 text-slate-700">{kit.officer}</td>
                                                    <td className="p-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                            kit.status === 'Active' ? 'bg-green-100 text-green-800' :
                                                            kit.status === 'Under Maintenance' ? 'bg-amber-100 text-amber-800' :
                                                            'bg-red-100 text-red-800'
                                                        }`}>
                                                            {kit.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <button 
                                                            onClick={() => handleDeleteKit(kit.id)}
                                                            className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                                                            title="Delete Asset Kit"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
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
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <h2 className="font-bold text-lg text-slate-900 mb-4">Kit Transfers</h2>
                            <p className="text-slate-600">Transfer management interface coming soon.</p>
                        </div>
                    )}

                    {currentTab === 'maintenance' && (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <h2 className="font-bold text-lg text-slate-900 mb-4">Maintenance</h2>
                            <p className="text-slate-600">Maintenance tracking interface coming soon.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* REGISTER KIT MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                                <Package className="text-red-600" size={20} /> Register New Asset Kit
                            </h3>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateKit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Kit ID *</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="e.g. NID-0005"
                                        value={newKit.kitId}
                                        onChange={(e) => setNewKit(prev => ({ ...prev, kitId: e.target.value }))}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-600 focus:bg-white transition-colors"
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
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-600 focus:bg-white transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Machine Type *</label>
                                <select 
                                    value={newKit.machineType}
                                    onChange={(e) => setNewKit(prev => ({ ...prev, machineType: e.target.value }))}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-600 focus:bg-white transition-colors"
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
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-600 focus:bg-white transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">City</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Adama"
                                        value={newKit.city}
                                        onChange={(e) => setNewKit(prev => ({ ...prev, city: e.target.value }))}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-600 focus:bg-white transition-colors"
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
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-600 focus:bg-white transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Initial Status</label>
                                <select 
                                    value={newKit.status}
                                    onChange={(e) => setNewKit(prev => ({ ...prev, status: e.target.value }))}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-600 focus:bg-white transition-colors"
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
                                            Registering...
                                        </>
                                    ) : (
                                        'Register Kit'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
