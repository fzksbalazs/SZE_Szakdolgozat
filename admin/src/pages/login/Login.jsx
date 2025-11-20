import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { login } from "../../redux/apiCalls";
import "./login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const dispatch = useDispatch();
  const history = useHistory();
  const { currentUser, error } = useSelector((state) => state.user);
  const admin = currentUser?.isAdmin;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      await login(dispatch, { username, password });

      if (error) {
        setErrorMsg("Hibás felhasználónév vagy jelszó!");
        return;
      }
    } catch {
      setErrorMsg("Hibás felhasználónév vagy jelszó!");
    }
  };

  useEffect(() => {
    if (currentUser && !admin) {
      setErrorMsg("Nincs admin jogosultságod!");
      return;
    }

    if (admin) {
      history.push("/welcome");
    }
  }, [currentUser, admin, history]);

  return (
    <div className="admin-login-bg">
      <form className="admin-login-box" onSubmit={handleSubmit}>
        <h1>Admin Bejelentkezés</h1>

        <input
          type="text"
          placeholder="Felhasználónév"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Jelszó"
          onChange={(e) => setPassword(e.target.value)}
        />

        {errorMsg && <p className="error-msg">{errorMsg}</p>}

        <button type="submit">Bejelentkezés</button>
      </form>
    </div>
  );
};

export default Login;
