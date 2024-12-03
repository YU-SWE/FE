import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Join.css";
import { useNavigate } from "react-router-dom";



export default function Join() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [pw, setPw] = useState("");
    const [confirmPw, setConfirmPw] = useState("");
    const [phone, setPhone] = useState("");
    const [emailValid, setEmailValid] = useState(false);
    const [pwValid, setPwValid] = useState(false);
    const [notAllow, setNotAllow] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (emailValid && pwValid && pw === confirmPw && username.length > 0) {
            setNotAllow(false);
            return;
        }
        setNotAllow(true);
    }, [emailValid, pwValid, pw, confirmPw, username]);

    const handleEmail = (e) => {
        setEmail(e.target.value);
        const regex =
            /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
        setEmailValid(regex.test(e.target.value));
    };

    const handlePw = (e) => {
        setPw(e.target.value);
        const regex =
            /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,20}$/;
        setPwValid(regex.test(e.target.value));
    };

    const onClickConfirmButton = async () => {
        try {
            const response = await axios.post("http://localhost:8080/api/user/join", {
                username,
                email,
                password: pw,
                passwordRepeated: confirmPw,
            });
            alert("회원가입에 성공했습니다."); // 성공 메시지 표시
            navigate("/login");
        } catch (error) {
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.error || "등록에 실패했습니다.";
                alert(errorMessage);
            } else {
                alert("서버와의 통신 중 문제가 발생했습니다.");
            }
        }
    };

    return (
        <div className="page-container">
            <div className="qna-banner">
                <h2>회원가입</h2>
            </div>
            <div className="join-container">
                <div className="join-form">
                    <div className="input-group">
                        <label className="input-label">사용자 이름</label>
                        <div className="input-wrapper">
                            <input
                                className="input-field"
                                type="text"
                                placeholder="사용자 이름 3글자 이상"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="input-group">
                        <label className="input-label">이메일 주소</label>
                        <div className="input-wrapper">
                            <input
                                className={`input-field ${!emailValid && email.length > 0 ? "error" : ""}`}
                                type="email"
                                placeholder="test@gmail.com"
                                value={email}
                                onChange={handleEmail}
                            />
                        </div>
                        {!emailValid && email.length > 0 && (
                            <div className="error-message">올바른 이메일을 입력해주세요.</div>
                        )}
                    </div>
                    <div className="input-group">
                        <label className="input-label">비밀번호</label>
                        <div className="input-wrapper">
                            <input
                                className={`input-field ${!pwValid && pw.length > 0 ? "error" : ""}`}
                                type="password"
                                placeholder="영문, 숫자, 특수문자 포함 8자 이상"
                                value={pw}
                                onChange={handlePw}
                            />
                        </div>
                        {!pwValid && pw.length > 0 && (
                            <div className="error-message">영문, 숫자, 특수문자 포함 8자 이상 입력해주세요.</div>
                        )}
                    </div>
                    <div className="input-group">
                        <label className="input-label">비밀번호 확인</label>
                        <div className="input-wrapper">
                            <input
                                className={`input-field ${pw !== confirmPw && confirmPw.length > 0 ? "error" : ""}`}
                                type="password"
                                placeholder="비밀번호를 다시 입력해주세요"
                                value={confirmPw}
                                onChange={(e) => setConfirmPw(e.target.value)}
                            />
                        </div>
                        {pw !== confirmPw && confirmPw.length > 0 && (
                            <div className="error-message">비밀번호가 일치하지 않습니다.</div>
                        )}
                    </div>
                </div>
                <button
                    className="verification-button"
                    onClick={onClickConfirmButton}
                    disabled={notAllow}
                >
                    가입하기
                </button>
            </div>
        </div>
    );
}
