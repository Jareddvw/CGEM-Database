import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Header from './components/Header'
import ReactionListPage from './pages/ReactionListPage'
import ReactionPage from './pages/ReactionPage'
import StructureList from './pages/StructureList';
import Footer from './components/Footer'
import SearchPage from './pages/SearchPage';
import GeneralSearch from './pages/GeneralSearch';

function App() {
  return (
    <Router>
    <div className="App">
      <Header />
      <br></br>
        <Routes>
          <Route path="/" exact element={<SearchPage />} />
          <Route path="/all-reactions" element={<ReactionListPage />} />
          <Route path="/structures" exact element={<StructureList />} />
          <Route path="/reaction/:id" element={<ReactionPage />} />
          <Route path="/search/:searchTerm" element={<GeneralSearch />} />
        </Routes>
      
      <br></br>
      <Footer />
    </div>
    </Router>
  );
}

export default App;
