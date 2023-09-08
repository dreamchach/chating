import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Index from "./pages/index";
import NotFound from "./pages/NotFound";
import Chat from './pages/Chat';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Index />}></Route>
          <Route path='/chat' element={<Chat/>}></Route>
          <Route path='*' element={<NotFound />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
