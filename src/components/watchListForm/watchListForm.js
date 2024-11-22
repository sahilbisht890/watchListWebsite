import {Modal , Form, Button, Input} from 'antd';
import { createWatchList } from '../utilis/index.';


const WatchListForm = ({isFormModalOpen , setIsFormModalOpen , userEmail , updateContent,setUpdateContent}) => {

    const handleCloseFormModal  = () => {
        setIsFormModalOpen(false);
    }
    const handleCreateWatchList = (values) => {
        const title  = values.watchListName ;
        const about = values.about;
        const createTemp = createWatchList(userEmail , title , about);
        if(createTemp){
          handleCloseFormModal();
          setUpdateContent(updateContent+1);
        }
    }
    return (<>
    <Modal
        title="Create New Watchlist"
        open={isFormModalOpen}
        onCancel={handleCloseFormModal}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={handleCreateWatchList}
          initialValues={{ watchListName: '', about: '' }}
          requiredMark={false}
        >
          <Form.Item
            label={
                <span>
                  WatchList Title
                  <span style={{ color: "red" }}> *</span>
                </span>
              }            name="watchListName"
            rules={[
              { required: true, message: 'Please enter a watchlist title!' },
            ]}
          >
            <Input placeholder="Enter watchlist title" />
          </Form.Item>

          <Form.Item label="About" name="about">
            <Input.TextArea rows={4} placeholder="Enter details about the watchlist (optional)" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: '8px' }}>
              Create
            </Button>
            <Button onClick={handleCloseFormModal}>Cancel</Button>
          </Form.Item>
        </Form>
      </Modal>
    </>)
}

export default WatchListForm;