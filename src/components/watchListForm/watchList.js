import { Card, Modal, Image, Button } from "antd";
import { getWatchList , addToWatchList} from "../utilis/index.";
import { useGlobalContext } from "../../globalProvider";
import { useEffect, useState } from "react";
import WatchListForm from "./watchListForm";
import style from "../../styles/watchList.module.scss";

const { Meta } = Card;

const WatchList = ({ isModalOpen, setIsModalOpen, movieData}) => {
  const { userKey, setUserKey, userWatchListData, setUserWatchListData } = useGlobalContext();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [updateContent, setUpdateContent] = useState(1);

  useEffect(() => {
    const tempWatchList = getWatchList(userKey);
    setUserWatchListData(tempWatchList);
  }, [updateContent]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateNew = () => {
    setIsFormModalOpen(true);
  };

  const handleAddToWatchList = (index) => {
   const flag =  addToWatchList(movieData,userKey , index);
   if(flag){
    setIsModalOpen(false);
    const tempWatchList = getWatchList(userKey);
    setUserWatchListData(tempWatchList);
   }
  }

  return (
    <>
      <WatchListForm
        isFormModalOpen={isFormModalOpen}
        setIsFormModalOpen={setIsFormModalOpen}
        userKey={userKey}
        updateContent={updateContent}
        setUpdateContent={setUpdateContent}
      />
      <Modal
        title="Your Watchlists"
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={520}
      >
        <div
          className={`d-flex flex-wrap justify-content-center w-100  align-items-center gap-4 ${style.watchListContainer}`}
        >
          <Card
            className="border border-danger"
            hoverable
            style={{ width: "42%" }}
            onClick={handleCreateNew}
          >
            <div className="d-flex flex-column  justify-content-center align-items-center">
              <Image
                src={`${process.env.PUBLIC_URL}/images/icons8-m-100.png`}
                width={70}
                preview={false}
              />
              <div className="text-danger fw-medium createText">
                Create a watchList
              </div>
            </div>
          </Card>
          {userWatchListData.map((watchList, index) => (
            <Card
              className="border border-primary"
              key={index}
              hoverable
              style={{ width: "42%" }}
              onClick={() => handleAddToWatchList(index)}
            >
              <div className="d-flex justify-content-center">
                <Image
                  src={`${process.env.PUBLIC_URL}/images/icons8-m-100.png`}
                  width={70}
                  preview={false}
                />
              </div>
              <Meta
                title={watchList.watchListName}
                description={watchList.about}
              />
            </Card>
          ))}
        </div>
      </Modal>
    </>
  );
};

export default WatchList;
