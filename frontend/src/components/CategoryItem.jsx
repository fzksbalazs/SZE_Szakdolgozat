import styled from "styled-components";
import { mobile } from "../responsive";
import { Link } from "react-router-dom";

const Container = styled.div`
  flex: 1 1 30%;
  margin: 10px;
  height: 60vh;
  min-height: 250px;
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.4s ease, box-shadow 0.4s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  }

  ${mobile({
    flex: "1 1 100%",
    height: "35vh",
    minHeight: "200px",
    margin: "5px 0"
  })}
`;

const WaveBackground = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;

  span {
    position: absolute;
    width: 200%;
    height: 200%;
    top: 0;
    left: 50%;
    transform: translate(-50%, -75%);
  }

  span:nth-child(1) {
    border-radius: 45%;
    background: rgba(0, 20, 20, 1);
    animation: rotate 5s linear infinite;
  }
  span:nth-child(2) {
    border-radius: 40%;
    background: rgba(0, 20, 20, 0.5);
    animation: rotate 10s linear infinite;
  }
  span:nth-child(3) {
    border-radius: 42.5%;
    background: rgba(0, 20, 20, 0.5);
    animation: rotate 15s linear infinite;
  }

  @keyframes rotate {
    0% {
      transform: translate(-50%, -75%) rotate(0deg);
    }
    100% {
      transform: translate(-50%, -75%) rotate(360deg);
    }
  }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(100, 20, 20, 0.6));
  z-index: 1;
`;

const Info = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  text-align: center;
`;

const Title = styled.h1`
  color: white;
  margin-bottom: 10px;
  font-size: 28px;
  letter-spacing: 1.5px;

  ${mobile({
    fontSize: "20px"
  })}
`;

const Button = styled.button`
  border: none;
  padding: 10px 20px;
  background-color: #ffffff;
  color: #333;
  cursor: pointer;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
  margin-bottom: 15px;

  &:hover {
    background-color: #000000;
    color: #fff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  ${mobile({
    padding: "8px 16px",
    fontSize: "14px"
  })}
`;

const Image = styled.img`
  width: 120px;
  height: auto;
  object-fit: contain;
  margin-top: 100px;
  border-radius: 8px;
  background

  ${mobile({
    width: "90px"
  })}
`;

const CategoryItem = ({ item }) => {
  return (
    <Container>
      <Link to={`/products/${item.cat}`}>
        <WaveBackground>
          <span></span>
          <span></span>
          <span></span>
        </WaveBackground>
        <Overlay />
        <Info>
          <Title>{item.title}</Title>
          <Button>BÖNGÉSZÉS</Button>
          <Image src={item.img} alt={item.title} />
        </Info>
      </Link>
    </Container>
  );
};

export default CategoryItem;
