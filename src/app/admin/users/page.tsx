
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

import { Loader2, CheckCircle, XCircle } from 'lucide-react';

/**
 * Admin Users Management Page
 * Lists all user profiles with their approval status and provides
 * Approve / Reject actions for admins.
 */
export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: users, error } = await supabase
    .from('profiles')
    .select('id,email,full_name,approval_status,role')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-500">Failed to load users: {error.message}</p>
      </div>
    );
  }

  const handleAction = async (userId: string, newStatus: string) => {
    'use server';
    const supabase = await createClient();
    const { error } = await supabase
      .from('profiles')
      .update({ approval_status: newStatus })
      .eq('id', userId);
    if (error) {
      console.error('Approval update failed:', error);
      // Optionally throw to surface in UI
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-light text-zinc-900 mb-6">User Management</h1>
      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-50/30 backdrop-blur-xl">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-200/30">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u) => (
              <tr key={u.id} className="border-t border-zinc-200/30">
                <td className="px-4 py-2">{u.full_name || '—'}</td>
                <td className="px-4 py-2">{u.email || '—'}</td>
                <td className="px-4 py-2 capitalize text-amber-400">{u.approval_status}</td>
                <td className="px-4 py-2 capitalize">{u.role}</td>
                <td className="px-4 py-2 space-x-2">
                  {u.approval_status !== 'approved' && (
                    <form action={async () => await handleAction(u.id, 'approved')}>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1 rounded-xl bg-amber-500 px-3 py-1 text-xs font-medium text-zinc-900 hover:bg-amber-400"
                      >
                        <CheckCircle className="h-4 w-4" /> Approve
                      </button>
                    </form>
                  )}
                  {u.approval_status !== 'rejected' && (
                    <form action={async () => await handleAction(u.id, 'rejected')}>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1 rounded-xl bg-red-500/20 px-3 py-1 text-xs font-medium text-red-400 hover:bg-red-500/30"
                      >
                        <XCircle className="h-4 w-4" /> Reject
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6">
        <Link href="/admin" className="text-amber-500 hover:underline">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
