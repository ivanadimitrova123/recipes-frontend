import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const Feed = () => {
  const [recipes, setRecipes] = useState([]);
  /* const [currentUser, setCurrentUser] = useState(null); */
  /* const [users, setUsers] = useState([]); */
  const [searchTerm, setSearchTerm] = useState("");
  /* const [filteredUsers, setFilteredUsers] = useState([]); */
  const currentUser = localStorage.getItem("user");
  /*   const filteredUsers = users.filter(
    (user) =>
      //user.username.toLowerCase().includes(searchTerm.toLowerCase())
      currentUser &&
      user.id !== currentUser.id &&
      user.username.toLowerCase().startsWith(searchTerm.toLowerCase())
  ); */

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    /*  axios.get('/api/account/current', { headers })
            .then((response) => {
                setCurrentUser(response.data);
                console.log(response.data)
            })
            .catch((error) => {
                console.error('Error fetching current user:', error);
            }); */

    axios
      .get("/api/follow/recipes", { headers })
      .then((response) => {
        setRecipes(response.data);
        /* console.log(response.data) */
      })
      .catch((error) => {
        console.error("Error fetching feed recipes:", error);
      });

    /*    axios
      .get("/api/account/allUsers", { headers })
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      }); */
  }, []);

  return (
    <div className="container-fluid customBg">
      <Navbar />
      <div className="row mb-3">
        <div className="col" style={{ display: "flex", alignItems: "center" }}>
          <h2 className="mainHeader" style={{width: '100%', textAlign: 'center'}}>Recipes Feed</h2>
        </div>
      </div>

      {searchTerm.length > 0 && (
        <div className="mb-3 row">
          <div className="col-2"></div>
          {/*       <div className="col-4">
            {filteredUsers.length > 0 ? (
              <ul className="list-group">
                {filteredUsers.map((user) => (
                  <li key={user.id} className="list-group-item">
                    <h5>
                      <Link
                        to={`/userProfile/${user.id}`}
                        className="text-decoration-none"
                      >
                        {user.username}
                      </Link>
                    </h5>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No users found with the specified username or part of it.</p>
            )}
          </div> */}
        </div>
      )}

{recipes.length > 0 ? (
  <div className="row row-cols-1 row-cols-md-3 m-2 feedRow">
    {recipes.map((recipe) => (
      <div
        key={recipe.recipe.id}
        className="col mb-4 card d-flex flex-column justify-content-between"
        style={{ position: 'relative' }}
      >
        <Link to={`/userProfile/${recipe.recipe.user.id}`} className="text-decoration-none">
          <div className="previewRecipe">
            <img
              src={recipe.userImage}
              alt="Profile"
              className="img-fluid rounded-circle"
              style={{ maxWidth: "50px", maxHeight: "50px" }}
            />
            <h3 style={{ display: "inline" }}>{recipe.recipe.user.username}</h3>
          </div>
        </Link>
        <Link to={`/recipeDetails/${recipe.recipe.id}`} className="text-decoration-none">
          <div style={{ overflow: "hidden", height: "300px" }}>
            <img
              src={recipe.recipeImage}
              alt="food"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "cover",
                height: "300px",
                width: "100%",
              }}
            />
          </div>
        </Link>
        <h5 className="mt-2">Recipe Name: {recipe.recipe.name}</h5>
        <div className="recipeRating">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index}>
              <span
                className={`star ${index < recipe.rating ? "filled" : ""}`}
              >
                ★
              </span>
            </div>
          ))}
          <div className="comments-section">
            <p>0</p> {/* You can replace this with the actual number of comments */}
          </div>
        </div>
      </div>
    ))}
  </div>
) : (
  <p className="errorMessage">No recipes from followed users.</p>
)}
    </div>
  );
};
export default Feed;
