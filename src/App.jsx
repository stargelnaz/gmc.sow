import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import ExportPage from './pages/ExportPage';
import './App.css'; // your grid + theme styles

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='/export' element={<ExportPage />} />
        <Route path='*' element={<MainPage />} />
      </Routes>
    </Router>
  );
}

export default App;
