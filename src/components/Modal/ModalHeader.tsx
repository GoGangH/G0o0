import Close from "@mui/icons-material/Close";

interface ModalHeaderProps {
  onClose: () => void;
  title: string;
}
const ModalHeader: React.FC<ModalHeaderProps> = ({ onClose, title }) => {
  return (
    <div className="flex items-center">
      <p className="font-bold text-lg flex-1 flex items-center justify-center">
        {title}
      </p>
      <button onClick={onClose} className="flex items-center justify-center">
        <Close className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ModalHeader;
