import styled from "styled-components";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { publicRequest } from "../requestMethods";

// --- styled components a style.css alapján ---
const Wrapper = styled.div`
  box-sizing: border-box;
  background-color: white;
  height: 100vh;
  width: max(40%, 600px);
  padding: 10px;
  border-radius: 0 20px 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: "Poppins", sans-serif;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 900;
  text-transform: uppercase;
  color: #2e2b41;
`;

const Form = styled.form`
  width: min(400px, 100%);
  margin-top: 20px;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const Field = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;

  &.incorrect label {
    background-color: #f06272;
  }
  &.incorrect input {
    border-color: #f06272;
  }
`;

const Label = styled.label`
  flex-shrink: 0;
  height: 50px;
  width: 50px;
  background-color: #8672ff;
  fill: white;
  color: white;
  border-radius: 10px 0 0 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;

  svg {
    fill: white;
  }
`;

const Input = styled.input`
  flex-grow: 1;
  min-width: 0;
  height: 50px;
  padding: 1em;
  font: inherit;
  border-radius: 0 10px 10px 0;
  border: 2px solid #f3f0ff;
  border-left: none;
  background-color: #f3f0ff;
  transition: 150ms ease;

  &:hover {
    border-color: #8672ff;
  }
  &:focus {
    outline: none;
    border-color: #2e2b41;
  }
  &::placeholder {
    color: #2e2b41;
  }
`;

const Button = styled.button`
  margin-top: 10px;
  border: none;
  border-radius: 1000px;
  padding: 0.85em 4em;
  background-color: #8672ff;
  color: white;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
  transition: 150ms ease;

  &:hover,
  &:focus {
    background-color: #2e2b41;
  }
`;

const ErrorMsg = styled.p`
  color: #f06272;
  margin-top: 10px;
  text-align: center;
`;

const Info = styled.p`
  margin-top: 20px;
  a {
    text-decoration: none;
    color: #8672ff;
  }
  a:hover {
    text-decoration: underline;
  }
`;

// --- komponens ---
const Register = () => {
  const [firstname, setFirstname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    let errors = [];
    if (!firstname) errors.push("Firstname is required");
    if (!email) errors.push("Email is required");
    if (!password) errors.push("Password is required");
    if (password.length < 8)
      errors.push("Password must have at least 8 characters");
    if (password !== repeatPassword)
      errors.push("Password does not match repeated password");

    if (errors.length > 0) {
      setError(errors.join(". "));
      return;
    }

    try {
      await publicRequest.post("/auth/register", {
        username: firstname,
        email,
        password,
      });
      history.push("/login");
    } catch (err) {
      setError("Hiba történt a regisztráció során.");
    }
  };

  return (
    <Wrapper>
      <Title>Signup</Title>
      {error && <ErrorMsg>{error}</ErrorMsg>}
      <Form onSubmit={handleSubmit}>
        <Field className={!firstname && error ? "incorrect" : ""}>
          <Label>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 -960 960 960"
              width="24"
            >
              <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Z" />
            </svg>
          </Label>
          <Input
            type="text"
            placeholder="Firstname"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
          />
        </Field>
        <Field className={!email && error ? "incorrect" : ""}>
          <Label>@</Label>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field className={!password && error ? "incorrect" : ""}>
          <Label>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 -960 960 960"
              width="24"
            >
              <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z" />
            </svg>
          </Label>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Field className={!repeatPassword && error ? "incorrect" : ""}>
          <Label>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              viewBox="0 -960 960 960"
              width="24"
            >
              <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z" />
            </svg>
          </Label>
          <Input
            type="password"
            placeholder="Repeat Password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
          />
        </Field>
        <Button type="submit">Signup</Button>
      </Form>
      <Info>
        Already have an Account? <a href="/login">Login</a>
      </Info>
    </Wrapper>
  );
};

export default Register;
