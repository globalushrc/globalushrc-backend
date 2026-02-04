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
  return (
    <div
      style={{
        isolation: "isolate",
        backgroundColor: "#ffffff",
        width: "794px",
        minHeight: "1123px",
        color: "#1e293b",
        padding: "48px",
        fontFamily: "Arial, sans-serif",
        margin: "0 auto",
        position: "relative",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          paddingBottom: "32px",
          marginBottom: "40px",
          borderBottom: "2px solid #0f172a",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <img
            src="/logo.png"
            alt="Logo"
            style={{ height: "60px", width: "auto", objectFit: "contain" }}
          />
          <div>
            <h1
              style={{
                fontSize: "30px",
                fontWeight: "900",
                textTransform: "uppercase",
                margin: "0 0 4px 0",
                color: "#0f172a",
                letterSpacing: "-0.05em",
              }}
            >
              Global US HR Consultant
            </h1>
            <p
              style={{
                fontSize: "12px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                margin: "0",
                color: "#64748b",
              }}
            >
              International Workforce & Recruitment Experts
            </p>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <p
            style={{
              fontSize: "10px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              margin: "0 0 4px 0",
              color: "#94a3b8",
            }}
          >
            Appointment Reference
          </p>
          <p
            style={{
              fontSize: "20px",
              fontWeight: "900",
              margin: "0",
              color: "#2563eb",
            }}
          >
            {applicantDetails.referenceId}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ gap: "48px", display: "flex", flexDirection: "column" }}>
        <section>
          <h2
            style={{
              fontSize: "14px",
              fontWeight: "900",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "24px",
              paddingBottom: "8px",
              color: "#94a3b8",
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            Appointment Confirmation Letter
          </h2>
          <p
            style={{
              fontSize: "14px",
              lineHeight: "1.6",
              marginBottom: "24px",
            }}
          >
            Dear{" "}
            <span style={{ fontWeight: "700" }}>{applicantDetails.name}</span>,
          </p>
          <p style={{ fontSize: "14px", lineHeight: "1.6", margin: "0" }}>
            Your appointment with Global US HR Consultant has been successfully
            scheduled. Please present this document (printed or digital) at the
            time of your consultation. Failure to provide this confirmation may
            result in delays or rescheduling.
          </p>
        </section>

        {/* Details Grid */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            rowGap: "32px",
            padding: "32px",
            borderRadius: "16px",
            backgroundColor: "#f8fafc",
            border: "1px solid #f1f5f9",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "10px",
                fontWeight: "900",
                textTransform: "uppercase",
                marginBottom: "4px",
                color: "#94a3b8",
              }}
            >
              Service Type
            </p>
            <p
              style={{
                fontSize: "16px",
                fontWeight: "700",
                color: "#1e293b",
                margin: "0",
              }}
            >
              {applicantDetails.service}
            </p>
          </div>
          <div>
            <p
              style={{
                fontSize: "10px",
                fontWeight: "900",
                textTransform: "uppercase",
                marginBottom: "4px",
                color: "#94a3b8",
              }}
            >
              Email Address
            </p>
            <p
              style={{
                fontSize: "16px",
                fontWeight: "700",
                color: "#1e293b",
                margin: "0",
              }}
            >
              {applicantDetails.email}
            </p>
          </div>
          <div>
            <p
              style={{
                fontSize: "10px",
                fontWeight: "900",
                textTransform: "uppercase",
                marginBottom: "4px",
                color: "#94a3b8",
              }}
            >
              Appointment Date
            </p>
            <p
              style={{
                fontSize: "16px",
                fontWeight: "700",
                color: "#1e293b",
                margin: "0",
              }}
            >
              {applicantDetails.date}
            </p>
          </div>
          <div>
            <p
              style={{
                fontSize: "10px",
                fontWeight: "900",
                textTransform: "uppercase",
                marginBottom: "4px",
                color: "#94a3b8",
              }}
            >
              Phone Number
            </p>
            <p
              style={{
                fontSize: "16px",
                fontWeight: "700",
                color: "#1e293b",
                margin: "0",
              }}
            >
              {applicantDetails.phone}
            </p>
          </div>
          <div>
            <p
              style={{
                fontSize: "10px",
                fontWeight: "900",
                textTransform: "uppercase",
                marginBottom: "4px",
                color: "#94a3b8",
              }}
            >
              Scheduled Time
            </p>
            <p
              style={{
                fontSize: "16px",
                fontWeight: "700",
                letterSpacing: "-0.025em",
                color: "#1e293b",
                margin: "0",
              }}
            >
              {applicantDetails.time}
            </p>
          </div>
          <div>
            <p
              style={{
                fontSize: "10px",
                fontWeight: "900",
                textTransform: "uppercase",
                marginBottom: "4px",
                color: "#94a3b8",
              }}
            >
              Status
            </p>
            <p
              style={{
                fontSize: "16px",
                fontWeight: "700",
                color: "#059669",
                margin: "0",
              }}
            >
              CONFIRMED
            </p>
          </div>
        </section>

        {/* Security / Verification */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 200px",
            gap: "32px",
            marginTop: "48px",
            paddingTop: "48px",
            borderTop: "1px solid #f1f5f9",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "32px" }}
          >
            <div>
              <p
                style={{
                  fontSize: "10px",
                  fontWeight: "900",
                  textTransform: "uppercase",
                  marginBottom: "16px",
                  color: "#94a3b8",
                }}
              >
                Verification Barcode
              </p>
              <div
                style={{
                  padding: "8px",
                  display: "inline-block",
                  borderRadius: "8px",
                  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                  backgroundColor: "#ffffff",
                  border: "1px solid #f1f5f9",
                }}
              >
                <Barcode
                  value={applicantDetails.referenceId}
                  height={50}
                  width={1.5}
                  fontSize={12}
                  margin={10}
                  renderer="canvas"
                />
              </div>
            </div>
            <div
              style={{
                fontSize: "10px",
                lineHeight: "1.6",
                fontStyle: "italic",
                maxWidth: "384px",
                color: "#94a3b8",
              }}
            >
              * This document is system-generated and does not require a
              physical signature. The barcode and QR code above are used for
              digital verification by our admissions team.
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <p
              style={{
                fontSize: "10px",
                fontWeight: "900",
                textTransform: "uppercase",
                marginBottom: "16px",
                color: "#94a3b8",
              }}
            >
              Secure QR Check
            </p>
            <div
              style={{
                padding: "16px",
                borderRadius: "16px",
                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                backgroundColor: "#ffffff",
                border: "1px solid #f1f5f9",
              }}
            >
              <QRCodeCanvas
                value={`https://globalushrc.com/verify/${applicantDetails.referenceId}`}
                size={120}
                level="H"
                includeMargin={true}
              />
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          bottom: "48px",
          left: "48px",
          right: "48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          paddingTop: "32px",
          borderTop: "1px solid #f1f5f9",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "9px",
              fontWeight: "700",
              textTransform: "uppercase",
              margin: "0",
              color: "#0f172a",
            }}
          >
            Global US HR Consultant
          </p>
          <p style={{ fontSize: "8px", margin: "0", color: "#94a3b8" }}>
            Head Office: Kathmandu, Nepal • USA Support: +1 (XXX) XXX-XXXX
          </p>
        </div>
        <p
          style={{
            fontSize: "9px",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            margin: "0",
            color: "#cbd5e1",
          }}
        >
          Verification ID: {Date.now()}
        </p>
      </div>
    </div>
  );
};

export default AppointmentConfirmation;
