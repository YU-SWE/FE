import { useState } from 'react';

const useSignupForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
        phoneNumber: '',
    });
    const [verificationCode, setVerificationCode] = useState('');
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e, field = null) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [field || name]: value
        }));
    };

    const sendVerificationEmail = async () => {
        // 실제 이메일 전송 로직으로 대체해야 합니다
        setIsEmailSent(true);
        setVerificationCode('123456');
    };

    const verifyEmail = () => {
        if (verificationCode === '123456') {
            setIsEmailVerified(true);
            setError('');
        } else {
            setError('Invalid verification code');
        }
    };

    const validateForm = () => {
        if (!isEmailVerified) {
            setError('Please verify your email before submitting');
            return false;
        }
        if (formData.password !== formData.passwordConfirm) {
            setError('Passwords do not match');
            return false;
        }
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Form submitted:', formData);
            // 여기에 실제 제출 로직을 추가하세요
        }
    };

    return {
        formData,
        verificationCode,
        isEmailSent,
        isEmailVerified,
        error,
        handleChange,
        sendVerificationEmail,
        verifyEmail,
        handleSubmit
    };
};

export default useSignupForm;