import { Add, Remove } from "@material-ui/icons";
import styled, { keyframes } from "styled-components";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { mobile } from "../responsive";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { publicRequest } from "../requestMethods";
import { useDispatch } from "react-redux";
import { addProduct } from "../redux/cartRedux";

// animált háttér (összhangban a Navbar / Slider stílussal)


const Container = styled.div`
  min-height: 100vh;
 
  
`;

const Wrapper = styled.div`
  display: flex;
  padding: 60px 80px;
  
  align-items: flex-start;
  background-color: white;
  color: black;
  ${mobile({ flexDirection: "column", padding: "20px" })}
`;

const ImgContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  perspective: 1000px; /* kis 3D mélység */
`;

const ImageFrame = styled.div`
  position: relative;
 
  overflow: hidden;
  background: #fff;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.25);
  transition: all 0.4s ease;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    
    background: linear-gradient(-45deg, #0d0d0f, #1b1833, #3a2c72, #0d0d0f);
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 1;
  }

  &:hover::before {
    opacity: 0.6;
  }

  img {
    position: relative;
    z-index: 2;
  }
`;


const Image = styled.img`
    width: 100%;
  height: auto;
  max-width: 500px;
  border-radius: 24px;
  object-fit: cover;
  transition: transform 0.5s ease;


  ${mobile({
    maxWidth: "100%",
    height: "auto",
  })}
`;

const InfoContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  
`;

const Title = styled.h1`
  font-size: 42px;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: 10px;
  text-decoration:  underline #5d0aab 4px;
`;

const Desc = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: black;
`;

const Price = styled.span`
  font-size: 36px;
  font-weight: 700;
  margin-top: 10px;
  color: black;
`;

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 30px;
  
  
`;

const Filter = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FilterTitle = styled.span`
  font-size: 18px;
  font-weight: 500;
  color: black;
`;

const FilterColor = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  border: ${(props) => (props.color === "white" ? "1px solid #ccc" : "none")};
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  &:hover {
    transform: scale(1.15);
    box-shadow: 0 0 10px ${(props) => props.color};
  }
`;

const FilterSize = styled.select`
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px black solid;
  background-color: rgba(255, 255, 255, 0.1);
  color: black;
  cursor: pointer;
  font-size: 16px;
  &:focus {
    outline: none;
    box-shadow: 0 0 5px white;
  }
`;

const FilterSizeOption = styled.option`
  background: #1a1633;
  color: white;
`;

const AddContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 40px;
  gap: 30px;
  ${mobile({ flexDirection: "column", gap: "20px" })}
`;

const AmountContainer = styled.div`
  display: flex;
  align-items: center;
  font-weight: 700;
  gap: 10px;
`;

const Amount = styled.span`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid #7a6df3;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
`;

const Button = styled.button`
  padding: 14px 40px;
  border: 1px solid black;
  border-radius: 12px;
  background: white;
  color: black;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1px;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.3s ease;
  &:hover {
    background-color: #000000;
    color: #fff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`;

const Product = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(addProduct({ ...product, quantity, color, size }));
  };

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await publicRequest.get("/products/find/" + id);
        setProduct(res.data);
        if (res.data.color?.length > 0) setColor(res.data.color[0]);
        if (res.data.size?.length > 0) setSize(res.data.size[0]);
      } catch (err) {
        console.error(err);
      }
    };
    getProduct();
  }, [id]);

  const handleQuantity = (type) => {
    if (type === "dec") quantity > 1 && setQuantity(quantity - 1);
    else setQuantity(quantity + 1);
  };

  const colorMap = {
    Fekete: "black",
    Fehér: "white",
    Piros: "red",
    Kék: "blue",
    Sárga: "yellow",
    Zöld: "green",
    Rózsaszin: "pink",
    Narancs: "orange",
    Lila: "purple",
    Szürke: "gray",
    Barna: "brown",
    Bézs: "beige",
  };

  return (
    <Container>
      <Navbar />
      <Wrapper>
        <ImgContainer>
          <ImageFrame>
          <Image src={product.img} alt={product.title} />
          </ImageFrame>
        </ImgContainer>
        <InfoContainer>
          <Title>{product.title}</Title>
          <Desc>{product.desc}</Desc>
          <Price>{product.price} Ft</Price>

          <FilterContainer>
            {product.color?.length > 0 && (
              <Filter>
                <FilterTitle>Szín:</FilterTitle>
                {product.color.map((c) => (
                  <FilterColor
                    key={c}
                    color={colorMap[c] || c}
                    onClick={() => setColor(c)}
                    title={c}
                  />
                ))}
              </Filter>
            )}

            {product.size?.length > 0 && (
              <Filter>
                <FilterTitle>Méret:</FilterTitle>
                <FilterSize onChange={(e) => setSize(e.target.value)}>
                  {product.size.map((s) => (
                    <FilterSizeOption key={s}>{s}</FilterSizeOption>
                  ))}
                </FilterSize>
              </Filter>
            )}
          </FilterContainer>

          <AddContainer>
            <AmountContainer>
              <Remove
                onClick={() => handleQuantity("dec")}
                style={{ cursor: "pointer" }}
              />
              <Amount>{quantity}</Amount>
              <Add
                onClick={() => handleQuantity("inc")}
                style={{ cursor: "pointer" }}
              />
            </AmountContainer>
            <Button onClick={handleClick}>Kosárhoz adás</Button>
          </AddContainer>
        </InfoContainer>
      </Wrapper>
      <Footer />
    </Container>
  );
};

export default Product;
