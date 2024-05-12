import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";

function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState("");
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const baseUrl = window.location.origin;

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const checkFollowStatus = async () => {
      console.log(headers);
      try {
        const response = await axios.get(`/api/follow/status/${id}`, {
          headers,
        });

        setIsFollowing(response.data);
      } catch (error) {
        console.log("here");
        console.error("Network error:", error);
      }
    };

    if (id) {
      fetch(`/api/account/user/${id}`, { headers })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setUser(data);
          checkFollowStatus();
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    } else {
      fetch("/api/account/current", { headers })
        .then((response) => {
          if (!response.ok) {
            throw Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setUser(data);
          setIsCurrentUser(true);
        })
        .catch((error) => {
          console.error("Error fetching current user data:", error);
        });
    }
  }, [id]);

  const handleFollowing = () => {
    navigate(`/followingList`);
  };

  const handleRatingClick = (recipeIndex, starIndex) => {
    // For simplicity, let's assume that recipes have a 'rating' property
    const updatedRecipes = [...user.recipes];
    updatedRecipes[recipeIndex].rating = starIndex + 1; // 1-based index
    setUser({ ...user, recipes: updatedRecipes });
  };

  const handleFollow = async () => {
    const token = localStorage.getItem("jwtToken");
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await fetch(`/api/follow/${user.id}`, {
        method: "POST",
        headers: headers,
      });

      if (response.ok) {
        setIsFollowing(true);
        console.log("You are now following this user.");
      } else {
        console.error("Failed to follow this user.");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const handleUnfollow = async () => {
    const token = localStorage.getItem("jwtToken");
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    try {
      await axios.delete(`/api/follow/${user.id}`, { headers });
      setIsFollowing(false);
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  return (
   <div className="heightMore">
     <div className="container-fluid customBackground">
      <Navbar />
      <div className="container pt-5 userProfileContainer">
        <div className="row">
          <div className="col-4 leftPartProfile">
            <div className="centeredProfile">
              {id ? (
                <img
                  src={user.imageId ? user.userImage : `${baseUrl}/default.jpg`}
                  alt="Profile"
                  className="img-fluid"
                  style={{
                    maxWidth: "150px",
                    maxHeight: "130px",
                  }}
                />
              ) : (
                <img
                  src={
                    user.profilePictureId
                      ? user.userImage
                      : `${baseUrl}/default.jpg`
                  }
                  alt="Profile"
                  className="img-fluid rounded-circle"
                />
              )}

              {user && (
                <div>
                  <h2>{user.username}</h2>
                  {!isCurrentUser && (
                    <div className="theBtns">
                      {isFollowing ? (
                        <button
                          onClick={handleUnfollow}
                          className="btn btn-danger unfollowBtn"
                        >
                          Unfollow
                        </button>
                      ) : (
                        <button
                          onClick={handleFollow}
                          className="btn btn-primary followBtn"
                        >
                          Follow
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            {isCurrentUser && (
              <Link to="/addProfilePicture" className=" mt-4">
                Change Profile Picture
              </Link>
            )}
          </div>
          <div className="col-6">
            {user && (
              <div className="profileInfo">
                {/* <h2>Username: {user.username}</h2> */}
                <p>
                  <b>{user.recipes ? user.recipes.length : 0}</b> posts
                </p>
                <p>
                  <b>{user.following}</b> following
                </p>
                <p>
                  <b>{user.followers}</b> followers
                </p>
                {isCurrentUser && (
                  <div className="theBtns">
                    <Link to="/recipeForm" className="btn btn-danger">
                      <b>Add Recipe</b>
                    </Link>
                    <button
                      className="btn btn-primary "
                      onClick={handleFollowing}
                    >
                      <b>Following List</b>
                    </button>
                  </div>
                )}
              </div>
            )}

            {!user && (
              <div className="profileInfo">
                {/* <h2>Username: {user.username}</h2> */}
                <p>
                  <b>{currentUser.recipes ? currentUser.recipes.length : 0}</b>{" "}
                  posts
                </p>
                {/* TODO */}
                <p>
                  <b>{currentUser.following}</b> following
                </p>
                <p>
                  <b>{currentUser.followers}</b> followers
                </p>
                {isCurrentUser && (
                  <div className="theBtns">
                    <Link to="/recipeForm" className="btn btn-danger">
                      <b>Add Recipe</b>
                    </Link>
                    <button
                      className="btn btn-primary "
                      onClick={handleFollowing}
                    >
                      <b>Following List</b>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mt-4 cardGroup">
        <h2 className="text-start"><b>Posts</b></h2>
        {user.recipes && user.recipes.length <= 0 && (
          <h4 className="noPostText">Make your first <span><Link to="/recipeForm">post!</Link></span></h4>
        )};
          
        

        {user.recipes && user.recipes.length > 0 && (
          <div className="row mt-4 paddingBottom">
            {user.recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="col-md-5 mb-2 card d-flex flex-column justify-content-between"
                style={{ height: "100%", position: 'relative' }}
              >
                <Link to={`/recipeDetails/${recipe.id}`}>
                  <div className="previewRecipe">
                    <img
                      src={user.userImage}
                      alt="Profile"
                      className="img-fluid rounded-circle"
                    />
                    <p>{user.username}</p>
                  </div>
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
                  <p className="recipeName">{recipe.name}</p>
                </Link>
                <div className="recipeRating">
                  {Array.from({ length: 5 }, (_, index) => (
                    <div>
                        <span
                      key={index}
                      className={`star ${index < recipe.rating ? "filled" : ""}`}
                    >
                      ★
                    </span>
                    </div>
                  ))}

                  <div className="comments-section">
                    <p>0</p>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
   </div>
  );
}

export default UserProfile;
