import { useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL ;

// Styled wrapper
const ResetWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  background: #fff;
  padding: 2rem;
`;

// Input
const Input = styled.input`
  padding: 12px;
  margin: 8px 0;
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
`;

// Button
const Button = styled.button`
  padding: 12px 20px;
  margin-top: 12px;
  background-color: #090040;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #2a007d;
  }
`;

// Message
const Message = styled.p<{ success?: boolean }>`
  font-size: 18px;
  margin-top: 16px;
  color: ${({ success }) => (success ? "green" : "red")};
`;

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!newPassword || !confirmPassword) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/forget/${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });

      if (!response.ok) {
        throw new Error("Password reset failed");
      }

      setMessage("Password updated successfully! Redirecting to login...");
      setSuccess(true);

      setTimeout(() => {
        window.close()
      }, 2000);
    } catch (error) {
      setMessage("Failed to reset password. Redirecting...");
      setSuccess(false);

      setTimeout(() => {
        window.close()
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResetWrapper>
      <h2>Reset Your Password</h2>
      <Input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <Button onClick={handleReset} disabled={loading}>
        {loading ? "Updating..." : "Reset Password"}
      </Button>
      {message && <Message success={success}>{message}</Message>}
    </ResetWrapper>
  );
};

export default ResetPasswordPage;
