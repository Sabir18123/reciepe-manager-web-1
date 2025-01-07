import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./app/home";
import Recipes from "./app/recipes";
import ContactMe from "./app/contact";
import CreateRecipe from "./app/recipes/create";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./app/components/Navbar";

function App() {
  return (
    <Router>
      <div className="App w-full h-full">
        <ToastContainer position="top-left" />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipes">
            <Route path="" element={<Recipes />} />
            <Route path="create" element={<CreateRecipe />} />
          </Route>
          <Route path="/contact-me" element={<ContactMe />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
