import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import TopNav from './components/TopNav';
import Home from './components/Home';
import ModulePage from './components/ModulePage';
import Traps from './components/Traps';
import MarksUI from './components/MarksUI';

export default function App() {
  return (
    <HashRouter>
      <TopNav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/m/:moduleId" element={<ModulePage />} />
        <Route path="/traps" element={<Traps />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <MarksUI />
    </HashRouter>
  );
}
