import React, { useState } from "react";
import { Modal, Form, Input, Button} from "antd";
import { toast } from 'react-hot-toast';
import { createNewAccount , userAlreadyPresentOrNot} from "../utilis/index.";
import { useGlobalContext } from "../../globalProvider";


const LoginFormModal = ({
  isModalVisible,
  setIsModalVisible,
  buttonText,
  setButtonText,
}) => {
  const [form] = Form.useForm();

  const { userEmail, setUserEmail } = useGlobalContext();
  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
    setButtonText("logIn");

  };

  const onFinish = (values) => {
    const email = values.email;
    const emailExists = userAlreadyPresentOrNot(email); 
  
    if (buttonText === 'signUp') {
      if (emailExists) {
        toast.error('User with this email already exists.');
      } else {
        createNewAccount(email);
        handleCancel();
        toast.success('Account created successfully.');
      }
    } else {
      if (emailExists) {
        setUserEmail(email);
        toast.success('Logged in successfully!'); // Toast for successful login.
        handleCancel();

      } else {
        toast.error('No account found with this email.');
      }
    }
  };
  

  const switchToSignIn = () => {
    setButtonText("logIn");
    form.resetFields();

  };

  const switchToSignUp = () => {
    setButtonText("signUp");
    form.resetFields();

  };

  return (
    <>
      <Modal
        title={buttonText === "logIn" ? "Log In" : "Sign Up"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={350}
      >
        <Form
          name="loginForm"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          className="py-2"
          form={form}
        >
          <Form.Item
            label={
              <span>
                Email<span style={{ color: "red" }}> *</span>
              </span>
            }
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>
          <div className="d-flex justify-content-center">
            <Button htmlType="submit">
              {buttonText === "logIn" ? "Log In" : "Sign Up"}
            </Button>
          </div>
        </Form>
        <div className="d-flex gap-2 mt-2 align-items-center">
          <div className="fw-medium">
            {buttonText === "logIn"
              ? "Don't have an account ? "
              : "Already have an account ? "}
          </div>
          <div
            className="text-primary cursor-pointer modalOptionBelow"
            onClick={buttonText === "logIn" ? switchToSignUp : switchToSignIn}
          >
            {buttonText === "logIn" ? "Sign Up" : "Log In"}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default LoginFormModal;
