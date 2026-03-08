"use client";
import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerStyle={{ top: 80, zIndex: 99999 }}
      toastOptions={{
        duration: 5000,
        style: {
          background: "#0D1F1A",
          color: "#fff",
          fontSize: "16px",
          fontWeight: "600",
          padding: "16px 24px",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          border: "1px solid rgba(255,255,255,0.1)",
        },
        success: {
          duration: 5000,
          style: { background: "#0D1F1A", color: "#6ee7b7", border: "1px solid #065f46" },
          iconTheme: { primary: "#6ee7b7", secondary: "#0D1F1A" },
        },
        error: {
          duration: 5000,
          style: { background: "#0D1F1A", color: "#fca5a5", border: "1px solid #7f1d1d" },
          iconTheme: { primary: "#fca5a5", secondary: "#0D1F1A" },
        },
        loading: {
          style: { background: "#0D1F1A", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" },
          iconTheme: { primary: "#fff", secondary: "#0D1F1A" },
        },
      }}
    />
  );
}