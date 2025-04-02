import styled from "styled-components";
import { mobile } from "../responsive"; 
import { Link as RouterLink } from "react-router-dom"; 


const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.5)
    ),
    url("https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2xvdGhlcyUyMHNob3B8ZW58MHx8MHx8fDA%3D")
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
  width: 30%;
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
  flex-direction: column;
  width: 100%; 
  align-items: center; 
`;

const Input = styled.input`
  flex: 1;
  width: 80%; 
  margin: 10px 0;
  padding: 10px;
  border: 1px solid gray;
  border-radius: 5px; 

  ${mobile({ width: "90%", padding: "8px" })} 
`;

const Button = styled.button`
  width: 50%; 
  border: none;
  padding: 15px 20px;
  background-color: teal;
  color: white;
  cursor: pointer;
  margin-bottom: 10px;
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

const ErrorMessage = styled.span`
  color: red;
  font-size: 14px;
  margin-top: 10px;
`;


const Login = () => {





  return (
    <Container>
      <Wrapper>
        <Title>BEJELENTKEZÉS</Title>
        <Form>
        <Input
            required
            placeholder="felhasználónév"
           
          />
          <Input
            required
            type={"password"}
            placeholder="jelszó"
          
          />
         <Button  >BEJELENTKEZÉS</Button>
          <ErrorMessage>Hibás felhasználónév vagy jelszó!</ErrorMessage>
          <StyledLink to="/register">REGISZTRÁCIÓ</StyledLink>
        </Form>
        <StyledLink to="/">VISSZA A FŐOLDALRA</StyledLink>
      </Wrapper>
    </Container>
  );
};

export default Login;