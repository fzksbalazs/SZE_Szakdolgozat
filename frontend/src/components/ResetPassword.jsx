import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { publicRequest } from "../requestMethods";  // API hívások
import styled, { keyframes } from "styled-components";

// Stílusok


const moveBg = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(-45deg, #0d0d0f, #1b1833, #3a2c72, #0d0d0f);
  background-size: 400% 400%;
  animation: ${moveBg} 7s ease infinite;
  font-family: "Poppins", sans-serif;
  color: #fff;
  padding: 20px 0;
`;

const Card = styled.div`
  width: min(980px, 96vw);
  min-height: 600px;
  background: #0e0f13;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  display: flex;
  flex-direction: column; 
  align-items: center; 
  justify-content: center; 
  padding: 20px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.45);

  @media (max-width: 768px) {
    width: 90%;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center; 
  width: 50%;
  gap: 20px; 
`;



const Title = styled.h1`
  font-size: clamp(28px, 4.2vw, 40px);
  font-weight: 800;
  letter-spacing: 0.5px;
  margin: 6px 0 18px;
  text-align: center; /* Középre igazítjuk a címet */
`;

const Input = styled.input`
  width: 80%;
  padding: 10px;
  margin: 10px 0;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: #fff;
  text-align: center;

  @media (max-width: 768px) {
    width: 90%;
  }
`;

const SubmitBtn = styled.button`
  width: 80%;
  padding: 10px;
  background: #dd648a;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;

  @media (max-width: 768px) {
    width: 90%;
  }
`;

const ErrorMsg = styled.div`
  color: #ff8aa6;
  font-size: 14px;
  margin-top: 10px;
  text-align: center; /* A hibát középre igazítjuk */
  white-space: pre-line;
`;

const PasswordChecklist = styled.div`
  font-size: 13px;
  margin-top: 10px;
  color: #ccc;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 10px 14px;
  width: 80%;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    width: 90%;
  }

  h4 {
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 4px;
    text-align: center; /* A h4 középre igazítása */
  }

  ul {
    margin: 0;
    padding-left: 18px;
    list-style: none;
  }

  li {
    margin: 3px 0;
    transition: color 0.2s ease;
    white-space: nowrap;
  }

  li.ok {
    color: #82ffa6;
  }

  .strong {
    color: #82ffa6;
    font-weight: 600;
    margin-top: 8px;
  }
`;

const BackButton = styled.button`
  background: transparent;
  color: #fff;
  border: none;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
  text-decoration: underline;
  font-weight: 600;
  text-align: center; /* A vissza gomb középre igazítása */
`;

const ResetPassword = () => {
  const location = useLocation();
  const history = useHistory();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState(null);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError("Érvénytelen vagy hiányzó token.");
    }
  }, [location]);

  const validatePasswordLive = (pwd) => {
    const checks = {
      length: pwd.length >= 8,
      upper: /[A-Z]/.test(pwd),
      lower: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
    };
    setPasswordChecks(checks);
    return checks;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("A két jelszó nem egyezik.");
      return;
    }

    try {
      const response = await publicRequest.post("/auth/reset-password", {
        token,
        newPassword,
      });
      alert(response.data.message); // Sikeres üzenet
      history.push("/login"); // Vissza a bejelentkezéshez
    } catch (err) {
      setError(err.response?.data?.message || "Hiba történt.");
    }
  };

  return (
    <Page>
      <Card>
        <Title>Új Jelszó Beállítása</Title>
        <Form onSubmit={handleSubmit}>
          <Input
            type="password"
            placeholder="Új jelszó"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              validatePasswordLive(e.target.value);
            }}
          />
          <Input
            type="password"
            placeholder="Jelszó megerősítése"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          
          {/* Jelszó erősségi ellenőrzés */}
          <PasswordChecklist>
            <h4>Jelszó követelmények:</h4>
            <ul>
              <li className={passwordChecks.length ? "ok" : ""}>
                {passwordChecks.length ? "✅" : "❌"} Legalább 8 karakter
              </li>
              <li className={passwordChecks.upper ? "ok" : ""}>
                {passwordChecks.upper ? "✅" : "❌"} Legalább egy nagybetű
              </li>
              <li className={passwordChecks.lower ? "ok" : ""}>
                {passwordChecks.lower ? "✅" : "❌"} Legalább egy kisbetű
              </li>
              <li className={passwordChecks.number ? "ok" : ""}>
                {passwordChecks.number ? "✅" : "❌"} Legalább egy számjegy
              </li>
            </ul>
            {Object.values(passwordChecks).every(Boolean) && (
              <p className="strong">💪 Erős jelszó!</p>
            )}
          </PasswordChecklist>

          <SubmitBtn type="submit">Jelszó visszaállítása</SubmitBtn>
          {error && <ErrorMsg>{error}</ErrorMsg>}
        </Form>
        <BackButton onClick={() => history.push("/login")}>Vissza a bejelentkezéshez</BackButton>
      </Card>
    </Page>
  );
};

export default ResetPassword;
