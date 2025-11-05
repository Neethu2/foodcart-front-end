import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";
import Menu from "./pages/Menu";
import CheckOut from "./pages/CheckOut";
import Cart from "./pages/Carts";
import SigninFormik from "./pages/SigninFormik";
import Register from "./pages/Register";
import DashboardLayout from "./layout/DashboardLayout";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<SigninFormik />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route path="home" element={<Home />} />
            <Route path="menu" element={<Menu />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<CheckOut />} />
          </Route>
        </Routes>
      </BrowserRouter>
      {/* <Signin /> */}
    </>
  );
}

export default App;
