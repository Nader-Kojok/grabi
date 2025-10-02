import React, { useRef, useState } from 'react';
import { Upload, X, User } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onRemove?: () => void;
  currentImage?: string;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
  placeholder?: string;
  type?: 'avatar' | 'banner';
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onRemove,
  currentImage,
  accept = 'image/*',
  maxSize = 5,
  className = '',
  placeholder = 'Click to upload image',
  type = 'avatar'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileSelect = (file: File) => {
    setError('');
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    onFileSelect(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const getContainerClasses = () => {
    if (type === 'avatar') {
      return `relative cursor-pointer transition-all duration-200 ${className}`;
    } else {
      // Banner upload with modern overlay style
      const baseClasses = `
        relative border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300
        ${isDragOver ? 'border-white/60 bg-white/10 backdrop-blur-sm' : 'border-white/30 hover:border-white/50 hover:bg-white/5'}
        ${error ? 'border-red-400 bg-red-500/10' : ''}
        backdrop-blur-sm
      `;
      return `${baseClasses} w-full h-40 flex items-center justify-center px-6 py-4 ${className}`;
    }
  };

  return (
    <div className="space-y-2">
      <div
        className={getContainerClasses()}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
        />

        {currentImage ? (
          <div className="relative w-full h-full group">
            {type === 'avatar' ? (
              // Avatar with clean circular design
              <div className="relative w-full h-full">
                <img
                  src={currentImage}
                  alt="Current"
                  className="w-full h-full object-cover rounded-full border-white shadow-xl"
                />
                {onRemove && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove();
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg z-10"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-full flex items-center justify-center">
                  <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Upload className="h-6 w-6 text-white mx-auto mb-1 drop-shadow-lg" />
                    <p className="text-xs text-white font-medium drop-shadow-md">Changer</p>
                    <p className="text-xs text-white/80 drop-shadow-sm">Max {maxSize} {' '} MB</p>
                  </div>
                </div>
              </div>
            ) : (
              // Banner with modern overlay
              <>
                <img
                  src={currentImage}
                  alt="Current"
                  className="w-full h-full object-cover rounded-xl"
                />
                {onRemove && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove();
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg z-10"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-xl flex items-center justify-center backdrop-blur-[1px]">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/30">
                    <Upload className="h-6 w-6 text-white drop-shadow-lg" />
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="text-center">
            {type === 'avatar' ? (
              // Avatar placeholder with clean design and info
              <div className="w-full h-full border-4 border-dashed border-gray-300 rounded-full flex items-center justify-center bg-gray-50 hover:border-red-400 hover:bg-red-50 transition-all duration-200">
                <div className="text-center">
                  <User className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 font-medium">Avatar</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Max {maxSize}MB
                  </p>
                  <p className="text-xs text-gray-400">
                    JPG, PNG
                  </p>
                </div>
              </div>
            ) : (
              // Banner placeholder with modern overlay style
              <div className="space-y-2">
                <Upload className="h-8 w-8 text-white/80 mx-auto drop-shadow-lg" />
                <p className="text-sm text-white/90 font-medium drop-shadow-md px-2">{placeholder}</p>
                <p className="text-xs text-white/70 drop-shadow-sm px-2">
                  Max {maxSize}MB • JPG, PNG, GIF
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className={`mt-3 p-3 rounded-lg border ${
          type === 'avatar' 
            ? 'bg-red-50 border-red-200 text-red-700' 
            : 'bg-red-500/10 border-red-400/30 text-red-200 backdrop-blur-sm'
        }`}>
          <p className="text-sm font-medium flex items-center gap-2">
            <X className="h-4 w-4" />
            {error}
          </p>
        </div>
      )}
    </div>
  );
};