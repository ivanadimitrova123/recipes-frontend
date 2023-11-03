import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [loginInfo, setLoginInfo] = useState({
        Username: '',
        Password: '',
    });
    const handleInputChange = (e) => {
        setLoginInfo({ ...loginInfo, [e.target.name]: e.target.value });
    };
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/account/login', loginInfo);
            if (response.status === 200) {
                localStorage.setItem('jwtToken', response.data.token);
                console.log('Login successful', response.data);
                navigate(`/feed`);
            }
        } catch (error) {
            console.error('Login error', error);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div className="mb-3">
                    <label htmlFor="Username" className="form-label">Username or Email:</label>
                    <input type="text" name="Username" value={loginInfo.Username} onChange={handleInputChange} className="form-control" />
                </div>
                <div className="mb-3">
                    <label htmlFor="Password" className="form-label">Password:</label>
                    <input type="password" name="Password" value={loginInfo.Password} onChange={handleInputChange} className="form-control" />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    );
};

export default Login;

