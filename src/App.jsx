// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Page1 from './pages/Page1';
import Page2 from './pages/Page2';
import ExportPage from './pages/ExportPage';
import './App.css'; // Import your global styles
import './styles/forms.css'; // Import form styles
import './styles/page.css'; // Import page styles

function App() {
  return (
    <Router>
      <div className='app'>
        <nav>
          <ul>
            <li>
              <Link to='/'>Page 1</Link>
            </li>
            <li>
              <Link to='/page2'>Page 2</Link>
            </li>
            <li>
              <Link to='/export'>Export</Link>
            </li>
          </ul>
        </nav>

        <main>
          <Routes>
            <Route path='/' element={<Page1 />} />
            <Route path='/page2' element={<Page2 />} />
            <Route path='/export' element={<ExportPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
