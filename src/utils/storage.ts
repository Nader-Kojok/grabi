import { supabase } from '../lib/supabase';

export interface UploadResult {
  url: string;
  path: string;
}

export const uploadFile = async (
  file: File,
  bucket: string,
  folder: string,
  userId: string
): Promise<UploadResult> => {
  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${folder}/${Date.now()}.${fileExt}`;

    // Upload file to Supabase storage
    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return {
      url: publicUrl,
      path: fileName
    };
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error('Failed to upload file');
  }
};

export const deleteFile = async (bucket: string, path: string): Promise<void> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Delete error:', error);
    throw new Error('Failed to delete file');
  }
};

export const uploadAvatar = async (file: File, userId: string): Promise<UploadResult> => {
  return uploadFile(file, 'avatars', 'profile', userId);
};

export const uploadBanner = async (file: File, userId: string): Promise<UploadResult> => {
  return uploadFile(file, 'banners', 'profile', userId);
};

export const deleteAvatar = async (path: string): Promise<void> => {
  return deleteFile('avatars', path);
};

export const deleteBanner = async (path: string): Promise<void> => {
  return deleteFile('banners', path);
};