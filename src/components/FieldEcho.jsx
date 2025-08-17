// src/components/FieldEcho.jsx
export default function FieldEcho({ label, value }) {
  return (
    <div className='field-echo'>
      <span className='label'>{label}:</span>
      <span className='value'>{String(value)}</span>
    </div>
  );
}
