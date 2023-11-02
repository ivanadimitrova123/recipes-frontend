import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";

const Feed = () => {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        axios.get('/api/follow/recipes', { headers })
            .then((response) => {
                setRecipes(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.error('Error fetching feed recipes:', error);
            });
    }, []);

    return (
        <div>
            <h2>Recipe Feed</h2>
            <Link to={'/userProfile'}className="text-decoration-none">MyProfile</Link>
            {recipes.length > 0 ? (
                <ul className="list-group">
                    {recipes.map((recipe) => (
                        <li key={recipe.id} className="list-group-item">
                            <img src={recipe.user.filename} alt={"profilepicture"}/>
                            <h3>{recipe.user.username}</h3>
                            <Link to={`/recipeDetails/${recipe.id}`}>
                                <h4>Recipe Name: {recipe.name}</h4>
                            </Link>
                            {recipe.picture && (
                                <div>
                                    <h3>Picture:</h3>
                                    <Link to={`/recipeDetails/${recipe.id}`}>
                                        <img src={recipe.picture.fileName} alt={recipe.name} className="img-fluid" />
                                    </Link>
                                </div>
                            )}
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
