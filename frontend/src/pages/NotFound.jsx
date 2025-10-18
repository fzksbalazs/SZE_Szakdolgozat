import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { Link, useHistory } from "react-router-dom";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  color: white;
  text-align: center;
  font-family: "Montserrat", sans-serif;
  padding: 0 20px;
  animation: ${fadeIn} 0.8s ease forwards;
`;

const Title = styled.h1`
  font-size: 120px;
  font-weight: 900;
  margin: 0;
  line-height: 1;
  background: linear-gradient(90deg, #b589f6, #7155b1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: 768px) {
    font-size: 80px;
  }
`;

const Subtitle = styled.h2`
  font-size: 32px;
  margin-top: 10px;
  color: #dcdcdc;

  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

const Message = styled.p`
  margin: 20px 0 40px;
  font-size: 18px;
  color: #bbb;
`;

const Timer = styled.span`
  display: block;
  margin-bottom: 30px;
  font-size: 18px;
  font-weight: 500;
  color: #a98ff7;
`;

const Button = styled(Link)`
  background-color: #ffffff;
  color: #000000;
  text-decoration: none;
  padding: 12px 30px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #000000;
    color: #fff;
    box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
  }
`;

const NotFound = () => {
  const [countdown, setCountdown] = useState(3);
  const history = useHistory();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirect = setTimeout(() => {
      history.push("/");
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [history]);

  return (
    <Container>
      <Title>404</Title>
      <Subtitle>Az oldal nem található</Subtitle>
      <Message>
        Úgy tűnik, rossz helyre tévedtél. Az oldal, amit keresel, nem létezik vagy
        át lett helyezve.
      </Message>
      <Timer>{countdown} másodperc múlva visszatérsz a főoldalra...</Timer>
      <Button to="/">Vissza most</Button>
    </Container>
  );
};

export default NotFound;
