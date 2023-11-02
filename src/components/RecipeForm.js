import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useParams} from "react-router-dom";
import { useNavigate } from 'react-router-dom';


function RecipeForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState({
        // Define the properties of the Recipe object here
        name: '',
        description: '',
        ingredients: [],
        // Add more properties as needed
    });

    const [photo, setPhoto] = useState(null);


    useEffect(() => {
        if (id) {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                // Handle the case where the token is not available
                console.error('JWT token not available.');
                return;
            }

            // Make an API request to fetch the recipe data based on the 'id'
            axios.get(`/api/recipes/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
                .then(response => {
                    console.log(response.data);
                    const fetchedRecipe = response.data;
                    setRecipe({
                        name: fetchedRecipe.name,
                        description: fetchedRecipe.description,
                        ingredients: fetchedRecipe.ingredients,
                    });
                    //setPhoto(fetchedRecipe.picture);
                    setPhoto(`data:${fetchedRecipe.picture.contentType};base64,${fetchedRecipe.picture.imageData}`);
                })
                .catch(error => {
                    console.error('Error fetching recipe data:', error);
                });
        }
    }, [id]);


    const handleIngredientChange = (e) => {
        const ingredientsArray = e.target.value.split('\n');
        setRecipe({ ...recipe, ingredients: ingredientsArray });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRecipe({
            ...recipe,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        setPhoto(e.target.files[0]);
    };

    const handleCreateOrUpdateRecipe = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', recipe.name);
        formData.append('description', recipe.description);
        formData.append('ingredients', recipe.ingredients.join('\n'));
        formData.append('photo', photo);

        const token = localStorage.getItem('jwtToken');

        try {
            if (id) {
                //edit action
                const response = await axios.put(`/api/recipes/${id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                console.log('Recipe updated:', response.data);
                navigate('/userProfile')
            } else {
                //add action
                const response = await axios.post('/api/recipes', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                console.log('Recipe created:', response.data);
                navigate('/userProfile')
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1>{id ? 'Edit Recipe' : 'Create Recipe'}</h1>
            <form>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={recipe.name}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <input
                        type="text"
                        name="description"
                        value={recipe.description}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Ingredients:</label>
                    <textarea
                        name="ingredients"
                        value={recipe.ingredients.join('\n')}
                        onChange={handleIngredientChange}
                    />
                </div>
                <div>
                    <label>Photo:</label>
                    <img src={photo} alt="Recipe" />
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                </div>
                <button onClick={handleCreateOrUpdateRecipe}>
                    {id ? 'Update Recipe' : 'Create Recipe'}
                </button>
            </form>
        </div>
    );
}

export default RecipeForm;
