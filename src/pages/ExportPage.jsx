// src/pages/ExportPage.jsx
import { useFormStore } from '../store/useFormStore';
import { generateSowPdf } from '../utils/generateSowPdf';
import { useNavigate } from 'react-router-dom';

export default function ExportPage() {
  const values = useFormStore((s) => s.values);
  const resetAll = useFormStore((s) => s.resetAll);
  const navigate = useNavigate();

  return (
    <main className='page'>
      <h2>Export</h2>
      <p>Click Export to generate the PDF using current form values.</p>
      <div className='actions'>
        <button className='btn primary' onClick={() => generateSowPdf(values)}>
          Export PDF
        </button>
        <button
          className='btn danger'
          onClick={() => {
            resetAll();
            navigate('/');
          }}
        >
          Clear
        </button>
      </div>
    </main>
  );
}
