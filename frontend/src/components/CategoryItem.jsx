import styled from "styled-components";
import { mobile } from "../responsive";
import { Link } from "react-router-dom";

const Container = styled.div`
  flex: 1;
  margin: 10px;
  height: 70vh;
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

  ${mobile({ height: "30vh" })}
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;

  ${Container}:hover & {
    transform: scale(1.1);
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    rgba(0, 0, 0, 0.3),
    rgba(0, 0, 0, 0.6)
  );
  opacity: 0;
  transition: opacity 0.5s ease;

  ${Container}:hover & {
    opacity: 1;
  }
`;

const Info = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  opacity: 0;
  transition: opacity 0.5s ease, transform 0.5s ease;

  ${Container}:hover & {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.05);
  }
`;

const Title = styled.h1`
  color: white;
  margin-bottom: 20px;
  font-size: 28px;
  letter-spacing: 1.5px;
`;

const Button = styled.button`
  border: none;
  padding: 12px 24px;
  background-color: #ffffff;
  color: #333;
  cursor: pointer;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #716eef;
    color: #fff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`;

const CategoryItem = ({ item }) => {
  return (
    <Container>
      <Link to={`/products/${item.cat}`}>
        <Image src={item.img} alt={item.title} />
        <Overlay />
        <Info>
          <Title>{item.title}</Title>
          <Button>BÖNGÉSZÉS</Button>
        </Info>
      </Link>
    </Container>
  );
};

export default CategoryItem;
