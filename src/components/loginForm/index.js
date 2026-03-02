import React from "react";
import { Modal, Form, Input, Button, Select } from "antd";
import { toast } from 'react-hot-toast';
import { createNewAccountWithRecovery, recoverPasskeyWithQuestion, userAlreadyPresentOrNot} from "../utilis/index.";
import { useGlobalContext } from "../../globalProvider";


const LoginFormModal = ({
  isModalVisible,
  setIsModalVisible,
  buttonText,
  setButtonText,
}) => {
  const [form] = Form.useForm();
  const [isForgotMode, setIsForgotMode] = React.useState(false);
  const securityQuestions = [
    { label: "What is your best friend's name?", value: "friend_name" },
    { label: "What is your favourite food?", value: "favourite_food" },
    { label: "Who is your favourite teacher?", value: "favourite_teacher" },
    { label: "What is your favourite sport?", value: "favourite_sport" },
  ];

  const { setUserKey } = useGlobalContext();
  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
    setButtonText("unlock");
    setIsForgotMode(false);

  };

  const onFinish = (values) => {
    const passkey = (values.passkey || "").trim();
    const selectedQuestion = (values.securityQuestion || "").trim();
    const securityAnswer = (values.securityAnswer || "").trim();
    const passkeyExists = userAlreadyPresentOrNot(passkey);
  
    if (isForgotMode) {
      if (!selectedQuestion || !securityAnswer) {
        toast.error("Please choose your question and enter the answer.");
        return;
      }
      const recoveredPasskey = recoverPasskeyWithQuestion(selectedQuestion, securityAnswer);
      if (!recoveredPasskey) {
        toast.error("Security question answer did not match.");
        return;
      }
      setUserKey(recoveredPasskey);
      toast.success("Unlocked successfully using security question.");
      handleCancel();
      return;
    }

    if (!passkey) {
      toast.error('Passkey cannot be empty.');
      return;
    }

    if (buttonText === 'create') {
      if (!selectedQuestion || !securityAnswer) {
        toast.error("Please choose a security question and answer.");
        return;
      }
      if (passkeyExists) {
        toast.error('This passkey already exists.');
      } else {
        createNewAccountWithRecovery(passkey, selectedQuestion, securityAnswer);
        handleCancel();
        toast.success('Passkey created successfully.');
      }
    } else {
      if (passkeyExists) {
        setUserKey(passkey);
        toast.success('Unlocked successfully!');
        handleCancel();

      } else {
        toast.error('Passkey not found.');
      }
    }
  };
  

  const switchToUnlock = () => {
    setButtonText("unlock");
    form.resetFields();
    setIsForgotMode(false);

  };

  const switchToCreate = () => {
    setButtonText("create");
    form.resetFields();
    setIsForgotMode(false);

  };

  return (
    <>
    <Modal
        title={
          isForgotMode
            ? "Recover Passkey"
            : buttonText === "unlock"
              ? "Unlock"
              : "Create Passkey"
        }
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={520}
      >
        <Form
          name="loginForm"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          className="py-2"
          form={form}
        >
          {!isForgotMode && (
            <Form.Item
              label={
                <span>
                  Passkey<span style={{ color: "red" }}> *</span>
                </span>
              }
              name="passkey"
              rules={[{ required: true, message: "Please input your passkey!" }]}
            >
              <Input.Password placeholder="Create or enter passkey" />
            </Form.Item>
          )}
          {(buttonText === "create" || isForgotMode) && (
            <>
              <Form.Item
                label={
                  <span>
                    Security Question<span style={{ color: "red" }}> *</span>
                  </span>
                }
                name="securityQuestion"
                rules={[{ required: true, message: "Please choose a security question." }]}
              >
                <Select
                  placeholder="Choose your question"
                  options={securityQuestions}
                />
              </Form.Item>
              <Form.Item
                label={
                  <span>
                    Answer<span style={{ color: "red" }}> *</span>
                  </span>
                }
                name="securityAnswer"
                rules={[{ required: true, message: "Please enter your answer." }]}
              >
                <Input placeholder="Enter security answer" />
              </Form.Item>
            </>
          )}
          <div className="d-flex justify-content-center">
            <Button htmlType="submit">
              {isForgotMode ? "Recover & Unlock" : buttonText === "unlock" ? "Unlock" : "Create"}
            </Button>
          </div>
        </Form>
        {buttonText === "unlock" && !isForgotMode && (
          <div className="d-flex justify-content-center mt-2">
            <Button
              type="link"
              className="modalOptionBelow"
              onClick={() => {
                form.resetFields();
                setIsForgotMode(true);
              }}
            >
              Forgot passkey?
            </Button>
          </div>
        )}
        {isForgotMode && (
          <div className="d-flex justify-content-center mt-1">
            <Button
              type="link"
              className="modalOptionBelow"
              onClick={() => {
                form.resetFields();
                setIsForgotMode(false);
              }}
            >
              Back to Unlock
            </Button>
          </div>
        )}
        <div className="d-flex gap-2 mt-2 align-items-center justify-content-center modalSwitchText">
          <div className="fw-medium">
            {buttonText === "unlock" || isForgotMode
              ? "Don't have a passkey ? "
              : "Already have a passkey ? "}
          </div>
          <div
            className="cursor-pointer modalOptionBelow"
            onClick={(buttonText === "unlock" || isForgotMode) ? switchToCreate : switchToUnlock}
          >
            {(buttonText === "unlock" || isForgotMode) ? "Create Passkey" : "Unlock"}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default LoginFormModal;
