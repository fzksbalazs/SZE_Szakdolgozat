import styled from "styled-components";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { mobile } from "../responsive";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, removeProduct, updateQuantity } from "../redux/cartRedux";
import StripeCheckout from "react-stripe-checkout";
import { userRequest } from "../requestMethods";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { Add, Remove, Delete } from "@material-ui/icons";

const KEY =
  "pk_test_51KTYWpB1bb1VrKRi8D6WQYnKbZ02r2Jp7evDytQUhbIatPZTSWs7An0BeVDTYzqVDM7DsDXoIcBeZwDmQXRaY2fe00pb87wOeq";

const Container = styled.div`
  min-height: 100vh;
  color: #1a1633;
`;

const Wrapper = styled.div`
  width: 95%;
  padding: 40px 60px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  ${mobile({ padding: "20px" })}
`;

const Title = styled.h1`
  font-size: 42px;
  font-weight: 700;
  text-align: center;
  letter-spacing: 1px;
  color: #1a1633;
  border-bottom: 3px solid #7a6df3;
  display: inline-block;
  margin: 20px auto 40px;
  padding-bottom: 10px;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  ${mobile({
    flexDirection: "column",
    gap: "10px",
    alignItems: "center",
  })}
`;

const TopButton = styled.button`
  padding: 10px 20px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 10px;
  border: 2px solid black;
  transition: all 0.3s ease;
  &:hover {
    background-color: #000000;
    color: #fff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  ${mobile({ flexDirection: "column" })}
`;

const Info = styled.div`
  flex: 3;
`;

const Product = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  ${mobile({ flexDirection: "column" })}
`;

const ProductDetail = styled.div`
  flex: 2;
  display: flex;
  align-items: center;
