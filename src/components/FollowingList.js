import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FollowingList() {
    const [followingUsers, setFollowingUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFollowingUsers = async () => {
        const token = localStorage.getItem('jwtToken');
        const headers = {
            Authorization: `Bearer ${token}`,
        };
        try {
            const response = await axios.get('/api/follow/following',{headers});
            setFollowingUsers(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching following users:', error);
        }

    };

    useEffect(() => {
        fetchFollowingUsers();
    }, []);
    const handleUnfollow = async (followedUserId) => {
        const token = localStorage.getItem('jwtToken');
        const headers = {
            Authorization: `Bearer ${token}`,
        };
        try {
            const response = await axios.delete(`/api/follow/${followedUserId}`,{headers});
            fetchFollowingUsers();
        } catch (error) {
            console.error('Error unfollowing user:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Following Users</h2>
            {loading ? (
                <p>Loading...</p>
            ) : followingUsers.length > 0 ? (
                <ul>
                    {followingUsers.map((user) => (
                        <li key={user.id}>
                            <h3>{user.username}</h3>
                            <button className="btn btn-danger" onClick={() => handleUnfollow(user.id)}>Unfollow</button>
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
