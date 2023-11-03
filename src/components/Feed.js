import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";

const Feed = () => {
    const [recipes, setRecipes] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = users.filter((user) =>
        //user.username.toLowerCase().includes(searchTerm.toLowerCase())
        currentUser && user.id !== currentUser.id && user.username.toLowerCase().startsWith(searchTerm.toLowerCase())
    );


    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        axios.get('/api/account/current', { headers })
            .then((response) => {
                setCurrentUser(response.data);
                console.log(response.data)
            })
            .catch((error) => {
                console.error('Error fetching current user:', error);
            });

        axios.get('/api/follow/recipes', { headers })
            .then((response) => {
                setRecipes(response.data);
                console.log(response.data)
            })
            .catch((error) => {
                console.error('Error fetching feed recipes:', error);
            });

        axios.get('/api/account/allUsers', { headers })
            .then((response) => {
                setUsers(response.data);
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            });
    }, []);

    return (
        <div className="container mt-5">
            <div className="row mb-3">
                <div className="col" style={{ display: "flex", alignItems: "center" }}>
                    <h2 className="me-5">Recipes Feed</h2>
                    <input
                        className="form-control"
                        type="text"
                        placeholder="Search users"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: "400px", // Adjust the width as needed
                        }}
                    />
                </div>
                {currentUser && (
                <div className="col">
                    <Link to={'/userProfile'} className="text-decoration-none d-flex justify-content-end me-5">
                        <img src={currentUser.userImage} alt="profile"
                            style={{
                                maxWidth:"50px",
                                maxHeight:"50px"
                            }}
                        />
                        <h4>{currentUser.username}</h4>
                    </Link>
                </div>
                )}
            </div>


            {searchTerm.length > 0 && (
                <div className="mb-3 row">
                    <div className="col-2">

                    </div>
                    <div className="col-4">
                        {filteredUsers.length > 0 ? (
                            <ul className="list-group">
                                {filteredUsers.map((user) => (
                                    <li key={user.id} className="list-group-item">
                                        <h5>
                                            <Link to={`/userProfile/${user.id}`} className="text-decoration-none">
                                                {user.username}
                                            </Link>
                                        </h5>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No users found with the specified username or part of it.</p>
                        )}
                    </div>

                </div>
            )}

            {recipes.length > 0 ? (
                <ul className="list-group">
                    {recipes.map((recipe) => (
                        <li key={recipe.recipe.id} className="list-group-item">

                            <Link to={`/userProfile/${recipe.recipe.user.id}`} className="text-decoration-none">
                                <img className="" src={recipe.userImage} alt={"profilepicture"} style={{
                                    maxWidth: "70px", maxHeight: "60px",}}/>
                                <h3 style={{display:"inline"}}>{recipe.recipe.user.username}</h3>
                            </Link>

                            <Link to={`/recipeDetails/${recipe.recipe.id}`} className="text-decoration-none">
                                <h4>Recipe Name: {recipe.recipe.name}</h4>
                                <img src={recipe.recipeImage} alt={recipe.name} className="img-fluid"
                                     style={{maxWidth: "250px", maxHeight: "250px",}}
                                />
                            </Link>

                        </li>
                    ))}
                </ul>
            ) : (
                <p>No recipes from followed users.</p>
            )}
        </div>
    );
}
export default Feed;
