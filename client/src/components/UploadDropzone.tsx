import { ImagePlus, X } from "lucide-react";
import { useMemo } from "react";

export function UploadDropzone({ files, onFiles, error }: { files: File[]; onFiles: (files: File[]) => void; error?: string }) {
  const previews = useMemo(() => files.map((file) => ({ file, url: URL.createObjectURL(file) })), [files]);
  return <div>
    <label className="grid cursor-pointer place-items-center rounded-3xl border-2 border-dashed border-primary/30 bg-primary/5 p-8 text-center transition hover:bg-primary/10">
      <ImagePlus className="mb-3 text-primary" size={34} /><b className="text-sm">Drop images or click to upload</b><p className="mt-1 text-xs text-slate-500">PNG/JPG, up to 5 images</p>
      <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => onFiles(Array.from(e.target.files || []))} />
    </label>
    {previews.length > 0 && <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{previews.map(({ file, url }) => <div key={file.name} className="relative overflow-hidden rounded-2xl"><img src={url} className="h-28 w-full object-cover" /><button type="button" onClick={() => onFiles(files.filter((f) => f !== file))} className="absolute right-2 top-2 rounded-full bg-white p-1 shadow"><X size={14} /></button></div>)}</div>}
    {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
  </div>;
}
