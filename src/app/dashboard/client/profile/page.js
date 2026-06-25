"use client";

import Image from "next/image";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { uploadImage } from "@/lib/imageUpload";

export default function ClientProfilePage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profile, setProfile] = useState({
    name: user?.name || "",
    image: user?.image || "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setSuccess("");
    setError("");

    try {
      const secureUrl = await uploadImage(file);
      setProfile((prev) => ({ ...prev, image: secureUrl }));
      setSuccess("Profile image uploaded successfully.");
    } catch (err) {
      setError(err.message || "Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setSuccess("");
    setError("");

    try {
      const { data, error: updateError } = await authClient.updateUser({
        name: profile.name,
        image: profile.image,
      });

      if (updateError) {
        throw new Error(updateError.message || "Failed to update profile.");
      }

      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="space-y-10 select-none">
        <div className="border-b border-black/10 pb-8">
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-black">
            Client Profile
          </h1>
        </div>
        <div className="text-center text-sm text-black/60">
          Loading profile information...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 select-none">
      <div className="border-b border-black/10 pb-8">
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-black">
          Client Profile
        </h1>
        <p className="text-xs font-bold tracking-widest text-black/40 uppercase mt-2">
          Update your account information
        </p>
      </div>

      <div className="max-w-2xl bg-white border border-black/10 p-8 shadow-sm rounded-none">
        <h2 className="text-sm font-black tracking-widest text-black uppercase border-b border-black/10 pb-4 mb-6">
          Profile Settings
        </h2>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 text-xs font-bold tracking-wider uppercase">
            ✓ {success}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-xs font-bold tracking-wider uppercase">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold tracking-widest text-black/60 uppercase">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="Your name"
              required
              className="w-full border border-black/20 px-4 py-3 text-xs text-black focus:outline-none focus:border-black rounded-none placeholder-black/20"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold tracking-widest text-black/60 uppercase">
              Profile Photo
            </label>
            <div className="flex flex-col sm:flex-row items-start gap-3">
              {profile.image && (
                <div className="w-14 h-14 border border-black/10 bg-white p-0.5 relative overflow-hidden shrink-0">
                  <Image
                    src={profile.image}
                    alt="Client avatar"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1 relative flex flex-col justify-center border border-dashed border-black/20 px-4 py-3 bg-black/1 hover:bg-black/3 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingImage}
                  onChange={handleImageFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                <span className="text-[10px] font-bold tracking-wide text-black/40 uppercase block">
                  {uploadingImage ? "Uploading image..." : "Click to upload or replace profile photo"}
                </span>
              </div>
            </div>
            <input
              type="url"
              name="image"
              value={profile.image}
              onChange={handleChange}
              placeholder="Or paste direct image URL"
              className="w-full border border-black/20 px-4 py-3 text-xs text-black focus:outline-none focus:border-black rounded-none placeholder-black/20"
            />
          </div>


          <button
            type="submit"
            disabled={saving || uploadingImage}
            className="bg-black hover:bg-black/90 text-white px-5 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors duration-200 rounded-none border border-black disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? "Saving Changes..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
