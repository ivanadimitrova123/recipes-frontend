import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Store } from "../Store";

function FollowingList() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [followingUsers, setFollowingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchFollowingUsers = async () => {
      const headers = {
        Authorization: `Bearer ${userInfo.token}`,
      };
      try {
        const response = await axios.get("/api/follow/following", { headers });
        setFollowingUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching following users:", error);
      }
    };
    fetchFollowingUsers();
    if (refresh === true) {
      setRefresh(false);
    }
  }, [userInfo, refresh]);

  const handleUnfollow = async (followedUserId) => {
    const headers = {
      Authorization: `Bearer ${userInfo.token}`,
    };
    try {
      const response = await axios.delete(`/api/follow/${followedUserId}`, {
        headers,
      });
      setRefresh(true);
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  return (
    <div className="container-fluid">
      <Navbar />
      <h2>Following Users</h2>
      {loading ? (
        <p>Loading...</p>
      ) : followingUsers.length > 0 ? (
        <ul
          className="followingList"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {followingUsers.map((user) => (
            <li key={user.id} className="mt-3">
              <img
                src={user.picture}
                alt={user.username}
                style={{ width: "50px", height: "50px" }}
              />
              <h3>{user.username}</h3>

              <button
                className="btn btn-danger"
                onClick={() => handleUnfollow(user.id)}
              >
                Unfollow
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>You are not following any users.</p>
      )}
    </div>
  );
}

export default FollowingList;
