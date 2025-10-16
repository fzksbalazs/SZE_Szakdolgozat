import { MailOutline, Phone, Room } from "@material-ui/icons";
import styled, { keyframes } from "styled-components";
import { mobile } from "../responsive";
import { Link } from "react-router-dom";

const moveBg = keyframes`
  0% { background-position: 50% 0%; }
  50% { background-position: 100% 100%; }
  100% { background-position: 50% 0%; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.footer`
  background: linear-gradient(-45deg, #0d0d0f, #1b1833, #3a2c72, #0d0d0f);
  background-size: 400% 400%;
  animation: ${moveBg} 4s ease infinite;
  color: #f1f1f1;
  display: flex;
  justify-content: space-between;
  padding: 40px 60px;
  flex-wrap: wrap;
  ${mobile({ flexDirection: "column", padding: "30px 20px" })}
`;

const Column = styled.div`
  flex: 1;
  margin: 20px;
  min-width: 200px;
  animation: ${fadeIn} 0.6s ease forwards;
`;

const Logo = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 15px;
  color: #fff;
`;

const Desc = styled.p`
  font-size: 15px;
  line-height: 1.6;
  color: #aaa;
`;

const Title = styled.h3`
  font-size: 18px;
  margin-bottom: 20px;
  color: #fff;
  position: relative;

  &::after {
    content: "";
    display: block;
    width: 40px;
    height: 2px;
    background: #ffffff;
    margin-top: 6px;
    border-radius: 4px;
  }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  margin-bottom: 12px;

  a {
    color: #aaa;
    text-decoration: none;
    position: relative;
    transition: color 0.3s ease;

    &::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: -3px;
      width: 0%;
      height: 2px;
      background: #ffffff;
      transition: width 0.3s ease;
    }

    &:hover {
      color: #fff;
    }

    &:hover::after {
      width: 100%;
    }
  }
`;

const ContactItem = styled.div`
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  color: #aaa;
  font-size: 15px;
  transition: color 0.3s ease;

  svg {
    margin-right: 10px;
    color: #ffffff;
    transition:
      transform 0.3s ease,
      color 0.3s ease;
  }

  &:hover {
    color: #fff;
  }

  &:hover svg {
    transform: scale(1.2);
    color: #dd648a;
  }
`;

const Bottom = styled.div`
  text-align: center;
  padding: 15px;
  background: #0d0d0d;
  font-size: 14px;
  color: #777;
`;

const Footer = () => {
  return (
    <>
      <Container>
        <Column>
          <Logo>WEARABLE.</Logo>
          <Desc>
            Egyedi pólótervező és webshop, ahol saját stílusod szerint
            alkothatsz. Készítsd el designodat 3D szerkesztőnk segítségével, és
            rendeld meg könnyedén!
          </Desc>
        </Column>

        <Column>
          <Title>Linkek</Title>
          <List>
            <ListItem>
              <Link to="/">Főoldal</Link>
            </ListItem>
            <ListItem>
              <Link to="/cart">Kosár</Link>
            </ListItem>
            <ListItem>
              <Link to="/products/polo">Polók</Link>
            </ListItem>
            <ListItem>
              <Link to="/products/cipo">Cipők</Link>
            </ListItem>
            <ListItem>
              <Link to="/products/kiegeszito">Kiegészítők</Link>
            </ListItem>
          </List>
        </Column>

        <Column>
          <Title>Elérhetőség</Title>
          <ContactItem>
            <Room /> Győr, Egyetem tér 1, 9026
          </ContactItem>
          <ContactItem>
            <Phone /> +36 30 666 6666
          </ContactItem>
          <ContactItem>
            <MailOutline /> wearableart0110@gmail.com
          </ContactItem>
        </Column>
      </Container>

      <Bottom>
        © {new Date().getFullYear()} WEARABLE. Minden jog fenntartva.
      </Bottom>
    </>
  );
};

export default Footer;
