"use client";

export default function LandImage({ src, alt }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      onError={(e) => { e.target.src = "/no-image.jpeg"; }}
    />
  );
}