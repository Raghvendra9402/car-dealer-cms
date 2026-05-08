"use client";

import { Plus, Upload, X } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { FileWithProgress } from "@/config/types";
import { usePutImageS3 } from "@/hooks/useCarListings";
import { inngest } from "@/inngest/client";
import { useAIState } from "@/hooks/use-ai-state";
import { v4 as uuid } from "uuid";
import { ResponseShowcase } from "./ai/response-showcase";

export function FileUpload() {
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [uploading, setUploading] = useState(false);
  const upload = usePutImageS3();
  const { isLoading, setIsLoading, setS3Keys, setDraftId, setImageSignedUrls } =
    useAIState.getState();

  const draftIdRef = useRef(uuid());

  useEffect(() => {
    setDraftId(draftIdRef.current);
  }, []);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const validFiles: FileWithProgress[] = [];

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const MAX_SIZE_MB = 2;
    const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

    Array.from(e.target.files).map((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`Rejected file: ${file.name} (invalid type: ${file.type})`);
        return;
      }

      const sizeInMB = file.size / (1024 * 1024);
      if (sizeInMB > MAX_SIZE_MB) {
        toast.error(`Rejected file: ${file.name} (exceeds ${MAX_SIZE_MB} MB)`);
        return;
      }

      const imageUrl = URL.createObjectURL(file);

      validFiles.push({
        file,
        id: file.name,
        progress: 0,
        uploaded: false,
        imageUrl: imageUrl,
      });

      console.log(file);
    });

    setFiles((prev) => [...prev, ...validFiles]);

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    console.log(files);
  };

  const onRemove = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleClear = () => {
    setFiles([]);
  };

  const handleUpload = async () => {
    if (uploading || files.length === 0) return;

    setUploading(true);

    try {
      const uploadImages = files.map(async (file) => {
        const fileBuffer = await new Promise<string>((res, rej) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = reader.result as string;
            const base64Data = base64.split(",")[1];
            res(base64Data);
          };
          reader.onerror = rej;
          reader.readAsDataURL(file.file);
        });

        return upload.mutateAsync({
          file: fileBuffer,
          fileName: `${uuid()}-${file.file.name}`,
          fileType: file.file.type,
          draftId: draftIdRef.current,
        });
      });

      const validSignedUrls = await Promise.all(uploadImages);

      setS3Keys(validSignedUrls.map((res) => res.key));

      setImageSignedUrls(validSignedUrls.map((res) => res.url));

      await inngest.send({
        name: "test/ai.data",
        data: {
          imageUrl: validSignedUrls[0].url,
          id: draftIdRef.current,
        },
      });
    } catch {
      toast.error("Something went wrong while uploading images...");
    } finally {
      setUploading(false);
      setIsLoading(true);
    }
  };

  return (
    <>
      {isLoading ? (
        <ResponseShowcase />
      ) : (
        <>
          <FileInput
            disabled={false}
            inputRef={inputRef}
            onFileSelect={handleFileSelect}
          />
          <div>
            <FileList files={files} onRemove={onRemove} uploading={uploading} />
          </div>
          <DialogActions
            disabled={uploading || files.length === 0}
            onClear={handleClear}
            onUpload={handleUpload}
          />
        </>
      )}
    </>
  );
}

interface FileInputProps {
  inputRef: React.RefObject<HTMLInputElement | null>;
  disabled: boolean;
  onFileSelect: (e: ChangeEvent<HTMLInputElement>) => void;
}

function FileInput({ disabled, inputRef, onFileSelect }: FileInputProps) {
  return (
    <div className="flex items-center justify-center w-full min-h-56 border-dashed border-2">
      <input
        type="file"
        ref={inputRef}
        onChange={onFileSelect}
        multiple
        className="hidden"
        id="file-upload"
        disabled={disabled}
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer flex flex-col items-center gap-2 p-4 rounded-md "
      >
        <Upload className="size-6" />
        Select files
      </label>
    </div>
  );
}

interface FileListProps {
  files: FileWithProgress[];
  onRemove: (id: string) => void;
  uploading: boolean;
}

function FileList({ files, onRemove, uploading }: FileListProps) {
  return (
    <div className="grid grid-cols-7 gap-8 overflow-x-scroll">
      {files.map((file) => (
        <FileItem
          key={file.id}
          file={file}
          onRemove={onRemove}
          uploading={uploading}
        />
      ))}
    </div>
  );
}

interface FileItemProps {
  file: FileWithProgress;
  onRemove: (id: string) => void;
  uploading: boolean;
}

function FileItem({ file, onRemove, uploading }: FileItemProps) {
  return (
    <div className="flex flex-col gap-1 items-center">
      <div className="relative w-full aspect-square">
        <Image
          src={file.imageUrl!}
          alt={file.file.name}
          fill
          className="object-cover rounded"
        />
        <button
          onClick={() => onRemove(file.id)}
          className="absolute top-0 right-0.5 bg-red-500 text-white rounded-full "
        >
          <X className="size-4" />
        </button>
      </div>
      <span className="text-sm w-full truncate text-center text-zinc-600 font-semibold">
        {file.file.name}
      </span>
    </div>
  );
}

interface DialogActionProps {
  disabled?: boolean;
  onUpload: () => void;
  onClear: () => void;
}

function DialogActions({ onClear, onUpload, disabled }: DialogActionProps) {
  return (
    <div className="flex flex-row justify-end items-center gap-x-4 mt-4">
      <Button variant={"outline"} onClick={onClear}>
        Clear
      </Button>
      <Button disabled={disabled} onClick={onUpload}>
        Upload
      </Button>
    </div>
  );
}
