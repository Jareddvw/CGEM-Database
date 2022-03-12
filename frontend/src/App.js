import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Header from './components/Header'
import ReactionListPage from './pages/ReactionListPage'
import ReactionPage from './pages/ReactionPage'
import Footer from './components/Footer'

function App() {
  return (
    <Router>
    <div className="App">
      <Header />
      <br></br>
        <Routes>
          <Route path="/" exact element={<ReactionListPage />} />
          <Route path="/reaction/:id" element={<ReactionPage />} />
        </Routes>
      
      <br></br>
      <Footer />
    </div>
    </Router>
  );
}

export default App;
