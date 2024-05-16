import React from "react";
import imageFood4 from "../images/image3.png";
import imageFood5 from "../images/image4.png";
import imageFood6 from "../images/image5.png";
import imageFood7 from "../images/image6.png";
import timer from "../images/Timer.png";
import level from "../images/levels-svgrepo-com.svg";
import forknknife from "../images/ForkKnife.png";
import { useNavigate } from "react-router-dom";

const RecomendedRecipes = ({ recipes }) => {
  const navigate = useNavigate();
  // const images = [imageFood4, imageFood5, imageFood6, imageFood7];
  return (
    <>
      <h3>Recomended Recipes</h3>
      <div className="image-slider">
        {recipes &&
          recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="cardItemFood"
              onClick={() => navigate(`/recipeDetails/${recipe.id}`)}
            >
              <img
                src={recipe.img}
                alt="food"
                style={{ width: "19rem", height: "15rem" }}
              ></img>
              <h5>{recipe.name}</h5>
              <span>
                <div>
                  <img src={timer} alt="timer"></img>
                  <p>{recipe.total}</p>
                </div>
                <div>
                  <img src={forknknife} alt="fork and knife"></img>
                  <p>{recipe.level}</p>
                </div>
              </span>
            </div>
          ))}
        {/* <div className="cardItemFood">
          <img src={imageFood4} alt="food"></img>
          <h5>Mixed Tropical Fruit Salad with Superfood Boosts</h5>
          <span>
            <div>
              <img src={timer} alt="timer"></img>
              <p>15 minutes</p>
            </div>
            <div>
              <img src={level} alt="fork and knife"></img>
              <p>Healty</p>
            </div>
          </span>
        </div>

        <div className="cardItemFood">
          <img src={imageFood5} alt="food"></img>
          <h5>Mixed Tropical Fruit Salad with Superfood Boosts</h5>
          <span>
            <div>
              <img src={timer} alt="clock"></img>
              <p>30 minutes</p>
            </div>
            <div>
              <img src={forknknife} alt="fork and knife"></img>
              <p>Western</p>
            </div>
          </span>
        </div>

        <div className="cardItemFood">
          <img src={imageFood6} alt="food"></img>
          <h5>Mixed Tropical Fruit Salad with Superfood Boosts</h5>
          <span>
            <div>
              <img src={timer} alt="clock"></img>
              <p>40 minutes</p>
            </div>
            <div>
              <img src={forknknife} alt="fork and knife"></img>
              <p>Healty</p>
            </div>
          </span>
        </div>

        <div className="cardItemFood">
          <img src={imageFood7} alt="food"></img>
          <h5>Mixed Tropical Fruit Salad with Superfood Boosts</h5>
          <span>
            <div>
              <img src={timer} alt="clock"></img>
              <p>50 minutes</p>
            </div>
            <div>
              <img src={forknknife} alt="fork and knife"></img>
              <p>Eastern</p>
            </div>
          </span>
        </div> */}
      </div>
    </>
  );
};

export default RecomendedRecipes;
