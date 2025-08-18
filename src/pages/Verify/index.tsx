import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

console.log(API_BASE_URL);


// Spinner animation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Styled wrapper
const VerifyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  background: #fff;
  padding: 2rem;
`;

// Spinner
const Loader = styled.div`
  border: 6px solid #f3f3f3;
  border-top: 6px solid #090040;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 20px;
`;

// Message
const Message = styled.p`
  font-size: 20px;
  color: #090040;
  margin-top: 10px;
`;

const VerifyPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [message, setMessage] = useState<string>("Verifying your account...");
  const [verified, setVerified] = useState<boolean>(false);

  useEffect(() => {
    console.log(API_BASE_URL);
    
    const verifyUser = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/verify/${token}`, {
          method: "PUT",
        });

        if (!response.ok) {
          throw new Error("Verification failed");
        }

        setMessage("Your account has been verified successfully!");
        setVerified(true);
      } catch (error) {
        setMessage("Verification failed. Please try again.");
      }
    };

    if (token) {
      verifyUser();
    } else {
      setMessage("No token provided.");
    }
  }, [token]);

  // Close tab after 5s if verified
  useEffect(() => {
    if (verified) {
      const timer = setTimeout(() => {
        window.close();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [verified]);

  return (
    <VerifyWrapper>
      <Loader />
      <Message>{message}</Message>
    </VerifyWrapper>
  );
};

export default VerifyPage;
