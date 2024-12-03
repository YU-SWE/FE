import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Profile(setIsLoggedIn) {
    const [profile, setProfile] = useState({ email: '', username: '', name: '' });
    const [editable, setEditable] = useState(false);
    const [error, setError] = useState('');
    const [passwordModal, setPasswordModal] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('로그인이 필요합니다.');
                    return;
                }

                const response = await axios.get('http://localhost:8080/api/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.data) {
                    setProfile(response.data);
                }
            } catch (err) {
                if (err.response?.status === 401) {
                    setError('로그인이 필요하거나 세션이 만료되었습니다. 다시 로그인해주세요.');
                } else {
                    setError('프로필 정보를 가져올 수 없습니다.');
                }
            }
        };

        fetchProfile();
    }, []);

    const handleUpdateProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('로그인이 필요합니다.');
                return;
            }

            await axios.put(
                'http://localhost:8080/api/profile/update',
                { username: profile.username, name: profile.name },
                {
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                }
            );

            alert('프로필 정보가 성공적으로 수정되었습니다.');
            setEditable(false);
        } catch (err) {
            setError('프로필 정보를 수정할 수 없습니다.');
        }
    };
    
    const handlePasswordChange = async () => {
        // 비밀번호 형식 검증을 위한 정규식
        const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])(?!.*[^a-zA-Z0-9$`~!@$!%*#^?&\\(\\)\-_=+]).{8,20}$/;
    
        // 새 비밀번호와 확인 비밀번호 일치 여부 확인
        if (newPassword !== confirmPassword) {
            alert('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
            return;
        }
    
        // 비밀번호 형식 검증
        if (!regex.test(newPassword)) {
            alert(
                '비밀번호는 8~20자이며, 영어 대소문자, 숫자, 특수문자를 모두 포함해야 합니다.'
            );
            return;
        }
    
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('로그인이 필요합니다.');
                return;
            }
    
            // UpdatePasswordForm 객체 생성
            const passwordChangeRequest = {
                oldPassword: oldPassword,
                newPassword: newPassword,
            };
    
            // 비밀번호 변경 요청 보내기
            await axios.put(
                'http://localhost:8080/api/change-password',
                passwordChangeRequest, // 보내는 데이터
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
    
            alert('비밀번호가 성공적으로 변경되었습니다.');
            setPasswordModal(false);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            setIsLoggedIn = false;
            navigate('/login');
        } catch (err) {
            setError('비밀번호 변경에 실패했습니다.');
        }
    };
    

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="profile-container" style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center' }}>프로필</h1>
            <div style={{ marginBottom: '20px' }}>
                <label><strong>이메일:</strong></label>
                <input
                    type="text"
                    value={profile.email}
                    readOnly
                    style={{ width: '100%', padding: '10px', marginBottom: '10px', backgroundColor: '#f0f0f0' }}
                />
            </div>
            <div style={{ marginBottom: '20px' }}>
                <label><strong>닉네임:</strong></label>
                <input
                    type="text"
                    value={profile.username}
                    readOnly
                    style={{ width: '100%', padding: '10px', marginBottom: '10px', backgroundColor: '#f0f0f0' }}
                />
            </div>
            <div style={{ marginBottom: '20px' }}>
                <label><strong>이름:</strong></label>
                <input
                    type="text"
                    value={profile.name}
                    readOnly={!editable}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    style={{
                        width: '100%',
                        padding: '10px',
                        marginBottom: '10px',
                        backgroundColor: editable ? '#fff' : '#f0f0f0',
                    }}
                />
            </div>
            <div style={{ textAlign: 'center' }}>
                {editable ? (
                    <>
                        <button
                            onClick={handleUpdateProfile}
                            style={{
                                padding: '10px 20px',
                                margin: '5px',
                                backgroundColor: '#4CAF50',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            저장
                        </button>
                        <button
                            onClick={() => setEditable(false)}
                            style={{
                                padding: '10px 20px',
                                margin: '5px',
                                backgroundColor: '#f44336',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            취소
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => setEditable(true)}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#008CBA',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        수정
                    </button>
                )}
                <button
                    onClick={() => setPasswordModal(true)}
                    style={{
                        padding: '10px 20px',
                        margin: '5px',
                        backgroundColor: '#FFA500',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    비밀번호 변경
                </button>
            </div>

            {passwordModal && (
                <div className="password-modal" style={{ padding: '20px', backgroundColor: '#fff', marginTop: '20px' }}>
                    <h2>비밀번호 변경</h2>
                    <div>
                        <label><strong>현재 비밀번호:</strong></label>
                        <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                        />
                    </div>
                    <div>
                        <label><strong>새 비밀번호:</strong></label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                        />
                    </div>
                    <div>
                        <label><strong>새 비밀번호 확인:</strong></label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                        />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <button
                            onClick={handlePasswordChange}
                            style={{
                                padding: '10px 20px',
                                margin: '5px',
                                backgroundColor: '#4CAF50',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            비밀번호 변경
                        </button>
                        <button
                            onClick={() => setPasswordModal(false)}
                            style={{
                                padding: '10px 20px',
                                margin: '5px',
                                backgroundColor: '#f44336',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            취소
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
