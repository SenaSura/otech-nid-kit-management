import React, { useState } from 'react';
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
  FileText
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample Data matching SRS Scope (1200 Total kits placeholder)
  const stats = [
    { label: 'Total Kits', count: '1,200', icon: Package, color: 'bg-blue-500' },
    { label: 'Active Kits', count: '1,142', icon: CheckCircle, color: 'bg-green-500' },
    { label: 'Under Maintenance', count: '38', icon: Wrench, color: 'bg-amber-500' },
    { label: 'Lost / Stolen', count: '20', icon: AlertTriangle, color: 'bg-red-500' },
  ];

  const sampleKits = [
    { id: 'NID-0001', serial: 'SN-983247', type: 'Laptop', status: 'Active', zone: 'East Oromia', city: 'Adama', officer: 'Gizaw Bogale' },
    { id: 'NID-0002', serial: 'SN-112049', type: 'Fingerprint Scanner', status: 'Under Maintenance', zone: 'North Oromia', city: 'Fiche', officer: 'Abebe Kebede' },
    { id: 'NID-0003', serial: 'SN-449302', type: 'Iris Scanner', status: 'Active', zone: 'West Oromia', city: 'Ambo', officer: 'Chala Alemu' },
    { id: 'NID-0004', serial: 'SN-773021', type: 'Camera', status: 'Lost', zone: 'South Oromia', city: 'Shashemene', officer: 'Fatuma Mohammed' },
  ];

  const filteredKits = sampleKits.filter(kit => 
    kit.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    kit.serial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kit.city.toLowerCase().includes(searchTerm.toLowerCase())
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
          </div>
        </header>

        {/* DYNAMIC TAB CONTROLLER */}
        <div className="p-8 max-w-7xl w-full mx-auto space-y-8">
          
          {currentTab === 'dashboard' && (
            <>
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                {stats.map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                      <p className="text-2xl font-bold mt-1 text-slate-900">{stat.count}</p>
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
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2"><MapPin size={18} className="text-red-500"/> Regional Kit Distribution Map</h3>
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
                    <button onClick={() => setCurrentTab('inventory')} className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm border border-slate-200 transition-colors text-left">
                      <span className="font-medium">Register New Asset Kit</span>
                      <Plus size={16} className="text-slate-500"/>
                    </button>
                    <button onClick={() => setCurrentTab('transfers')} className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm border border-slate-200 transition-colors text-left">
                      <span className="font-medium">Initiate Zone Transfer</span>
                      <MoveRight size={16} className="text-slate-500"/>
                    </button>
                    <button onClick={() => setCurrentTab('maintenance')} className="w-full flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm border border-slate-200 transition-colors text-left">
                      <span className="font-medium">File Incident / Repair Order</span>
                      <Wrench size={16} className="text-slate-500"/>
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
                <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-800 transition-colors">
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
                    </tr>
                  </thead>
                  <tbody>
                    {filteredKits.map((kit) => (
                      <tr key={kit.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-medium text-slate-900">{kit.id}</td>
                        <td className="p-4 text-slate-700">{kit.serial}</td>
                        <td className="p-4 text-slate-700">{kit.type}</td>
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
                      </tr>
                    ))}
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
    </div>
  );
}

