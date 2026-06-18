import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trash2, Shield, User, Users } from 'lucide-react';
import api from '../../utils/axios';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { useToast } from '../../components/ui/Toast';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
};

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const addToast = useToast();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users');
      setUsers(Array.isArray(data.users) ? data.users : []);
    } catch (err) {
      addToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    try {
      await api.put(`/users/${userId}`, { role: newRole });
      addToast(`User role updated to ${newRole}`, 'success');
      fetchUsers();
    } catch (err) {
      addToast(err?.response?.data?.message || 'Update failed', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/users/${deleteTarget._id}`);
      addToast('User deleted', 'success');
      setDeleteTarget(null);
      fetchUsers();
    } catch (err) {
      addToast(err?.response?.data?.message || 'Delete failed', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">Manage registered users</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="relative max-w-xs mb-6"
      >
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="input-field pl-10 text-sm"
        />
      </motion.div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card p-4 flex items-center gap-4">
              <div className="w-11 h-11 rounded-full skeleton" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-44 skeleton rounded-lg" />
                <div className="h-3 w-60 skeleton rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-24"
        >
          <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8 text-[var(--color-text-secondary)]" />
          </div>
          <p className="text-base font-medium text-[var(--color-text-secondary)]">No users found</p>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1 opacity-60">Try adjusting your search</p>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-2"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((u) => (
              <motion.div
                key={u._id}
                layout
                variants={itemVariants}
                exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
                className="card p-4 flex items-center gap-4 group hover:border-[var(--color-accent)]/20 transition-all duration-200"
              >
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[#a78bfa] flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 shadow-lg shadow-[var(--glow-color)]">
                  {getInitials(u.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{u.name}</p>
                  <p className="text-xs text-[var(--color-text-secondary)] truncate">{u.email}</p>
                </div>
                <span className={`badge ${u.role === 'admin' ? 'badge-admin ring-1 ring-[#a78bfa]/20' : 'badge-customer'} flex-shrink-0`}>
                  {u.role}
                </span>
                <button
                  onClick={() => handleToggleRole(u._id, u.role)}
                  className="btn-ghost p-2.5 rounded-xl flex-shrink-0 hover:bg-[var(--color-accent)]/10 hover:text-[var(--color-accent)] transition-all duration-200"
                  title={`Change to ${u.role === 'admin' ? 'customer' : 'admin'}`}
                >
                  {u.role === 'admin' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Shield className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => setDeleteTarget(u)}
                  className="btn-ghost p-2.5 rounded-xl text-[#f87171] hover:bg-[rgba(248,113,113,0.1)] flex-shrink-0 transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        loading={deleting}
      />
    </div>
  );
}
