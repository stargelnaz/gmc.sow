import { useNavigate } from 'react-router-dom';
import { useFormStore } from '../store/useFormStore';

export default function MainPage() {
  const navigate = useNavigate();
  const resetAll = useFormStore((s) => s.resetAll);

  return (
    <div className='page-layout'>
      {/* Top info box */}
      <div className='page info'>
        <h2>Page Information</h2>
        <p>This is where you can put general instructions or metadata.</p>
      </div>

      {/* Left / Right panels */}
      <div className='page left'>
        <h2>Required Texts</h2>
      </div>
      <div className='page right'>
        <h2>Statement of Work</h2>
      </div>

      {/* Bottom buttons */}
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
