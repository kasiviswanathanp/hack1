import { storage, isFirebaseConfigured } from './firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const storageService = {
  /**
   * Uploads an image file to Firebase Storage or converts to data URI in demo mode
   */
  async uploadComplaintImage(file: File, folder = 'complaints'): Promise<string> {
    if (isFirebaseConfigured && storage) {
      try {
        const fileExt = file.name.split('.').pop() || 'jpg';
        const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const storageRef = ref(storage, `${folder}/${uniqueFileName}`);
        const snapshot = await uploadBytes(storageRef, file);
        return await getDownloadURL(snapshot.ref);
      } catch (err) {
        console.warn('Firebase Storage upload failed, falling back to local base64:', err);
      }
    }

    // In demo mode or if storage fails, convert file to data URL so the UI renders real image immediately
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  },

  /**
   * Uploads resolution proof (Before/After photo)
   */
  async uploadResolutionProof(file: File, workOrderId: string, type: 'before' | 'after'): Promise<string> {
    return this.uploadComplaintImage(file, `workOrders/${workOrderId}/${type}`);
  },
};
