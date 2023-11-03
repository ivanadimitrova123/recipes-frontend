import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RecipeDetails = () => {
    const { id } = useParams();
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        // Fetch the current user's data
        axios.get('/api/account/current', { headers })
            .then((response) => {
                setCurrentUser(response.data);
                console.log(response.data)
            })
            .catch((error) => {
                console.error('Error fetching current user:', error);
            });

        axios.get(`/api/recipes/${id}`, { headers })
            .then((response) => {
                setRecipe(response.data);
               // console.log(response.data);
            })
            .catch((error) => {
                console.error('Error fetching recipe details:', error);
            });
    }, [id]);

    const handleEdit = () => {
        navigate(`/recipeForm/${id}`);
    };

    const handleDelete = () => {
        const token = localStorage.getItem('jwtToken');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        axios.delete(`/api/recipes/${id}`, { headers })
            .then(() => {
                navigate('/userProfile');
            })
            .catch((error) => {
                console.error('Error deleting recipe:', error);
            });
    };

    return (
        <div className="container mt-5">
            <h2>Recipe Details</h2>
            {recipe ? (
                <div>
                    <div className="mt-4">
                        <h3>Name: {recipe.name}</h3>
                    </div>
                    <div className="mt-4">
                        <p>Description: {recipe.description}</p>
                    </div>
                    {recipe.picture && (
                        <div className="mt-4">
                            <h3>Picture:</h3>
                            <img
                                src={recipe.picture.fileName.replace("images", "image")}
                                alt={recipe.name}
                                className="img-fluid"
                                style={{
                                    maxWidth: "200px",
                                    maxHeight: "200px",
                                }}
                            />
                        </div>
                    )}
                    {recipe.ingredients && recipe.ingredients.length > 0 && (
                        <div className="mt-4">
                            <h3>Ingredients:</h3>
                            <ul>
                                {recipe.ingredients.map((ingredient, index) => (
                                    <li key={index}>{ingredient}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {recipe.user && currentUser && currentUser.id === recipe.user.id && (
                        <div className="mt-4">
                            <button className="btn btn-primary me-2" onClick={handleEdit}>
                                Edit
                            </button>
                            <button className="btn btn-danger" onClick={handleDelete}>
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <p className="mt-4">Loading recipe details...</p>
            )}
        </div>

    );
};

export default RecipeDetails;

