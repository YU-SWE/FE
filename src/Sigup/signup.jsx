import React from 'react';
import useSignupForm from './useSignup';
import InputField from '../InputField';
import EmailVerification from './EmailVerification';
import './signup.css';

const SignupForm = () => {
    const {
        formData,
        verificationCode,
        isEmailSent,
        isEmailVerified,
        error,
        handleChange,
        sendVerificationEmail,
        verifyEmail,
        handleSubmit
    } = useSignupForm();

    return (
        <div className="signup-container">
            <form onSubmit={handleSubmit} className="signup-form">
                <h2>Sign Up</h2>
                <InputField
                    label="Name"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <EmailVerification
                    email={formData.email}
                    isEmailSent={isEmailSent}
                    isEmailVerified={isEmailVerified}
                    verificationCode={verificationCode}
                    onEmailChange={handleChange}
                    onSendVerification={sendVerificationEmail}
                    onVerifyEmail={verifyEmail}
                    onVerificationCodeChange={(e) => handleChange(e, 'verificationCode')}
                />
                <InputField
                    label="Password"
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <InputField
                    label="Confirm Password"
                    id="passwordConfirm"
                    name="passwordConfirm"
                    type="password"
                    value={formData.passwordConfirm}
                    onChange={handleChange}
                    required
                />
                <InputField
                    label="Phone Number"
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                />
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="signup-button">Sign Up</button>
            </form>
        </div>
    );
};

export default SignupForm;