'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';

interface GalleryImage {
  id: string;
  public_url: string;
  alt_text: string;
  caption: string | null;
  created_at: string;
}

export default function AdminGalleryPage() {
  const [secret, setSecret] = useState('');
  const [authed, setAuthed] = useState(false);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Upload form state
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState('');
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Delete state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState('');

  async function fetchImages(adminSecret: string) {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/gallery', {
        headers: { Authorization: `Bearer ${adminSecret}` },
      });
      if (res.status === 401) {
        setError('Incorrect secret.');
        setLoading(false);
        return;
      }
      const data = await res.json();
      setImages(data);
      setAuthed(true);
    } catch {
      setError('Failed to load gallery.');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setUploadError('');
    setUploadSuccess('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('alt_text', altText);
    formData.append('caption', caption);

    try {
      const res = await fetch('/api/admin/gallery/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${secret}` },
        body: formData,
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setUploadError(body.error ?? 'Upload failed.');
        return;
      }
      const newImage: GalleryImage = await res.json();
      setImages((prev) => [newImage, ...prev]);
      setFile(null);
      setAltText('');
      setCaption('');
      setUploadSuccess('Photo added to gallery.');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch {
      setUploadError('Upload failed. Check your connection.');
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    setActionError('');
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${secret}` },
      });
      if (res.ok) {
        setImages((prev) => prev.filter((img) => img.id !== id));
      } else {
        setActionError('Failed to delete image.');
      }
    } catch {
      setActionError('Failed to delete image.');
    } finally {
      setDeletingId(null);
    }
  }

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(201,162,39,0.2)',
    borderRadius: 4,
    padding: '8px 12px',
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'inherit',
    fontSize: 13,
    width: '100%',
  };

  return (
    <div style={{ background: '#07070A', minHeight: '100vh' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="font-heading text-3xl font-black text-brand-text mb-8">
          Gallery Manager
        </h1>

        {!authed ? (
          <form
            onSubmit={(e) => { e.preventDefault(); fetchImages(secret); }}
            className="flex flex-col gap-4 max-w-sm"
          >
            <label className="tac-label" style={{ fontSize: 9 }}>ADMIN SECRET</label>
            <input
              type="password"
              required
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="font-body text-sm text-white/80"
              style={inputStyle}
              placeholder="Enter admin secret"
            />
            {error && <p className="font-body text-sm" style={{ color: '#f87171' }}>{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-fit"
              style={{ padding: '9px 20px', fontSize: 11 }}
            >
              {loading ? 'LOADING…' : 'ENTER'}
            </button>
          </form>
        ) : (
          <div className="flex flex-col gap-10">

            {/* Upload form */}
            <div style={{ border: '1px solid rgba(201,162,39,0.2)', borderRadius: 8, padding: '24px' }}>
              <h2 className="font-heading font-bold text-brand-text mb-6" style={{ fontSize: 16 }}>
                Add Photo
              </h2>
              <form onSubmit={handleUpload} className="flex flex-col gap-4">
                <div>
                  <label className="tac-label block mb-2" style={{ fontSize: 9 }}>PHOTO FILE</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,image/heic"
                    required
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    className="font-body text-sm text-white/60"
                    style={{ ...inputStyle, padding: '6px 10px' }}
                  />
                </div>
                <div>
                  <label className="tac-label block mb-2" style={{ fontSize: 9 }}>ALT TEXT (describes the photo)</label>
                  <input
                    type="text"
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    placeholder="e.g. Custom engraved cutting board with family name"
                    className="font-body"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className="tac-label block mb-2" style={{ fontSize: 9 }}>CAPTION (optional)</label>
                  <input
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="e.g. Customer photo — wedding gift engraving"
                    className="font-body"
                    style={inputStyle}
                  />
                </div>
                {uploadError && (
                  <p className="font-body text-sm" style={{ color: '#f87171' }}>{uploadError}</p>
                )}
                {uploadSuccess && (
                  <p className="font-body text-sm" style={{ color: '#4ade80' }}>{uploadSuccess}</p>
                )}
                <div className="flex gap-3 items-center">
                  <button
                    type="submit"
                    disabled={uploading || !file}
                    className="btn-gold w-fit"
                    style={{ padding: '9px 20px', fontSize: 11 }}
                  >
                    {uploading ? 'UPLOADING…' : 'UPLOAD PHOTO'}
                  </button>
                  {file && (
                    <span className="font-body text-white/40 text-xs">{file.name}</span>
                  )}
                </div>
              </form>
            </div>

            {/* Existing images */}
            <div>
              <h2 className="font-heading font-bold text-brand-text mb-4" style={{ fontSize: 16 }}>
                Gallery ({images.length} {images.length === 1 ? 'photo' : 'photos'})
              </h2>
              {actionError && (
                <p className="font-body text-sm mb-4" style={{ color: '#f87171' }}>{actionError}</p>
              )}
              {images.length === 0 ? (
                <p className="font-body text-white/30">No photos yet. Upload your first one above.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((img) => (
                    <div
                      key={img.id}
                      style={{ border: '1px solid rgba(201,162,39,0.15)', borderRadius: 6, overflow: 'hidden', position: 'relative' }}
                    >
                      <div style={{ position: 'relative', aspectRatio: '1', background: '#111' }}>
                        <Image
                          src={img.public_url}
                          alt={img.alt_text || 'Gallery photo'}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div style={{ padding: '8px 10px', background: 'rgba(0,0,0,0.6)' }}>
                        {img.alt_text && (
                          <p className="font-body text-white/60 text-xs mb-1 truncate">{img.alt_text}</p>
                        )}
                        {img.caption && (
                          <p className="font-body text-white/40 text-xs mb-2 truncate">{img.caption}</p>
                        )}
                        <button
                          onClick={() => handleDelete(img.id)}
                          disabled={deletingId === img.id}
                          style={{
                            fontSize: 10,
                            padding: '4px 10px',
                            background: 'rgba(239,68,68,0.15)',
                            border: '1px solid rgba(239,68,68,0.3)',
                            borderRadius: 4,
                            color: '#f87171',
                            fontFamily: 'inherit',
                            letterSpacing: '0.05em',
                            cursor: deletingId === img.id ? 'wait' : 'pointer',
                          }}
                        >
                          {deletingId === img.id ? 'DELETING…' : 'DELETE'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
