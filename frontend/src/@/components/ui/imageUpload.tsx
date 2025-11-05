import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { uploadAPI } from '../../../services/api';

interface ImageUploadProps {
  onImagesChange: (images: string[], files?: File[]) => void;
  existingImages: string[];
  multiple?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImagesChange,
  existingImages = [],
  multiple = true
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>(existingImages);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('images', file);
      });

      const response = await uploadAPI.uploadImages(formData);
      const newImageUrls = response.data.images || [];
      
      const updatedImages = [...previewUrls, ...newImageUrls];
      setPreviewUrls(updatedImages);
      onImagesChange(updatedImages);
    } catch (error: any) {
      console.error('Upload error:', error);
      alert(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    const updated = previewUrls.filter((_, i) => i !== index);
    setPreviewUrls(updated);
    onImagesChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        uploading ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
      }`}>
        <input
          type="file"
          multiple={multiple}
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className={`cursor-pointer block ${uploading ? 'opacity-50' : ''}`}
        >
          <Icon 
            icon={uploading ? "eos-icons:loading" : "solar:upload-linear"} 
            className="mx-auto text-4xl text-gray-400 mb-2" 
          />
          <p className="text-lg font-medium text-gray-900">
            {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            PNG, JPG, GIF, WebP up to 5MB
          </p>
        </label>
      </div>

      {/* Image Previews */}
      {previewUrls.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">
            Uploaded Images ({previewUrls.length})
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={`http://localhost:5001${url}`}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Error';
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Icon icon="solar:close-circle-bold" className="text-lg" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;