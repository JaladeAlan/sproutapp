import toast from "react-hot-toast";

export default function handleApiError(err, fallbackMessage, setError) {
  console.log("🔥 Full error object:", err);

  if (!err.response) {
    console.error("Network or CORS error:", err);
    const message = "Network error — please check your connection.";
    if (typeof setError === "function") setError(message);
    else toast.error(message);
    return;
  }

  const data = err.response.data;
  console.log("📦 Response data:", data);

  const message =
    data?.message ||
    data?.error ||
    (data?.errors
      ? Object.values(data.errors).flat().join("\n")
      : fallbackMessage || "Something went wrong.");

  if (typeof setError === "function") {
    setError(message);
  } else {
    toast.error(message);
  }
}