import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Store } from "../Store";
import FeedItem from "../components/FeedItem";

const Feed = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const headers = {
      Authorization: `Bearer ${userInfo.token}`,
    };

    axios
      .get("https://recipes-backend-id80.onrender.com/api/follow/recipes", {
        headers,
      })
      .then((response) => {
        setRecipes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching feed recipes:", error);
      });

    setIsLoading(false);
  }, [userInfo]);

  return (
    <div className="container-fluid customBg" style={{ minHeight: "100vh" }}>
      <Navbar />
      <div className="row mb-3">
        <div className="col" style={{ display: "flex", alignItems: "center" }}>
          <h2
            className="mainHeader"
            style={{ width: "100%", textAlign: "center" }}
          >
            Recipes Feed
          </h2>
        </div>
      </div>
      {isLoading && (
        <div className="text-center">
          <p>Loading...</p>
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {recipes.length > 0 ? (
        <div className="row row-cols-1 row-cols-md-3 m-2 feedRow">
          {recipes.map((recipe) => (
            <FeedItem
              recipe={recipe.recipe}
              user={recipe.user}
              key={recipe.recipe.id}
            />
          ))}
        </div>
      ) : (
        <p className="errorMessage">No recipes from followed users.</p>
      )}
    </div>
  );
};
export default Feed;