`;

const Circle = styled.div`
  position: absolute;
  width: ${(props) => (props.isCustom ? "200px" : "200px")};
  height: ${(props) => (props.isCustom ? "200px" : "200px")};
  border-radius: 50%;
  background: linear-gradient(-45deg, #4f2c72, #5d3e8a, #7155b1, #8e73b5);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.35);
  z-index: 0;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: transform 0.5s ease;

  ${mobile({
    width: (props) => (props.isCustom ? "150px" : "150px"),
    height: (props) => (props.isCustom ? "150px" : "150px"),
  })}
`;

const ImageWrapper = styled.div`
  position: relative;
  width: ${(props) => (props.isCustom ? "200px" : "200px")};
  height: ${(props) => (props.isCustom ? "200px" : "200px")};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
  background: transparent;

  ${mobile({
    width: (props) => (props.isCustom ? "180px" : "160px"),
    height: (props) => (props.isCustom ? "160px" : "160px"),
  })}

  img {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100%;
    object-fit: ${(props) => (props.isCustom ? "cover" : "contain")};
    object-position: center;
    border-radius: ${(props) => (props.isCustom ? "200px" : "0")};
    background: transparent;
    transition: transform 0.4s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }

  &:hover ${Circle} {
    transform: translate(-50%, -50%) scale(1.05);
  }
`;


const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  display: block;
`;

const Details = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;

const ProductName = styled.span``;
const ProductId = styled.span``;
const ProductSize = styled.span``;

const PriceDetail = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ProductAmountContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 8px;
`;

const ProductAmount = styled.div`
  font-size: 24px;
  margin: 5px;
  width: 40px;
  text-align: center;
  ${mobile({ margin: "5px 15px" })}
`;

const ProductPrice = styled.div`
  font-size: 26px;
  font-weight: 500;
  ${mobile({ marginBottom: "20px" })}
`;

const DeleteIcon = styled(Delete)`
  margin-top: 10px;
  cursor: pointer;
  color: #d9534f;
  transition: all 0.3s ease;

  &:hover {
    color: #ff0000;
    transform: scale(1.2);
  }
`;

const Hr = styled.hr`
  background-color: #eee;
  border: none;
  height: 1px;
`;

const Empty = styled.h1`
  font-weight: 600;
  text-align: center;
  font-size: 45px;
`;

const Summary = styled.div`
  flex: 1;
  border-radius: 5px;
  padding: 25px 30px;
  height: fit-content;
  color: white;
  background: linear-gradient(-45deg, #0d0d0f, #1b1833, #3a2c72, #0d0d0f);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
`;

const SummaryTitle = styled.h1`
  font-weight: 400;
  text-align: center;
  margin-bottom: 20px;
`;

const ProductColor = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  border: ${(props) => (props.color === "white" ? "1px solid black" : "none")};
`;

const SummaryItem = styled.div`
  margin: 30px 0px;
  display: flex;
  justify-content: space-between;
  font-weight: ${(props) => props.type === "total" && "700"};
  font-size: ${(props) => props.type === "total" && "22px"};
`;

const SummaryItemText = styled.span``;
const SummaryItemPrice = styled.span``;

const Button = styled.button`
  width: 100%;
  padding: 14px 0;
  background: white;
  border: 1px solid black;
  color: black;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #000000;
    color: #fff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`;

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [stripeToken, setStripeToken] = useState(null);
  const history = useHistory();

  const onToken = (token) => {
    setStripeToken(token);
  };

  useEffect(() => {
    const makeRequest = async () => {
      try {
        const res = await userRequest.post("/checkout/payment", {
          tokenId: stripeToken.id,
          amount: cart.total * 100,
        });

        history.replace("/success", {
          stripeData: res.data,
          products: cart,
        });
      } catch {}
    };
    stripeToken && makeRequest();
  }, [stripeToken, cart.total, history, cart]);

  const handleDeleteAll = () => {
    dispatch(clearCart());
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
  };

  const getDisplayColor = (color) => {
    if (/^#([0-9A-F]{3}){1,2}$/i.test(color)) return color;
    return colorMap[color] || "gray";
  };

  const getDisplayName = (color) => {
    if (/^#([0-9A-F]{3}){1,2}$/i.test(color)) return color;
    return color || "-";
  };

  return (
    <Container>
      <Navbar />
      <Wrapper>
        <Title>KOSÁR</Title>
        <Top>
          <Link to="/">
            <TopButton>VÁSÁRLÁS FOLYTATÁSA</TopButton>
          </Link>
          <TopButton onClick={handleDeleteAll}>KOSÁR TÖRLÉSE</TopButton>
        </Top>

        <Bottom>
          <Info>
            <Empty style={cart.total !== 0 ? { display: "none" } : {}}>
              A kosár üres!
            </Empty>

            {cart.products.map((product, index) => (
              <Product key={`${product._id}-${index}`}>
                <ProductDetail>
                  <ImageWrapper isCustom={!!product.customImageUrl}>
                    <Circle isCustom={!!product.customImageUrl} />

                    <Image
  src={product.customImageUrl ? product.customImageUrl : product.img}
  alt={product.title}
  style={
    product.customImageUrl
      ? {
          objectFit: "cover",
          objectPosition: "center",
          borderRadius: "200px",
          width: "200px",
          height: "200px",
          
        }
      : {
          objectFit: "contain",
          width: "100%",
          height: "auto",
        }
  }
/>

                  </ImageWrapper>
                  <Details>
                    <ProductId>
                      <b>Termék azonosító:</b> {product._id}
                    </ProductId>
                    <ProductName>
                      <b>Termék neve:</b> {product.title}
                    </ProductName>
                    <ProductSize>
                      <b>Választott méret:</b>{" "}
                      {Array.isArray(product.size)
                        ? product.size[0]
                        : product.size || "-"}
                    </ProductSize>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <ProductColor color={getDisplayColor(product.color)} />
                      <span>{getDisplayName(product.color)}</span>
                    </div>
                  </Details>
                </ProductDetail>

                <PriceDetail>
                  <ProductAmountContainer>
                    <Remove
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        dispatch(updateQuantity({ id: product._id, type: "dec" }))
                      }
                    />
                    <ProductAmount>{product.quantity}</ProductAmount>
                    <Add
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        dispatch(updateQuantity({ id: product._id, type: "inc" }))
                      }
                    />
                  </ProductAmountContainer>

                  <ProductPrice>
                    {product.price * product.quantity} Ft
                  </ProductPrice>

                  <DeleteIcon
                    onClick={() => dispatch(removeProduct(product._id))}
                  />
                </PriceDetail>
              </Product>
            ))}

            <Hr />
          </Info>

          <Summary>
            <SummaryTitle>RENDELÉS ÖSSZEGZÉSE</SummaryTitle>
            <SummaryItem>
              <SummaryItemText>TERMÉKEK ÁRA</SummaryItemText>
              <SummaryItemPrice>{cart.total} Ft</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem>
              <SummaryItemText>SZÁLLÍTÁSI DÍJ</SummaryItemText>
              <SummaryItemPrice>0 Ft</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem type="total">
              <SummaryItemText>TELJES ÁR</SummaryItemText>
              <SummaryItemPrice>{cart.total} Ft</SummaryItemPrice>
            </SummaryItem>
            <StripeCheckout
  name="WEARABLE."
  billingAddress
  shippingAddress
  locale="hu"
  currency="HUF"
  description={`A végösszeg ${cart.total} Ft`}
  amount={cart.total * 100}
  token={onToken}
  stripeKey={KEY}
>
              <Button style={cart.total === 0 ? { display: "none" } : {}}>
                MEGRENDELÉS
              </Button>
            </StripeCheckout>
          </Summary>
        </Bottom>
      </Wrapper>
      <Footer />
    </Container>
  );
};

export default Cart;
