// src/pages/MainPage.jsx
import { useNavigate } from 'react-router-dom';
import { useFormStore } from '../store/useFormStore';
import { fieldsForPage } from '../config/fields';
import FieldRow from '../components/FieldRow';

export default function MainPage() {
  const navigate = useNavigate();

  // store
  const values = useFormStore((s) => s.values);
  const errors = useFormStore((s) => s.errors);
  const hints = useFormStore((s) => s.hints);
  const setValue = useFormStore((s) => s.setValue);
  const setErrors = useFormStore((s) => s.setErrors);
  const resetAll = useFormStore((s) => s.resetAll);

  const page1Fields = fieldsForPage(1);

  // "Complete" = all page-1 validators pass (or sensible fallback checks)
  const isPage1Complete = page1Fields.every((f) => {
    const v = values[f.id];
    if (typeof f.validate === 'function') {
      return f.validate(v) === null;
    }
    if (f.type === 'string[]') return Array.isArray(v) && v.length > 0;
    if (f.type === 'number') return Number.isFinite(v) && v > 0;
    return v != null && String(v).trim() !== '';
  });

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

      {/* LEFT: Page 1 form (stacked) */}
      <div className='panel left'>
        <h2>Required Information</h2>

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
      </div>

      {/* RIGHT: stays gray and empty until complete */}
      <div className='page right'>
        {isPage1Complete ? (
          <>
            <h2>Statement of Work</h2>
            {/* TODO: SOW preview content goes here */}
          </>
        ) : null}
      </div>

      {/* Buttons */}
      <div className='buttons'>
        <button className='btn primary' type='button' onClick={handleContinue}>
          Continue
        </button>
        <button className='btn danger' type='button' onClick={resetAll}>
          Clear
        </button>
      </div>
    </div>
  );
}
