import {
    SearchOutlined,
  } from "@material-ui/icons";
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
    height: 350px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    position: relative;
    border-radius: 16px;
  
    &:hover ${Info}{
      opacity: 1;
      border-radius: 50px;
    }
  `;
  
  const Circle = styled.div`
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: linear-gradient(-45deg, #0d0d0f, #1b1833, #3a2c72, #0d0d0f);
    position: absolute;
  `;
  
// // const Image = styled.img`
// //   width: 80%;
// //   height: auto; /* a magasság automatikus az arány megtartásához */
// //   max-height: 220px; /* ne legyen túl nagy egyik se */
// //   object-fit: contain; /* nem torzítja a képet */
// //   z-index: 2;
// //   display: block;
// //   margin: 0 auto; /* vízszintesen középre */
// //   position: relative;
  
  
// `;
const ImageWrapper = styled.div`
  width: 280px;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden; /* nem engedi kilógni a képet */
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
  color: black; /* halvány fehér */
  text-transform: uppercase;
  letter-spacing: 1px;
  z-index: 4;
  pointer-events: none;
  text-align: center;
`;



  
  const Product = ({ item }) => {
    return (
      <Container>
        <Title>{item.title}</Title>
        <Circle />
        <ImageWrapper>
        <Image src={item.img} />
       </ImageWrapper>
        <Info>
          <Icon>
            <Link to={`/product/${item._id}`}>
              <SearchOutlined />
            </Link>
          </Icon>
        </Info>
      </Container>
    );
  };
  
  export default Product;