import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Header from './components/Header'
import ReactionListPage from './pages/ReactionListPage'
import ReactionPage from './pages/ReactionPage'
import StructureListPage from './pages/StructureListPage';
import Footer from './components/Footer'
import SearchPage from './pages/SearchPage';
import GeneralSearch from './pages/GeneralSearchResults';
import AdvSearchPage from './pages/AdvSearchPage';
import ContributePage from './pages/ContributePage';
import LoginPage from './pages/LoginPage';
import NewUserPage from './pages/NewUserPage';

function App() {
  return (
    <Router>
    <div className="App">
      <Header />
      <br></br>
        <Routes>
          <Route path="/" exact element={<SearchPage />} />
          <Route path="/sign-in" exact element={<LoginPage />} />
          <Route path="/create-account" exact element={<NewUserPage />} />
          <Route path="/all-reactions" element={<ReactionListPage />} />
          <Route path="/structures" exact element={<StructureListPage />} />
          <Route path="/reaction/:id" element={<ReactionPage />} />
          <Route path="/search/:searchTerm" element={<GeneralSearch />} />
          <Route path="/advanced" exact element={<AdvSearchPage />} />
          <Route path="/contribute" exact element={<ContributePage />} />
        </Routes>
      
      <br></br>
      <Footer />
    </div>
    </Router>
  );
}

export default App;
