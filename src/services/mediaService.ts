/**
 * Media Upload Service
 * Handles image uploads for candidate photos and custom symbols
 * Uses localStorage for mock storage (in production, use S3 or backend API)
 */

const MEDIA_STORAGE_KEY = 'electwin_media_uploads';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

export interface MediaUploadResult {
  success: boolean;
  url?: string;
  error?: string;
  fileName?: string;
}

export interface MediaFile {
  id: string;
  fileName: string;
  dataUrl: string;
  fileType: string;
  uploadedAt: string;
  purpose: 'photo' | 'symbol';
}

/**
 * Validate file before upload
 */
export const validateMediaFile = (file: File): { valid: boolean; error?: string } => {
  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Only JPG, PNG, and WebP images are allowed' };
  }

  // Check file extension
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
    return { valid: false, error: 'Invalid file extension. Use jpg, jpeg, png, or webp' };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File size exceeds 5MB limit (${(file.size / 1024 / 1024).toFixed(2)}MB)` };
  }

  return { valid: true };
};

/**
 * Upload media file and return data URL
 * In production, this would POST to backend /media/upload endpoint
 */
export const uploadMediaFile = async (
  file: File,
  purpose: 'photo' | 'symbol'
): Promise<MediaUploadResult> => {
  try {
    // Validate file
    const validation = validateMediaFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Convert file to data URL (for mock storage)
    const dataUrl = await fileToDataUrl(file);

    // Create media file object
    const mediaFile: MediaFile = {
      id: `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fileName: file.name,
      dataUrl,
      fileType: file.type,
      uploadedAt: new Date().toISOString(),
      purpose
    };

    // Store in localStorage (mock - in production POST to backend)
    const mediaStore = JSON.parse(localStorage.getItem(MEDIA_STORAGE_KEY) || '[]') as MediaFile[];
    mediaStore.push(mediaFile);
    localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(mediaStore));

    return {
      success: true,
      url: dataUrl,
      fileName: file.name
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Failed to upload file'
    };
  }
};

/**
 * Convert File to Data URL
 */
const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Get all uploaded media files of a specific purpose
 */
export const getMediaFiles = (purpose?: 'photo' | 'symbol'): MediaFile[] => {
  const mediaStore = JSON.parse(localStorage.getItem(MEDIA_STORAGE_KEY) || '[]') as MediaFile[];
  if (purpose) {
    return mediaStore.filter(m => m.purpose === purpose);
  }
  return mediaStore;
};

/**
 * Delete uploaded media file
 */
export const deleteMediaFile = (fileId: string): boolean => {
  try {
    const mediaStore = JSON.parse(localStorage.getItem(MEDIA_STORAGE_KEY) || '[]') as MediaFile[];
    const filtered = mediaStore.filter(m => m.id !== fileId);
    localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch {
    return false;
  }
};

/**
 * Clear all media files
 */
export const clearMediaFiles = (): void => {
  localStorage.removeItem(MEDIA_STORAGE_KEY);
};
