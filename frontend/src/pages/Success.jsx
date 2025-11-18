import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";
import { clearCart } from "../redux/cartRedux";
import { userRequest } from "../requestMethods";
import styled from "styled-components";

const Success = () => {
  const location = useLocation();
  const data = location.state?.stripeData;
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const currentUser = useSelector((state) => state.user.currentUser);
  const [orderId, setOrderId] = useState(null);
  const [progress, setProgress] = useState(0);
  const history = useHistory();

  const handleDelete = (e) => {
    e.preventDefault();
    dispatch(clearCart());
    history.push("/");
  };

  useEffect(() => {
    const createOrder = async () => {
      try {
        const res = await userRequest.post("/orders", {
          userId: currentUser._id,

        
          products: cart.products.map((item) => {
           
            if (item.customImageUrl) {
              return {
                productId: "custom-" + Date.now(),       
                title: item.title || "Egyedi póló",
                img: item.customImageUrl,                
                price: item.price,
                size: item.size,
                quantity: item.quantity,
              };
            }

          
            return {
              productId: item._id,
              title: item.title,
              img: item.img,
              price: item.price,
              quantity: item.quantity,
            };
          }),

          amount: cart.total,
          address: data.billing_details.address,
        });

        setOrderId(res.data._id);
        startProgress();
      } catch (err) {
        console.log("Error creating order:", err);
      }
    };

    if (data) createOrder();
  }, [cart, data, currentUser]);

  const startProgress = () => {
    let value = 0;
    const interval = setInterval(() => {
      value += 1;
      setProgress(value);
      if (value >= 100) clearInterval(interval);
    }, 20);
  };

  console.log("CART:", cart.products);

  return (
    <Container>
      {orderId ? (
        <>
          <Message>
            A rendelésed sikeres! <br /> 
            Rendelés azonosító: <strong>{orderId}</strong>
          </Message>

          <ProgressBar>
            <ProgressFill style={{ width: `${progress}%` }} />
          </ProgressBar>

          {progress === 100 && (
            <Button onClick={handleDelete}>Menjünk a főoldalra</Button>
          )}
        </>
      ) : (
        <Message>Rendelés feldolgozása...</Message>
      )}
    </Container>
  );
};

export default Success;




const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
`;

const Message = styled.div`
  font-size: 20px;
  text-align: center;
  margin-bottom: 30px;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin-top: 20px;
  font-weight: bold;
  cursor: pointer;
  background-color: black;
  border: none;
  border-radius: 5px;
  color: white;
  transition: 0.3s;
  &:hover {
    background-color: white;
    color: black;
  }
`;

const ProgressBar = styled.div`
  width: 300px;
  height: 15px;
  border: 2px solid white;
  border-radius: 10px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #00ff7f, #32cd32);
  transition: width 0.2s;
`;
