import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

// Csak háttér
export const HeroGeometricBg = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
  background: linear-gradient(135deg, #716eef 0%, #dd648a 100%);

  &::before,
  &::after {
    content: "";
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.5;
  }

  &::before {
    width: 400px;
    height: 400px;
    background: #ffffff22;
    top: -50px;
    left: -100px;
  }

  &::after {
    width: 500px;
    height: 500px;
    background: #00000022;
    bottom: -100px;
    right: -150px;
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  max-width: 600px;
  padding: 2rem;
  color: white;
`;

const Badge = styled.span`
  display: inline-block;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  padding: 6px 12px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.15);
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  line-height: 1.2;

  span {
    display: block;
    color: #ffd1dc;
  }
`;

const Description = styled.p`
  margin-top: 1.5rem;
  font-size: 1.125rem;
  line-height: 1.6;
  color: #f1f1f1;
`;

const HeroGeometric = ({ badge, title1, title2, description }) => {
  return (
    <Content>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {badge && <Badge>{badge}</Badge>}
        <Title>
          {title1} <span>{title2}</span>
        </Title>
        <Description>{description}</Description>
      </motion.div>
    </Content>
  );
};

export default HeroGeometric;
