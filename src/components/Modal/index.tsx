import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import ModalHeader from "./ModalHeader";

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex w-screen items-center justify-center">
        <DialogPanel className="min-w-2xl min-h-9 h-fit border border-gray-500 bg-white px-4 py-3.5 rounded-lg flex flex-col">
          <ModalHeader onClose={onClose} title={title} />
          {children}
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default Modal;
