import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import ViewDish from "./Pages/ViewDish";
import Login from "./Pages/Login";
import UseSweetAlert from "./components/useSweetAlert";
import AddDish from "./Pages/AddDish";

function App() {
  const location = useLocation();

  const shouldHideSidebar = location.pathname === "/Login";

  return (
    <>
      {!shouldHideSidebar && <Sidebar />}
      <Routes>
        <Route path="/ViewDish" element={<ViewDish />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/UseSweetAlert" element={<UseSweetAlert />} />
        <Route path="/AddDish" element={<AddDish />} />


      </Routes>
    </>
  );
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
