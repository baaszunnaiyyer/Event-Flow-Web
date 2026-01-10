import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../../common/Button";
import { useAuth } from "../../context/AuthContext";
import { message } from "antd";
import { testBackendConnection } from "../../utils/testConnection";

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
  padding: 2rem;
  background: #f5f5f5;
`;

const LoginBox = styled.div`
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
`;

const Title = styled.h1`
  text-align: center;
  color: #090040;
  margin-bottom: 2rem;
  font-size: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #090040;
  }
`;

const StyledButton = styled.button`
  padding: 12px 24px;
  background-color: #090040;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2a007d;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const GoogleButton = styled(StyledButton)`
  background-color: #4285f4;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background-color: #357ae8;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1.5rem 0;
  color: #666;

  &::before,
  &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid #ddd;
  }

  &::before {
    margin-right: 0.5rem;
  }

  &::after {
    margin-left: 0.5rem;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4d4f;
  background-color: #fff2f0;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ffccc7;
  margin-bottom: 1rem;
  text-align: center;
`;

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [connectionWarning, setConnectionWarning] = useState("");
  const { login, loginWithGoogle } = useAuth();
  const history = useHistory();

  useEffect(() => {
    // Test connection on component mount
    testBackendConnection().then((result) => {
      if (!result.connected && result.error) {
        setConnectionWarning(result.error);
      }
    });
  }, []);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const result = await login(email, password);
      setLoading(false);

      if (result.success) {
        message.success("Login successful!");
        history.push("/");
      } else {
        const errorMsg = result.error || "Login failed. Please try again.";
        setError(errorMsg);
        console.error("Login error:", errorMsg);
      }
    } catch (err) {
      setLoading(false);
      const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMsg);
      console.error("Login exception:", err);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const result = await loginWithGoogle();
      setLoading(false);

      if (result.success) {
        message.success("Login successful!");
        history.push("/");
      } else {
        const errorMsg = result.error || "Google sign-in failed. Please try again.";
        setError(errorMsg);
        console.error("Google login error:", errorMsg);
      }
    } catch (err) {
      setLoading(false);
      const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMsg);
      console.error("Google login exception:", err);
    }
  };

  return (
    <LoginContainer>
      <LoginBox>
        <Title>Login</Title>
        {connectionWarning && (
          <ErrorMessage style={{ backgroundColor: "#fff7e6", borderColor: "#ffd591", color: "#d46b08" }}>
            {connectionWarning}
          </ErrorMessage>
        )}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Form onSubmit={handleEmailLogin}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
          <StyledButton type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </StyledButton>
        </Form>
        <Divider>OR</Divider>
        <GoogleButton onClick={handleGoogleLogin} disabled={loading} type="button">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
              fill="#4285F4"
            />
            <path
              d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
              fill="#34A853"
            />
            <path
              d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.348 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"
              fill="#FBBC05"
            />
            <path
              d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </GoogleButton>
      </LoginBox>
    </LoginContainer>
  );
};

export default Login;
