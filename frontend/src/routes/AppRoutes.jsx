import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Alunos from '../pages/Alunos';
import Termos from '../pages/Termos';
import Emissao from '../pages/Emissao';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/alunos" element={<Alunos />} />
        <Route path="/termos" element={<Termos />} />
        <Route path="/emissao" element={<Emissao />} />
      </Routes>
    </BrowserRouter>
  );
}