"use client";

import React, { useRef } from "react";

export interface CertificateData {
  studentName: string;
  certificateNumber: string;
  courseName: string;
  issueDate: string;
  grade?: string;
  customNote?: string;
  status?: "valid" | "revoked";
  signatory1?: {
    name?: string;
    title?: string;
    signUrl?: string;
  };
  signatory2?: {
    name?: string;
    title?: string;
    signUrl?: string;
  };
}

interface CertificateTemplateProps {
  data: CertificateData;
  className?: string;
  printableId?: string;
}

export function CertificateTemplate({
  data,
  className = "",
  printableId = "elite-vertex-certificate",
}: CertificateTemplateProps) {
  const {
    studentName = "Aditi Sharma",
    certificateNumber = "EV-2025-ENG-8492",
    courseName = "Advanced Spoken English & Executive Communication",
    issueDate = "14 Nov 2025",
    status = "valid",
    signatory1 = {
      name: "Dr. Aris Thorne",
      title: "Authorized Signatory",
      signUrl: "",
    },
    signatory2 = {
      name: "Prof. Marcus Vance",
      title: "Director / Principal",
      signUrl: "",
    },
  } = data;

  const formattedDate = (() => {
    try {
      if (!issueDate) return "14 Nov 2025";
      const d = new Date(issueDate);
      if (isNaN(d.getTime())) return issueDate;
      return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return issueDate;
    }
  })();

  return (
    <div
      id={printableId}
      className={`relative w-full max-w-[1000px] aspect-[1.414/1] bg-white text-slate-900 shadow-2xl rounded-sm overflow-hidden select-none print:shadow-none print:max-w-none print:w-full print:m-0 print:rounded-none ${className}`}
      style={{
        boxSizing: "border-box",
        fontFamily: "'Montserrat', 'Cinzel', serif, sans-serif",
      }}
    >
      {/* 1. Official Canva Template Background Graphic (High-Resolution 100% Match) */}
      <img
        src="/certificate-template.jpg"
        alt="Elite Vertex Certificate Template"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
      />

      {/* 2. Revoked Watermark Stamp if status is revoked */}
      {status === "revoked" && (
        <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
          <div className="border-8 border-red-600/70 text-red-600/70 font-black text-6xl tracking-widest uppercase px-12 py-6 rounded-2xl transform -rotate-12 select-none bg-white/70 backdrop-blur-xs">
            REVOKED
          </div>
        </div>
      )}

      {/* 3. DYNAMIC OVERLAY ELEMENTS PRECISELY POSITIONED ON TEMPLATE LINES */}
      <div className="absolute inset-0 z-10 pointer-events-none w-full h-full">
        
        {/* FIELD 1: Student Full Name (Centered directly over the student name line) */}
        <div
          className="absolute left-[24%] right-[24%] text-center flex items-center justify-center"
          style={{
            top: "45.5%",
            height: "6.5%",
          }}
        >
          <span
            className="text-lg sm:text-2xl md:text-3xl lg:text-[34px] font-extrabold tracking-wide text-[#002855] uppercase truncate max-w-full leading-none"
            style={{
              fontFamily: "'Cinzel', 'Times New Roman', serif",
              textShadow: "0 1px 2px rgba(255,255,255,0.8)",
            }}
          >
            {studentName}
          </span>
        </div>

        {/* FIELD 2: Course / Program Name (Centered directly over the course line) */}
        <div
          className="absolute left-[23%] right-[23%] text-center flex items-center justify-center"
          style={{
            top: "55.8%",
            height: "5.5%",
          }}
        >
          <span
            className="text-xs sm:text-base md:text-lg lg:text-[20px] font-bold tracking-normal text-[#8B0000] truncate max-w-full leading-none"
            style={{
              textShadow: "0 1px 2px rgba(255,255,255,0.8)",
            }}
          >
            {courseName}
          </span>
        </div>

        {/* FIELD 3: Date of Issue (Placed directly on the line after Date of Issue:) */}
        <div
          className="absolute text-center flex items-center justify-center"
          style={{
            top: "71.8%",
            left: "25.5%",
            width: "22%",
            height: "4%",
          }}
        >
          <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-slate-900 leading-none">
            {formattedDate}
          </span>
        </div>

        {/* FIELD 4: Certificate ID (Placed directly on the line after Certificate ID:) */}
        <div
          className="absolute text-center flex items-center justify-center"
          style={{
            top: "71.8%",
            left: "63.5%",
            width: "20%",
            height: "4%",
          }}
        >
          <span className="text-[10px] sm:text-xs md:text-sm font-mono font-bold text-slate-900 leading-none tracking-wider">
            {certificateNumber}
          </span>
        </div>

        {/* FIELD 5: Authorized Signatory (Signature + Name above Authorized Signatory line) */}
        <div
          className="absolute flex flex-col items-center justify-end text-center"
          style={{
            top: "76.5%",
            left: "15%",
            width: "22.5%",
            height: "9%",
          }}
        >
          {signatory1?.signUrl ? (
            <img
              src={signatory1.signUrl}
              alt={signatory1.name || "Authorized Signatory"}
              className="max-h-[75%] max-w-full object-contain filter contrast-125 mb-0.5"
            />
          ) : (
            <svg viewBox="0 0 160 45" className="w-24 sm:w-28 md:w-32 h-[75%] text-slate-900 mb-0.5">
              <path
                d="M10,32 Q25,8 40,20 T70,24 Q90,6 110,20 T150,15 M30,24 L55,10 M80,22 Q95,36 120,26"
                fill="none"
                stroke="#002855"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          )}
          {signatory1?.name && (
            <span className="text-[8px] sm:text-[9.5px] md:text-[11px] font-bold text-slate-900 leading-none">
              {signatory1.name}
            </span>
          )}
        </div>

        {/* FIELD 6: Director / Principal (Signature + Name above Director/Principal line) */}
        <div
          className="absolute flex flex-col items-center justify-end text-center"
          style={{
            top: "76.5%",
            left: "62.5%",
            width: "22.5%",
            height: "9%",
          }}
        >
          {signatory2?.signUrl ? (
            <img
              src={signatory2.signUrl}
              alt={signatory2.name || "Director / Principal"}
              className="max-h-[75%] max-w-full object-contain filter contrast-125 mb-0.5"
            />
          ) : (
            <svg viewBox="0 0 160 45" className="w-24 sm:w-28 md:w-32 h-[75%] text-slate-900 mb-0.5">
              <path
                d="M15,16 C35,6 40,34 55,16 T95,20 Q115,8 135,24 T150,12 M40,20 L145,20"
                fill="none"
                stroke="#002855"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          )}
          {signatory2?.name && (
            <span className="text-[8px] sm:text-[9.5px] md:text-[11px] font-bold text-slate-900 leading-none">
              {signatory2.name}
            </span>
          )}
        </div>

      </div>
    </div>
  );
}

