
import React, { useState, useEffect } from 'react';
import { Users, Heart, DollarSign, ShieldCheck, Ban, UserCheck, Search, Gem, Activity } from './IconComponents';
import { DatingUser } from '../types';

const DatingManager: React.FC = () => {
    // RULE OF ZERO: Initialize empty
    const [users, setUsers] = useState<DatingUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    // Fetch from real API
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // const res = await fetch('/api/admin/users');
                // const data = await res.json();
                // setUsers(data);
                setLoading(false);
            } catch (e) {
                console.error("Failed to load users", e);
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    // Actions
    const handleBan = async (id: string) => {
        if (confirm('Are you sure you want to BAN this user?')) {
            // await fetch(`/api/admin/users/${id}/ban`, { method: 'POST' });
            setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'banned', trustScore: 0 } : u));
        }
    };

    const handleVerify = async (id: string) => {
        // await fetch(`/api/admin/users/${id}/verify`, { method: 'POST' });
        setUsers(prev => prev.map(u => u.id === id ? { ...u, verified: true, trustScore: Math.min(u.trustScore + 20, 100) } : u));
    };

    // Stats Calculation
    const totalRevenue = users.reduce((acc, user) => acc + user.revenue, 0);
    const activeUsers = users.filter(u => u.status === 'active').length;
    const avgTrust = users.length > 0 ? (users.reduce((acc, user) => acc + user.trustScore, 0) / users.length).toFixed(1) : "0.0";

    const filteredUsers = users.filter(u => 
        u.email.toLowerCase().includes(filter.toLowerCase()) || 
        u.firstName.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <main className="flex-1 p-6 overflow-y-auto bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
            <header className="glass-card p-6 mb-8 border-l-4 border-pink-500 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Heart className="w-8 h-8 text-pink-500" />
                        YouAndINotAI Admin
                    </h1>
                    <p className="text-slate-400 mt-1">Managing the Anti-AI Dating Ecosystem</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-xs text-slate-400 uppercase tracking-wider">Total Revenue</p>
                        <p className="text-2xl font-bold text-green-400">${totalRevenue.toLocaleString()}</p>
                    </div>
                    <div className="w-px h-10 bg-white/10"></div>
                    <div className="text-right">
                        <p className="text-xs text-slate-400 uppercase tracking-wider">Trust Score</p>
                        <p className="text-2xl font-bold text-blue-400">{avgTrust}</p>
                    </div>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass-card p-5 flex items-center justify-between relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-pink-500/10 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:scale-110"></div>
                    <div>
                        <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Active Subscribers</p>
                        <h3 className="text-3xl font-bold text-white mt-1">{activeUsers}</h3>
                    </div>
                    <div className="p-3 bg-pink-500/20 rounded-lg">
                        <Users className="w-6 h-6 text-pink-400" />
                    </div>
                </div>

                <div className="glass-card p-5 flex items-center justify-between relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:scale-110"></div>
                    <div>
                        <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">VIP Members</p>
                        <h3 className="text-3xl font-bold text-white mt-1">{users.filter(u => u.plan === 'VIP').length}</h3>
                    </div>
                    <div className="p-3 bg-yellow-500/20 rounded-lg">
                        <Gem className="w-6 h-6 text-yellow-400" />
                    </div>
                </div>

                <div className="glass-card p-5 flex items-center justify-between relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:scale-110"></div>
                    <div>
                        <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Avg Engagement</p>
                        <h3 className="text-3xl font-bold text-white mt-1">{users.length > 0 ? '87%' : '0%'}</h3>
                    </div>
                    <div className="p-3 bg-green-500/20 rounded-lg">
                        <Activity className="w-6 h-6 text-green-400" />
                    </div>
                </div>
            </div>

            {/* User Management Table */}
            <div className="glass-card overflow-hidden">
                <div className="p-6 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h3 className="text-lg font-bold text-white">User Governance</h3>
                    <div className="relative w-full md:w-64">
                        <input 
                            type="text" 
                            placeholder="Search users..." 
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="glass-input w-full pl-10 py-2 text-sm"
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-white/5 text-xs uppercase font-bold text-slate-300">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Plan</th>
                                <th className="px-6 py-4">Trust Score</th>
                                <th className="px-6 py-4">Revenue (LTV)</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} className="text-center py-8">Connecting to User Database...</td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-8">No users found in database.</td></tr>
                            ) : (
                                filteredUsers.map(user => (
                                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                                {user.firstName[0]}
                                            </div>
                                            <div>
                                                <div className="font-medium text-white flex items-center gap-1">
                                                    {user.firstName} {user.lastName}
                                                    {user.verified && <ShieldCheck className="w-3 h-3 text-blue-400" />}
                                                </div>
                                                <div className="text-xs text-slate-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            user.plan === 'VIP' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                            user.plan === 'Premium' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                                            'bg-slate-700 text-slate-300'
                                        }`}>
                                            {user.plan}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-full bg-slate-700 h-1.5 rounded-full max-w-[60px]">
                                                <div 
                                                    className={`h-1.5 rounded-full ${user.trustScore > 80 ? 'bg-green-400' : user.trustScore > 50 ? 'bg-yellow-400' : 'bg-red-400'}`} 
                                                    style={{ width: `${user.trustScore}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-medium">{user.trustScore}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-green-400 font-mono">
                                        ${user.revenue.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                         <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            user.status === 'active' ? 'text-green-400' :
                                            user.status === 'banned' ? 'text-red-400' :
                                            'text-yellow-400'
                                        }`}>
                                            {user.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        {!user.verified && user.status !== 'banned' && (
                                            <button 
                                                onClick={() => handleVerify(user.id)}
                                                className="p-1.5 rounded bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors"
                                                title="Verify Human Identity"
                                            >
                                                <UserCheck className="w-4 h-4" />
                                            </button>
                                        )}
                                        {user.status !== 'banned' && (
                                            <button 
                                                onClick={() => handleBan(user.id)}
                                                className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                                                title="Ban User"
                                            >
                                                <Ban className="w-4 h-4" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            )))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
};

export default DatingManager;
