"use client";

import { useState } from "react";
import { useGetAdminCampusesQuery, useCreateCampusMutation, useDeleteCampusMutation } from "@/lib/features/api/apiSlice";

export default function AdminCampusesPage() {
  const { data: response, isLoading } = useGetAdminCampusesQuery({});
  const campuses = response?.data || [];
  const [createCampus, { isLoading: isCreating }] = useCreateCampusMutation();
  const [deleteCampus] = useDeleteCampusMutation();

  const [city, setCity] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [metroAccess, setMetroAccess] = useState("");
  const [parkingInfo, setParkingInfo] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city || !name || !address) return;

    try {
      await createCampus({
        city,
        name,
        address,
        landmark,
        metroAccess,
        parkingInfo,
        isPublished: true,
      }).unwrap();

      setCity("");
      setName("");
      setAddress("");
      setLandmark("");
      setMetroAccess("");
      setParkingInfo("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this campus location?")) {
      await deleteCampus(id);
    }
  };

  return (
    <div className="flex flex-col gap-space-xl max-w-5xl mx-auto">
      <div>
        <h1 className="font-display text-headline-lg text-on-surface">Campus Locations CRM</h1>
        <p className="text-body-md text-on-surface-variant">Manage physical institute campus addresses, metro access points, and transit landmarks.</p>
      </div>

      {/* Add Form */}
      <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant">
        <h3 className="font-headline-sm text-primary mb-space-md">Add New Campus Location</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface">City *</label>
            <input
              type="text"
              required
              placeholder="e.g. Bengaluru"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface">Campus / Tower Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. M.G. Road Campus (Apex Tower)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
            />
          </div>
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="font-label-md text-on-surface">Full Campus Address *</label>
            <textarea
              required
              rows={2}
              placeholder="Ground & 2nd Floor, Apex Tower, M.G. Road, Bengaluru 560001"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface">Metro / Transit Access</label>
            <input
              type="text"
              placeholder="e.g. 120m from M.G. Road Metro (Purple Line)"
              value={metroAccess}
              onChange={(e) => setMetroAccess(e.target.value)}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface">Landmark</label>
            <input
              type="text"
              placeholder="e.g. Opposite Cauvery Arts Emporium"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={isCreating}
              className="bg-primary text-on-primary font-label-md px-space-xl py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isCreating ? "Saving..." : "+ Save Campus Location"}
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant">
        <h3 className="font-headline-sm text-primary mb-space-md">Campus Network ({campuses.length})</h3>
        {isLoading ? (
          <p className="text-on-surface-variant">Loading campuses...</p>
        ) : campuses.length === 0 ? (
          <p className="text-on-surface-variant">No campus locations added yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            {campuses.map((item: any) => (
              <div key={item.id} className="bg-surface-container-low p-space-md rounded-lg flex flex-col justify-between">
                <div>
                  <span className="font-label-sm text-secondary font-bold uppercase tracking-wider">{item.city}</span>
                  <h4 className="font-headline-sm text-primary">{item.name}</h4>
                  <p className="font-body-sm text-on-surface-variant mt-1">{item.address}</p>
                </div>
                <div className="mt-space-md pt-space-xs border-t border-outline-variant flex justify-end">
                  <button onClick={() => handleDelete(item.id)} className="text-error font-label-sm hover:underline">
                    Delete Campus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
