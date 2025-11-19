import React, { useEffect } from "react";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeOut = keyframes`
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-10px); }
`;

const ToastBox = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 14px 22px;
  background: #5d0aab;
  color: white;
  font-weight: bold;
  border-radius: 8px;
  z-index: 9999;
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
  animation: ${fadeIn} 0.3s ease forwards,
             ${fadeOut} 0.3s ease forwards 2.3s;
`;

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 2600);
    return () => clearTimeout(timer);
  }, [onClose]);

  return <ToastBox>{message}</ToastBox>;
};

export default Toast;







