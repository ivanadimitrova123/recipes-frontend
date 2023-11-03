import React, { useState } from 'react';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        Username: '',
        Password: '',
        Email: '',
        FirstName: '',
        LastName: '',
    });

    const handleInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/account/register', user);
            navigate(`/login`);
            console.log(response)
        } catch (error) {
            console.error('Registration error', error);
        }
    };
    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-7 bg-light" >

                </div>
                <div className="col-5">
                    <h2 className="mb-4">Register</h2>
                    <form onSubmit={handleRegister}>
                        <div className="mb-3">
                            <label htmlFor="FirstName" className="form-label">First Name:</label>
                            <input type="text" name="FirstName" value={user.FirstName} onChange={handleInputChange} className="form-control" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="LastName" className="form-label">Last Name:</label>
                            <input type="text" name="LastName" value={user.LastName} onChange={handleInputChange} className="form-control" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Username" className="form-label">Username:</label>
                            <input type="text" name="Username" value={user.Username} onChange={handleInputChange} className="form-control" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Email" className="form-label">Email:</label>
                            <input type="text" name="Email" value={user.Email} onChange={handleInputChange} className="form-control" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Password" className="form-label">Password:</label>
                            <input type="password" name="Password" value={user.Password} onChange={handleInputChange} className="form-control" />
                        </div>
                        <button type="submit" className="btn btn-primary">Register</button>
                    </form>
                    <p className="mt-3">Already have an account <Link to={"/login"} className="">Login</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;