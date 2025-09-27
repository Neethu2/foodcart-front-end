import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";
import { Dashboard, Home } from "@mui/icons-material";
import Menu from "./pages/Menu";
import CheckOut from "./pages/CheckOut";
import Cart from "./pages/Carts";
import SigninFormik from "./pages/SigninFormik";
import Register from "./pages/Register";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />}>
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
