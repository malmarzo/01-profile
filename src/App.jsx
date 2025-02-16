import Home from "./components/Home";
import Login from "./components/Login"
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import AuthRoute from "./components/AuthRoute";
import AlreadyAuthRoute from "./components/AlreadyAuthRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/01-Profile/login"
          element={
            <AlreadyAuthRoute>
              <Login />
            </AlreadyAuthRoute>
          }
        />
        <Route
          path="01-Profile/"
          element={
            <AuthRoute>
              <Home />
            </AuthRoute>
          }
        />
        <Route
          path="/*"
          element={
            <h1>
              404 Not Found <a href="/01-Profile">return home</a>
            </h1>
          }
        />
      </Routes>
    </Router>
  );
}


export default App