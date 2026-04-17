import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

interface Profile {
  name: string;
  email: string;
}

interface Props {
  open: boolean;
  profile: Profile;
  onClose: () => void;
  onSave: (profile: Profile) => void;
}

const ProfileModal = ({ open, profile, onClose, onSave }: Props) => {
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);

  useEffect(() => {
    if (open) {
      setName(profile.name);
      setEmail(profile.email);
    }
  }, [open, profile]);

  if (!open) return null;

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), email: email.trim() });
  };

  const getInitials = (n: string) =>
    n.trim().split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "?";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle" />

        <div className="modal-header">
          <h2 className="modal-title">Редактировать профиль</h2>
          <button className="icon-btn" onClick={onClose}>
            <Icon name="X" size={18} />
          </button>
        </div>

        {/* Avatar preview */}
        <div className="profile-edit-avatar-wrap">
          <div className="profile-avatar profile-avatar--lg">{getInitials(name)}</div>
        </div>

        <div className="modal-form">
          <div className="modal-field">
            <label className="modal-label">Имя</label>
            <input
              className="modal-input"
              type="text"
              placeholder="Ваше имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">Email</label>
            <input
              className="modal-input"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="modal-actions">
          <button className="modal-btn modal-btn--secondary" onClick={onClose}>Отмена</button>
          <button className="modal-btn modal-btn--primary" onClick={handleSave} disabled={!name.trim()}>
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
