import React from 'react';
import InputField from '../InputField';

const EmailVerification = ({
                               email,
                               isEmailSent,
                               isEmailVerified,
                               verificationCode,
                               onEmailChange,
                               onSendVerification,
                               onVerifyEmail,
                               onVerificationCodeChange
                           }) => (
    <>
        <InputField
            label="Email"
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={onEmailChange}
            required
        />
        <button
            type="button"
            onClick={onSendVerification}
            className="verification-button"
            disabled={isEmailVerified}
        >
            {isEmailVerified ? 'Email Verified' : 'Send Verification Code'}
        </button>
        {isEmailSent && !isEmailVerified && (
            <div className="form-group">
                <InputField
                    label="Verification Code"
                    id="verificationCode"
                    name="verificationCode"
                    value={verificationCode}
                    onChange={onVerificationCodeChange}
                />
                <button
                    type="button"
                    onClick={onVerifyEmail}
                    className="verification-button"
                >
                    Verify Email
                </button>
            </div>
        )}
    </>
);

export default EmailVerification;