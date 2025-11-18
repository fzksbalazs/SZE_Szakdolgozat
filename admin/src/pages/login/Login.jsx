import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { login } from "../../redux/apiCalls";

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

      // Ha hibás a login
      if (error) {
        setErrorMsg("Hibás felhasználónév vagy jelszó!");
        return;
      }
    } catch (err) {
      setErrorMsg("Hibás felhasználónév vagy jelszó!");
      return;
    }
  };

  useEffect(() => {
    // Ha van felhasználó, de nem admin
    if (currentUser && !admin) {
      setErrorMsg("Nincs admin jogosultságod!");
    }

    // Ha admin → mehet az admin felületre
    if (admin) {
      history.push("/welcome");
    }
  }, [currentUser, admin, history]);

  return (
    <div
      style={{
        backgroundImage: `url("https://cutewallpaper.org/23/admin-account-wallpaper-hd/115462483.jpg")`,
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: 380,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: 12,
          padding: "40px 35px",
          boxShadow: "0px 8px 20px rgba(0,0,0,0.3)",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: 30 }}>Admin Bejelentkezés</h1>

        <input
          style={{
            width: "100%",
            padding: 15,
            marginBottom: 15,
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
          type="text"
          name="username"
          placeholder="Felhasználónév"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          style={{
            width: "100%",
            padding: 15,
            marginBottom: 15,
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
          type="password"
          name="password"
          placeholder="Jelszó"
          onChange={(e) => setPassword(e.target.value)}
        />

        {errorMsg && (
          <p style={{ color: "red", marginBottom: 15, fontWeight: "bold" }}>
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: 15,
            borderRadius: 8,
            backgroundColor: "#333",
            color: "white",
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          Bejelentkezés
        </button>
      </form>
    </div>
  );
};

export default Login;
