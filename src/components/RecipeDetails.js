import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

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
        <div className="container-fluid">
          <Navbar />
          {recipe ? (
            <div>
              <div
                className="recipe-background"
                style={{
                  backgroundImage: `url(${recipe.picture.fileName.replace("images", "image")})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  minHeight: "300px", // Adjust the height as needed
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.8)", // Adjust the opacity as needed
                    padding: "20px",
                    borderRadius: "10px",
                    textAlign: "center",
                  }}
                >
                  <img
                    src={recipe.user.profileImage} // Replace with the path to the user's profile image
                    alt={recipe.user.username}
                    style={{
                      width: "50px", // Adjust the size as needed
                      height: "50px", // Adjust the size as needed
                      borderRadius: "50%",
                      marginBottom: "10px",
                    }}
                  />
                  <p>Recipe by {recipe.user.username}</p>
                </div>
              </div>
              <div className="mt-4">
                <h3>Name: {recipe.name}</h3>
              </div>
              <div className="mt-4">
                <p>Description: {recipe.description}</p>
              </div>
              {/* Add other sections (ratings, level, prep, yield, total, cook) here */}
              <div className="mt-4">
                <h3>Ingredients:</h3>
                <ul>
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
              {/* Add other sections (directions) here */}
              {currentUser && currentUser.id === recipe.user.id && (
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

