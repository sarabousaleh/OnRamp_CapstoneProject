import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { signup } from '../../api'; 
import './SignInPage.css';

const SignupForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password_hash: '',
        firstname: '',
        lastname: '',
        dob: '',
        gender: '',
        email: '',
        nationality: '',
        telephoneNumber: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signup(formData);
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className='signin-container'>
            <h1 className='h1-design'>Sign Up</h1>
            <form onSubmit={handleSubmit} className='signin-form'>
                <div className='form-group'>
                    <label htmlFor='username'>Username:</label>
                    <input type='text' name='username' onChange={handleChange} />
                </div>
                <div className='form-group'>
                    <label htmlFor='password'>Password:</label>
                    <input type='password' name='password_hash' onChange={handleChange} />
                </div>
                <div className='form-group'>
                    <label htmlFor='firstname'>First Name:</label>
                    <input type='text' name='firstname' onChange={handleChange} />
                </div>
                <div className='form-group'>
                    <label htmlFor='lastname'>Last Name:</label>
                    <input type='text' name='lastname' onChange={handleChange} />
                </div>
                <div className='form-group'>
                    <label htmlFor='dob'>Date of Birth:</label>
                    <input type='date' name='dob' onChange={handleChange} />
                </div>
                <div className='form-group'>
                    <label htmlFor='gender'>Gender:</label>
                    <select name='gender' onChange={handleChange}>
                        <option value=''></option>
                        <option value='male'>Male</option>
                        <option value='female'>Female</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='email'>Email:</label>
                    <input type='email' name='email' onChange={handleChange} />
                </div>
                <div className='form-group'>
                    <label htmlFor='nationality'>Nationality:</label>
                    <input type='text' name='nationality' onChange={handleChange} />
                </div>
                <div className='form-group'>
                    <label htmlFor='telephoneNumber'>Telephone Number:</label>
                    <input type='tel' name='telephoneNumber' onChange={handleChange} />
                </div>
                <button className='signin-button' type='submit'>Sign Up</button>
                <Link className="login-link" to="/LogInPage">Already have an account? Log In!</Link> 
            </form>
        </div>
    );
};

export default SignupForm;
