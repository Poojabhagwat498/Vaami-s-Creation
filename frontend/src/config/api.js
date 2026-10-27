export const API_BASE = import.meta.env.VITE_URL || "";

export const getImageUrl = (img) => {
  if (!img) return "/uploads/pendant11.jpeg";
  if (img.startsWith("http://") || img.startsWith("https://")) {
    if (img.includes("vaami-s-creation.onrender.com")) {
      return img.replace(/^https?:\/\/[^\/]+/, "");
    }
    return img;
  }
  return img.startsWith("/") ? img : `/${img}`;
};
