import React, { useContext } from "react";
import flag from "../images/flag-black-shape-svgrepo-com.svg";
import { Store } from "../Store";
import axios from "axios";
import { toast } from "react-toastify";

const Comment = ({ comment, deleteHandler }) => {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const reportHandler = async () => {
    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${userInfo.user.id}`,
    };

    const formData = new FormData();
    formData.append("userId", userInfo.user.id);
    formData.append("commentId", comment.commentId);

    axios
      .post(`https://recipes-backend-id80.onrender.com/api/report`, formData, {
        headers,
      })
      .then((response) => {
        toast.success(response.data);
      })
      .catch((error) => {
        console.error("Error deleting recipe:", error);
      });
  };

  return (
    <div
      key={comment.id}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <img
          src={comment.userImage}
          style={{ width: "40px", height: "40px", borderRadius: "50%" }}
          alt="profile"
        />
        <b style={{ marginLeft: "5px" }}>{comment.username}</b>
        <p>{comment.content}</p>
      </div>
      {userInfo.user.username !== comment.username ? (
        <img
          onClick={reportHandler}
          src={flag}
          alt="report"
          style={{
            width: "20px",
            height: "20px",
            marginRight: "20px",
            cursor: "pointer",
          }}
        />
      ) : (
        <button
          className="btn btn-danger"
          onClick={() => deleteHandler(comment.commentId)}
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default Comment;
