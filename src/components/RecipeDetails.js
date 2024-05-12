import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { Button } from "react-bootstrap";
import { render } from "@testing-library/react";
import Favorites from "../images/favorites.svg";
import timer from '../images/Timer.png';
import forknknife from '../images/ForkKnife.png';
import level from '../images/levels-svgrepo-com.svg';
import flag from '../images/flag-black-shape-svgrepo-com.svg';
import share from '../images/share.png';
import print from '../images/printer.png';
import imageFood1 from '../images/image 26.png';
import imageFood2 from '../images/image 26 (1).png';
import imageFood3 from '../images/image 26 (2).png';
import imageFood4 from '../images/image3.png';
import imageFood5 from '../images/image4.png';
import imageFood6 from '../images/image5.png';
import imageFood7 from '../images/image6.png';
const baseUrl = window.location.origin;

const RecipeDetails = () => {
  const [currentDate, setCurrentDate] = useState('');
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
  const [randomCalories, setRandomCalories] = useState(0);
  const [randomFat, setRandomFat] = useState(0);
  const [randomProtein, setRandomProtein] = useState(0);
  const [randomCarboh, setRandomCarboh] = useState(0);
  const [randomChole, setRandomChole] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = [imageFood4, imageFood5, imageFood6, imageFood7];

  const nextSlide = () => {
    console.log("Next slide clicked");
    setCurrentSlide((prevSlide) => (prevSlide === images.length - 1 ? 0 : prevSlide + 1));
  };

  const prevSlide = () => {
    console.log("Previous slide clicked");
    setCurrentSlide((prevSlide) => (prevSlide === 0 ? images.length - 1 : prevSlide - 1));
  };

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

    const getCurrentDate = () => {
      const date = new Date();
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    };

    const min = 200;
    const max = 1000;
    const randomCalories = ((Math.random() * (max - min)) + min).toFixed(2);

    const minFat = 20;
    const maxFat = 50;
    const randomFat = ((Math.random() * (maxFat - minFat)) + minFat).toFixed(2);

    const minProtein = 50;
    const maxProtein = 300;
    const randomProtein = ((Math.random() * (maxProtein - minProtein)) + minProtein).toFixed(2);


    const minCarboh = 20;
    const maxCarboh = 100;
    const randomCarboh = ((Math.random() * (maxCarboh - minCarboh)) + minCarboh).toFixed(2);


    const minChole = 30;
    const maxChole = 100;
    const randomChole = ((Math.random() * (maxChole - minChole)) + minChole).toFixed(2);

    setRandomCalories(randomCalories);
    setRandomFat(randomFat);
    setRandomProtein(randomProtein);
    setRandomCarboh(randomCarboh);
    setRandomChole(randomChole);
    setCurrentDate(getCurrentDate());
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
      .then(() => { })
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

    window.location.reload();
  };

  return (
    <div className="container-fluid">
      <Navbar />
      <div className="container mb-4">
        {recipe ? (
          <div>
            <div className="info-details mt-4">
              <h1 className="recipe-name">{recipe.name}</h1>
              <div className="recipeBoxDetails">
                <div className="detailsMins">
                  <div className="createdBy">
                    <img
                      src={recipeUserImage}
                      alt={recipe.user.username}
                      className="recipe-user-image"
                    />
                    <div className="usernameFlex">
                      <p className="recipe-by"><b>{recipe.user.username}</b></p>
                      <small>{currentDate}</small>
                    </div>
                  </div>

                  <div className="prepTime">
                    <img src={timer}></img>

                    <div className="usernameFlex">
                      <p className="recipe-by"><b>PREP TIME</b></p>
                      <small>{recipe.prep} Minutes</small>
                    </div>
                  </div>

                  <div className="cookTime">
                    <img src={timer}></img>
                    <div className="usernameFlex">
                      <p className="recipe-by"><b>COOK TIME</b></p>
                      <small>{recipe.cook} Minutes</small>
                    </div>
                  </div>

                  <div className="levels">
                    <img src={level} style={{ width: '20px', height: '20px' }} />
                    <div className="usernameFlex">
                      <p className="recipe-by"><b>LEVEL</b></p>
                      <small>{recipe.level}</small>
                    </div>
                  </div>

                  <div className="servings">
                    <img src={forknknife}></img>
                    <div className="usernameFlex">
                      <p className="recipe-by"><b>SERVINGS</b></p>
                      <small>{recipe.yield} Servings</small>
                    </div>
                  </div>

                  <div className="final">
                    <img src={flag} style={{ width: '20px', height: '20px' }} ></img>
                    <div className="usernameFlex">
                      <p className="recipe-by"><b>TOTAL</b></p>
                      <small>{recipe.total} Minutes</small>
                    </div>
                  </div>
                </div>

                <div className="actionShareBtn">
                  <a className="shareBtn"><img src={print}></img></a>
                  <a className="shareBtn"><img src={share}></img></a>
                  <Button className="button-fav" onClick={saveRecipe}> <img src={Favorites} /> Save recipe</Button>
                </div>
              </div>
              {/* <div className="reviews-details">
                <div className="stars-details">
               
                  {Array.from({ length: 5 }, (_, index) => (
                    <span
                      key={index}
                      className={`star ${index < recipe.rating ? "filled" : ""}`}
                    >
                      &#9733;
                    </span>
                  ))}
                </div>
                <p className="reviews-count">Reviews: {reviews}</p>
              </div> */}
            </div>

            {/* Recipe timing and rating */}
            <div className="numbered-timing mt-2">

              <div className="second-time newRating">
                <p>Rating: <span>{parseFloat(recipe.rating).toFixed(2)}</span></p>
                {Array.from({ length: 5 }, (_, index) => (
                  <span
                    key={index}
                    className={`star ${index < recipe.rating ? "filled" : ""}`}
                  >
                    &#9733;
                  </span>
                ))}
              </div>
            </div>

            <div className="mainSection mt-3">
              <div className="recipeNewImage">
                <img src={"data:" + recipe.picture.contentType + ";base64," + recipe.picture.imageData}></img>
              </div>

              <div className="nutrition">
                <h4>Nutrition Information</h4>

                <div className="item">
                  <p>Calories</p>
                  <span>{randomCalories} kcal</span>
                </div>

                <div className="item">
                  <p>Total Fat</p>
                  <span>{randomFat} g</span>
                </div>

                <div className="item">
                  <p>Protein</p>
                  <span>{randomProtein} g</span>
                </div>

                <div className="item">
                  <p>Carbohydrate</p>
                  <span>{randomCarboh} g</span>
                </div>

                <div className="item">
                  <p>Cholesterol</p>
                  <span>{randomChole} mg</span>
                </div>
                <p className="disclaimerText">This recipe is considured to be healty</p>
              </div>
            </div>

            {/* Recipe description and ingredients */}
            <div className="description-for-recipe mt-4">
              <div className="flex-items">
                <div className="directions">
                  <h5>Directions</h5>
                  <p>{recipe.description}</p>
                </div>
                <div className="groupedClasses">
                  <div className="ingredients">
                    <h5>Ingredients:</h5>
                    <ul>
                      {recipe.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="recommendedBox">
                    <h3>Other Recipe</h3>
                    <ul>
                      <li>
                        <img src={imageFood1}></img>
                        <span>
                          <h5>Chicken Meatball with Creamy Chees...</h5>
                          <p>By Ivana Dimitrova</p>
                        </span>
                      </li>

                      <li>
                        <img src={imageFood2}></img>
                        <span>
                          <h5>The Creamiest Creamy Chicken an...</h5>
                          <p>By Nace Gjorgievski</p>
                        </span>
                      </li>

                      <li>
                        <img src={imageFood3}></img>
                        <span>
                          <h5>Chicken Meatball with Creamy Chees...</h5>
                          <p>By Stojan Malev</p>
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

              </div>
            </div>

            {/* User rating and save recipe button */}
            {currentUser && currentUser.id !== recipe.user.id && (
              <div className="your-rating mt-4">
                <h5>Your rating:</h5>
                {Array.from({ length: 5 }, (_, index) => (
                  <span
                    key={index}
                    onClick={() => gradeRecipe(index + 1)}
                    className={`star ${index < recipeGrade ? "filled" : ""}`}
                  >
                    &#9733;
                  </span>
                ))}
             
              </div>
            )}

            {/* Comment section */}
            <h3 className="comment-heading mt-4">Comment</h3>
            <div className="comment-form">
              <img
                src={
                  currentUser && currentUser.profilePictureId != null
                    ? `${currentUser.userImage}`
                    : `${baseUrl}/default.jpg`
                }
                alt="profile"
                className="comment-profile-image"
              />
              <form onSubmit={addCommentHandler}>
                <textarea
                  type="text"
                  placeholder="Did you make this recipe? Leave a review!"
                  name="comment"
                  className="comment-input"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)} />
                <Button type="submit" className="post-review-btn">Post review</Button>
              </form>
            </div>

            {/* Display comments */}
            <h2 className="comments-heading mt-4">Comments</h2>
            <div className="commentsSection">

              {comments &&
                comments.map((c) => (
                  <div key={c.id}><b>Commented:</b> {c.content}</div>
                ))}
            </div>

            {/* Recipe action buttons for the recipe owner */}
            {currentUser && currentUser.id === recipe.user.id && (
              <div className="recipe-action-btns mt-4">
                <button className="btn-edit" onClick={handleEdit}>
                  Edit
                </button>
                <button className="btn-delete" onClick={handleDelete}>
                  Delete
                </button>
              </div>
            )}

            <div className="image-slider">
              <div className="cardItemFood">
                <img src={imageFood4}></img>
                <h5>Mixed Tropical Fruit Salad with Superfood Boosts</h5>
                <span>
                  <div>
                    <img src={timer}></img>
                    <p>15 minutes</p>
                  </div>
                  <div>
                    <img src={forknknife}></img>
                    <p>Healty</p>
                  </div>
                </span>
              </div>

              <div className="cardItemFood">
                <img src={imageFood5}></img>
                <h5>Mixed Tropical Fruit Salad with Superfood Boosts</h5>
                <span>
                  <div>
                    <img src={timer}></img>
                    <p>30 minutes</p>
                  </div>
                  <div>
                    <img src={forknknife}></img>
                    <p>Western</p>
                  </div>
                </span>
              </div>

              <div className="cardItemFood">
                <img src={imageFood6}></img>
                <h5>Mixed Tropical Fruit Salad with Superfood Boosts</h5>
                <span>
                  <div>
                    <img src={timer}></img>
                    <p>40 minutes</p>
                  </div>
                  <div>
                    <img src={forknknife}></img>
                    <p>Healty</p>
                  </div>
                </span>
              </div>

              <div className="cardItemFood">
                <img src={imageFood7}></img>
                <h5>Mixed Tropical Fruit Salad with Superfood Boosts</h5>
                <span>
                  <div>
                    <img src={timer}></img>
                    <p>50 minutes</p>
                  </div>
                  <div>
                    <img src={forknknife}></img>
                    <p>Eastern</p>
                  </div>
                </span>
              </div>
            </div>
          </div>
        ) : (
          <p className="loading-message mt-4">Loading recipe details...</p>
        )}
      </div>
    </div>
  );
};

export default RecipeDetails;
