import { Button } from "./Button";
import { Modal } from "./Modal";

export function ConfirmDialog({ open, title, onClose, onConfirm }: { open: boolean; title: string; onClose: () => void; onConfirm: () => void }) {
  return <Modal open={open} title={title} onClose={onClose}>
    <p className="text-sm leading-7 text-slate-600">This action cannot be undone. Confirm only if you want to continue.</p>
    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><Button variant="secondary" onClick={onClose}>Cancel</Button><Button variant="danger" onClick={onConfirm}>Confirm</Button></div>
  </Modal>;
}
