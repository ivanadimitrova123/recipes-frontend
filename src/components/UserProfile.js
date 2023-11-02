/*import React, { useState, useEffect } from "react";
import {Link, useParams} from "react-router-dom";
import { useNavigate } from 'react-router-dom';

function UserProfile() {
    const { id } = useParams();
    const navigate=useNavigate();
    const [user, setUser] = useState({});
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        fetch("/api/account/current", {headers})
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                setUser(data.userData);
                setImageUrl(data.imageUrl);
            })
            .catch((error) => {
            });
    }, []);
    const handleFollowing = () => {
        navigate(`/followingList`);
    };


    return (
        <div className="container mt-5">
            <h1>User Profile</h1>
            {imageUrl && (
                <div>
                    <h4 className="card-subtitle mb-2 text-muted">Profile Picture</h4>
                    <img src={imageUrl} alt="Profile Picture" className="img-fluid"
                         style={{
                             maxWidth: "200px",
                             maxHeight: "200px",
                         }}/>
                </div>
            )}
            <Link to="/addProfilePicture" className="btn btn-secondary mt-3">
                Change Profile Picture
            </Link>
            {user && (
                <div>
                    <h4 className="card-subtitle mb-2 text-muted">User Information</h4>
                    <p>Username: {user.username}</p>
                    <p>First Name: {user.firstName}</p>
                    <p>Last Name: {user.lastName}</p>
                </div>
            )}
            {user.recipes && user.recipes.length > 0 && (
                <div className="card mt-4">
                    <div className="card-body">
                        <h2 className="card-title">My Recipes</h2>
                        <ul>
                            {user.recipes.map((recipe) => (
                                <li key={recipe.id}>
                                    <Link to={`/recipeDetails/${recipe.id}`}>{recipe.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>)}

            <Link to="/recipeForm" className="btn btn-primary mt-3">
                Add Recipe
            </Link>

            <button className="btn btn-primary mt-3" onClick={handleFollowing}>Following</button>

        </div>
    );
}

export default UserProfile;
*/
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

function UserProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [imageUrl, setImageUrl] = useState("");
    const [isCurrentUser, setIsCurrentUser] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        if (id) {
            // Fetch the user profile by ID if 'id' parameter exists
            fetch(`/api/account/user/${id}`, { headers })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then((data) => {
                    setUser(data.userData);
                    setImageUrl(data.imageUrl);
                })
                .catch((error) => {
                    // Handle the error
                });
        } else {
            // Fetch the current user's profile if 'id' parameter does not exist
            fetch("/api/account/current", { headers })
                .then((response) => {
                    if (!response.ok) {
                        throw Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then((data) => {
                    setUser(data.userData);
                    setImageUrl(data.imageUrl);
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
            } else {
                // Handle any errors
                console.error("Failed to follow this user.");
            }
        } catch (error) {
            // Handle network errors
            console.error("Network error:", error);
        }
    };

    return (
        <div className="container mt-5">
            <h1>User Profile</h1>
            {imageUrl && (
                <div>
                    <h4 className="card-subtitle mb-2 text-muted">Profile Picture</h4>
                    <img src={imageUrl} alt="Profile Picture" className="img-fluid"
                         style={{
                             maxWidth: "200px",
                             maxHeight: "200px",
                         }}/>
                </div>
            )}
            {isCurrentUser && (
            <Link to="/addProfilePicture" className="btn btn-secondary mt-3">
                Change Profile Picture
            </Link>
            )}
            {user && (
                <div>
                    <h4 className="card-subtitle mb-2 text-muted">User Information</h4>
                    <p>Username: {user.username}</p>
                    <p>First Name: {user.firstName}</p>
                    <p>Last Name: {user.lastName}</p>
                </div>
            )}
            {user.recipes && user.recipes.length > 0 && (
                <div className="card mt-4">
                    <div className="card-body">
                        <h2 className="card-title">
                            {isCurrentUser ? "My Recipes" : `${user.firstName}'s Recipes`}
                        </h2>
                        <ul>
                            {user.recipes.map((recipe) => (
                                <li key={recipe.id}>
                                    <Link to={`/recipeDetails/${recipe.id}`}>{recipe.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
            {isCurrentUser && (
                <div>
                    <Link to="/recipeForm" className="btn btn-primary mt-3">
                        Add Recipe
                    </Link>
                    <button className="btn btn-primary mt-3" onClick={handleFollowing}>Following</button>
                </div>
            )}
            {!isCurrentUser && (
                <button onClick={handleFollow}>Follow</button>
            )}
        </div>
    );
}

export default UserProfile;
