import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type BucketType = 'professional-documents' | 'vehicle-documents' | 'avatars';
type DocumentCategory = 'cnh' | 'rg' | 'criminal_record' | 'vehicle' | 'insurance' | 'inspection' | 'bank_proof';

interface UploadResult {
  url?: string;
  error?: string;
}

export function useDocumentUpload() {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const getBucket = (category: DocumentCategory): BucketType => {
    switch (category) {
      case 'vehicle':
      case 'insurance':
      case 'inspection':
        return 'vehicle-documents';
      default:
        return 'professional-documents';
    }
  };

  const upload = async (
    file: File,
    category: DocumentCategory,
    customPath?: string
  ): Promise<UploadResult> => {
    if (!user?.id) return { error: 'Usuário não autenticado' };

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return { error: 'Tipo de arquivo não permitido. Use JPG, PNG, WebP ou PDF.' };
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return { error: 'Arquivo muito grande. Tamanho máximo: 5MB.' };
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const bucket = getBucket(category);
      const fileExt = file.name.split('.').pop();
      const timestamp = Date.now();
      const fileName = customPath || `${user.id}/${category}_${timestamp}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, { 
          upsert: true,
          cacheControl: '3600',
        });

      if (uploadError) throw uploadError;

      setUploadProgress(100);

      // Get signed URL for private buckets
      if (bucket !== 'avatars') {
        const { data: urlData, error: urlError } = await supabase.storage
          .from(bucket)
          .createSignedUrl(fileName, 60 * 60 * 24 * 365); // 1 year

        if (urlError) throw urlError;

        toast.success('Documento enviado com sucesso!');
        return { url: urlData.signedUrl };
      } else {
        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(fileName);

        toast.success('Documento enviado com sucesso!');
        return { url: urlData.publicUrl };
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      toast.error('Erro ao enviar documento');
      return { error: err.message };
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const deleteDocument = async (
    filePath: string,
    category: DocumentCategory
  ): Promise<{ success?: boolean; error?: string }> => {
    try {
      const bucket = getBucket(category);
      
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) throw error;

      toast.success('Documento removido com sucesso!');
      return { success: true };
    } catch (err: any) {
      toast.error('Erro ao remover documento');
      return { error: err.message };
    }
  };

  return {
    upload,
    deleteDocument,
    isUploading,
    uploadProgress,
  };
}
