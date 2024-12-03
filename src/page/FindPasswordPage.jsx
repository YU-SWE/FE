import React, { useState } from 'react';
import axios from 'axios';

const EmailVerification = () => {
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [message, setMessage] = useState('');

    const handleSendCode = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/email/verify/send', null, {
                params: { email }
            });
            setIsCodeSent(true);
            setMessage('인증 코드가 이메일로 전송되었습니다.');
        } catch (error) {
            setMessage('인증 코드 전송에 실패했습니다.');
        }
    };
    
    const handleVerifyCode = async () => {
        try {
            // 1. 이메일 인증 확인
            const verifyResponse = await axios.post('http://localhost:8080/api/email/verify', null, {
                params: { 
                    email,
                    code: verificationCode 
                }
            });
            
            // 2. 인증 성공 시 임시 비밀번호 발송 요청
            if (verifyResponse.status === 200) {
                setMessage('이메일 인증이 완료되었습니다.');
                
                // 임시 비밀번호 발송 요청
                const resetResponse = await axios.post('http://localhost:8080/api/email/password/reset', null, {
                    params: { email }
                });
                
                if (resetResponse.status === 200) {
                    setMessage('임시 비밀번호가 이메일로 전송되었습니다.');
                }
            }
        } catch (error) {
            setMessage(error.response?.status === 400 
                ? '잘못된 인증 코드입니다.' 
                : '임시 비밀번호 전송에 실패했습니다.');
        }
    };

    return (
        <div className="email-verification">
            <h2>이메일 인증</h2>
            <div className="input-group">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="이메일 주소를 입력하세요"
                />
                <button onClick={handleSendCode}>인증코드 받기</button>
            </div>
            
            {isCodeSent && (
                <div className="input-group">
                    <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="인증 코드를 입력하세요"
                    />
                    <button onClick={handleVerifyCode}>확인</button>
                </div>
            )}
            
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default EmailVerification;