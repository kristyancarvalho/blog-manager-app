import { HashRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import ManagePost from "./pages/ManagePost";
import AddPost from "./pages/AddPost";
import PostPage from "./pages/Post";

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/manage-posts" element={<ManagePost />} />
          <Route path="/add-posts" element={<AddPost />} />
          <Route path="/post/:id" element={<PostPage />} />
        </Routes>
      </Router>
  );
}

export default App;