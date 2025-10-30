// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { getUserProfile, saveUserProfile, updateAvatar, updateUsername, updateBio } from '../services/userService';
import { Camera, User, Mail, Edit, Save, X, Loader, CheckCircle, AlertCircle } from 'lucide-react';

export default function ProfilePage() {
  const [profile, setProfile] = useState(getUserProfile());
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(profile.username);
  const [newBio, setNewBio] = useState(profile.bio);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setNewUsername(profile.username);
    setNewBio(profile.bio);
  }, [profile, isEditing]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError('');
    setSuccess('');

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const result = await updateAvatar(reader.result);
        if (result.success) {
          setProfile(result.data);
          setSuccess('Foto profil berhasil diperbarui!');
        } else {
          setError(result.message || 'Gagal memperbarui foto profil.');
        }
      } catch (err) {
        setError(err.message || 'Terjadi kesalahan saat mengunggah foto.');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let resultUsername = { success: true };
      let resultBio = { success: true };

      if (newUsername !== profile.username) {
        resultUsername = await updateUsername(newUsername);
      }
      if (newBio !== profile.bio) {
        resultBio = await updateBio(newBio);
      }

      if (resultUsername.success && resultBio.success) {
        setProfile(getUserProfile()); // Reload updated profile
        setIsEditing(false);
        setSuccess('Profil berhasil diperbarui!');
      } else {
        setError(resultUsername.message || resultBio.message || 'Gagal memperbarui profil.');
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat menyimpan profil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pb-20 md:pb-8">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/40">
          <h1 className="text-3xl font-bold text-slate-800 mb-6">Profil Pengguna</h1>

          {error && (
            <div className="mb-4 flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 p-3 rounded-xl">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-4 flex items-center gap-2 text-green-600 bg-green-50 border border-green-200 p-3 rounded-xl">
              <CheckCircle className="w-5 h-5" />
              <p className="text-sm">{success}</p>
            </div>
          )}

          <div className="flex flex-col items-center mb-8">
            <div className="relative w-32 h-32 mb-4">
              <img
                src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.username}&background=random&size=128`}
                alt="Avatar Profil"
                className="w-full h-full rounded-full object-cover border-4 border-blue-400 shadow-lg"
              />
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={loading}
              />
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-md"
                title="Ubah Foto Profil"
              >
                {loading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </label>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">@{profile.username}</h2>
            <p className="text-slate-500 text-sm">ID Pengguna: {profile.userId}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Pengguna</label>
              {isEditing ? (
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              ) : (
                <p className="px-3 py-2 bg-slate-50 rounded-md text-slate-800">{profile.username}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
              {isEditing ? (
                <textarea
                  value={newBio}
                  onChange={(e) => setNewBio(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  disabled={loading}
                ></textarea>
              ) : (
                <p className="px-3 py-2 bg-slate-50 rounded-md text-slate-800 whitespace-pre-wrap">{profile.bio || 'Belum ada bio.'}</p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              {isEditing ? (
                <>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setError('');
                      setSuccess('');
                    }}
                    className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-100 transition-colors"
                    disabled={loading}
                  >
                    <X className="w-5 h-5 inline-block mr-1" /> Batal
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader className="w-5 h-5 inline-block mr-1 animate-spin" />
                    ) : (
                      <Save className="w-5 h-5 inline-block mr-1" />
                    )}
                    Simpan
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-5 h-5 inline-block mr-1" /> Edit Profil
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}