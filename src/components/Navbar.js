import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ChefsFeedImage from "../images/ChefsFeed.png";
import NavDropdown from "react-bootstrap/NavDropdown";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = () => {
  /*   const [recipes, setRecipes] = useState([]);
 
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const filteredUsers = users.filter(
    (user) =>
      //user.username.toLowerCase().includes(searchTerm.toLowerCase())
      currentUser &&
      user.id !== currentUser.id &&
      user.username.toLowerCase().startsWith(searchTerm.toLowerCase())
  ); */
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const baseUrl = window.location.origin;
  const [currentUser, setCurrentUser] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [foundUsers, setFoundUsers] = useState([]);
  const [foundRecipes, setFoundRecipes] = useState([]);
  useEffect(() => {
    if (localStorage.getItem("user")) {
      const token = localStorage.getItem("jwtToken");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      axios
        .get("/api/account/current", { headers })
        .then((response) => {
          setCurrentUser(response.data);
        })
        .catch((error) => {
          console.error("Error fetching current user:", error);
        });
      /*
      axios
        .get("/api/follow/recipes", { headers })
        .then((response) => {
          setRecipes(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error fetching feed recipes:", error);
        });

      axios
        .get("/api/account/allUsers", { headers })
        .then((response) => {
          setUsers(response.data);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });*/
    }
  }, []);

  useEffect(() => {
    if (searchText.length > 0) {
      const token = localStorage.getItem("jwtToken");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      axios
        .get(`/api/account/search?text=${searchText}`, { headers })
        .then((response) => {
          setFoundUsers(response.data);
        })
        .catch((error) => {
          console.error("Error fetching searched users:", error);
        });

      axios
        .get(`/api/recipes/search?text=${searchText}`, { headers })
        .then((response) => {
          setFoundRecipes(response.data);
        })
        .catch((error) => {
          console.error("Error fetching searched recipes:", error);
        });
    }
  }, [searchText]);

  const signoutHandler = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("jwtToken");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light sticky-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src={ChefsFeedImage} alt="Logo" height="30" />
        </Link>
        {user && (
          <>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <input
                  className="searchNav"
                  type="search"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search..."
                ></input>
                <li className="nav-item">
                  <Link to="/recipeForm" className="nav-link">
                    Recipe Form
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/recipeDetails/1" className="nav-link">
                    Recipe Details
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/followingList" className="nav-link">
                    Following List
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/feed" className="nav-link">
                    Feed
                  </Link>
                </li>
                <li className="nav-item">
                  <div className="currentLogged">
                    <NavDropdown
                      id="basic-nav-dropdown"
                      title={
                        <img
                          src={
                            currentUser && currentUser.profilePictureId != null
                              ? `${currentUser.userImage}`
                              : `${baseUrl}/default.jpg`
                          }
                          alt="profile"
                        />
                      }
                    >
                      <NavDropdown.Item
                        onClick={() => {
                          navigate("/userProfile");
                        }}
                      >
                        Профил
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item onClick={signoutHandler}>
                        Logout
                      </NavDropdown.Item>
                    </NavDropdown>
                  </div>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
      <div>
        {searchText.length > 0 &&
          foundUsers &&
          foundUsers.map((u) => <h3 key={u.id}>{u.username}</h3>)}
        {searchText.length > 0 &&
          foundRecipes &&
          foundRecipes.map((r) => <h3 key={r.id}>{r.name}</h3>)}
      </div>
    </nav>
  );
};

export default Navbar;
