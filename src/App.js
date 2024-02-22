import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import RecipeDetails from './components/RecipeDetails';
import RecipeForm from "./components/RecipeForm";
import Login from "./components/Login ";
import Register from "./components/Register"
import UserProfile from "./components/UserProfile";
import Feed from "./components/Feed";
import FollowingList from "./components/FollowingList";
import AddProfilePicture from "./components/AddProfilePicture";
import ForgotPassword from "./components/ForgotPassword";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';


function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/recipeForm" element={<RecipeForm />} />
                    <Route path="/recipeDetails/:id" element={<RecipeDetails />} />
                    <Route path="/recipeForm/:id" element={<RecipeForm/>} />
                    <Route path="/register" element={<Register />}  />
                    <Route exact path="/" element={<Register />} />
                    <Route path="/login"  element={<Login />} />
                    <Route path="/userProfile" element={<UserProfile />} />
                    <Route path="/userProfile/:id" element={<UserProfile />} />
                    <Route path="/feed" element={<Feed />} />
                    <Route path="/followingList" element={<FollowingList />} />
                    <Route path="/addProfilePicture" element={<AddProfilePicture/>}/>
                    <Route path="/forgotPassword" element={<ForgotPassword/>}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
