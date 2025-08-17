// src/components/FieldRow.jsx
export default function FieldRow({ field, value, error, hint, onChange }) {
  const inputId = `fld-${field.id}`;

  return (
    <>
      {/* LABEL COLUMN */}
      <label className='label' htmlFor={inputId}>
        {field.label}
      </label>

      {/* INPUT COLUMN */}
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
            value={
              value ??
              (field.type === 'number'
                ? 0
                : field.type === 'string[]'
                ? []
                : '')
            }
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

      {/* ECHO COLUMN */}
      <div className='echo'>{formatDisplay(field, value)}</div>
    </>
  );
}

function formatDisplay(field, value) {
  if (field?.type === 'string[]' && Array.isArray(value)) {
    return value.join(', ');
  }
  if (value == null || value === '') return '—';
  return String(value);
}
