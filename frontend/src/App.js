import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
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

import PrivateRoute from './utils/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import MyReactionsPage from './pages/MyReactionsPage';
import DrawSubstructPage from './pages/DrawSubstructPage';
import AboutPage from './pages/AboutPage';
import MyAccountPage from './pages/MyAccountPage';
import ReactionDraftsPage from './pages/ReactionDraftsPage';
import DraftPage from './pages/DraftPage';

function App() {
  
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Header />
          <br></br>
            <Routes>
              <Route path="/" exact element={<SearchPage />} />
              <Route path="/about" exact element={<AboutPage />} />
              <Route path="/sign-in" exact element={<LoginPage />} />
              <Route path="/create-account" exact element={<NewUserPage />} />
              <Route path="/all-reactions" exact element={<ReactionListPage />} />
              <Route path="/smiles-structures" exact element={<StructureListPage />} />
              <Route path="/draw-structures" exact element={<DrawSubstructPage />} />
              <Route path="/reaction/:id" exact element={<ReactionPage />} />
              <Route path="/search/:searchTerm" exact element={<GeneralSearch />} />
              <Route path="/advanced" exact element={<AdvSearchPage />} />
              <Route path="/reaction-drafts" exact element={<ReactionDraftsPage />} />
              <Route path="/reaction-drafts/:id" exact element={<DraftPage />} />
              <Route exact path='/contribute' element={
                <PrivateRoute>
                  <ContributePage />
                </PrivateRoute>
              }/>
              <Route exact path='/my-reactions' element={
                <PrivateRoute>
                  <MyReactionsPage />
                </PrivateRoute>
              }/>
              <Route exact path='/my-account' element={
                <PrivateRoute>
                  <MyAccountPage />
                </PrivateRoute>
              }/>

            </Routes>
          
          <br></br>
          <Footer />
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
