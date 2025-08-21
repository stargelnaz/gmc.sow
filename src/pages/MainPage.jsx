// src/pages/MainPage.jsx
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormStore } from '../store/useFormStore';
import { fieldsForPage } from '../config/fields';
import FieldRow from '../components/FieldRow';

export default function MainPage() {
  const navigate = useNavigate();

  // store
  const values = useFormStore((s) => s.values);
  const errors = useFormStore((s) => s.errors);
  // const hints = useFormStore((s) => s.hints);
  const setValue = useFormStore((s) => s.setValue);
  const setErrors = useFormStore((s) => s.setErrors);
  const setMany = useFormStore((s) => s.setMany);
  const resetAll = useFormStore((s) => s.resetAll);

  const page1Fields = useMemo(() => fieldsForPage(1), []);
  const page2Fields = useMemo(() => fieldsForPage(2), []);

  // Is page-1 complete?
  const isPage1Complete = page1Fields.every((f) => {
    const v = values[f.id];
    if (typeof f.validate === 'function') return f.validate(v) === null;
    if (f.type === 'string[]') return Array.isArray(v) && v.length > 0;
    if (f.type === 'number') return Number.isFinite(v) && v > 0;
    return v != null && String(v).trim() !== '';
  });

  // Recompute any derived page-2 fields when deps change
  useEffect(() => {
    const derived = page2Fields.filter(
      (f) => f.derived && typeof f.compute === 'function'
    );
    const patch = {};
    for (const f of derived) {
      const next = f.compute(values);
      if ((values[f.id] ?? '') !== (next ?? '')) patch[f.id] = next ?? '';
    }
    if (Object.keys(patch).length) setMany(patch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.gnpSourceId, values.sourceTitle, values.totalCost]);

  const handleContinue = () => {
    const errs = {};
    for (const f of page1Fields) {
      if (typeof f.validate === 'function') {
        const msg = f.validate(values[f.id]);
        if (msg) errs[f.id] = msg;
      }
    }
    if (Object.keys(errs).length) {
      setErrors(errs);
      const firstId = Object.keys(errs)[0];
      const el = document.getElementById(`fld-${firstId}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    navigate('/export');
  };

  return (
    <div className='page-layout'>
      {/* Top info box */}
      <div className='page info'>
        <h2>GNP Statement of Work Generator</h2>
      </div>

      {/* LEFT PANEL (note: class matches your CSS .panel.left) */}
      <div className='panel left'>
        <h2>Required Information</h2>

        {page1Fields.map((field) => {
          const hintText =
            typeof field.hint === 'function' ? field.hint(values) : field.hint;

          return (
            <FieldRow
              key={field.id}
              field={field}
              value={values[field.id]}
              error={errors[field.id]}
              hint={hintText}
              onChange={(val) => setValue(field.id, val)}
            />
          );
        })}

        <div className='buttons'>
          <button
            className='btn primary'
            type='button'
            onClick={handleContinue}
          >
            Continue
          </button>
          <button className='btn danger' type='button' onClick={resetAll}>
            Clear
          </button>
        </div>
      </div>

      {/* RIGHT PANEL: only shows after page-1 is valid */}
      <div className='page right'>
        {isPage1Complete ? (
          <>
            <h2>Statement of Work</h2>
            <div className='stack'>
              {page2Fields.map((field) => {
                const hintText =
                  typeof field.hint === 'function'
                    ? field.hint(values)
                    : field.hint;

                return (
                  <RightFieldRow
                    key={field.id}
                    field={field}
                    value={values[field.id]}
                    error={errors[field.id]}
                    hint={hintText}
                    onChange={(val) => setValue(field.id, val)}
                  />
                );
              })}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

// Minimal stacked row for the right panel (no echo column).
function RightFieldRow({ field, value, error, hint, onChange }) {
  const inputId = `fld-${field.id}`;
  const readOnly = !!field.derived;

  const onChangeBasic = (e) => {
    const raw = e.target.value;
    onChange(field.type === 'number' ? Number(raw) : raw);
  };

  return (
    <div className='form-row' style={{ marginBottom: '0.9rem' }}>
      <label className='label' htmlFor={inputId}>
        {field.label}
        {field.derived ? ' (auto)' : ''}
      </label>

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
        onChange={onChangeBasic}
        aria-describedby={hint ? `${inputId}-hint` : undefined}
        readOnly={readOnly}
      />

      {hint && (
        <div id={`${inputId}-hint`} className='hint'>
          {hint}
        </div>
      )}
      {error && <div className='error'>{error}</div>}
    </div>
  );
}
