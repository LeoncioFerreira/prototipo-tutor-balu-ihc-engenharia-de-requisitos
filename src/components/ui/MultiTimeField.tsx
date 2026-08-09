import type { Ref } from "react";
import { Plus, Trash2 } from "lucide-react";

export function MultiTimeField({
  times,
  onChange,
  error,
  errorId,
  firstInputRef,
}: {
  times: string[];
  onChange: (times: string[]) => void;
  error?: string;
  errorId: string;
  firstInputRef?: Ref<HTMLInputElement>;
}) {
  return (
    <fieldset className="multi-time-field" aria-describedby={error ? errorId : undefined}>
      <legend>
        Horários <b className="required-mark">*</b>
      </legend>
      <div className="multi-time-field__list">
        {times.map((time, index) => (
          <div className="multi-time-field__row" key={index}>
            <label>
              <span>Horário {index + 1}</span>
              <input
                ref={index === 0 ? firstInputRef : undefined}
                type="text"
                inputMode="numeric"
                maxLength={5}
                placeholder="HH:MM"
                pattern="([01][0-9]|2[0-3]):[0-5][0-9]"
                aria-label={`Horário ${index + 1}`}
                aria-invalid={Boolean(error && !time)}
                value={time}
                onChange={(event) => {
                  const digits = event.target.value.replace(/\D/g, "").slice(0, 4);
                  const formatted =
                    digits.length > 2 ? `${digits.slice(0, 2)}:${digits.slice(2)}` : digits;
                  onChange(
                    times.map((current, currentIndex) =>
                      currentIndex === index ? formatted : current,
                    ),
                  );
                }}
              />
            </label>
            {times.length > 1 && (
              <button
                type="button"
                aria-label={`Remover horário ${index + 1}`}
                onClick={() => onChange(times.filter((_, currentIndex) => currentIndex !== index))}
              >
                <Trash2 aria-hidden="true" size={17} />
              </button>
            )}
          </div>
        ))}
      </div>
      {error && (
        <small className="field-error" id={errorId}>
          {error}
        </small>
      )}
      <button
        className="multi-time-field__add"
        type="button"
        onClick={() => onChange([...times, ""])}
      >
        <Plus aria-hidden="true" size={17} />
        Adicionar horário
      </button>
    </fieldset>
  );
}
