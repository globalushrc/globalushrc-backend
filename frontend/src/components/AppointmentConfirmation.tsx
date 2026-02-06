import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import Barcode from "react-barcode";

interface AppointmentConfirmationProps {
  applicantDetails: {
    name: string;
    email: string;
    phone: string;
    service: string;
    date: string;
    time: string;
    referenceId: string;
  };
}

const AppointmentConfirmation: React.FC<AppointmentConfirmationProps> = ({
  applicantDetails,
}) => {
  // Helper to format Reference ID: REF-1770374016361 -> 177-0374-0163-61
  const formatRefId = (rawId: string) => {
    const digits = rawId.replace(/\D/g, "");
    if (digits.length >= 12) {
      return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}-${digits.slice(11)}`;
    }
    return rawId;
  };

  const formattedId = formatRefId(applicantDetails.referenceId);

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        width: "794px",
        minHeight: "1123px",
        color: "#000000",
        padding: "56px",
        fontFamily: "'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        margin: "0 auto",
        position: "relative",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header - REFINED CLEAN LAYOUT */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          paddingBottom: "24px",
          marginBottom: "40px",
          borderBottom: "2px solid #f1f5f9",
        }}
      >
        {/* Left: Branding */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <img
            src="/logo.png"
            alt="Logo"
            style={{ height: "55px", width: "auto", objectFit: "contain" }}
          />
          <div>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: "900",
                textTransform: "uppercase",
                margin: "0",
                color: "#000000",
                letterSpacing: "-0.04em",
                whiteSpace: "nowrap",
                lineHeight: "1",
              }}
            >
              Global US HR Consultant
            </h1>
            <p
              style={{
                fontSize: "10px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                margin: "6px 0 0 0",
                color: "#64748b",
              }}
            >
              International Workforce & Recruitment Experts
            </p>
          </div>
        </div>

        {/* Right: Appointment Reference Block - FIXED ALIGNMENT & NO OVERLAP */}
        <div
          style={{
            textAlign: "right",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            minWidth: "220px",
          }}
        >
          <p
            style={{
              fontSize: "9px",
              fontWeight: "900",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              margin: "0 0 8px 0",
              color: "#94a3b8",
            }}
          >
            Appointment Reference
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <p
              style={{
                fontSize: "18px",
                fontWeight: "900",
                margin: "0 0 8px 0", // Increased from 4px to 8px
                color: "#000000",
                fontFamily: "monospace",
                letterSpacing: "0.05em",
                lineHeight: "1.2", // Explicit line height
              }}
            >
              {formattedId}
            </p>

            {/* Header integrated barcode - BORDERLESS */}
            <div
              style={{
                display: "inline-block",
                margin: "0", // Reset margins
              }}
            >
              <Barcode
                value={applicantDetails.referenceId}
                height={22}
                width={1.2}
                fontSize={0}
                displayValue={false}
                margin={0}
                renderer="canvas"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1 }}>
        <section style={{ marginBottom: "40px" }}>
          <h2
            style={{
              fontSize: "12px",
              fontWeight: "900",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              marginBottom: "32px",
              color: "#94a3b8",
              borderBottom: "1px solid #f1f5f9",
              paddingBottom: "8px",
              display: "inline-block",
            }}
          >
            Appointment Confirmation Letter
          </h2>

          <p style={{ fontSize: "16px", marginBottom: "24px", color: "#000" }}>
            Dear{" "}
            <span style={{ fontWeight: "900" }}>
              {applicantDetails.name.toUpperCase()}
            </span>
            ,
          </p>

          <p
            style={{
              fontSize: "15px",
              lineHeight: "1.7",
              color: "#475569",
              margin: "0",
            }}
          >
            Your appointment with Global US HR Consultant has been successfully
            scheduled. Please present this document (printed or digital) at the
            time of your consultation.{" "}
            <strong>
              Failure to provide this confirmation may result in delays or
              rescheduling.
            </strong>
          </p>
        </section>

        {/* Info Grid Container (Rounded Box) - ULTRACLEAN */}
        <div
          style={{
            backgroundColor: "#f8fafc",
            borderRadius: "20px",
            padding: "48px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "40px",
            border: "1px solid #e2e8f0",
          }}
        >
          {[
            { label: "Service Type", value: applicantDetails.service },
            { label: "Email Address", value: applicantDetails.email },
            {
              label: "Appointment Date",
              value: applicantDetails.date,
              bold: true,
            },
            { label: "Phone Number", value: applicantDetails.phone },
            {
              label: "Scheduled Time",
              value: applicantDetails.time,
              bold: true,
            },
            { label: "Status", value: "CONFIRMED", status: true },
          ].map((item, idx) => (
            <div key={idx} style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "9px",
                  fontWeight: "900",
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: "8px",
                }}
              >
                {item.label}
              </span>
              <span
                style={{
                  fontSize: item.bold ? "20px" : "18px",
                  fontWeight: item.bold || item.status ? "900" : "700",
                  color: item.status ? "#059669" : "#000000",
                }}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Verification / Security Row */}
      <div style={{ marginTop: "40px", marginBottom: "80px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: "40px",
          }}
        >
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: "10px",
                color: "#94a3b8",
                fontStyle: "italic",
                maxWidth: "450px",
                margin: "0",
                lineHeight: "1.6",
              }}
            >
              * This document is system-generated and officially verified. The
              unique reference code and secure QR check above are required for
              digital authentication by our admissions team.
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p
              style={{
                fontSize: "9px",
                fontWeight: "900",
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "12px",
              }}
            >
              Secure QR Check
            </p>
            <div
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "16px",
                padding: "12px",
                display: "inline-block",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <QRCodeCanvas
                value={`https://globalushrc.com/verify/${applicantDetails.referenceId}`}
                size={100}
                level="H"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer - UNITED KINGDOM HQ */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: "24px",
          borderTop: "2px solid #000000",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "11px",
              fontWeight: "900",
              textTransform: "uppercase",
              margin: "0",
              color: "#000000",
            }}
          >
            Global US HR Consultant
          </p>
          <p
            style={{
              fontSize: "10px",
              margin: "4px 0 0 0",
              color: "#475569",
              fontWeight: "800",
            }}
          >
            Head Office: United Kingdom • USA Support: +1 (XXX) XXX-XXXX
          </p>
        </div>
        <p
          style={{
            fontSize: "10px",
            fontWeight: "900",
            color: "#94a3b8",
            margin: "0",
          }}
        >
          VERIFICATION ID: {Date.now()}
        </p>
      </div>
    </div>
  );
};

export default AppointmentConfirmation;
