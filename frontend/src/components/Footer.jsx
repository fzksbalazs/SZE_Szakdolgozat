import {
    Facebook,
    Instagram,
    MailOutline,
    Phone,
    Pinterest,
    Room,
    Twitter,
  } from "@material-ui/icons";
  import styled from "styled-components";
  import { mobile } from "../responsive";
  
  const Container = styled.div`
    display: flex;
    ${mobile({ flexDirection: "column" })}
  `;
  
  const Left = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 20px;
  `;
  
  const Logo = styled.h1``;
  
  const Desc = styled.p`
    margin: 20px 0px;
  `;
  
  const SocialContainer = styled.div`
    display: flex;
  `;
  
  const SocialIcon = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    color: white;
    background-color: #${(props) => props.color};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
  `;
  
  const Center = styled.div`
    flex: 1;
    padding: 20px;
    ${mobile({ display: "none" })}
  `;
  
  const Title = styled.h3`
    margin-bottom: 30px;
  `;
  
  const List = styled.ul`
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
  `;
  
  const ListItem = styled.li`
    width: 50%;
    margin-bottom: 10px;
  `;
  
  const Right = styled.div`
    flex: 1;
    padding: 20px;
    ${mobile({ backgroundColor: "#fff8f8" })}
  
  `;
  
  const ContactItem = styled.div`
    margin-bottom: 20px;
    display: flex;
    align-items: center;
  `;
  
  const Payment = styled.img`
      width: 50%;
  `;
  
  const Footer = () => {
    return (
      <Container>
        <Left>
          <Logo>WEARABLE.</Logo>
          <Desc>
          Wearable. – Egyedi pólótervező és webshop, ahol saját stílusod szerint alkothatsz. Készítsd el egyedi designodat 3D szerkesztőnk segítségével, és rendeld meg könnyedén!
          </Desc>
        </Left>
        <Center>
          <Title>LINKEK</Title>
          <List>
            <ListItem>Főoldal</ListItem>
            <ListItem>Kosár</ListItem>
            <ListItem>Polók</ListItem>
            <ListItem>Cipők</ListItem>
            <ListItem>Kiegészitők</ListItem>
            <ListItem>Fiókom</ListItem>
           
          </List>
        </Center>
        <Right>
          <Title>ELÉRHETŐSÉG</Title>
          <ContactItem>
            <Room style={{marginRight:"10px"}}/> Győr, Egyetem tér 1, 9026
          </ContactItem>
          <ContactItem>
            <Phone style={{marginRight:"10px"}}/> +36 30 666 6666
          </ContactItem>
          <ContactItem>
            <MailOutline style={{marginRight:"10px"}} /> wearableart0110@gmail.com
          </ContactItem>
        </Right>
      </Container>
    );
  };
  
  export default Footer;