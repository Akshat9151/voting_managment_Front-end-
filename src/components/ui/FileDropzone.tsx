import React, { useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { clsx } from 'clsx';

export interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFileSelect,
  accept = '.csv,.pdf,.xlsx,.png,.jpg',
  title = 'Drag & drop official voter files or click to browse',
  subtitle = 'Supports official electoral roll CSV, PDF scans, and image rosters',
  className
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      className={clsx(
        'border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[140px]',
        isDragOver ? 'border-sky-500 bg-sky-50/50 scale-[1.01]' : 'border-slate-300 hover:border-sky-400 bg-slate-50/50 hover:bg-sky-50/20',
        className
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
      <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mb-3 shadow-sm">
        <UploadCloud className="w-6 h-6" />
      </div>
      <div className="text-sm font-bold text-slate-800 mb-1">{title}</div>
      <div className="text-xs text-slate-500">{subtitle}</div>
    </div>
  );
};
