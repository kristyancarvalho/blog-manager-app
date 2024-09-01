import { HashRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import CreatePost from "./pages/CreatePost";

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create-post" element={<CreatePost />} />
        </Routes>
      </Router>
  );
}

export default App;