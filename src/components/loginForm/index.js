import React from "react";
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

  const { userKey, setUserKey } = useGlobalContext();
  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
    setButtonText("unlock");

  };

  const onFinish = (values) => {
    const passkey = (values.passkey || "").trim();
    const passkeyExists = userAlreadyPresentOrNot(passkey); 
  
    if (!passkey) {
      toast.error('Passkey cannot be empty.');
      return;
    }

    if (buttonText === 'create') {
      if (passkeyExists) {
        toast.error('This passkey already exists.');
      } else {
        createNewAccount(passkey);
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

  };

  const switchToCreate = () => {
    setButtonText("create");
    form.resetFields();

  };

  return (
    <>
    <Modal
        title={buttonText === "unlock" ? "Unlock" : "Create Passkey"}
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
          <div className="d-flex justify-content-center">
            <Button htmlType="submit">
              {buttonText === "unlock" ? "Unlock" : "Create"}
            </Button>
          </div>
        </Form>
        <div className="d-flex gap-2 mt-2 align-items-center justify-content-center modalSwitchText">
          <div className="fw-medium">
            {buttonText === "unlock"
              ? "Don't have a passkey ? "
              : "Already have a passkey ? "}
          </div>
          <div
            className="text-primary cursor-pointer modalOptionBelow"
            onClick={buttonText === "unlock" ? switchToCreate : switchToUnlock}
          >
            {buttonText === "unlock" ? "Create Passkey" : "Unlock"}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default LoginFormModal;
