import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function PasswordInput({
  label,
  value,
  onChange,
  minLength,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  minLength?: number;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <label>
      <span>
        {label} <span aria-hidden="true">*</span>
      </span>
      <span className="account-security-screen__password-field">
        <input
          aria-label={label}
          type={visible ? "text" : "password"}
          required
          minLength={minLength}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <button
          type="button"
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? <EyeOff aria-hidden="true" size={19} /> : <Eye aria-hidden="true" size={19} />}
        </button>
      </span>
    </label>
  );
}
