import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/loginPage";
import RegisterPage from "./pages/registerPage";
import ProtectedRoute from "./layouts/protectedRouters";
const App = () => {
  return (
    <BrowserRouter>
      <div className=" min-h-screen">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path='/dashboard/*' element={<AdminLayout />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
