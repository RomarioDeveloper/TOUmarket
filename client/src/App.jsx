import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./components/Toast";

import MainCat from "./Main/MainCat";
import MainNew from "./Main/MainNew";
import Login from "./Login/Login";
import Register from "./Register/Register";
import CartMinimal from "./cart/CartMinimal";
import './Main/Main.css'


export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainCat />} />
          <Route path="/new" element={<MainNew />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<CartMinimal />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
