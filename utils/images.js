const API_BASE = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://growthbackend.onrender.com/api"
).replace(/\/api$/, "");

export const getLandImage = (land) => {
  if (land?.images?.length > 0 && land.images[0].url) {
    return land.images[0].url;
  }

return `${API_BASE}/images/placeholder.jpg`;
};
