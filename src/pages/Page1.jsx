// src/pages/Page1.jsx
import { useFormStore } from '../store/useFormStore';
import { fieldsForPage } from '../config/fields';
import { LANGUAGE_LABEL_BY_CODE } from '../config/languageOptions';

export default function Page1() {
  const setValue = useFormStore((s) => s.setValue);
  const values = useFormStore((s) => s.values);
  const errors = useFormStore((s) => s.errors);
  const hints = useFormStore((s) => s.hints);

  const fields = fieldsForPage(1);

  return (
    <div className='app-header'>
      <h1>Required Information</h1>
      Need help? {/* <form className='form-grid'> */}
      {/* Header row */}
      <div className='hdr label'>Field</div>
      <div className='hdr input'>Input</div>
      {/* <div className='hdr echo'>Current value</div> */}
      {fields.map((field) => (
        <FieldRow
          key={field.id}
          field={field}
          value={values[field.id]}
          error={errors[field.id]}
          hint={hints[field.id]}
          onChange={(val) => setValue(field.id, val)}
        />
      ))}
      {/* </form> */}
    </div>
  );
}

function formatDisplay(field, value) {
  if (field.type === 'string[]' && Array.isArray(value)) {
    // Map codes → labels for languages (or fall back to the code)
    return value.map((code) => LANGUAGE_LABEL_BY_CODE[code] || code).join(', ');
  }
  if (value == null || value === '') return '—';
  return String(value);
}

function FieldRow({ field, value, error, hint, onChange }) {
  const inputId = `fld-${field.id}`;

  return (
    <>
      <label className='label' htmlFor={inputId}>
        {field.label}
      </label>

      {/* INPUT */}
      <div className='input'>
        {field.type === 'string[]' && field.options ? (
          <select
            id={inputId}
            multiple
            value={value ?? []}
            onChange={(e) =>
              onChange(Array.from(e.target.selectedOptions, (opt) => opt.value))
            }
            aria-describedby={hint ? `${inputId}-hint` : undefined}
          >
            {field.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={inputId}
            type={
              field.type === 'number'
                ? 'number'
                : field.type === 'date'
                ? 'date'
                : 'text'
            }
            value={value ?? (field.type === 'number' ? 0 : '')}
            onChange={(e) => {
              const raw = e.target.value;
              onChange(field.type === 'number' ? Number(raw) : raw);
            }}
            aria-describedby={hint ? `${inputId}-hint` : undefined}
          />
        )}

        {/* Inline messages */}
        {hint && (
          <div id={`${inputId}-hint`} className='hint'>
            {hint}
          </div>
        )}
        {error && <div className='error'>{error}</div>}
      </div>

      {/* CURRENT VALUE */}
      {/* <div className='echo'>{formatDisplay(field, value)}</div> */}
    </>
  );
}
