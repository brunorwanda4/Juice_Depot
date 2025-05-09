import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
const App = () => {
  return (
    <BrowserRouter>
      <div className=" min-h-screen">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
