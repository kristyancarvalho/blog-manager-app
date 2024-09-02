import { HashRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import ManagePost from "./pages/ManagePost";
import AddPost from "./pages/AddPost";

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/manage-posts" element={<ManagePost />} />
          <Route path="/add-posts" element={<AddPost />} />
        </Routes>
      </Router>
  );
}

export default App;