"use client"

import React from 'react' // Add React import
import { useFileUpload } from "@/hooks/use-file-upload"
import { XIcon, FileIcon, Upload, AlertCircle } from "lucide-react"

type UploadsFilesProps = {
  label: string
  required?: boolean
  accept?: string
  maxSize?: number // in MB
  className?: string
  onFileChange?: (file: File | null) => void
  error?: string
  helpText?: string
}

export default function UploadsFiles({ 
  label, 
  required = false,
  accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png",
  maxSize = 5,
  className = "",
  onFileChange,
  error,
  helpText
}: UploadsFilesProps) {
  // Fix: pass accept as string, not array
  const [{ files }, { getInputProps, openFileDialog, removeFile }] = useFileUpload({
    multiple: false,
    maxSize: maxSize * 1024 * 1024, // Convert MB to bytes
    accept: accept // Keep as string - your hook expects string
  })

  // Call onFileChange when files change
  React.useEffect(() => {
    if (files.length > 0 && files[0].file instanceof File) {
      onFileChange?.(files[0].file)
    } else {
      onFileChange?.(null)
    }
  }, [files, onFileChange])

  const hasFile = files.length > 0
  const file = hasFile ? files[0] : null

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label with required indicator */}
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Upload Area */}
      <div
        onClick={openFileDialog}
        className={`cursor-pointer border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
          error 
            ? 'border-red-300 bg-red-50 dark:bg-red-900/20 hover:border-red-400' 
            : hasFile
            ? 'border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 hover:border-emerald-400'
            : 'border-gray-300 dark:border-gray-600 hover:border-emerald-400 hover:bg-gray-50 dark:hover:bg-gray-800'
        }`}
      >
        <input {...getInputProps()} className="sr-only" required={required} />
        
        {!hasFile ? (
          <div className="space-y-2">
            <Upload className="w-8 h-8 mx-auto text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                اضغط لرفع ملف أو اسحب وأفلت
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {accept.replace(/\./g, '').replace(/,/g, ', ').toUpperCase()} • حد أقصى {maxSize}MB
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-emerald-600">
              <FileIcon className="w-6 h-6" />
              <span className="font-medium">تم الرفع بنجاح</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              اضغط لتغيير الملف
            </p>
          </div>
        )}
      </div>

      {/* File Display */}
      {hasFile && file && (
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <FileIcon className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {file.file instanceof File ? file.file.name : file.file.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {file.file instanceof File 
                  ? `${(file.file.size / 1024 / 1024).toFixed(2)} MB`
                  : 'Unknown size'
                }
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={(e) => {
              e.stopPropagation()
              removeFile(file.id)
            }}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Remove file"
          >
            <XIcon className="w-4 h-4 text-red-500" />
          </button>
        </div>
      )}

      {/* Help Text */}
      {helpText && !error && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {helpText}
        </p>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  )
}