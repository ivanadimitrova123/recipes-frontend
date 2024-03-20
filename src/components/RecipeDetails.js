import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { Button } from "react-bootstrap";
import { render } from "@testing-library/react";

const RecipeDetails = () => {
  const { id } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [recipeUserImage, setRecipeUserImage] = useState("");
  const [recipeGrade, setRecipeGrade] = useState("");
  const [reviews, setReviews] = useState("");
  const [rerender, setRerender] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // Fetch the current user's data
    axios
      .get("/api/account/current", { headers })
      .then((response) => {
        setCurrentUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching current user:", error);
      });

    axios
      .get(`/api/recipes/${id}`, { headers })
      .then((response) => {
        setRecipe(response.data.recipe);
        setRecipeUserImage(response.data.recipeUserImage);
      })
      .catch((error) => {
        console.error("Error fetching recipe details:", error);
      });
  }, [id]);

  useEffect(() => {
    if (currentUser && currentUser.id !== recipe.user.id) {
      const token = localStorage.getItem("jwtToken");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      axios
        .get(`/api/usergrades?userId=${currentUser.id}&recipeId=${recipe.id}`, {
          headers,
        })
        .then((response) => {
          setRecipeGrade(response.data.grade);
          setReviews(response.data.reviews);
        })
        .catch((error) => {
          console.error("Error fetching current user:", error);
        });
    }
  }, [currentUser, recipe]);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    if (recipe && recipe.id != null) {
      axios
        .get(`/api/comments/${recipe.id}`, { headers })
        .then((response) => setComments(response.data))
        .catch((error) => {
          console.error("Error fetching current user:", error);
        });
    }
  }, [recipe]);

  const handleEdit = () => {
    navigate(`/recipeForm/${id}`);
  };

  const handleDelete = () => {
    const token = localStorage.getItem("jwtToken");
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    axios
      .delete(`/api/recipes/${id}`, { headers })
      .then(() => {
        navigate("/userProfile");
      })
      .catch((error) => {
        console.error("Error deleting recipe:", error);
      });
  };

  const gradeRecipe = (grade) => {
    const token = localStorage.getItem("jwtToken");
    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    };

    const formData = new FormData();
    formData.append("userId", currentUser.id);
    formData.append("recipeId", recipe.id);
    formData.append("grade", grade);

    axios
      .post(`/api/usergrades`, formData, { headers })
      .then(() => {
        setRerender(!rerender);
      })
      .catch((error) => {
        console.error("Error Grading recipe:", error);
      });
  };

  const saveRecipe = () => {
    const token = localStorage.getItem("jwtToken");
    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    };

    const formData = new FormData();
    formData.append("userId", currentUser.id);
    formData.append("recipeId", recipe.id);

    axios
      .post(`/api/saverecipe`, formData, { headers })
      .then(() => {})
      .catch((error) => {
        console.error("Error Grading recipe:", error);
      });
  };

  const addCommentHandler = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");
    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    };

    const formData = new FormData();
    formData.append("UserId", currentUser.id);
    formData.append("RecipeId", recipe.id);
    formData.append("Content", commentText);

    axios
      .post(`/api/comments`, formData, { headers })
      .then(() => {
        setRerender(!render);
      })
      .catch((error) => {
        console.error("Error Grading recipe:", error);
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
              backgroundImage: `url(${recipe.picture.fileName.replace(
                "images",
                "image"
              )})`,
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
                src={recipeUserImage} // Replace with the path to the user's profile image
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
            {Array.from({ length: 5 }, (_, index) => (
              <span
                key={index}
                className={`star ${index < recipe.rating ? "filled" : ""}`}
              >
                &#9733;
              </span>
            ))}
            {`Reviews: ${reviews}`}
            <Button variant="danger" className="ms-5" onClick={saveRecipe}>
              Save recipe
            </Button>
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
          {currentUser && currentUser.id !== recipe.user.id && (
            <div>
              <h5>Your rating:</h5>
              {Array.from({ length: 5 }, (_, index) => (
                <span
                  key={index}
                  onClick={() => gradeRecipe(index + 1)}
                  style={{ cursor: "pointer" }}
                  className={`star ${index < recipeGrade ? "filled" : ""}`}
                >
                  &#9733;
                </span>
              ))}
            </div>
          )}

          <div>
            <h3>Comment</h3>
            <form onSubmit={addCommentHandler}>
              <input
                type="text"
                name="comment"
                onChange={(e) => setCommentText(e.target.value)}
              />
              <Button type="submit">Post Comment</Button>
            </form>
          </div>
          <div>
            <h2>Comments</h2>
            {comments &&
              comments.map((c) => (
                <div style={{ border: "1px solid black" }}>{c.content}</div>
              ))}
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
