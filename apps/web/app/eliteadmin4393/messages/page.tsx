"use client";

import { useGetAdminMessagesQuery, useUpdateMessageStatusMutation, useDeleteMessageMutation } from "@/lib/features/api/apiSlice";

export default function AdminMessagesPage() {
  const { data: response, isLoading } = useGetAdminMessagesQuery({});
  const messages = response?.data || [];
  const [updateStatus] = useUpdateMessageStatusMutation();
  const [deleteMessage] = useDeleteMessageMutation();

  const handleStatusChange = async (id: string, newStatus: string) => {
    await updateStatus({ id, status: newStatus });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this lead record?")) {
      await deleteMessage(id);
    }
  };

  return (
    <div className="flex flex-col gap-space-xl max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-headline-lg text-on-surface">Student Leads & Enquiries</h1>
          <p className="text-body-md text-on-surface-variant">Review, track status, and manage prospective student callback requests submitted from the public site.</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant overflow-x-auto">
        <h3 className="font-headline-sm text-primary mb-space-md">All Registered Leads ({messages.length})</h3>
        {isLoading ? (
          <p className="text-on-surface-variant">Loading enquiries...</p>
        ) : messages.length === 0 ? (
          <p className="text-on-surface-variant">No enquiries received yet.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant">
                <th className="p-3">Date</th>
                <th className="p-3">Name</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Program & Mode</th>
                <th className="p-3">Message</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((item: any) => (
                <tr key={item.id} className="border-b border-outline-variant/60 hover:bg-surface-container-low transition-colors">
                  <td className="p-3 text-body-sm text-on-surface-variant whitespace-nowrap">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 font-headline-sm text-headline-sm text-primary">
                    {item.name}
                  </td>
                  <td className="p-3 text-body-sm text-on-surface">
                    <div>{item.email}</div>
                    <div className="text-secondary font-semibold">{item.phone || "No Phone"}</div>
                  </td>
                  <td className="p-3 text-body-sm text-on-surface-variant">
                    <span className="font-semibold text-primary block">{item.program || "General Enquiry"}</span>
                    <span className="text-label-sm uppercase tracking-wider bg-surface-container px-2 py-0.5 rounded text-[11px] inline-block mt-1">
                      {item.mode || "Campus"}
                    </span>
                  </td>
                  <td className="p-3 text-body-sm text-on-surface-variant max-w-xs truncate" title={item.message}>
                    {item.message}
                  </td>
                  <td className="p-3">
                    <select
                      value={item.status || "unread"}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      className={`text-label-sm font-label-sm uppercase px-2 py-1 rounded font-semibold outline-none ${
                        item.status === 'replied'
                          ? 'bg-secondary-container text-on-secondary-container'
                          : item.status === 'read'
                          ? 'bg-surface-container-high text-on-surface'
                          : 'bg-error-container text-on-error-container animate-pulse'
                      }`}
                    >
                      <option value="unread">New / Unread</option>
                      <option value="read">Contacted</option>
                      <option value="replied">Resolved</option>
                    </select>
                  </td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <button onClick={() => handleDelete(item.id)} className="text-error font-label-sm hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
