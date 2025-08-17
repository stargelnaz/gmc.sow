import { useFormStore } from '../store/useFormStore';

export default function ExportPage() {
  const values = useFormStore((s) => s.values);
  const resetAll = useFormStore((s) => s.resetAll);

  const handleExport = () => {
    // For now just log values, later connect to PDF exporter
    console.log('Exporting values:', values);
    alert('Export triggered. Check console for values!');
  };

  return (
    <div className='page'>
      <h2>Export Page</h2>
      <p>Review your data below. When ready, click Export.</p>

      <pre style={{ background: '#f4f4f4', padding: '1rem' }}>
        {JSON.stringify(values, null, 2)}
      </pre>

      <div className='buttons'>
        <button type='button' onClick={handleExport}>
          Export PDF
        </button>
        <button type='button' onClick={resetAll}>
          Clear All
        </button>
      </div>
    </div>
  );
}
