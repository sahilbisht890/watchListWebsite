import {Modal , Form, Button, Input} from 'antd';
import { createWatchList } from '../utilis/index.';


const WatchListForm = ({isFormModalOpen , setIsFormModalOpen , userKey , updateContent,setUpdateContent}) => {

    const handleCloseFormModal  = () => {
        setIsFormModalOpen(false);
    }
    const handleCreateWatchList = (values) => {
        const title  = values.watchListName ;
        const about = values.about;
        const createTemp = createWatchList(userKey , title , about);
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
        width={520}
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
              { min: 2, message: 'Title should be at least 2 characters.' },
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
