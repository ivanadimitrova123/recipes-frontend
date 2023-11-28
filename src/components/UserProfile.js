import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

function UserProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [isCurrentUser, setIsCurrentUser] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        if (id) {
            // TEST123
            // Fetch the user profile by ID if 'id' parameter exists
            fetch(`/api/account/user/${id}`, { headers })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then((data) => {
                    setUser(data);
                    console.log(data)
                })
                .catch((error) => {
                    // Handle the error
                });
        } else {
            //  current user's profile
            fetch("/api/account/current", { headers })
                .then((response) => {
                    if (!response.ok) {
                        throw Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then((data) => {
                    setUser(data);
                    console.log(data)
                    setIsCurrentUser(true);
                })
                .catch((error) => {
                    // Handle the error
                });
        }
    }, [id]);

    const handleFollowing = () => {
        navigate(`/followingList`);
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
                // Handle the success case (e.g., show a success message)
                console.log("You are now following this user.");
                navigate('/feed')
            } else {
                // Handle any errors
                console.error("Failed to follow this user.");
            }
        } catch (error) {
            // Handle network errors
            console.error("Network error:", error);
        }
    };
    const handleUnfollow = async () => {
        const token = localStorage.getItem('jwtToken');
        const headers = {
            Authorization: `Bearer ${token}`,
        };
        try {
            await axios.delete(`/api/follow/${user.id}`, { headers });
            navigate('/feed')

        } catch (error) {
            console.error('Error unfollowing user:', error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-6">
                        <div>
                            <img src={user.userImage} alt="Profile Picture" className="img-fluid"
                                 style={{
                                     maxWidth: "150px",
                                     maxHeight: "150px",
                                 }}/>
                        </div>
                    {isCurrentUser && (
                        <Link to="/addProfilePicture" className=" mt-4">
                            Change Profile Picture
                        </Link>
                    )}
                </div>
                <div className="col-6">
                    {user && (
                        <div>
                            <h2>Username: {user.username}</h2>
                        </div>
                    )}
                    {isCurrentUser && (
                        <div>
                            <Link to="/recipeForm" className="btn btn-primary mt-3 me-3">
                                Add Recipe
                            </Link>
                            <button className="btn btn-primary mt-3" onClick={handleFollowing}>Following List</button>
                        </div>
                    )}
                    {!isCurrentUser && (
                        <div>
                            <button onClick={handleFollow} className="btn btn-primary me-3">Follow</button>
                            <button onClick={handleUnfollow} className="btn btn-danger">Unfollow</button>
                        </div>
                    )}
                </div>
            </div>


            {user.recipes && user.recipes.length > 0 && (
                <div className="row mt-5">
                    {user.recipes.map((recipe) => (
                        <div key={recipe.id} className="col-md-4 mb-2 card  justify-content-center">
                            <Link to={`/recipeDetails/${recipe.id}`}>
                                <p>{recipe.name}</p>
                                <img src={recipe.recipeImage} alt="food"
                                     style={{
                                         maxWidth: "300px",
                                         maxHeight: "300px",
                                     }}
                                />
                            </Link>
                        </div>
                    ))}
                </div>

            )}

        </div>
    );
}

export default UserProfile;
