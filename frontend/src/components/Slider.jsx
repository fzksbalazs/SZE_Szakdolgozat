import { useState } from "react";
import styled from "styled-components";
import { sliderItems } from "../data";
import { useHistory } from "react-router-dom";
import { mobile } from "../responsive";

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  position: relative;
  overflow: hidden;

  ${mobile({ height: "auto" })}
`;

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  transition: all 1.5s ease;
  transform: translateX(${(props) => props.slideIndex * -100}vw);
`;

const Slide = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: stretch; /* kitölti teljesen */
  justify-content: center;
  margin: 0;
  padding: 0;

  ${mobile({
    flexDirection: "column",
    height: "auto",
    padding: "20px 0",
  })}
`;

const IframeContainer = styled.div`
  flex: 1;
  height: 100%;
  border: none;
  background-color: white;

  ${mobile({
    width: "100%",
    height: "300px",
  })}
`;

const Iframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

const InfoWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  position: relative;
  overflow: hidden;

  background: transparent;

  ${mobile({
    width: "100%",
    padding: "40px 0",
  })}
`;

const InfoContainer = styled.div`
  flex: 1;
  padding: 50px;

  ${mobile({
    padding: "20px",
    textAlign: "center",
  })}
`;

const Title = styled.h1`
  font-size: 70px;

  ${mobile({
    fontSize: "36px",
  })}
`;

const Desc = styled.p`
  margin: 50px 0px;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 3px;

  ${mobile({
    margin: "20px 0",
    fontSize: "16px",
    letterSpacing: "1px",
  })}
`;

const PlayButton = styled.a`
  position: relative;
  display: inline-block;
  padding: 20px 25px;
  margin: 20px 0;
  color: #ffffff;
  text-decoration: none;
  text-transform: uppercase;
  transition: 0.5s;
  font-weight: 600;
  letter-spacing: 4px;
  overflow: hidden;
  border: none;
  background: transparent;
  cursor: pointer;

  &:hover {
    background: #ffffff;
    color: #000000;
    box-shadow:
      0 0 5px #fff,
      0 0 25px #fff,
      0 0 50px #fff,
      0 0 200px #fff;
    -webkit-box-reflect: below 1px linear-gradient(transparent, #0005);
  }

  span {
    position: absolute;
    display: block;
  }

  span:nth-child(1) {
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #fff);
    animation: animate1 1s linear infinite;
  }

  span:nth-child(2) {
    top: -100%;
    right: 0;
    width: 2px;
    height: 100%;
    background: linear-gradient(180deg, transparent, #fff);
    animation: animate2 1s linear infinite;
    animation-delay: 0.25s;
  }

  span:nth-child(3) {
    bottom: 0;
    right: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(270deg, transparent, #fff);
    animation: animate3 1s linear infinite;
    animation-delay: 0.5s;
  }

  span:nth-child(4) {
    bottom: -100%;
    left: 0;
    width: 2px;
    height: 100%;
    background: linear-gradient(360deg, transparent, #fff);
    animation: animate4 1s linear infinite;
    animation-delay: 0.75s;
  }

  @keyframes animate1 {
    0% {
      left: -100%;
    }
    50%,
    100% {
      left: 100%;
    }
  }
  @keyframes animate2 {
    0% {
      top: -100%;
    }
    50%,
    100% {
      top: 100%;
    }
  }
  @keyframes animate3 {
    0% {
      right: -100%;
    }
    50%,
    100% {
      right: 100%;
    }
  }
  @keyframes animate4 {
    0% {
      bottom: -100%;
    }
    50%,
    100% {
      bottom: 100%;
    }
  }
`;

const PriceNote = styled.p`
  font-size: 15px;
  font-weight: 300;
  color: #fff; /* vagy #ccc, ha szürkére szeretnéd */
  margin-top: 1px;

  ${mobile({
    fontSize: "12px",
    marginTop: "8px",
  })}
`;

const DESIGNER_URL =
  process.env.REACT_APP_DESIGNER_URL || "https://wearable-3d.vercel.app";

const Slider = () => {
  const [slideIndex] = useState(0);
  const history = useHistory();

  const openDesigner = (product) => {
    if (!product || (!product._id && !product.id)) {
      console.error("openDesigner: hiányzó product vagy _id/id", product);
      return;
    }
    const productId = product._id || product.id;

    const params = new URLSearchParams({
      productId,
      color: "#ffffff",
      logoUrl: "",
      mode: "logo",
    });

    history.push(`/designer?${params.toString()}`);
  };

  return (
    <Container>
      <Wrapper slideIndex={slideIndex}>
        {sliderItems.map((item) => (
          <Slide bg={item.bg} key={item.id}>
            <IframeContainer>
              <Iframe
                src={`${DESIGNER_URL}/?mode=preview`}
                title={`3D T-Shirt ${item.title}`}
              />
            </IframeContainer>

            <InfoWrapper bg="#222">
              <InfoContainer>
                <Title>{item.title}</Title>
                <Desc>{item.desc}</Desc>
                <PriceNote>Minden egyedi poló 9999 Ft!</PriceNote>
                <PlayButton href="#" onClick={() => openDesigner(item)}>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  TERVEZD MEG!
                </PlayButton>
              </InfoContainer>
            </InfoWrapper>
          </Slide>
        ))}
      </Wrapper>
    </Container>
  );
};

export default Slider;
