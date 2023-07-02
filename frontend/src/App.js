// Import modules
import Log from "./components/pages/Log";
import Acceuil from "./components/pages/Acceuil";
import Profil from "./components/pages/Profil";
//Import react dom router
import { Routes, Route } from "react-router-dom";

// Function app relier a index.js
function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Log />}></Route>
        <Route path="/Acceuil" element={<Acceuil />}></Route>
        <Route path="/Profil" element={<Profil />}></Route>
      </Routes>
    </div>
  );
}
export default App;
