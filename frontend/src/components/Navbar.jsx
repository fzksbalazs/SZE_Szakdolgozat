import { Badge } from "@material-ui/core";
import { ShoppingCartOutlined } from "@material-ui/icons";
import React from "react";
import styled from "styled-components";
import { mobile } from "../responsive";
import { Link } from "react-router-dom";

const Container = styled.div`
  height: 60px;
  ${mobile({ height: "50px" })}
`;

const Wrapper = styled.div`
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${mobile({ padding: "10px 0px" })}
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;



const Input = styled.input`
  border: none;
  ${mobile({ width: "50px" })}
`;

const Center = styled.div`
  flex: 1;
  text-align: center;
`;

const Logo = styled.h1`
  font-weight: bold;
  color: black;
  ${mobile({ fontSize: "24px" })}
`;
const Right = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  ${mobile({ flex: 2, justifyContent: "center" })}
`;

const MenuItem = styled.div`
  font-size: 14px;
  cursor: pointer;
  margin-left: 25px;
  ${mobile({ fontSize: "12px", marginLeft: "10px" })}
`;

const Navbar = () => {
  return (
    <Container>
      <Wrapper>
        <Left>
        </Left>
        <Center>
        <Link style={{ textDecoration: "none" }} to="/">
          <Logo>WEARABLE.</Logo>
          </Link>
        </Center>
        <Right>
        <Link style={{ textDecoration: "none", color:"black" }} to={"/register"}>
            <MenuItem >
              REGISZTRÁCIÓ
            </MenuItem>
          </Link>
          <Link style={{ textDecoration: "none", color:"black" }} to={"/login"}>
            <MenuItem >
              BEJELENTKEZÉS
            </MenuItem>
          </Link>
          <MenuItem>
          <Link  to="/cart">
            <Badge badgeContent={4} color="secondary" style={{ color: "black", textDecoration: "none" }}>
              <ShoppingCartOutlined />
            </Badge>
            </Link>
          </MenuItem>
        </Right>
      </Wrapper>
    </Container>
  );
};

export default Navbar;