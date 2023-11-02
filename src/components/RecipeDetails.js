import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RecipeDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        axios.get(`/api/recipes/${id}`, { headers })
            .then((response) => {
                setRecipe(response.data);
                console.log(response.data);
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
        <div>
            <h2>Recipe Details</h2>
            {recipe ? (
                <div>
                    <h3>Name: {recipe.name}</h3>
                    <p>Description: {recipe.description}</p>
                    {recipe.picture && (
                        <div>
                            <h3>Picture:</h3>
                            <img src={recipe.picture.fileName.replace("images","image")} alt={recipe.name} />
                        </div>
                    )}
                    {recipe.ingredients && recipe.ingredients.length > 0 && (
                        <div>
                            <h3>Ingredients:</h3>
                            <ul>
                                {recipe.ingredients.map((ingredient, index) => (
                                    <li key={index}>{ingredient}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <button onClick={handleEdit}>Edit</button>
                    <button onClick={handleDelete}>Delete</button>

                </div>
            ) : (
                <p>Loading recipe details...</p>
            )}
        </div>
    );
};

export default RecipeDetails;

