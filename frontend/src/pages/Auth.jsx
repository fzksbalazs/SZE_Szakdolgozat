import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useHistory } from "react-router-dom";
import { publicRequest } from "../requestMethods";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/apiCalls";


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
  overflow-y: auto; 
  padding: 20px 0;
`;

const Card = styled.div`
  width: min(980px, 96vw);
  min-height: 600px;
  background: #0e0f13;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.45);
  display: grid;
  grid-template-columns: 1fr 380px;
  transition: all 0.3s ease;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    min-height: auto;
    height: auto;
  }

  @media (max-width: 600px) {
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  }
`;

const FormsViewport = styled.div`
  position: relative;
  overflow: hidden;
`;

const FormsTrack = styled.div`
  width: 200%;
  height: 100%;
  display: flex;
  transition: transform 600ms cubic-bezier(0.22, 0.61, 0.36, 1);
  transform: ${(props) =>
    props.isLogin ? "translateX(0%)" : "translateX(-50%)"};

  @media (max-width: 900px) {
    transform: translateX(0%);
    width: 100%;
    display: block;
  }
`;

const Pane = styled.div`
  width: 50%;
  padding: 48px clamp(18px, 4vw, 48px);

  @media (max-width: 900px) {
    width: 100%;
    padding: 32px 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  @media (max-width: 480px) {
    padding: 24px 16px;
  }
`;

const Title = styled.h1`
  font-size: clamp(28px, 4.2vw, 40px);
  font-weight: 800;
  letter-spacing: 0.5px;
  margin: 6px 0 18px;
`;

const Subtitle = styled.p`
  color: #cfcfe1;
  opacity: 0.8;
  margin-bottom: 28px;
`;

const Form = styled.form`
  display: grid;
  gap: 14px;
  max-width: 460px;
  width: 100%;

  @media (max-width: 480px) {
    width: 90%;
  }
`;

const Field = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  border: 2px solid
    ${(props) => (props.error ? "#dd648a" : "rgba(255,255,255,0.1)")};
  background: rgba(255, 255, 255, 0.05);
  border-radius: 14px;
  overflow: hidden;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &:focus-within {
    border-color: #716eef;
    background: rgba(255, 255, 255, 0.08);
  }

  @media (max-width: 480px) {
    border-radius: 10px;
  }
`;

const FieldIcon = styled.div`
  width: 50px;
  display: grid;
  place-items: center;
  color: #bfbff2;
  font-size: 18px;
  background: rgba(255, 255, 255, 0.03);
  border-right: 1px solid rgba(255, 255, 255, 0.05);

  @media (max-width: 480px) {
    width: 44px;
    font-size: 16px;
  }
`;

const Input = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  padding: 14px 16px;
  font-size: 15px;
  font-family: "Poppins", sans-serif;

  box-sizing: border-box;
  min-width: 0;

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  @media (max-width: 480px) {
    padding: 12px;
    font-size: 14px;
    width: 10%;
  }
`;

const ErrorMsg = styled.div`
  color: #ff8aa6;
  font-size: 14px;
  line-height: 1.4;
  margin-top: 6px;
  white-space: pre-line; 
`;

const PrimaryBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center; 
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  margin-top: 16px;
  border: none;
  border-radius: 12px;
  padding: 14px 18px;
  background: linear-gradient(90deg, #716eef 0%, #dd648a 100%);
  color: #fff;
  font-weight: 600;
  font-size: 15px;
  letter-spacing: 0.4px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 8px 22px rgba(113, 110, 239, 0.25);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 30px rgba(113, 110, 239, 0.35);
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }

  @media (max-width: 480px) {
    padding: 14px 0;
    font-size: 14px;
    justify-content: center; 
  }
`;

const Overlay = styled.div`
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(600px 300px at 80% 10%, #2a2778 0%, transparent 60%),
    radial-gradient(600px 300px at 0% 100%, #7f2d58 0%, transparent 60%),
    linear-gradient(135deg, #1a1941 0%, #291b2c 100%);
  border-left: 1px solid rgba(255, 255, 255, 0.06);

  @media (max-width: 900px) {
    display: none; 
  }
`;

const OverlayInner = styled.div`
  position: relative;
  z-index: 1;
  height: 100%;
  padding: 40px;
  display: grid;
  place-items: center;
  text-align: center;

  @media (max-width: 900px) {
    padding: 24px 20px;
  }
`;

const OverlayTitle = styled.h2`
  margin: 0 0 10px;
  font-size: clamp(22px, 3vw, 28px);
  font-weight: 800;
`;

const OverlayText = styled.p`
  color: #e8e7ff;
  opacity: 0.85;
  margin-bottom: 18px;
`;

const SwitchBtn = styled.button`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.35);
  color: #fff;
  padding: 10px 16px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;

  &:hover {
    border-color: #fff;
    transform: translateY(-1px);
  }
`;

const ForgotPasswordBtn = styled.button`
  background: transparent;
  color: #fff;
  font-size: 14px;
  border: none;
  cursor: pointer;
  margin-top: 10px;
  text-decoration: underline;
  font-weight: 600;
`;

const PasswordChecklist = styled.div`
  font-size: 13px;
  margin-top: 10px;
  color: #ccc;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 10px 14px;
  width: 100%;
  box-sizing: border-box;

  h4 {
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 4px;
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

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 8px 10px;
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
`;

const ForgotPasswordModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ForgotPasswordContent = styled.div`
  background: #0e0f13;
  padding: 30px;
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
  color: #fff;
`;

const CloseButton = styled.button`
  background: transparent;
  color: #fff;
  border: none;
  font-size: 20px;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
`;

const EmailInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: #fff;
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 10px;
  background: #dd648a;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;
`;

const ForgotPasswordForm = ({ closeModal, closeForgotPassword }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await publicRequest.post("/auth/forgot-password", { email });
      alert(res.data.message); 
      closeModal(); 
    } catch (err) {
      alert(err.response.data.message || "Hiba történt.");
    }
  };

  return (
    <ForgotPasswordContent>
      <CloseButton onClick={closeModal}>×</CloseButton>
      <h3>Jelszó visszaállítás</h3>
      <EmailInput
        type="email"
        placeholder="Írd be az email címed"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <SubmitBtn onClick={handleSubmit}>Visszaállítás</SubmitBtn>

     
      <BackButton onClick={closeForgotPassword}>
        Vissza a bejelentkezéshez
      </BackButton>
    </ForgotPasswordContent>
  );
};

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  
  const dispatch = useDispatch();
  const history = useHistory();
  const { error: reduxError, currentUser } = useSelector((state) => state.user);

 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const closeForgotPassword = () => setIsForgotPasswordOpen(false);

  
  const [firstname, setFirstname] = useState("");
  const [email, setEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    if (currentUser) {
      history.push("/"); 
    }
  }, [currentUser, history]);

  
  const handleLogin = (e) => {
    e.preventDefault();
    setLocalError("");
    setInfo("");
    if (!username || !password) {
      setLocalError("Felhasználónév és jelszó megadása kötelező.");
      return;
    }
    login(dispatch, { username, password });
  };

  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
  });

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

  
  const handleRegister = async (e) => {
    e.preventDefault();
    setLocalError("");
    setInfo("");

    let errors = [];
    if (!firstname) errors.push("A felhasználónév megadása kötelező.");
    if (!email) errors.push("Az email megadása kötelező.");
    if (!regPassword) errors.push("A jelszó megadása kötelező.");
    if (regPassword !== repeatPassword)
      errors.push("A jelszavak nem egyeznek.");

    if (errors.length > 0) {
      setLocalError(errors.join("\n"));
      return;
    }

    try {
      const res = await publicRequest.post("/auth/register", {
        username: firstname,
        email,
        password: regPassword,
      });

      if (res.data.message) setInfo(res.data.message);

      setIsLogin(true);
      setFirstname("");
      setEmail("");
      setRegPassword("");
      setRepeatPassword("");
    } catch (err) {
      if (err.response && err.response.data) {
        const data = err.response.data;
        if (data.errors && Array.isArray(data.errors)) {
          setLocalError(data.errors.join("\n"));
        } else {
          setLocalError(data.message || "Hiba történt a regisztráció során.");
        }
      } else {
        setLocalError("Hiba történt a regisztráció során.");
      }
    }
  };

  return (
    <Page>
      <Card>
        <FormsViewport>
          <FormsTrack isLogin={isLogin}>
           
            <Pane>
              <Title>Bejelentkezés</Title>
              <Subtitle>Üdv újra! Lépj be a fiókodba.</Subtitle>
              {(localError || reduxError) && isLogin && (
                <ErrorMsg>
                  {localError || "Hibás felhasználónév vagy jelszó."}
                </ErrorMsg>
              )}

              <Form onSubmit={handleLogin}>
                <Field error={isLogin && !!localError && !username}>
                  <FieldIcon>👤</FieldIcon>
                  <Input
                    type="text"
                    placeholder="Felhasználónév"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Field>

                <Field error={isLogin && !!localError && !password}>
                  <FieldIcon>🔒</FieldIcon>
                  <Input
                    type="password"
                    placeholder="Jelszó"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Field>

                <PrimaryBtn type="submit">Belépés</PrimaryBtn>
                <ForgotPasswordBtn
                  onClick={() => setIsForgotPasswordOpen(true)}
                >
                  Elfelejtetted a jelszavad?
                </ForgotPasswordBtn>
              </Form>
            </Pane>

           
            <Pane>
              <Title>Regisztráció</Title>
              <Subtitle>Hozz létre egy fiókot és kezdj alkotni!</Subtitle>
              {localError && !isLogin && <ErrorMsg>{localError}</ErrorMsg>}
              {info && !isLogin && (
                <ErrorMsg style={{ color: "#82ffa6" }}>{info}</ErrorMsg>
              )}

              <Form onSubmit={handleRegister}>
                <Field error={!isLogin && !!localError && !firstname}>
                  <FieldIcon>👤</FieldIcon>
                  <Input
                    type="text"
                    placeholder="Felhasználónév"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                  />
                </Field>

                <Field error={!isLogin && !!localError && !email}>
                  <FieldIcon>＠</FieldIcon>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Field>

                <Field
                  error={
                    !isLogin &&
                    !!localError &&
                    (!regPassword || regPassword.length < 8)
                  }
                >
                  <FieldIcon>🔒</FieldIcon>
                  <Input
                    type="password"
                    placeholder="Jelszó (min. 8 karakter)"
                    value={regPassword}
                    onChange={(e) => {
                      setRegPassword(e.target.value);
                      validatePasswordLive(e.target.value);
                    }}
                  />
                </Field>

                <Field
                  error={
                    !isLogin && !!localError && repeatPassword !== regPassword
                  }
                >
                  <FieldIcon>🔁</FieldIcon>
                  <Input
                    type="password"
                    placeholder="Jelszó ismét"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                  />
                </Field>

                {!isLogin && (
                  <PasswordChecklist>
                    <h4>Jelszó követelmények:</h4>
                    <ul>
                      <li className={passwordChecks.length ? "ok" : ""}>
                        {passwordChecks.length ? "✅" : "❌"} Legalább 8
                        karakter
                      </li>
                      <li className={passwordChecks.upper ? "ok" : ""}>
                        {passwordChecks.upper ? "✅" : "❌"} Legalább egy
                        nagybetű
                      </li>
                      <li className={passwordChecks.lower ? "ok" : ""}>
                        {passwordChecks.lower ? "✅" : "❌"} Legalább egy
                        kisbetű
                      </li>
                      <li className={passwordChecks.number ? "ok" : ""}>
                        {passwordChecks.number ? "✅" : "❌"} Legalább egy
                        számjegy
                      </li>
                    </ul>
                    {Object.values(passwordChecks).every(Boolean) && (
                      <p className="strong">Erős jelszó!</p>
                    )}
                  </PasswordChecklist>
                )}

                <PrimaryBtn type="submit">Regisztrálok</PrimaryBtn>
              </Form>
            </Pane>
          </FormsTrack>
        </FormsViewport>

       
        <Overlay>
          <OverlayInner>
            <div>
              <OverlayTitle>
                {isLogin ? "Még nincs fiókod?" : "Van már fiókod?"}
              </OverlayTitle>
              <OverlayText>
                {isLogin
                  ? "Készíts fiókot, és kezdd el a 3D-s egyedi pólótervezést!"
                  : "Lépj be, és folytasd a testreszabást."}
              </OverlayText>
              <SwitchBtn
                onClick={() => {
                  setLocalError("");
                  setInfo("");
                  setIsLogin((v) => !v);
                }}
              >
                {isLogin ? "Regisztráció" : "Bejelentkezés"}
              </SwitchBtn>
            </div>
          </OverlayInner>
        </Overlay>
      </Card>

     
      {isForgotPasswordOpen && (
        <ForgotPasswordModal>
          <ForgotPasswordForm
            closeModal={() => setIsForgotPasswordOpen(false)}
            closeForgotPassword={closeForgotPassword}
          />
        </ForgotPasswordModal>
      )}
    </Page>
  );
};

export default Auth;
