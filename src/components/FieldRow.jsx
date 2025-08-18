export default function FieldRow({ field, value, error, hint, onChange }) {
  const inputId = `fld-${field.id}`;

  return (
    <div className='field-row'>
      <label className='label' htmlFor={inputId}>
        {field.label}
      </label>

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
            (field.type === 'number' ? 0 : field.type === 'string[]' ? [] : '')
          }
          onChange={(e) => {
            const raw = e.target.value;
            onChange(field.type === 'number' ? Number(raw) : raw);
          }}
          aria-describedby={hint ? `${inputId}-hint` : undefined}
        />
      )}

      {hint && (
        <div id={`${inputId}-hint`} className='hint'>
          {hint}
        </div>
      )}
      {error && <div className='error'>{error}</div>}
    </div>
  );
}