// Utility to download high-resolution 300 DPI Certificate Canvas image
export async function downloadCertificateImage(
  data: CertificateData,
  fileName = "Elite_Vertex_Certificate.png"
) {
  if (typeof window === "undefined") return;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Render at 2048 x 1448 (Super High Resolution for Crisp Printing)
  canvas.width = 2048;
  canvas.height = 1448;

  const bgImg = new Image();
  bgImg.crossOrigin = "anonymous";
  bgImg.src = "/certificate-template.jpg";

  await new Promise((resolve, reject) => {
    bgImg.onload = resolve;
    bgImg.onerror = reject;
  });

  // Draw background template
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

  // Student Name
  ctx.font = "bold 56px 'Cinzel', 'Times New Roman', serif";
  ctx.fillStyle = "#002855";
  ctx.textAlign = "center";
  ctx.fillText(data.studentName.toUpperCase(), canvas.width / 2, 735);

  // Course Name
  ctx.font = "bold 38px 'Montserrat', sans-serif";
  ctx.fillStyle = "#8B0000";
  ctx.textAlign = "center";
  ctx.fillText(data.courseName, canvas.width / 2, 882);

  // Date of Issue
  let dateText = data.issueDate;
  try {
    const d = new Date(data.issueDate);
    if (!isNaN(d.getTime())) {
      dateText = d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
  } catch {}

  ctx.font = "600 28px 'Montserrat', sans-serif";
  ctx.fillStyle = "#0f172a";
  ctx.textAlign = "center";
  ctx.fillText(dateText, canvas.width * 0.365, 1075);

  // Certificate ID
  ctx.font = "bold 28px 'Courier New', monospace";
  ctx.fillStyle = "#0f172a";
  ctx.textAlign = "center";
  ctx.fillText(data.certificateNumber, canvas.width * 0.735, 1075);

  // Signatory 1 (Authorized Signatory)
  if (data.signatory1?.signUrl) {
    try {
      const sig1Img = new Image();
      sig1Img.crossOrigin = "anonymous";
      sig1Img.src = data.signatory1.signUrl;
      await new Promise((res) => {
        sig1Img.onload = res;
        sig1Img.onerror = res;
      });
      ctx.drawImage(sig1Img, canvas.width * 0.17, 1120, 240, 90);
    } catch {}
  } else {
    // Draw calligraphy line
    ctx.strokeStyle = "#002855";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.18, 1200);
    ctx.quadraticCurveTo(canvas.width * 0.22, 1140, canvas.width * 0.25, 1180);
    ctx.quadraticCurveTo(canvas.width * 0.27, 1130, canvas.width * 0.31, 1170);
    ctx.stroke();
  }

  if (data.signatory1?.name) {
    ctx.font = "bold 22px 'Montserrat', sans-serif";
    ctx.fillStyle = "#0f172a";
    ctx.textAlign = "center";
    ctx.fillText(data.signatory1.name, canvas.width * 0.26, 1238);
  }

  // Signatory 2 (Director / Principal)
  if (data.signatory2?.signUrl) {
    try {
      const sig2Img = new Image();
      sig2Img.crossOrigin = "anonymous";
      sig2Img.src = data.signatory2.signUrl;
      await new Promise((res) => {
        sig2Img.onload = res;
        sig2Img.onerror = res;
      });
      ctx.drawImage(sig2Img, canvas.width * 0.64, 1120, 240, 90);
    } catch {}
  } else {
    // Draw calligraphy line
    ctx.strokeStyle = "#002855";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.65, 1170);
    ctx.bezierCurveTo(canvas.width * 0.68, 1120, canvas.width * 0.70, 1220, canvas.width * 0.73, 1160);
    ctx.bezierCurveTo(canvas.width * 0.75, 1120, canvas.width * 0.77, 1190, canvas.width * 0.81, 1170);
    ctx.stroke();
  }

  if (data.signatory2?.name) {
    ctx.font = "bold 22px 'Montserrat', sans-serif";
    ctx.fillStyle = "#0f172a";
    ctx.textAlign = "center";
    ctx.fillText(data.signatory2.name, canvas.width * 0.735, 1238);
  }

  // Revoked watermark if needed
  if (data.status === "revoked") {
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(-0.25);
    ctx.font = "900 130px 'Montserrat', sans-serif";
    ctx.fillStyle = "rgba(220, 38, 38, 0.75)";
    ctx.textAlign = "center";
    ctx.fillText("REVOKED", 0, 40);
    ctx.strokeStyle = "rgba(220, 38, 38, 0.75)";
    ctx.lineWidth = 14;
    ctx.strokeRect(-380, -90, 760, 170);
    ctx.restore();
  }

  // Trigger browser download
  const link = document.createElement("a");
  link.download = fileName;
  link.href = canvas.toDataURL("image/png", 1.0);
  link.click();
}
