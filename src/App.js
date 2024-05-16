import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RecipeDetails from "./pages/RecipeDetails";
import RecipeForm from "./pages/RecipeForm";
import Login from "./pages/Login ";
import Register from "./pages/Register";
import UserProfile from "./pages/UserProfile";
import Feed from "./pages/Feed";
import FollowingList from "./pages/FollowingList";
import AddProfilePicture from "./pages/AddProfilePicture";
import ForgotPassword from "./components/ForgotPassword";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import SavedRecipes from "./pages/SavedRecipes";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <ToastContainer position="bottom-center" limit={1} />
      <Routes>
        <Route path="/recipeForm" element={<RecipeForm />} />
        <Route path="/recipeDetails/:id" element={<RecipeDetails />} />
        <Route path="/recipeForm/:id" element={<RecipeForm />} />
        <Route path="/register" element={<Register />} />
        <Route exact path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/saved" element={<SavedRecipes />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/userProfile/:id" element={<UserProfile />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/followingList" element={<FollowingList />} />
        <Route path="/addProfilePicture" element={<AddProfilePicture />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
