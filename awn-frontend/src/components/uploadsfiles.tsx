"use client"

import { useFileUpload } from "@/hooks/use-file-upload"
import { XIcon, FileIcon } from "lucide-react"

type UploadsFilesProps = {
  label: string
}

export default function UploadsFiles({ label }: UploadsFilesProps) {
  const [{ files }, { getInputProps, openFileDialog, removeFile }] = useFileUpload({
    multiple: false, // 👈 ملف واحد فقط
    maxSize: 5 * 1024 * 1024, // 5MB
  })

  return (
    <div className="space-y-2">
      <p className="font-medium text-gray-700 dark:text-gray-300">{label}</p>

      <div
        onClick={openFileDialog}
        className="cursor-pointer flex items-center justify-center border-2 border-dashed rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        <input {...getInputProps()} className="sr-only" />
        {files.length === 0 ? (
          <span className="text-sm text-gray-500">اضغط لرفع ملف</span>
        ) : (
          files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between w-full bg-gray-100 dark:bg-gray-800 rounded p-2"
            >
              <div className="flex items-center gap-2">
                <FileIcon className="w-5 h-5 text-emerald-600" />
                <span className="text-sm">{file.file instanceof File ? file.file.name : file.file.name}</span>
              </div>
              <button type="button" onClick={() => removeFile(file.id)}>
                <XIcon className="w-4 h-4 text-red-500" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
