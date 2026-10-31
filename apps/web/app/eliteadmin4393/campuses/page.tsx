"use client";

import { useState } from "react";
import {
  useGetAdminCampusesQuery,
  useCreateCampusMutation,
  useUpdateCampusMutation,
  useDeleteCampusMutation,
} from "@/lib/features/api/apiSlice";

export default function AdminCampusesPage() {
  const { data: response, isLoading } = useGetAdminCampusesQuery({});
  const campuses = response?.data || [];
  const [createCampus, { isLoading: isCreating }] = useCreateCampusMutation();
  const [updateCampus, { isLoading: isUpdating }] = useUpdateCampusMutation();
  const [deleteCampus] = useDeleteCampusMutation();

  const [editId, setEditId] = useState<string | null>(null);
  const [city, setCity] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [metroAccess, setMetroAccess] = useState("");
  const [parkingInfo, setParkingInfo] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const resetForm = () => {
    setEditId(null);
    setCity("");
    setName("");
    setAddress("");
    setLandmark("");
    setMetroAccess("");
    setParkingInfo("");
    setMapUrl("");
    setIsPublished(true);
  };

  const handleStartEdit = (campus: any) => {
    setEditId(campus.id);
    setCity(campus.city || "");
    setName(campus.name || "");
    setAddress(campus.address || "");
    setLandmark(campus.landmark || "");
    setMetroAccess(campus.metroAccess || "");
    setParkingInfo(campus.parkingInfo || "");
    setMapUrl(campus.mapUrl || "");
    setIsPublished(campus.isPublished !== false);

    // Scroll up to form smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim() || !name.trim() || !address.trim()) {
      showToast("❌ Please fill in City, Campus Name, and Full Address.");
      return;
    }

    const payload = {
      city: city.trim(),
      name: name.trim(),
      address: address.trim(),
      landmark: landmark.trim() || null,
      metroAccess: metroAccess.trim() || null,
      parkingInfo: parkingInfo.trim() || null,
      mapUrl: mapUrl.trim() || null,
      isPublished,
    };

    try {
      if (editId) {
        await updateCampus({ id: editId, ...payload }).unwrap();
        showToast("✓ Campus location updated successfully!");
      } else {
        await createCampus(payload).unwrap();
        showToast("✓ New campus location added successfully!");
      }
      resetForm();
    } catch (err: any) {
      console.error(err);
      showToast("❌ Failed to save campus: " + (err?.data?.message || err?.message || "Server error"));
    }
  };

  const handleDelete = async (id: string, campusName: string) => {
    if (confirm(`Are you sure you want to delete "${campusName}"?`)) {
      try {
        await deleteCampus(id).unwrap();
        showToast("✓ Campus location deleted!");
        if (editId === id) resetForm();
      } catch (err: any) {
        console.error(err);
        showToast("❌ Failed to delete campus: " + (err?.data?.message || err?.message || "Server error"));
      }
    }
  };

  const isSaving = isCreating || isUpdating;

  return (
    <div className="flex flex-col gap-space-xl max-w-5xl mx-auto pb-12 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-secondary text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 font-semibold text-sm border border-secondary animate-fade-in">
          <span className="material-symbols-outlined text-[20px]">
            {toastMessage.includes("✓") ? "check_circle" : "error"}
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      <div>
        <h1 className="font-display text-2xl sm:text-3xl text-on-surface font-extrabold">Campus Locations CRM</h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          Manage physical institute campus addresses, metro access points, transit landmarks, and Google Maps directions for the website.
        </p>
      </div>

      {/* Campus Form (Add or Edit) */}
      <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl shadow-sm border border-outline-variant">
        <div className="flex items-center justify-between border-b border-outline-variant pb-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[24px]">
              {editId ? "edit_location_alt" : "add_location_alt"}
            </span>
            <h3 className="font-headline-sm text-primary font-bold text-lg">
              {editId ? `Edit Campus Location` : "Add New Campus Location"}
            </h3>
          </div>
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs font-bold uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
              Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-xs font-bold uppercase tracking-wider text-on-surface">City / Region *</label>
            <input
              type="text"
              required
              placeholder="e.g. Siwan or Mairwa"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-secondary text-on-surface text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-md text-xs font-bold uppercase tracking-wider text-on-surface">Campus / Tower Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Shastri Nagar Registry Kachari Campus"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-secondary text-on-surface text-sm"
            />
          </div>

          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="font-label-md text-xs font-bold uppercase tracking-wider text-on-surface">Full Campus Address *</label>
            <textarea
              required
              rows={2}
              placeholder="e.g. Ground Floor, Plaza 2, Siwan, Bihar 841226"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-secondary text-on-surface text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-md text-xs font-bold uppercase tracking-wider text-on-surface">Transit / Station Access</label>
            <input
              type="text"
              placeholder="e.g. Near Siwan Junction Railway Station"
              value={metroAccess}
              onChange={(e) => setMetroAccess(e.target.value)}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-secondary text-on-surface text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-md text-xs font-bold uppercase tracking-wider text-on-surface">Prominent Landmark</label>
            <input
              type="text"
              placeholder="e.g. Opposite Gandhi Maidan / Registry Office"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-secondary text-on-surface text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-md text-xs font-bold uppercase tracking-wider text-on-surface">Parking / Access Information</label>
            <input
              type="text"
              placeholder="e.g. Dedicated two-wheeler & visitor parking available"
              value={parkingInfo}
              onChange={(e) => setParkingInfo(e.target.value)}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-secondary text-on-surface text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-md text-xs font-bold uppercase tracking-wider text-on-surface">Google Maps Link</label>
            <input
              type="text"
              placeholder="https://maps.google.com/?q=..."
              value={mapUrl}
              onChange={(e) => setMapUrl(e.target.value)}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-secondary text-on-surface text-sm"
            />
          </div>

          <div className="md:col-span-2 flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 text-secondary rounded focus:ring-secondary cursor-pointer"
              />
              <span className="text-xs font-semibold text-on-surface">Published (Visible on website)</span>
            </label>

            <div className="flex items-center gap-3">
              {editId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-surface-container hover:bg-surface-container-high text-on-surface px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isSaving}
                className="bg-secondary hover:bg-on-secondary-container text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {editId ? "save" : "add"}
                </span>
                <span>{isSaving ? "Saving..." : editId ? "Update Campus" : "+ Add Campus"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Campuses List */}
      <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl shadow-sm border border-outline-variant">
        <div className="flex items-center justify-between border-b border-outline-variant pb-3 mb-6">
          <h3 className="font-headline-sm text-primary font-bold text-lg">
            Active Campus Network ({campuses.length})
          </h3>
          <span className="text-xs font-semibold text-on-surface-variant">
            Displayed on Contact Page &amp; Footer
          </span>
        </div>

        {isLoading ? (
          <p className="text-on-surface-variant text-sm">Loading campuses...</p>
        ) : campuses.length === 0 ? (
          <p className="text-on-surface-variant text-sm">No campus locations added yet. Add your first campus above!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campuses.map((item: any) => (
              <div
                key={item.id}
                className={`bg-surface-container-low p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                  editId === item.id ? "border-secondary ring-2 ring-secondary/20 shadow-sm" : "border-outline-variant/40"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-secondary/10 text-secondary border border-secondary/20">
                      {item.city}
                    </span>
                    {!item.isPublished && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                        Draft
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-base text-primary leading-snug">{item.name}</h4>
                  <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed font-medium">
                    {item.address}
                  </p>

                  {(item.landmark || item.metroAccess) && (
                    <div className="mt-3 pt-3 border-t border-outline-variant/30 flex flex-col gap-1 text-[11px] text-on-surface-variant">
                      {item.landmark && (
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[14px] text-secondary">near_me</span>
                          <span><strong>Landmark:</strong> {item.landmark}</span>
                        </div>
                      )}
                      {item.metroAccess && (
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[14px] text-secondary">train</span>
                          <span><strong>Access:</strong> {item.metroAccess}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-outline-variant/40 flex items-center justify-between">
                  <span className="text-[11px] text-on-surface-variant font-mono">
                    ID: {item.id.slice(0, 8)}...
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(item)}
                      className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">edit</span>
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id, item.name)}
                      className="px-3 py-1.5 rounded-lg text-error hover:bg-error/10 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">delete</span>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
