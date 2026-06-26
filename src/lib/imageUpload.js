export async function uploadImage(file) {
  const apiKey = process.env.NEXT_PUBLIC_IMAGEBB_API_KEY;
  const url = `https://api.imgbb.com/1/upload?key=${apiKey}`;

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.error?.message || "Failed to upload image to Imgbb.");
  }

  const result = await res.json();
  if (!result.success || !result.data?.url) {
    throw new Error("Invalid response format from Imgbb API.");
  }

  return result.data.url;
}
