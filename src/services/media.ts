import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { MediaItem } from '../types';

export const ALLOWED_IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
export const ALLOWED_DOC_MIMES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_DOC_SIZE = 25 * 1024 * 1024; // 25MB

/**
 * Uploads a file securely to Supabase Storage with path sanitization
 */
export async function uploadStorageFile(
  bucket: 'property-images' | 'property-videos' | 'property-documents' | 'project-images' | 'blog-images' | 'avatars' | 'site-assets',
  folder: string,
  file: File
): Promise<{ url: string | null; path: string | null; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { url: null, path: null, error: 'Storage backend is not connected' };
  }

  // Validate size
  const isDoc = bucket.includes('documents');
  const maxSize = isDoc ? MAX_DOC_SIZE : MAX_IMAGE_SIZE;
  if (file.size > maxSize) {
    return { url: null, path: null, error: `File size exceeds allowed limit of ${maxSize / (1024 * 1024)}MB` };
  }

  // Validate mime
  if (!isDoc && !ALLOWED_IMAGE_MIMES.includes(file.type) && !file.type.startsWith('video/')) {
    return { url: null, path: null, error: 'Unsupported file format.' };
  }

  try {
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'webp';
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const safePath = `${folder}/${uniqueId}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(safePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      return { url: null, path: null, error: error.message };
    }

    // If bucket is public, get public URL
    const isPrivate = bucket.includes('documents');
    if (!isPrivate) {
      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
      return { url: publicUrlData.publicUrl, path: data.path, error: null };
    } else {
      // For private documents, generate signed URL
      const { data: signedUrlData, error: signError } = await supabase.storage
        .from(bucket)
        .createSignedUrl(data.path, 3600); // 1 hour validity

      if (signError) return { url: null, path: data.path, error: signError.message };
      return { url: signedUrlData.signedUrl, path: data.path, error: null };
    }
  } catch (err: any) {
    return { url: null, path: null, error: err.message };
  }
}

/**
 * Fetch centralized media records
 */
export async function getMediaLibrary(): Promise<MediaItem[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data as MediaItem[];
  } catch {
    return [];
  }
}
