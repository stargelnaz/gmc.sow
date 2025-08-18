// src/pages/ExportPage.jsx
import { useNavigate } from 'react-router-dom';
import { useFormStore } from '../store/useFormStore';
import { generateSowPdf } from '../utils/generateSowPdf';

export default function ExportPage() {
  const navigate = useNavigate();
  const values = useFormStore((s) => s.values);
  const resetAll = useFormStore((s) => s.resetAll);

  const handleExport = () => {
    generateSowPdf(values);
  };

  const handleClear = () => {
    resetAll();
    navigate('/');
  };

  return (
    <main className='page'>
      <h2>Export</h2>
      <p>
        Click <strong>Export PDF</strong> to generate the Statement of Work
        using your completed form values.
      </p>

      <div className='actions'>
        <button className='btn primary' onClick={handleExport}>
          Export PDF
        </button>
        <button className='btn danger' onClick={handleClear}>
          Clear &amp; Start Over
        </button>
      </div>
    </main>
  );
}
