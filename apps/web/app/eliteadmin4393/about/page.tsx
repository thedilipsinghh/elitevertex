"use client";

import { useState, useEffect } from "react";
import { useGetAdminAboutQuery, useUpdateAboutMutation } from "@/lib/features/api/apiSlice";

export default function AdminAboutPage() {
  const { data: response, isLoading } = useGetAdminAboutQuery({});
  const [updateAbout, { isLoading: isSaving }] = useUpdateAboutMutation();

  const [formData, setFormData] = useState({
    headerTitle: "",
    headerSubtitle: "",
    paradigmTitle: "",
    paradigmParagraph1: "",
    paradigmParagraph2: "",
    paradigmParagraph3: "",
    airtimeStat: "",
    ratioStat: "",
    paradigmImage: "",
    visionTitle: "",
    visionBody: "",
    missionTitle: "",
    missionBody: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (response?.data) {
      setFormData({
        headerTitle: response.data.headerTitle || "",
        headerSubtitle: response.data.headerSubtitle || "",
        paradigmTitle: response.data.paradigmTitle || "",
        paradigmParagraph1: response.data.paradigmParagraph1 || "",
        paradigmParagraph2: response.data.paradigmParagraph2 || "",
        paradigmParagraph3: response.data.paradigmParagraph3 || "",
        airtimeStat: response.data.airtimeStat || "",
        ratioStat: response.data.ratioStat || "",
        paradigmImage: response.data.paradigmImage || "",
        visionTitle: response.data.visionTitle || "",
        visionBody: response.data.visionBody || "",
        missionTitle: response.data.missionTitle || "",
        missionBody: response.data.missionBody || "",
      });
    }
  }, [response]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      await updateAbout(formData).unwrap();
      setMessage("✓ About Page content saved successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to save About Page content.");
    }
  };

  if (isLoading) return <p className="text-on-surface-variant">Loading About Page CRM...</p>;

  return (
    <div className="flex flex-col gap-space-xl max-w-5xl mx-auto">
      <div>
        <h1 className="font-display text-headline-lg text-on-surface">About Page Content CRM</h1>
        <p className="text-body-md text-on-surface-variant">Manage the institutional narrative, origin story, airtime statistics, vision, and mission statement.</p>
      </div>

      {message && (
        <div className="bg-secondary-container text-on-secondary-container p-4 rounded-xl font-label-md font-semibold">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-space-xl">
        {/* EDITORIAL HEADER */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant flex flex-col gap-space-md">
          <h3 className="font-headline-sm text-primary border-b border-outline-variant pb-2">Header Section</h3>
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface">Main Title</label>
            <input
              type="text"
              name="headerTitle"
              placeholder="More Than English. We Build Confidence."
              value={formData.headerTitle}
              onChange={handleChange}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface">Subtitle Narrative</label>
            <textarea
              rows={2}
              name="headerSubtitle"
              placeholder="Founded on the conviction that spoken language is mastered through psychological safety..."
              value={formData.headerSubtitle}
              onChange={handleChange}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
            />
          </div>
        </div>

        {/* ORIGIN & PARADIGM */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant flex flex-col gap-space-md">
          <h3 className="font-headline-sm text-primary border-b border-outline-variant pb-2">Our Story & Paradigm</h3>
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface">Headline</label>
            <input
              type="text"
              name="paradigmTitle"
              placeholder="Fluency is a physical and psychological habit."
              value={formData.paradigmTitle}
              onChange={handleChange}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            <div className="flex flex-col gap-1">
              <label className="font-label-md text-on-surface">Airtime Statistic (e.g. 70%)</label>
              <input
                type="text"
                name="airtimeStat"
                placeholder="70%"
                value={formData.airtimeStat}
                onChange={handleChange}
                className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label-md text-on-surface">Cohort Ratio Statistic (e.g. 1:12)</label>
              <input
                type="text"
                name="ratioStat"
                placeholder="1:12"
                value={formData.ratioStat}
                onChange={handleChange}
                className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface">Story Paragraph 1</label>
            <textarea
              rows={3}
              name="paradigmParagraph1"
              value={formData.paradigmParagraph1}
              onChange={handleChange}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface">Story Paragraph 2</label>
            <textarea
              rows={3}
              name="paradigmParagraph2"
              value={formData.paradigmParagraph2}
              onChange={handleChange}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface">Workshop Photo URL</label>
            <input
              type="text"
              name="paradigmImage"
              placeholder="https://..."
              value={formData.paradigmImage}
              onChange={handleChange}
              className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
            />
          </div>
        </div>

        {/* VISION & MISSION */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant flex flex-col gap-space-md">
          <h3 className="font-headline-sm text-primary border-b border-outline-variant pb-2">Vision & Mission</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            <div className="flex flex-col gap-space-sm">
              <label className="font-label-md text-on-surface font-bold">Institutional Vision</label>
              <input
                type="text"
                name="visionTitle"
                placeholder="Vision Title"
                value={formData.visionTitle}
                onChange={handleChange}
                className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
              />
              <textarea
                rows={4}
                name="visionBody"
                placeholder="Vision Body..."
                value={formData.visionBody}
                onChange={handleChange}
                className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
              />
            </div>
            <div className="flex flex-col gap-space-sm">
              <label className="font-label-md text-on-surface font-bold">Core Mission</label>
              <input
                type="text"
                name="missionTitle"
                placeholder="Mission Title"
                value={formData.missionTitle}
                onChange={handleChange}
                className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
              />
              <textarea
                rows={4}
                name="missionBody"
                placeholder="Mission Body..."
                value={formData.missionBody}
                onChange={handleChange}
                className="bg-surface-container p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary text-on-surface"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-primary text-on-primary font-label-lg px-space-2xl py-4 rounded-xl hover:bg-primary/90 transition-colors shadow-md disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save About Page Content"}
          </button>
        </div>
      </form>
    </div>
  );
}
