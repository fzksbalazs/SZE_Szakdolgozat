import styled from "styled-components";
import { mobile } from "../responsive";
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import { publicRequest } from "../requestMethods";
import { useHistory } from "react-router-dom";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.5)
    ),
    url("https://images.pexels.com/photos/102129/pexels-photo-102129.jpeg?cs=srgb&dl=pexels-daiangan-102129.jpg&fm=jpg")
      center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;

  ${mobile({
    width: "100vw",
    height: "100vh",
    padding: "10px",
  })}
`;

const Wrapper = styled.div`
  width: 40%;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;

  ${mobile({
    width: "85%",
    padding: "15px",
    borderRadius: "10px",
  })}
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 300;
  text-align: center;

  ${mobile({ fontSize: "20px" })}
`;

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
`;

const Input = styled.input`
  flex: 1;
  min-width: 40%;
  margin: 20px 10px 0px 0px;
  padding: 10px;
  border: 1px solid gray;
  border-radius: 5px;

  ${mobile({
    minWidth: "80%",
    margin: "10px 0",
    padding: "8px",
  })}
`;

const Agreement = styled.span`
  font-size: 12px;
  margin: 20px 0px;
  text-align: center;

  ${mobile({ fontSize: "11px" })}
`;

const Button = styled.button`
  width: 50%;
  border: none;
  padding: 15px 20px;
  background-color: teal;
  color: white;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
  transition: all 0.3s ease;

  &:hover {
    background-color: darkcyan;
  }

  ${mobile({
    width: "60%",
    padding: "12px",
    fontSize: "14px",
  })}
`;

const StyledLink = styled(RouterLink)`
  margin-top: 10px;
  font-size: 14px;
  text-decoration: underline;
  color: teal;
  cursor: pointer;

  ${mobile({ fontSize: "12px" })}
`;

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("A jelszavak nem egyeznek.");
      return;
    }
    try {
      const res = await publicRequest.post("/auth/register", {
        username,
        email,
        password,
      });
      console.log("Sikeres regisztráció:", res.data);
      setSuccess(true); // sikerüzenet beállítása

      setTimeout(() => {
        history.push("/login");
      }, 2000); // 2 másodperc után átdob a login oldalra

    } catch (err) {
      setError("Hiba történt a regisztráció során.");
      console.error(err);
    }
  };

  return (
    <Container>
      <Wrapper>
        <Title>REGISZTRÁCIÓ</Title>
        <Form onSubmit={handleSubmit}>
          <Input placeholder="felhasználónév" onChange={(e) => setUsername(e.target.value)} />
          <Input placeholder="email" type="email" onChange={(e) => setEmail(e.target.value)} />
          <Input placeholder="jelszó" type="password" onChange={(e) => setPassword(e.target.value)} />
          <Input placeholder="jelszó megerősítése" type="password" onChange={(e) => setConfirmPassword(e.target.value)} />

          <Agreement>
            A fiók létrehozásával hozzájárulok személyes adataim feldolgozásához.
            <b> ADATKEZELÉSI TÁJÉKOZATÓ</b>
          </Agreement>

          <div style={{ width: "100%", textAlign: "center", marginBottom: "10px" }}>
    {error && <span style={{ color: "red" }}>{error}</span>}
    {success && <span style={{ color: "green" }}>Sikeres regisztráció! Átirányítás...</span>}
  </div>
          
          <Button type="submit">REGISZTRÁCIÓ</Button>
        </Form>
        <StyledLink to="/">VISSZA A FŐOLDALRA</StyledLink>
      </Wrapper>
    </Container>
  );
};

export default Register;
