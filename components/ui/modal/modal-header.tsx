import { X } from "lucide-react";

interface ModalHeaderProps {
  header: string;
  closeModal: () => void;
}

export const ModalHeader = (props: ModalHeaderProps) => (
  <div className="w-full flex justify-between p-2">
    <div></div>
    <h3 className="flex items-center">{ props.header }</h3>
    <button
      className="mr-2 p-2 hover:bg-gray-100 rounded-full"
      onClick={() => props.closeModal()}
      aria-label={`Close "${ props.header }" Modal`}
      title={`Close "${ props.header }" Modal`}
    >
      <X />
    </button>
  </div>
)