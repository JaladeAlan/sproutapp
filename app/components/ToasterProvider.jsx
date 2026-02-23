"use client";
import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      containerStyle={{ top: 80, zIndex: 99999 }}
      toastOptions={{
        duration: 5000,
        style: {
          background: "#363636",
          color: "#fff",
          fontSize: "16px",
          fontWeight: "600",
          padding: "16px 24px",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        },
        success: {
          duration: 5000,
          style: { background: "#10b981", color: "#fff" },
          iconTheme: { primary: "#fff", secondary: "#10b981" },
        },
        error: {
          duration: 5000,
          style: { background: "#ef4444", color: "#fff" },
          iconTheme: { primary: "#fff", secondary: "#ef4444" },
        },
        loading: {
          style: { background: "#3b82f6", color: "#fff" },
          iconTheme: { primary: "#fff", secondary: "#3b82f6" },
        },
      }}
    />
  );
}