import cn from "classnames";

type Props = {
  isOpen: boolean,
  onClose: () => void,
  onConfirm: () => void,
}

export const ModalFinishQuiz: React.FC<Props> = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;
  
    return (
      <div className={cn("fixed inset-0 flex items-center justify-center", { "bg-black bg-opacity-50": isOpen })}>
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-xl font-bold mb-4">Finish Quiz</h2>
          <p className="mb-4">Are you sure you want to finish the quiz and return to the home page?</p>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };