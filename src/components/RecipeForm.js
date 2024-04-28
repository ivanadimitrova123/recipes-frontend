import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function RecipeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [recipe, setRecipe] = useState({
    name: "",
    description: "",
    ingredients: "",
    level: "easy",
    prep: "",
    cook: "",
    total: "",
    yield: "",
  });

  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    if (id) {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        console.error("JWT token not available.");
        return;
      }
      axios
        .get(`/api/recipes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const fetchedRecipe = response.data.recipe;
          /*    setRecipe({
            name: fetchedRecipe.name,
            description: fetchedRecipe.description,
            ingredients: fetchedRecipe.ingredients,
          }); */
          setRecipe(fetchedRecipe);
          //setPhoto(fetchedRecipe.picture);
          setPhoto(
            `data:${fetchedRecipe.picture.contentType};base64,${fetchedRecipe.picture.imageData}`
          );
        })
        .catch((error) => {
          console.error("Error fetching recipe data:", error);
        });
    }
  }, [id]);

  const handleIngredientChange = (e) => {
    const ingredientsArray = e.target.value
      .split("\n")
      .map((ingredient) => ingredient.trim());
    console.log(ingredientsArray);
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
    formData.append("name", recipe.name);
    formData.append("description", recipe.description);
    formData.append("ingredients", [recipe.ingredients]);
    formData.append("level", recipe.level);
    formData.append("cook", recipe.cook);
    formData.append("prep", recipe.prep);
    formData.append("total", recipe.total);
    formData.append("yield", recipe.yield);
    //formData.append('ingredients', recipe.ingredients.join('\n'));
    /*  recipe.ingredients.forEach((ingredient) => {
      formData.append("ingredients", ingredient);
    }); */

    formData.append("photo", photo);

    const token = localStorage.getItem("jwtToken");

    try {
      if (id) {
        //edit action

        const response = await axios.put(`/api/recipes/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Recipe updated:", response.data);
        navigate("/userProfile");
      } else {
        //add action
        const response = await axios.post("/api/recipes", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Recipe created:", response.data);
        navigate("/userProfile");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container-fluid">
      <Navbar />
      <div className="container">
        <div className="form-group recipeHeader">
          <div
            className="recipePhotoCover"
            style={{
              height: "100%",
              backgroundImage: `url(${(recipe.picture && recipe.picture.fileName) || ""
                })`,
              backgroundSize: "cover", // Optional: Adjust the background size as per your requirement
              backgroundPosition: "center", // Optional: Adjust the background position as per your requirement
              // You can add more CSS properties here as needed
            }}
          >
            {/* <label htmlFor="photo">Photo:</label> */}
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          {/* {currentUser && (
                    <div>
                        <img src={currentUser.userImage} alt="profile"/>
                        <h4>{currentUser.username}</h4>
                    </div>
                )} */}
        </div>
        <div className="form-group">
          {/* <label htmlFor="name">Title Recipe:</label> */}
          <input
            type="text"
            name="name"
            className="form-control mt-3 recipeTitle"
            placeholder="Enter title of recepie"
            value={recipe.name}
            onChange={handleInputChange}
          />
        </div>
        <h3 className="mt-4">{id ? "Edit Recipe" : "Create Recipe"}</h3>
        <form className="recipeDetailsForm">
          <div className="row">
            <div className="col-sm">
              <div className="form-group selectorGroup">
                <label htmlFor="form-select">Level: </label>
                <select
                  className="form-select"
                  name="form-select"
                  aria-label="Default select example"
                  value={recipe.level}
                  onChange={(e) => {
                    setRecipe({
                      ...recipe,
                      level: e.target.value,
                    });
                  }}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
            <div className="col-sm">
              <div className="form-group selectorGroup">
                <label>Prep: </label>
                <input
                  type="number"
                  name="prep"
                  value={recipe.prep}
                  onChange={handleInputChange}
                ></input>
                min
              </div>
            </div>
            <div className="col-sm">
              <div className="form-group selectorGroup">
                <label>Cook: </label>
                <input
                  type="number"
                  name="cook"
                  value={recipe.cook}
                  onChange={handleInputChange}
                ></input>
                min
              </div>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-sm">
              <div className="form-group selectorGroup">
                <label>Total: </label>
                <input
                  type="number"
                  name="total"
                  value={recipe.total}
                  onChange={handleInputChange}
                ></input>
                min
              </div>
            </div>
            <div className="col-sm">
              <div className="form-group selectorGroup">
                <label>Yield: </label>
                <input
                  type="text"
                  name="yield"
                  value={recipe.yield}
                  onChange={handleInputChange}
                ></input>
              </div>
            </div>
          </div>
          <div className="ingredientAndDesc">
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
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
                value={recipe.ingredients}
                //onChange={handleIngredientChange}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <button
            className="btn btn-danger mt-5"
            onClick={handleCreateOrUpdateRecipe}
          >
            {id ? "Update Recipe" : "Create Recipe"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RecipeForm;
