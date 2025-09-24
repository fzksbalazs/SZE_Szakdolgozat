import styled from "styled-components";
import Announcement from "../components/Announcement";
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

const KEY = "pk_test_51KTYWpB1bb1VrKRi8D6WQYnKbZ02r2Jp7evDytQUhbIatPZTSWs7An0BeVDTYzqVDM7DsDXoIcBeZwDmQXRaY2fe00pb87wOeq";

const Container = styled.div``;

const Wrapper = styled.div`
  padding: 20px;
  ${mobile({ padding: "10px" })}
`;

const Title = styled.h1`
  font-weight: 300;
  text-align: center;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  ${mobile({
    flexDirection: "column",       
    gap: "10px",                   
    alignItems: "center"           
  })}
`;

const TopButton = styled.button`
  padding: 10px;
  font-weight: 600;
  cursor: pointer;
  border: ${(props) => props.type === "filled" && "none"};
  background-color: ${(props) =>
    props.type === "filled" ? "black" : "transparent"};
  color: ${(props) => props.type === "filled" && "white"};
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
  ${mobile({ flexDirection: "column" })}
`;

const ProductDetail = styled.div`
  flex: 2;
  display: flex;
`;

const Image = styled.img`
  width: 200px;
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
  font-weight: 200;
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
  border: 0.5px solid lightgray;
  border-radius: 10px;
  padding: 20px;
  height: 50vh;
`;

const SummaryTitle = styled.h1`
  font-weight: 200;
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
  font-weight: ${(props) => props.type === "total" && "500"};
  font-size: ${(props) => props.type === "total" && "24px"};
`;

const SummaryItemText = styled.span``;

const SummaryItemPrice = styled.span``;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: black;
  color: white;
  font-weight: 600;
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
          amount: cart.total*100,
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
    "Fekete": "black",
    "Fehér": "white",
    "Piros": "red",
    "Kék": "blue",
    "Sárga": "yellow",
    "Zöld": "green",
    "Rózsaszin": "pink",
    "Narancs": "orange",
    "Lila": "purple",
    "Szürke": "gray",
  };



  return (
    <Container>
      <Announcement />
      <Navbar />
      <Wrapper>
        <Title>KOSÁR</Title>
        <Top>
          <Link to="webshop">
          <TopButton>VÁSÁRLÁS FOLYTATÁSA</TopButton>
          </Link>
          <TopButton onClick={handleDelete} type="filled">
            KOSÁR TÖRLÉSE
          </TopButton>
        </Top>
        <Bottom>
          <Info >
          <Empty style={cart.total !== 0 ? { display: "none" } : {}}>
              A kosár üres!
            </Empty>

            {cart.products.map((product, index) => (
   <Product key={`${product._id}-${index}`}>
    <ProductDetail>
      <Image src={product.customImageUrl ? product.customImageUrl : product.img}
  alt={product.title}/>
      <Details>
        
        <ProductId>
          <b>Termék azonosító:</b> {product._id}
        </ProductId>
        <ProductName>
          <b>Termék neve:</b> {product.title}
        </ProductName>
        <ProductSize>
  <b>Választott méret:</b> {Array.isArray(product.size) ? product.size[0] : product.size || "-"}
</ProductSize>
<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
  <ProductColor color={colorMap[product.color] || "gray"} />
  <span>{product.color}</span>
</div>
        
      </Details>
    </ProductDetail>
    <PriceDetail>
      <ProductAmountContainer>
        <ProductAmount>{product.quantity}</ProductAmount>
      </ProductAmountContainer>
      <ProductPrice>
        {product.price * product.quantity} Ft
      </ProductPrice>
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
              <SummaryItemText>SZÁLLITÁSI DIJ</SummaryItemText>
              <SummaryItemPrice>0 Ft</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem type="total">
              <SummaryItemText>TELJES ÁR</SummaryItemText>
              <SummaryItemPrice>{cart.total}</SummaryItemPrice>
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
