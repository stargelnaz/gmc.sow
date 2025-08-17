// src/pages/FormDual.jsx
import { useNavigate } from 'react-router-dom';
import { useFormStore } from '../store/useFormStore';
import { fieldsForPage, FIELD_BY_ID } from '../config/fields';
import { LANGUAGE_LABEL_BY_CODE } from '../config/languageOptions';
import '../styles/page.css';

export default function FormDual() {
  const navigate = useNavigate();

  const setValue = useFormStore((s) => s.setValue);
  const values = useFormStore((s) => s.values);
  const errors = useFormStore((s) => s.errors);
  const hints = useFormStore((s) => s.hints);
  const resetAll = useFormStore((s) => s.resetAll);

  const page1Fields = fieldsForPage(1);
  const page2Fields = fieldsForPage(2);

  // Page 2 echoes key Page 1 fields at the top
  const echoIds = ['gnpSourceId', 'sourceTitle', 'languages', 'totalCost'];

  return (
    <div className="page-layout">
      {/* LEFT: Page 1 */}
      <div className="page left">
        <h2>Page 1: Enter Required Information</h2>
        <form className="form-grid">
          <div className="hdr label">Field</div>
          <div className="hdr input">Input</div>
          <div className="hdr echo">Current value</div>

          {page1Fields.map((field) => (
            <FieldRow
              key={field.id}
              field={field}
              value={values[field.id]}
              error={errors[field.id]}
              hint={hints[field.id]}
              onChange={(val) => setValue(field.id, val)}
            />
          ))}
        </form>
      </div>

      {/* RIGHT: Page 2 */}
      <div className="page right">
        <h2>Page 2: Review and Edit</h2>

        <section>
          <h3>From Page 1 (editable)</h3>
          <div className="form-grid">
            <div className="hdr label">Field</div>
            <div className="hdr input">Input</div>
            <div className="hdr echo">Current value</div>

            {echoIds.map((id) => {
              const field = FIELD_BY_ID[id];
              if (!field) return null;
              return (
                <FieldRow
                  key={field.id}
                  field={field}
                  value={values[field.id]}
                  error={errors[field.id]}
                  hint={hints[field.id]}
                  onChange={(val) => setValue(field.id, val)}
                />
              );
            })}
          </div>
        </section>

        <section>
          <h3>Additional Fields</h3>
          <div className="form-grid">
            <div className="hdr label">Field</div>
            <div className="hdr input">Input</div>
            <div className="hdr echo">Current value</div>

            {page2Fields.map((field) => (
              <FieldRow
                key={field.id}
                field={field}
                value={values[field.id]}
                error={errors[field.id]}
                hint={hints[field.id]}
                onChange={(val) => setValue(field.id, val)}
              />
            ))}
          </div>
        </section>

        <div className="buttons">
          <button type="button" onClick={() => navigate('/export')}>Continue</button>
          <button type="button" onClick={resetAll}>Clear</button>
        </div>
      </div>
    </div>
  );
}

function formatDisplay(field, value) {
  if (field.type === 'string[]' && Array.isArray(value)) {
    return value.map((code) => LANGUAGE_LABEL_BY_CODE[code] || code).join(', ');
  }
  if (value == null || value === '') return '—';
  return String(value);
}

function FieldRow({ field, value, error, hint, onChange }) {
  const inputId = `fld-${field.id}`;

  return (
    <>
      {/* LABEL COLUMN */}
      <label className="label" htmlFor={inputId}>
        {field.label}
        {field.derived ? ' (auto)' : ''}
      </label>

      {/* INPUT COLUMN */}
      <div className="input">
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
            readOnly={!!field.derived}
            aria-describedby={hint ? `${inputId}-hint` : undefined}
          />
        )}

        {hint && (
          <div id={`${inputId}-hint`} className="hint">
            {hint}
          </div>
        )}
        {error && <div className="error">{error}</div>}
      </div>

      {/* ECHO COLUMN */}
      <div className="echo">{formatDisplay(field, value)}</div>
    </>
  );
}
