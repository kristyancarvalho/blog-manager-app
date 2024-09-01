import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home/index";
import CreatePost from "./pages/CreatePost";

function App() {
  return (
    <>
      <Router>
        <div className="min-h-screen bg-neutral-950">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create-post" element={<CreatePost />} />
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App
