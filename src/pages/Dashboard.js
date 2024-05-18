import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Store } from "../Store";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";

const Dashboard = () => {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [comments, setComments] = useState([]);
  const [commentsIsLoading, setCommentsIsLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [recipesIsLoading, setRecipesIsLoading] = useState(false);
  const [commentRefesh, setCommentRefesh] = useState(false);
  const [commentAllowLoading, setCommentAllowLoading] = useState(false);
  const [commentDeleteLoading, setCommentDeleteLoading] = useState(false);
  const [recipeAllowLoading, setRecipeAllowLoading] = useState(false);
  const [recipeRefresh, setRecipeRefresh] = useState(false);

  const allowHandler = async (id) => {
    const headers = {
      Authorization: `Bearer ${userInfo.token}`,
    };
    setCommentAllowLoading(true);
    axios
      .delete(`https://recipes-backend-id80.onrender.com/api/report/${id}`, {
        headers,
      })
      .then(() => {
        setCommentAllowLoading(false);
      })
      .catch((error) => {
        setCommentAllowLoading(false);
        console.error("Error fetching feed recipes:", error);
      });
    setCommentRefesh(true);
  };

  const deleteHandler = async (id) => {
    setCommentDeleteLoading(true);
    const headers = {
      Authorization: `Bearer ${userInfo.token}`,
    };
    axios
      .delete(
        `https://recipes-backend-id80.onrender.com/api/report/delete/${id}`,
        { headers }
      )
      .then(() => {
        setCommentDeleteLoading(false);
      })
      .catch((error) => {
        setCommentDeleteLoading(false);
        console.error("Error fetching feed recipes:", error);
      });
    setCommentRefesh(true);
  };

  const allowRecipe = async (id) => {
    setRecipeAllowLoading(true);
    const headers = {
      Authorization: `Bearer ${userInfo.token}`,
    };
    axios
      .delete(
        `https://recipes-backend-id80.onrender.com/api/reportedrecipe/${id}`,
        { headers }
      )
      .then(() => {
        setRecipeAllowLoading(false);
      })
      .catch((error) => {
        setRecipeAllowLoading(false);
        console.error("Error fetching feed recipes:", error);
      });
    setRecipeRefresh(true);
  };

  useEffect(() => {
    setCommentsIsLoading(true);
    const headers = {
      Authorization: `Bearer ${userInfo.token}`,
    };

    axios
      .get("https://recipes-backend-id80.onrender.com/api/report", { headers })
      .then((response) => {
        setComments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching reported comments:", error);
      });

    if (commentRefesh) setCommentRefesh(false);
    setCommentsIsLoading(false);
  }, [commentRefesh, userInfo]);

  useEffect(() => {
    setRecipesIsLoading(true);
    const headers = {
      Authorization: `Bearer ${userInfo.token}`,
    };

    axios
      .get("https://recipes-backend-id80.onrender.com/api/reportedrecipe", {
        headers,
      })
      .then((response) => {
        setRecipes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching reported recipes:", error);
      });
    if (recipeRefresh) setRecipeRefresh(false);
    setRecipesIsLoading(false);
  }, [userInfo, recipeRefresh]);

  return (
    <div className="container-fluid customBg" style={{ minHeight: "100vh" }}>
      <Navbar />
      <div className="row mb-3">
        <div className="col" style={{ display: "flex", alignItems: "center" }}>
          <h2
            className="mainHeader"
            style={{ width: "100%", textAlign: "center" }}
          >
            Admin Dashboard
          </h2>
        </div>
      </div>
      <div
        className="mt-5"
        style={{ display: "flex", justifyContent: "space-evenly" }}
      >
        <div style={{ width: "40%" }}>
          <h2>Reported Comments</h2>
          {commentsIsLoading && (
            <div className="text-center">
              <p>Loading...</p>
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          {comments &&
            comments.map((c) => (
              <div
                className="mt-3"
                key={c.commentId}
                style={{
                  border: "1px solid black",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px",
                }}
              >
                <div>
                  <img
                    src={c.user.picture}
                    alt="profile"
                    style={{ width: "30px", height: "30px" }}
                  />
                  <b className="ms-2">{c.user.username}</b>
                  <p>{c.comment.content}</p>
                </div>
                <div>
                  <button
                    className="me-2 btn btn-primary"
                    onClick={() => allowHandler(c.commentId)}
                  >
                    {commentAllowLoading ? (
                      <Spinner style={{ width: "1rem", height: "1rem" }} />
                    ) : (
                      "Allow"
                    )}
                  </button>
                  <button
                    className="me-2 btn btn-danger"
                    onClick={() => deleteHandler(c.commentId)}
                  >
                    {commentDeleteLoading ? (
                      <Spinner style={{ width: "1rem", height: "1rem" }} />
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </div>
            ))}
        </div>
        <div style={{ width: "40%" }}>
          <h2>Reported Recipes</h2>
          {recipesIsLoading && (
            <div className="text-center">
              <p>Loading...</p>
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          {recipes &&
            recipes.map((r) => (
              <div
                className="mt-3"
                key={r.recipeId}
                style={{
                  border: "1px solid black",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px",
                }}
              >
                <div>
                  <img
                    src={r.img}
                    alt="profile"
                    style={{ width: "30px", height: "30px" }}
                  />
                  <b className="ms-2">{r.name}</b>
                </div>
                <div>
                  <button
                    className="me-2 btn btn-primary"
                    onClick={() => allowRecipe(r.recipeId)}
                  >
                    {recipeAllowLoading ? (
                      <Spinner style={{ width: "1rem", height: "1rem" }} />
                    ) : (
                      "Allow"
                    )}
                  </button>
                  <button
                    className="me-2 btn btn-primary"
                    onClick={() => navigate(`/recipeDetails/${r.recipeId}`)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
