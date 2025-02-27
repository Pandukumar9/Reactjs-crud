// import MovieBooking from './components/MovieBooking';
import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
// import GroceryApp from './pages/GroceryApp';
// import AboutMe from './pages/AboutMe';
// import DependentDropdown from './pages/DependentDropdown';
// import User from './pages/User';
import SingleWithMultple from './components/singleWithMultiple';
import Header from './layout/Header';

function App() {
  return (
    <>
      {/* <MovieBooking></MovieBooking> */}
      <div className="App">
      <BrowserRouter>
        <Header />
        <div className='container'>
          <Routes>
            {/* <Route path='/' element={<AboutMe></AboutMe>} ></Route>
            <Route path='/User' element={<User></User>} ></Route>
            <Route path='/GroceryApp' element={<GroceryApp></GroceryApp>} ></Route>
            <Route path='/AboutMe' element={<AboutMe></AboutMe>} ></Route> 
            <Route path='/Dependent-Dropdown' element={<DependentDropdown></DependentDropdown>} ></Route>  */}
            <Route path='/Single-Multple' element={<SingleWithMultple></SingleWithMultple>} ></Route> 
            {/* <Route path='*' element={<AboutMe></AboutMe>}>  </Route> */}
          </Routes>
        </div>
      </BrowserRouter> 
    </div>
    </>
  );
}

export default App;
