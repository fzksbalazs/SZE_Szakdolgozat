import { useParams } from "react-router-dom";
import { SearchOutlined } from "@material-ui/icons";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Info = styled.div`
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s ease;
  cursor: pointer;
`;

const Container = styled.div`
  flex: 1;
  margin: 5px;
  min-width: 280px;
  height: 450px;  // Increase height for better spacing
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  position: relative;
  border-radius: 16px;

  &:hover ${Info} {
    opacity: 1;
    border-radius: 50px;
  }
`;

const Circle = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: ${(props) =>
    props.isShirtCategory
      ? "linear-gradient(-45deg, #4f2c72, #5d3e8a, #7155b1, #8e73b5)" // Light gradient for shirt
      : "linear-gradient(-45deg, #0d0d0f, #1b1833, #3a2c72, #0d0d0f)"}; // Default dark gradient
  position: absolute;
`;

const ImageWrapper = styled.div`
  width: 280px;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  z-index: 2;
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const Icon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
  transition: all 0.5s ease;
  &:hover {
    background-color: #e9f5f5;
    transform: scale(1.1);
  }
`;

const Title = styled.span`
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  font-family: "Montserrat", sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: black;
  text-transform: uppercase;
  letter-spacing: 1px;
  z-index: 4;
  pointer-events: none;
  text-align: center;
`;

const Price = styled.span`
  display: block;
  text-align: center;
  font-size: 21px;
  font-weight: 700;
  margin-top: 10px;
  color: black;
  margin-bottom: 10px; /* Added margin to separate from button */
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const Product = ({ item }) => {
  // Use the useParams hook to get the category from the URL
  const { category } = useParams();

  // Determine if the category is "polo"
  const isShirtCategory = category === "polo";

  return (
    <Container>
      <InfoContainer>
        <Title>{item.title}</Title>
        <Circle isShirtCategory={isShirtCategory} />
        <ImageWrapper>
          <Image src={item.img} />
        </ImageWrapper>
        <Price>{item.price} Ft</Price> {/* Display price below the image */}
        <Info>
          <Icon>
            <Link to={`/product/${item._id}`}>
              <SearchOutlined />
            </Link>
          </Icon>
        </Info>
      </InfoContainer>
    </Container>
  );
};

export default Product;
