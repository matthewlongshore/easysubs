// --- src/pages/content/components/QuickAddModal/QuickAddModal.tsx ---
// (Create this new file and folder)

import React, { FC, useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { LiloChatService } from "@src/learning-service/liloChatService";
import { useClickOutside } from "@src/hooks/useClickOutside";

interface QuickAddModalProps {
  word: string;
  onClose: () => void;
}

const liloChatService = new LiloChatService();

export const QuickAddModal: FC<QuickAddModalProps> = ({ word, onClose }) => {
  const [translation, setTranslation] = useState("");
  const modalRef = useRef(null);

  // Close the modal if the user clicks outside of it
  useClickOutside(modalRef, onClose);

  // Focus the input field when the modal opens
  useEffect(() => {
    const inputElement = document.getElementById("quick-add-translation-input");
    if (inputElement) {
      inputElement.focus();
    }
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!translation.trim()) {
      toast.error("Please enter a translation.");
      return;
    }

    try {
      const result = await liloChatService.addWord(word, translation, {});
      toast.success(result);
      onClose(); // Close the modal on success
    } catch (error) {
      toast.error(String(error));
    }
  };

  return (
    <div className="es-quick-add-overlay">
      <div className="es-quick-add-modal" ref={modalRef}>
        <h3>Add to LiloChat</h3>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label>Word</label>
            <input type="text" value={word} readOnly />
          </div>
          <div className="form-group">
            <label htmlFor="quick-add-translation-input">Translation</label>
            <input
              id="quick-add-translation-input"
              type="text"
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              placeholder="Enter translation..."
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
