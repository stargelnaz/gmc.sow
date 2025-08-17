// src/pages/MainPage.jsx
import { useNavigate } from 'react-router-dom';
import { useFormStore } from '../store/useFormStore';
import { fieldsForPage } from '../config/fields';
import FieldRow from '../components/FieldRow';

export default function MainPage() {
  const navigate = useNavigate();
  const resetAll = useFormStore((s) => s.resetAll);

  // pull form state
  const setValue = useFormStore((s) => s.setValue);
  const values = useFormStore((s) => s.values);
  const errors = useFormStore((s) => s.errors);
  const hints = useFormStore((s) => s.hints);

  const page1Fields = fieldsForPage(1);

  return (
    <div className='page-layout'>
      {/* Top info box */}
      <div className='page info'>
        <h2>GNP Statement of Work Generator</h2>
      </div>

      {/* LEFT: Page 1 form */}
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
        {/* </form> */}
      </div>

      {/* RIGHT: placeholder for now */}
      <div className='page right'>
        <h2>Statement of Work</h2>
      </div>

      {/* Buttons */}
      <div className='buttons'>
        <button className='btn primary' onClick={() => navigate('/export')}>
          Continue
        </button>
        <button className='btn danger' onClick={resetAll}>
          Clear
        </button>
      </div>
    </div>
  );
}
