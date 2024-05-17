import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Store } from "../Store";
import { Spinner } from "react-bootstrap";

function RecipeForm() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
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
      axios
        .get(`https://recipes-backend-id80.onrender.com/api/recipes/${id}`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        })
        .then((response) => {
          const fetchedRecipe = response.data.recipe;

          fetchedRecipe.ingredients = fetchedRecipe.ingredients.join("\n");
          setRecipe(fetchedRecipe);
          setPhoto(
            `data:${fetchedRecipe.picture.contentType};base64,${fetchedRecipe.picture.imageData}`
          );
        })
        .catch((error) => {
          console.error("Error fetching recipe data:", error);
        });
    }
  }, [userInfo, id]);

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
    if (
      recipe.name === "" ||
      recipe.description === "" ||
      photo === null ||
      recipe.ingredients === ""
    ) {
      alert("No empty fields allowed");
    }
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", recipe.name);
    formData.append("description", recipe.description);
    formData.append("ingredients", [recipe.ingredients]);
    formData.append("level", recipe.level);
    formData.append("cook", recipe.cook);
    formData.append("prep", recipe.prep);
    formData.append("total", parseInt(recipe.cook) + parseInt(recipe.prep));
    formData.append("yield", recipe.yield);
    formData.append("photo", photo);

    try {
      if (id) {
        const response = await axios.put(
          `https://recipes-backend-id80.onrender.com/api/recipes/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );

        setIsLoading(false);
        if (userInfo.user.role === "Admin") {
          navigate(`/admin/dashboard`);
        } else {
          navigate(`/userProfile/${userInfo.user.id}`);
        }
      } else {
        const response = await axios.post(
          "https://recipes-backend-id80.onrender.com/api/recipes",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
        setIsLoading(false);
        navigate(`/userProfile/${userInfo.user.id}`);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
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
              backgroundImage: `url(${
                (recipe.picture && recipe.picture.fileName) || ""
              })`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <label htmlFor="photo">Photo:</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
        </div>
        <div className="form-group">
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
                  disabled
                  value={parseInt(recipe.cook) + parseInt(recipe.prep)}
                  onChange={handleInputChange}
                ></input>
                min
              </div>
            </div>
            <div className="col-sm">
              <div className="form-group selectorGroup">
                <label>Yield: </label>
                <input
                  type="number"
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
                onChange={handleInputChange}
              />
            </div>
          </div>

          <button
            className="btn btn-danger mt-5"
            onClick={handleCreateOrUpdateRecipe}
          >
            {isLoading ? (
              <Spinner style={{ height: "1rem", width: "1rem" }} />
            ) : id ? (
              "Update Recipe"
            ) : (
              "Create Recipe"
            )}
            {/* {id ? "Update Recipe" : "Create Recipe"} */}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RecipeForm;
