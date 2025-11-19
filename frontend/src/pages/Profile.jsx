import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSelector, useDispatch } from "react-redux";
import { userRequest } from "../requestMethods";
import { addProduct } from "../redux/cartRedux";
import { mobile } from "../responsive";
import Toast from "../components/toast";




const Container = styled.div`
  padding: 20px;
  max-width: 1100px;
  margin: auto;

  ${mobile({
    padding: "10px"
  })}
`;

const Section = styled.div`
  margin-bottom: 40px;
  padding: 25px;
  background: #ffffff;

  ${mobile({
    padding: "15px"
  })}
`;

const Title = styled.h2`
  margin-bottom: 20px;
  padding-left: 12px;
  border-left: 4px solid #5d0aab;
`;



const OrderTable = styled.div`
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;

  @media (max-width: 750px) {
    display: block;
  }
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 2fr 1fr 1fr;
  background: #5d0aab;
  color: white;
  padding: 12px 10px;
  font-weight: bold;

  @media (max-width: 750px) {
    display: none; /* Mobile: eltűnik a fejléc */
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 2fr 1fr 1fr;
  padding: 12px 10px;
  border-bottom: 1px solid #ddd;
  align-items: center;

  @media (max-width: 750px) {
    display: block;
    margin-bottom: 20px;
    padding: 15px;
    background: #f9f9f9;
  }
`;

const Cell = styled.div`
  font-size: 15px;

  @media (max-width: 750px) {
    margin-bottom: 6px;

    &:before {
      content: attr(data-label) ": ";
      font-weight: bold;
      color: #5d0aab;
    }
  }
`;

const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ProductItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  img {
    width: 50px;
    height: 50px;
    border-radius: 6px;
    object-fit: cover;
  }
`;




const CustomContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 25px;

  ${mobile({
    flexDirection: "column",
    textAlign: "center"
  })}
`;

const CustomImg = styled.img`
  width: 170px;
  height: 170px;
  border-radius: 200px;
  object-fit: cover;
  margin-right: 20px;

  ${mobile({
    marginRight: 0,
    marginBottom: "12px",
    width: "150px",
    height: "150px"
  })}
`;

const AddButton = styled.button`
  padding: 10px 16px;
  background: #5d0aab;
  border: none;
  color: white;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: #43017c;
  }
`;



const Profile = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [orders, setOrders] = useState([]);
  const [customShirts, setCustomShirts] = useState([]);
  const dispatch = useDispatch();
  const [toastMessage, setToastMessage] = useState("");


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await userRequest.get(`/orders/find/${currentUser._id}`);
        setOrders(res.data);

        
        const customs = [];
        res.data.forEach(order => {
          order.products.forEach(p => {
            if (p.productId.startsWith("custom")) {
              customs.push(p);
            }
          });
        });

        setCustomShirts(customs);

      } catch (err) {
        console.log(err);
      }
    };

    fetchOrders();
  }, [currentUser]);

  
  const addToCartHandler = (product) => {
  dispatch(
    addProduct({
      _id: "custom-" + Date.now(),
      title: product.title,
      img: product.img,
      customImageUrl: product.img,
      price: product.price,
      size: product.size || "M",
      quantity: 1,
    })
  );

  setToastMessage("Hozzáadva a kosárhoz ✔");
};


  return (
    <>
      <Navbar />

      <Container>

 
        <Section>
          <Title>Felhasználói profil</Title>

        
          <div style={{ marginBottom: "30px" }}>
            <p><strong>Név:</strong> {currentUser.username}</p>
            <p><strong>Email:</strong> {currentUser.email}</p>
            <p>
              <strong>Regisztráció:</strong>{" "}
              {new Date(currentUser.createdAt).toLocaleDateString()}
            </p>
          </div>

         
  <Title>Rendeléseim</Title>

  {orders.length === 0 && <p>Még nincs rendelésed.</p>}

  <OrderTable>
    <TableHeader>
      <div>Rendelés ID</div>
      <div>Dátum</div>
      <div>Termékek</div>
      <div>Összeg</div>
      <div>Státusz</div>
    </TableHeader>

    {orders.map((order) => (
      <TableRow key={order._id}>
        <Cell data-label="Rendelés ID">{order._id}</Cell>

        <Cell data-label="Dátum">
          {new Date(order.createdAt).toLocaleDateString()}
        </Cell>

        <Cell data-label="Termékek">
          <ProductList>
            {order.products.map((p) => (
              <ProductItem key={p.productId}>
                <img src={p.img} alt="" />
                <div>
                  <strong>{p.title}</strong>
                  <div>{p.price} Ft × {p.quantity} db</div>
                </div>
              </ProductItem>
            ))}
          </ProductList>
        </Cell>

        <Cell data-label="Összeg">{order.amount} Ft</Cell>
        <Cell data-label="Státusz">{order.status}</Cell>
      </TableRow>
    ))}
  </OrderTable>
</Section>


   
        <Section>
          <Title>Eddigi tervezett pólóim</Title>

          {customShirts.length === 0 && <p>Még nincs egyedi pólód.</p>}

          {customShirts.map((p, idx) => (
            <CustomContainer key={idx}>
              <CustomImg src={p.img} alt={p.title} />

              <div>
                <p><strong>{p.title}</strong></p>
                <p>{p.price} Ft</p>

                <AddButton onClick={() => addToCartHandler(p)}>
                  Kosárhoz adom
                </AddButton>
              </div>
            </CustomContainer>
          ))}
        </Section>
{toastMessage && (
  <Toast message={toastMessage} onClose={() => setToastMessage("")} />
)}

      </Container>

      <Footer />
    </>
  );
};

export default Profile;
