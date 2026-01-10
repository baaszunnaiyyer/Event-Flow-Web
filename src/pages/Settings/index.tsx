import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../../common/Button";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../utils/api";
import { message, Modal, Input, Form, Select, DatePicker, Switch } from "antd";
import moment from "moment";

const SettingsContainer = styled.div`
  min-height: calc(100vh - 200px);
  padding: 2rem;
  background: #f5f5f5;
`;

const SettingsBox = styled.div`
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #090040;
  margin-bottom: 2rem;
  font-size: 2rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  color: #090040;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid #090040;
  padding-bottom: 0.5rem;
`;

const Field = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 600;
`;

const Value = styled.div`
  padding: 8px 12px;
  background: #f5f5f5;
  border-radius: 4px;
  color: #666;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
`;

const DangerButton = styled.button`
  padding: 12px 24px;
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #ff7875;
  }
`;

const SaveButton = styled.button`
  padding: 12px 24px;
  background-color: #090040;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2a007d;
  }
`;

const Settings: React.FC = () => {
  const { user, refreshUserData, logout, loading: authLoading, token } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const history = useHistory();

  useEffect(() => {
    if (!authLoading && !token) {
      history.push("/login");
    }
  }, [authLoading, token, history]);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        phone: user.phone || "",
        date_of_birth: user.date_of_birth ? moment(user.date_of_birth) : null,
        gender: user.gender || "",
        country: user.country || "",
        is_private: user.is_private || false,
        availability_day_of_week: user.availability_day_of_week || "",
        availability_start_time: user.availability_start_time || "",
        availability_end_time: user.availability_end_time || "",
      });
    }
  }, [user, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const updateData: any = {};
      if (values.name !== user?.name) updateData.name = values.name;
      if (values.phone !== (user?.phone || "")) updateData.phone = values.phone || null;
      if (values.date_of_birth) {
        const formattedDate = values.date_of_birth.format("YYYY-MM-DD");
        if (formattedDate !== user?.date_of_birth) {
          updateData.date_of_birth = formattedDate;
        }
      } else if (user?.date_of_birth) {
        updateData.date_of_birth = null;
      }
      if (values.gender !== (user?.gender || "")) updateData.gender = values.gender || null;
      if (values.country !== (user?.country || "")) updateData.country = values.country || null;
      if (values.is_private !== user?.is_private) updateData.is_private = values.is_private;
      if (values.availability_day_of_week !== (user?.availability_day_of_week || ""))
        updateData.availability_day_of_week = values.availability_day_of_week || null;
      if (values.availability_start_time !== (user?.availability_start_time || ""))
        updateData.availability_start_time = values.availability_start_time || null;
      if (values.availability_end_time !== (user?.availability_end_time || ""))
        updateData.availability_end_time = values.availability_end_time || null;

      const response = await api.put("/settings", updateData);

      if (response.error) {
        message.error(response.error);
      } else {
        message.success("Settings updated successfully!");
        await refreshUserData();
      }
    } catch (error) {
      console.error("Validation or update error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== user?.name) {
      message.error("Confirmation name does not match your account name.");
      return;
    }

    setLoading(true);
    const response = await api.delete("/settings", {
      confirmation_name: deleteConfirm,
    });

    setLoading(false);
    setDeleteModalVisible(false);
    setDeleteConfirm("");

    if (response.error) {
      message.error(response.error);
    } else {
      message.success("Account deleted successfully");
      await logout();
      history.push("/");
    }
  };

  if (authLoading || !user) {
    return (
      <SettingsContainer>
        <SettingsBox>
          <Title>Settings</Title>
          <div>Loading...</div>
        </SettingsBox>
      </SettingsContainer>
    );
  }

  return (
    <SettingsContainer>
      <SettingsBox>
        <Title>Settings</Title>

        <Section>
          <SectionTitle>Profile Information</SectionTitle>
          <Form form={form} layout="vertical">
            <Field>
              <Form.Item label="Email" name="email">
                <Value>{user.email}</Value>
              </Form.Item>
            </Field>

            <Field>
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <Input placeholder="Your name" />
              </Form.Item>
            </Field>

            <Field>
              <Form.Item label="Phone" name="phone">
                <Input placeholder="Your phone number" />
              </Form.Item>
            </Field>

            <Field>
              <Form.Item label="Date of Birth" name="date_of_birth">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Field>

            <Field>
              <Form.Item label="Gender" name="gender">
                <Select placeholder="Select gender">
                  <Select.Option value="male">Male</Select.Option>
                  <Select.Option value="female">Female</Select.Option>
                  <Select.Option value="other">Other</Select.Option>
                </Select>
              </Form.Item>
            </Field>

            <Field>
              <Form.Item label="Country" name="country">
                <Input placeholder="Your country" />
              </Form.Item>
            </Field>

            <Field>
              <Form.Item label="Account Status" name="status">
                <Value>{user.status || "N/A"}</Value>
              </Form.Item>
            </Field>

            <Field>
              <Form.Item label="Timezone" name="timezone">
                <Value>{user.timezone || "N/A"}</Value>
              </Form.Item>
            </Field>

            <Field>
              <Form.Item label="Created At" name="created_at">
                <Value>
                  {user.created_at
                    ? moment(user.created_at).format("YYYY-MM-DD HH:mm:ss")
                    : "N/A"}
                </Value>
              </Form.Item>
            </Field>
          </Form>
        </Section>

        <Section>
          <SectionTitle>Privacy Settings</SectionTitle>
          <Form form={form} layout="vertical">
            <Field>
              <Form.Item label="Private Account" name="is_private" valuePropName="checked">
                <Switch checkedChildren="Private" unCheckedChildren="Public" />
              </Form.Item>
            </Field>
          </Form>
        </Section>

        <Section>
          <SectionTitle>Availability</SectionTitle>
          <Form form={form} layout="vertical">
            <Field>
              <Form.Item label="Day of Week" name="availability_day_of_week">
                <Input placeholder="e.g., Monday-Friday" />
              </Form.Item>
            </Field>

            <Field>
              <Form.Item label="Start Time" name="availability_start_time">
                <Input placeholder="e.g., 09:00" />
              </Form.Item>
            </Field>

            <Field>
              <Form.Item label="End Time" name="availability_end_time">
                <Input placeholder="e.g., 17:00" />
              </Form.Item>
            </Field>
          </Form>
        </Section>

        <ButtonGroup>
          <SaveButton onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </SaveButton>
          <DangerButton
            onClick={() => setDeleteModalVisible(true)}
            disabled={loading}
          >
            Delete Account
          </DangerButton>
        </ButtonGroup>

        <Modal
          title="Delete Account"
          open={deleteModalVisible}
          onOk={handleDeleteAccount}
          onCancel={() => {
            setDeleteModalVisible(false);
            setDeleteConfirm("");
          }}
          okText="Delete"
          okButtonProps={{ danger: true, disabled: loading }}
          cancelButtonProps={{ disabled: loading }}
        >
          <p>
            Are you sure you want to delete your account? This action cannot be undone.
          </p>
          <p style={{ marginTop: "1rem" }}>
            To confirm, please type your account name: <strong>{user.name}</strong>
          </p>
          <Input
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
            placeholder="Enter your account name"
            style={{ marginTop: "1rem" }}
          />
        </Modal>
      </SettingsBox>
    </SettingsContainer>
  );
};

export default Settings;
