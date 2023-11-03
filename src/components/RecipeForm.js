import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useParams} from "react-router-dom";
import { useNavigate } from 'react-router-dom';


function RecipeForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState({
        name: '',
        description: '',
        ingredients: [],
    });

    const [photo, setPhoto] = useState(null);


    useEffect(() => {
        if (id) {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                console.error('JWT token not available.');
                return;
            }
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
        const ingredientsArray = e.target.value.split('\n').map(ingredient => ingredient.trim());
        console.log(ingredientsArray)
        //const ingredientsArray = e.target.value.split('\n').filter((ingredient) => ingredient.trim() !== '');
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
        //formData.append('ingredients', recipe.ingredients.join('\n'));
        recipe.ingredients.forEach(ingredient => {
            formData.append('ingredients', ingredient);
        });
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
        <div className="container">
            <h1 className="mt-4">{id ? 'Edit Recipe' : 'Create Recipe'}</h1>
            <form>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={recipe.name}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <input
                        type="text"
                        name="description"
                        className="form-control"
                        value={recipe.description}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="ingredients">Ingredients:</label>
                    <textarea
                        name="ingredients"
                        className="form-control"
                        value={recipe.ingredients.join('\n')}
                        onChange={handleIngredientChange}
                    />
                </div>
                <div className="form-group mt-3">
                    <label htmlFor="photo">Photo:</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                </div>
                <button className="btn btn-primary mt-3" onClick={handleCreateOrUpdateRecipe}>
                    {id ? 'Update Recipe' : 'Create Recipe'}
                </button>
            </form>
        </div>
    );
}


export default RecipeForm;
