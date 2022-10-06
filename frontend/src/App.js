
import React from 'react'
import { BrowserRouter , Routes,Route} from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header'
import Footer from './components/Footer'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import ForgotPassword from './screens/ForgotPassword'
import Profile from './screens/Profile'
import UpdateProfile from './screens/UpdateProfile'
import Users from './screens/Users'
import UpdateUser from './screens/UpdateUser'
import ViewUser from './screens/ViewUser'
import Stocks from './screens/Stocks'
import Alerts from './screens/Alerts'
import Portfolio from './screens/Portfolio'
import AddPortfolio from './screens/AddPortfolio'
import AddAlert from './screens/AddAlert'
import SearchData from './screens/SearchData'
import SearchBox from './components/SearchBox'
const Home=()=><h1>Wecome to Home</h1>

function App() {
  return (
    <BrowserRouter>
    <Header/>
<main className='py-3'>      
   <Container >
   <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<LoginScreen />} />
    <Route path="/register" element={<RegisterScreen />} />
    <Route path="/admin/userlist" element={<Users />} />
    <Route path="/forgotpassword" element={<ForgotPassword />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/portfolio" element={<Portfolio />} />
    <Route path="/addportfolio" element={<AddPortfolio />} />
    <Route path="/updateprofile/:id" element={<UpdateProfile />} />
    <Route path="/admin/updateuser/:id" element={<UpdateUser />} />
    <Route path="/admin/viewuser/:id" element={<ViewUser />} />
    <Route path="/stocks/:ticker" element={<Stocks />} />
    <Route path="/stocks" element={<Stocks />} />
    <Route path="/alerts" element={<Alerts />} />
    <Route path="/alerts/addalert" element={<AddAlert />} />
    </Routes>
    </Container>
    </main>
    <Footer/>
    </BrowserRouter>
    );
}

export default App;
