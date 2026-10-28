"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  useGetAdminCertificatesQuery,
  useCreateCertificateMutation,
  useUpdateCertificateMutation,
  useDeleteCertificateMutation,
  useUpdateAuthoritySignaturesMutation,
  useSeedCertificatesMutation,
  useGetCoursesQuery,
} from "@/lib/features/api/apiSlice";
import { CertificateTemplate, CertificateData } from "@/components/certificate/CertificateTemplate";
import DualImageInput from "@/components/admin/DualImageInput";

export default function AdminCertificatesCmsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: response, isLoading, refetch } = useGetAdminCertificatesQuery({ q: searchQuery });
  const { data: coursesResponse } = useGetCoursesQuery({});

  const [createCertificate, { isLoading: isCreating }] = useCreateCertificateMutation();
  const [updateCertificate, { isLoading: isUpdating }] = useUpdateCertificateMutation();
  const [deleteCertificate] = useDeleteCertificateMutation();
  const [updateSignatures, { isLoading: isSavingSignatures }] = useUpdateAuthoritySignaturesMutation();
  const [seedCertificates, { isLoading: isSeeding }] = useSeedCertificatesMutation();

  const certificatesList = response?.data || [];
  const coursesList = coursesResponse?.data || [];

  const [activeTab, setActiveTab] = useState<"list" | "issue" | "signatures">("list");
  const [toastMessage, setToastMessage] = useState("");
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [previewCert, setPreviewCert] = useState<CertificateData | null>(null);

  // Form state for creating / editing certificate
  const [formData, setFormData] = useState({
    certificateNumber: "",
    studentName: "",
    courseName: "Fluent Spoken English & Advanced Communication",
    issueDate: new Date().toISOString().split("T")[0],
    grade: "Distinction (CEFR C1)",
    customNote: "We appreciate their dedication and commitment towards learning and skill development.",
    status: "valid" as "valid" | "revoked",
  });

  // Authority Signatures CMS State
  const [signaturesForm, setSignaturesForm] = useState({
    sig1Name: "Dr. Aris Thorne",
    sig1Title: "Authorized Signatory",
    sig1Sign: "",
    sig2Name: "Prof. Marcus Vance",
    sig2Title: "Director / Principal",
    sig2Sign: "",
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  useEffect(() => {
    if (response?.authoritySignatures) {
      const a = response.authoritySignatures;
      setSignaturesForm((prev) => ({
        ...prev,
        sig1Name: a.sig1Name || prev.sig1Name,
        sig1Title: a.sig1Title || prev.sig1Title,
        sig1Sign: a.sig1Sign || prev.sig1Sign,
        sig2Name: a.sig2Name || prev.sig2Name,
        sig2Title: a.sig2Title || prev.sig2Title,
        sig2Sign: a.sig2Sign || prev.sig2Sign,
      }));
    }
  }, [
    response?.authoritySignatures?.sig1Name,
    response?.authoritySignatures?.sig1Title,
    response?.authoritySignatures?.sig1Sign,
    response?.authoritySignatures?.sig2Name,
    response?.authoritySignatures?.sig2Title,
    response?.authoritySignatures?.sig2Sign,
  ]);

  const generateCertNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    const generated = `EV-${year}-ENG-${random}`;
    setFormData((prev) => ({ ...prev, certificateNumber: generated }));
  };

  const handleStartCreate = () => {
    setEditingCertId(null);
    generateCertNumber();
    setFormData((prev) => ({
      ...prev,
      studentName: "",
      courseName: coursesList[0]?.title || "Fluent Spoken English & Advanced Communication",
      issueDate: new Date().toISOString().split("T")[0],
      grade: "Distinction (CEFR C1)",
      customNote: "We appreciate their dedication and commitment towards learning and skill development.",
      status: "valid",
    }));
    setActiveTab("issue");
  };

  const handleStartEdit = (cert: any) => {
    setEditingCertId(cert.id);
    setFormData({
      certificateNumber: cert.certificateNumber,
      studentName: cert.studentName,
      courseName: cert.courseName,
      issueDate: cert.issueDate,
      grade: cert.grade || "Distinction",
      customNote: cert.customNote || "We appreciate their dedication and commitment towards learning and skill development.",
      status: cert.status,
    });
    setActiveTab("issue");
  };

  const handleSubmitCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName.trim() || !formData.certificateNumber.trim() || !formData.courseName.trim()) {
      showToast("❌ Please fill in all required fields (Student Name, Cert #, Course).");
      return;
    }

    try {
      if (editingCertId) {
        await updateCertificate({ id: editingCertId, ...formData }).unwrap();
        showToast("✓ Certificate updated successfully!");
      } else {
        await createCertificate(formData).unwrap();
        showToast("✓ Certificate created and added to Academic Registry!");
      }
      refetch();
      setActiveTab("list");
      setEditingCertId(null);
    } catch (err: any) {
      console.error("Save error:", err);
      showToast("❌ Error: " + (err?.data?.message || err.message));
    }
  };

  const handleDeleteCert = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete the certificate for "${name}"?`)) return;
    try {
      await deleteCertificate(id).unwrap();
      showToast("✓ Certificate deleted successfully.");
      refetch();
    } catch (err: any) {
      showToast("❌ Failed to delete certificate.");
    }
  };

  const handleToggleStatus = async (cert: any) => {
    const newStatus = cert.status === "valid" ? "revoked" : "valid";
    try {
      await updateCertificate({ id: cert.id, status: newStatus }).unwrap();
      showToast(`✓ Certificate marked as ${newStatus.toUpperCase()}`);
      refetch();
    } catch (err: any) {
      showToast("❌ Status update failed.");
    }
  };

  const handleSaveSignatures = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSignatures(signaturesForm).unwrap();
      showToast("✓ Authority signatures and titles updated successfully!");
      refetch();
    } catch (err: any) {
      showToast("❌ Failed to save signatures.");
    }
  };

  const handleSeedDemo = async () => {
    try {
      await seedCertificates({}).unwrap();
      showToast("✓ Sample institutional certificates seeded!");
      refetch();
    } catch (err: any) {
      showToast("❌ Seeding failed.");
    }
  };

  // Preview data combining form with current authority signatures
  const livePreviewData: CertificateData = {
    certificateNumber: formData.certificateNumber || "EV-2026-ENG-0000",
    studentName: formData.studentName || "Student Full Name",
    courseName: formData.courseName || "Course / Program Name",
    issueDate: formData.issueDate || "14 Nov 2025",
    grade: formData.grade,
    customNote: formData.customNote,
    status: formData.status,
    signatory1: {
      name: signaturesForm.sig1Name,
      title: signaturesForm.sig1Title,
      signUrl: signaturesForm.sig1Sign,
    },
    signatory2: {
      name: signaturesForm.sig2Name,
      title: signaturesForm.sig2Title,
      signUrl: signaturesForm.sig2Sign,
    },
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-16 font-sans">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-secondary text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 font-semibold text-sm border border-secondary">
          <span className="material-symbols-outlined text-[20px]">
            {toastMessage.includes("✓") ? "check_circle" : "error"}
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-outline-variant">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[28px]">workspace_premium</span>
            <h1 className="font-display text-2xl md:text-3xl font-extrabold text-on-surface">
              Certificate Registry &amp; Authority CMS
            </h1>
          </div>
          <p className="text-sm text-on-surface-variant mt-1">
            Issue verified certificates, update student credentials, manage authorized signatures, and maintain official ISO academic attestations.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <Link
            href="/verify-certificate"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container-high transition-colors text-sm font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">verified</span>
            Public Verification Portal
          </Link>

          <button
            onClick={handleStartCreate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-secondary text-white hover:bg-on-secondary-container transition-all text-sm font-bold shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            Issue New Certificate
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-outline-variant pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("list")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${
            activeTab === "list"
              ? "bg-secondary text-white"
              : "text-on-surface-variant hover:bg-surface-container-high"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">list_alt</span>
          All Issued Certificates ({certificatesList.length})
        </button>

        <button
          onClick={() => {
            if (!editingCertId && !formData.certificateNumber) generateCertNumber();
            setActiveTab("issue");
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${
            activeTab === "issue"
              ? "bg-secondary text-white"
              : "text-on-surface-variant hover:bg-surface-container-high"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {editingCertId ? "edit_document" : "post_add"}
          </span>
          {editingCertId ? "Edit Certificate" : "Issue / Create Certificate"}
        </button>

        <button
          onClick={() => setActiveTab("signatures")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${
            activeTab === "signatures"
              ? "bg-secondary text-white"
              : "text-on-surface-variant hover:bg-surface-container-high"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">draw</span>
          Authority Signatures &amp; Seal CMS
        </button>
      </div>

      {/* TAB 1: ALL ISSUED CERTIFICATES */}
      {activeTab === "list" && (
        <div className="flex flex-col gap-5">
          {/* Search & Actions Bar */}
          <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by student name, certificate ID, course..."
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-sm font-medium focus:outline-none focus:border-secondary"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {certificatesList.length === 0 && (
                <button
                  onClick={handleSeedDemo}
                  disabled={isSeeding}
                  className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider bg-surface-container hover:bg-surface-container-high border border-outline-variant rounded-lg transition-colors"
                >
                  {isSeeding ? "Seeding..." : "Load Sample Certificates"}
                </button>
              )}
              <span className="text-xs font-semibold text-on-surface-variant">
                Total Records: {certificatesList.length}
              </span>
            </div>
          </div>

          {/* Certificates Table */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm">
            {isLoading ? (
              <div className="p-12 text-center text-sm text-on-surface-variant">
                <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                Loading certificates...
              </div>
            ) : certificatesList.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center gap-3">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant">
                  badge
                </span>
                <h3 className="font-bold text-on-surface text-base">No Certificates Issued Yet</h3>
                <p className="text-xs text-on-surface-variant max-w-sm">
                  Click &quot;Issue New Certificate&quot; to issue an official completion certificate or seed sample institutional records.
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={handleStartCreate}
                    className="px-4 py-2 bg-secondary text-white rounded-lg text-xs font-bold"
                  >
                    Issue First Certificate
                  </button>
                  <button
                    onClick={handleSeedDemo}
                    className="px-4 py-2 bg-surface-container border border-outline-variant rounded-lg text-xs font-bold"
                  >
                    Seed Demo Records
                  </button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                      <th className="p-3.5 pl-6">Certificate ID</th>
                      <th className="p-3.5">Student Name</th>
                      <th className="p-3.5">Course / Program</th>
                      <th className="p-3.5">Issue Date</th>
                      <th className="p-3.5">Grade</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/60">
                    {certificatesList.map((cert: any) => (
                      <tr
                        key={cert.id}
                        className="hover:bg-surface-container-low transition-colors"
                      >
                        <td className="p-3.5 pl-6 font-mono font-bold text-secondary whitespace-nowrap">
                          {cert.certificateNumber}
                        </td>
                        <td className="p-3.5 font-bold text-on-surface">
                          {cert.studentName}
                        </td>
                        <td className="p-3.5 text-on-surface-variant max-w-xs truncate" title={cert.courseName}>
                          {cert.courseName}
                        </td>
                        <td className="p-3.5 text-on-surface-variant whitespace-nowrap">
                          {cert.issueDate}
                        </td>
                        <td className="p-3.5 text-on-surface-variant whitespace-nowrap text-xs font-semibold">
                          {cert.grade || "Distinction"}
                        </td>
                        <td className="p-3.5 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleStatus(cert)}
                            title="Click to toggle status"
                            className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider border transition-colors ${
                              cert.status === "valid"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                                : "bg-red-50 text-red-800 border-red-300 hover:bg-red-100"
                            }`}
                          >
                            {cert.status === "valid" ? "✓ Valid" : "✕ Revoked"}
                          </button>
                        </td>
                        <td className="p-3.5 pr-6 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setPreviewCert({
                                  certificateNumber: cert.certificateNumber,
                                  studentName: cert.studentName,
                                  courseName: cert.courseName,
                                  issueDate: cert.issueDate,
                                  grade: cert.grade,
                                  customNote: cert.customNote,
                                  status: cert.status,
                                  signatory1: {
                                    name: signaturesForm.sig1Name,
                                    title: signaturesForm.sig1Title,
                                    signUrl: signaturesForm.sig1Sign,
                                  },
                                  signatory2: {
                                    name: signaturesForm.sig2Name,
                                    title: signaturesForm.sig2Title,
                                    signUrl: signaturesForm.sig2Sign,
                                  },
                                });
                              }}
                              className="p-1.5 text-secondary hover:bg-secondary/10 rounded-lg transition-colors"
                              title="Preview Certificate"
                            >
                              <span className="material-symbols-outlined text-[18px]">visibility</span>
                            </button>

                            <Link
                              href={`/verify-certificate?id=${cert.certificateNumber}`}
                              target="_blank"
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Open Verification Link"
                            >
                              <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                            </Link>

                            <button
                              onClick={() => handleStartEdit(cert)}
                              className="p-1.5 text-on-surface hover:bg-surface-container-high rounded-lg transition-colors"
                              title="Edit Details"
                            >
                              <span className="material-symbols-outlined text-[18px]">edit</span>
                            </button>

                            <button
                              onClick={() => handleDeleteCert(cert.id, cert.studentName)}
                              className="p-1.5 text-error hover:bg-error-container rounded-lg transition-colors"
                              title="Delete Record"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ISSUE / EDIT CERTIFICATE */}
      {activeTab === "issue" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form Controls */}
          <div className="lg:col-span-5 bg-surface-container-lowest p-6 sm:p-7 rounded-2xl border border-outline-variant shadow-sm flex flex-col gap-5">
            <div className="border-b border-outline-variant pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-on-surface text-base">
                  {editingCertId ? "Edit Certificate Record" : "Issue New Student Certificate"}
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  All changes will dynamically reflect on the live preview and verifiable PDF parchment.
                </p>
              </div>
              {editingCertId && (
                <button
                  type="button"
                  onClick={handleStartCreate}
                  className="text-xs text-secondary font-bold underline"
                >
                  Create New Instead
                </button>
              )}
            </div>

            <form onSubmit={handleSubmitCertificate} className="flex flex-col gap-4">
              
              {/* Certificate Number */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Certificate Number / ID *
                  </label>
                  <button
                    type="button"
                    onClick={generateCertNumber}
                    className="text-[11px] font-bold text-secondary hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">autorenew</span>
                    Auto Generate
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={formData.certificateNumber}
                  onChange={(e) => setFormData({ ...formData, certificateNumber: e.target.value.toUpperCase() })}
                  placeholder="e.g. EV-2026-ENG-8492"
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-sm font-mono font-bold focus:outline-none focus:border-secondary uppercase"
                />
              </div>

              {/* Student Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                  Student Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  placeholder="e.g. Aditi Sharma"
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-sm font-semibold focus:outline-none focus:border-secondary"
                />
              </div>

              {/* Course Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                  Course / Program Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.courseName}
                  onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                  placeholder="e.g. Advanced Spoken English & Executive Communication"
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-sm font-semibold focus:outline-none focus:border-secondary mb-2"
                />
                {coursesList.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block w-full">
                      Quick Pick From Courses:
                    </span>
                    {coursesList.slice(0, 4).map((c: any) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, courseName: c.title })}
                        className="px-2 py-1 bg-surface-container text-[11px] font-medium rounded border border-outline-variant hover:bg-secondary/10 hover:border-secondary transition-colors truncate max-w-[200px]"
                      >
                        {c.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Issue Date & Grade */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Date of Issue *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-sm font-medium focus:outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Attainment / Grade
                  </label>
                  <input
                    type="text"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    placeholder="e.g. Distinction (CEFR C1)"
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl text-sm font-medium focus:outline-none focus:border-secondary"
                  />
                </div>
              </div>

              {/* Custom Note */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                  Appreciation / Attestation Text
                </label>
                <textarea
                  rows={2}
                  value={formData.customNote}
                  onChange={(e) => setFormData({ ...formData, customNote: e.target.value })}
                  placeholder="We appreciate their dedication and commitment towards learning and skill development."
                  className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-xs font-medium focus:outline-none focus:border-secondary resize-none"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                  Registry Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: "valid" })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 ${
                      formData.status === "valid"
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-surface-container-low text-on-surface-variant border-outline-variant"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    Valid / Active
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: "revoked" })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 ${
                      formData.status === "revoked"
                        ? "bg-red-600 text-white border-red-600"
                        : "bg-surface-container-low text-on-surface-variant border-outline-variant"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">cancel</span>
                    Revoked
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="flex-1 py-3.5 bg-secondary hover:bg-on-secondary-container text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {isCreating || isUpdating ? "hourglass_empty" : "save"}
                  </span>
                  <span>{editingCertId ? "Update Certificate" : "Issue Certificate Now"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("list")}
                  className="px-5 py-3.5 bg-surface-container-low hover:bg-surface-container border border-outline-variant text-on-surface font-semibold text-sm rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>

          {/* Right Column: Live Dynamic Canva Preview */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Live Canva Template Preview
              </span>
              <span className="text-xs text-on-surface-variant">
                Landscape A4 / Vector Ratio
              </span>
            </div>

            <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant flex items-center justify-center overflow-hidden">
              <CertificateTemplate data={livePreviewData} />
            </div>

            <p className="text-xs text-on-surface-variant text-center">
              This exact design will be rendered on the public verification portal and when students download or print their credentials as PDF.
            </p>
          </div>

        </div>
      )}

      {/* TAB 3: AUTHORITY SIGNATURES CMS */}
      {activeTab === "signatures" && (
        <div className="max-w-4xl mx-auto w-full bg-surface-container-lowest p-6 sm:p-8 rounded-2xl border border-outline-variant shadow-sm flex flex-col gap-6">
          <div className="border-b border-outline-variant pb-4">
            <h3 className="font-bold text-on-surface text-lg">
              Official Authority Signatures &amp; Designation CMS
            </h3>
            <p className="text-xs text-on-surface-variant mt-1">
              Customize the names, administrative titles, and actual signature images of the two certifying authorities printed on all certificates.
            </p>
          </div>

          <form onSubmit={handleSaveSignatures} className="flex flex-col gap-6">
            
            {/* SIGNATORY 1 */}
            <div className="p-5 bg-surface-container-low rounded-xl border border-outline-variant flex flex-col gap-4">
              <div className="flex items-center gap-2 text-sm font-bold text-secondary">
                <span className="material-symbols-outlined text-[20px]">draw</span>
                <h4>Signatory 1: Authorized Academic Signatory (Left)</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Authority Name
                  </label>
                  <input
                    type="text"
                    value={signaturesForm.sig1Name}
                    onChange={(e) => setSignaturesForm({ ...signaturesForm, sig1Name: e.target.value })}
                    placeholder="e.g. Dr. Aris Thorne"
                    className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Official Title / Designation
                  </label>
                  <input
                    type="text"
                    value={signaturesForm.sig1Title}
                    onChange={(e) => setSignaturesForm({ ...signaturesForm, sig1Title: e.target.value })}
                    placeholder="e.g. Authorized Signatory / Academic Dean"
                    className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:outline-none focus:border-secondary"
                  />
                </div>
              </div>

              <div>
                <DualImageInput
                  label="Authorized Signatory Signature Image"
                  value={signaturesForm.sig1Sign}
                  onChange={(val) => setSignaturesForm({ ...signaturesForm, sig1Sign: val })}
                  helpText="Transparent PNG image recommended. If left empty, an elegant digital calligraphy signature will be rendered automatically."
                />
              </div>
            </div>

            {/* SIGNATORY 2 */}
            <div className="p-5 bg-surface-container-low rounded-xl border border-outline-variant flex flex-col gap-4">
              <div className="flex items-center gap-2 text-sm font-bold text-secondary">
                <span className="material-symbols-outlined text-[20px]">draw</span>
                <h4>Signatory 2: Director / Principal (Right)</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Authority Name
                  </label>
                  <input
                    type="text"
                    value={signaturesForm.sig2Name}
                    onChange={(e) => setSignaturesForm({ ...signaturesForm, sig2Name: e.target.value })}
                    placeholder="e.g. Prof. Marcus Vance"
                    className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Official Title / Designation
                  </label>
                  <input
                    type="text"
                    value={signaturesForm.sig2Title}
                    onChange={(e) => setSignaturesForm({ ...signaturesForm, sig2Title: e.target.value })}
                    placeholder="e.g. Director / Principal"
                    className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:outline-none focus:border-secondary"
                  />
                </div>
              </div>

              <div>
                <DualImageInput
                  label="Director / Principal Signature Image"
                  value={signaturesForm.sig2Sign}
                  onChange={(val) => setSignaturesForm({ ...signaturesForm, sig2Sign: val })}
                  helpText="Transparent PNG image recommended. If left empty, an elegant digital executive signature will be rendered automatically."
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-on-surface-variant">
                Updated signatures will apply instantly across all past and future issued certificates.
              </span>

              <button
                type="submit"
                disabled={isSavingSignatures}
                className="flex items-center gap-2 px-8 py-3.5 bg-secondary hover:bg-on-secondary-container text-white font-bold text-sm rounded-xl shadow-md transition-all disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {isSavingSignatures ? "hourglass_empty" : "save"}
                </span>
                <span>{isSavingSignatures ? "Saving..." : "Save Authority Signatures"}</span>
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Certificate Modal Preview */}
      {previewCert && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-surface rounded-2xl max-w-4xl w-full p-6 border border-outline-variant shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-outline-variant pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[24px]">verified</span>
                <h3 className="font-bold text-on-surface text-base">
                  Official Attestation Preview — {previewCert.certificateNumber}
                </h3>
              </div>
              <button
                onClick={() => setPreviewCert(null)}
                className="p-1.5 text-on-surface-variant hover:text-on-surface rounded-lg"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex justify-center p-2 bg-slate-100 rounded-xl">
              <CertificateTemplate data={previewCert} />
            </div>

            <div className="flex items-center justify-between pt-2">
              <Link
                href={`/verify-certificate?id=${previewCert.certificateNumber}`}
                target="_blank"
                className="text-xs font-bold text-secondary hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                Open Verification URL
              </Link>

              <button
                onClick={() => setPreviewCert(null)}
                className="px-6 py-2.5 bg-secondary text-white rounded-xl text-xs font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
