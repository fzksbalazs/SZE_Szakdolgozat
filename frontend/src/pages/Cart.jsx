import styled from "styled-components";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { mobile } from "../responsive";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../redux/cartRedux";
import StripeCheckout from "react-stripe-checkout";
import { userRequest } from "../requestMethods";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

const KEY =
  "pk_test_51KTYWpB1bb1VrKRi8D6WQYnKbZ02r2Jp7evDytQUhbIatPZTSWs7An0BeVDTYzqVDM7DsDXoIcBeZwDmQXRaY2fe00pb87wOeq";

// ============ STYLED COMPONENTS =============

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
  cursor: pointer;
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

const ImageWrapper = styled.div`
  width: 180px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain; /* arányosan illeszkedik, nem torzul */
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
`;

const ProductAmount = styled.div`
  font-size: 24px;
  margin: 5px;
  ${mobile({ margin: "5px 15px" })}
`;

const ProductPrice = styled.div`
  font-size: 30px;
  font-weight: 500;
  ${mobile({ marginBottom: "20px" })}
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
  border: 1px solid black
  color: white;
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

// ============ MAIN COMPONENT =============

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

  const handleDelete = () => {
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

  return (
    <Container>
      <Navbar />
      <Wrapper>
        <Title>KOSÁR</Title>
        <Top>
          <Link to="/">
            <TopButton>VÁSÁRLÁS FOLYTATÁSA</TopButton>
          </Link>
          <TopButton onClick={handleDelete} type="filled">
            KOSÁR TÖRLÉSE
          </TopButton>
        </Top>
        <Bottom>
          <Info>
            <Empty style={cart.total !== 0 ? { display: "none" } : {}}>
              A kosár üres!
            </Empty>

            {cart.products.map((product, index) => (
              <Product key={`${product._id}-${index}`}>
                <ProductDetail>
                  <ImageWrapper>
                  <Image
                    src={
                      product.customImageUrl ? product.customImageUrl : product.img
                    }
                    alt={product.title}
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
                      <ProductColor color={colorMap[product.color] || "gray"} />
                      <span>{product.color}</span>
                    </div>
                  </Details>
                </ProductDetail>
                <PriceDetail>
                  <ProductAmountContainer>
                    <ProductAmount>{product.quantity}</ProductAmount>
                  </ProductAmountContainer>
                  <ProductPrice>{product.price * product.quantity} Ft</ProductPrice>
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
