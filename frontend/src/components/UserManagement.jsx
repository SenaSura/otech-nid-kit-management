import { useCallback, useEffect, useState } from 'react';
import { Loader2, Pencil, Plus, ShieldCheck, Trash2, UserRound, X } from 'lucide-react';

const emptyForm = { name: '', email: '', password: '', role: 'user' };

export default function UserManagement({ currentUser }) {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const request = useCallback(async (url, options = {}) => {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'x-user-id': String(currentUser.id),
                ...(options.headers || {}),
            },
        });
        const data = response.status === 204 ? {} : await response.json();
        if (!response.ok) throw new Error(data.message || 'User request failed.');
        return data;
    }, [currentUser.id]);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const data = await request('/api/auth/users');
            setUsers(data.users);
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setIsLoading(false);
        }
    }, [request]);

    useEffect(() => {
        queueMicrotask(fetchUsers);
    }, [fetchUsers]);

    const openCreate = () => {
        setEditingId(null);
        setForm(emptyForm);
        setError('');
        setIsModalOpen(true);
    };

    const openEdit = (user) => {
        setEditingId(user.id);
        setForm({ name: user.name, email: user.email, password: '', role: user.role });
        setError('');
        setIsModalOpen(true);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            const body = { ...form };
            if (!body.password) delete body.password;
            const data = await request(editingId ? `/api/auth/users/${editingId}` : '/api/auth/users', {
                method: editingId ? 'PUT' : 'POST',
                body: JSON.stringify(body),
            });
            setUsers((current) => editingId
                ? current.map((user) => user.id === editingId ? data.user : user)
                : [data.user, ...current]);
            if (editingId === currentUser.id) {
                localStorage.setItem('otech_user', JSON.stringify(data.user));
            }
            setIsModalOpen(false);
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (user) => {
        if (!window.confirm(`Delete ${user.name}'s account?`)) return;
        try {
            await request(`/api/auth/users/${user.id}`, { method: 'DELETE' });
            setUsers((current) => current.filter((item) => item.id !== user.id));
        } catch (requestError) {
            setError(requestError.message);
        }
    };

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-red-600">Administration</p>
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">User & Role Management</h2>
                    <p className="mt-1 text-sm text-slate-500">Create accounts, change access roles, and manage console access.</p>
                </div>
                <button onClick={openCreate} className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-600/20 hover:bg-red-700">
                    <Plus size={17} /> Add User
                </button>
            </div>

            {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {isLoading ? <div className="flex items-center justify-center gap-2 p-12 text-sm text-slate-500"><Loader2 size={18} className="animate-spin" /> Loading users...</div> : (
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                            <tr><th className="px-6 py-4">User</th><th className="px-6 py-4">Username / Email</th><th className="px-6 py-4">Role</th><th className="px-6 py-4 text-right">Actions</th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map((user) => <tr key={user.id} className="hover:bg-slate-50/70">
                                <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600"><UserRound size={17} /></div><div><p className="font-bold text-slate-800">{user.name}</p>{user.id === currentUser.id && <p className="text-xs text-emerald-600">Current account</p>}</div></div></td>
                                <td className="px-6 py-4 text-slate-600">{user.email}</td>
                                <td className="px-6 py-4"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold uppercase ${user.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>{user.role === 'admin' && <ShieldCheck size={13} />}{user.role}</span></td>
                                <td className="px-6 py-4"><div className="flex justify-end gap-2"><button title="Edit user" onClick={() => openEdit(user)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"><Pencil size={16} /></button><button title="Delete user" onClick={() => handleDelete(user)} className="rounded-lg p-2 text-red-500 hover:bg-red-50"><Trash2 size={16} /></button></div></td>
                            </tr>)}
                        </tbody>
                    </table>
                )}
            </div>

            {isModalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"><div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl"><div className="flex items-center justify-between border-b border-slate-100 p-6"><h3 className="flex items-center gap-2 text-lg font-bold text-slate-900"><UserRound className="text-red-600" size={20} /> {editingId ? 'Edit User' : 'Create User'}</h3><button onClick={() => setIsModalOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-50"><X size={20} /></button></div><form onSubmit={handleSubmit} className="space-y-4 p-6">
                <input required placeholder="Full name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-red-500" />
                <input required placeholder="Username or email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-red-500" />
                <input type="password" required={!editingId} minLength="8" placeholder={editingId ? 'New password (optional)' : 'Password, at least 8 characters'} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-red-500" />
                <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-red-500"><option value="user">User</option><option value="admin">Admin</option></select>
                {error && <p className="text-sm text-red-600">{error}</p>}<div className="flex justify-end gap-3 border-t border-slate-100 pt-4"><button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600">Cancel</button><button disabled={isSubmitting} className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:bg-slate-400">{isSubmitting && <Loader2 size={15} className="animate-spin" />}{editingId ? 'Save Changes' : 'Create User'}</button></div>
            </form></div></div>}
        </section>
    );
}
