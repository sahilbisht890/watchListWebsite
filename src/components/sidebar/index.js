import { useEffect, useState } from "react";
import { Input, Dropdown, Menu, Button } from "antd";
import {
  IconSearch,
  IconHomeFilled,
  IconDotsVertical,
  IconPlus,
} from "@tabler/icons-react";
import { FaRegUserCircle } from "react-icons/fa";
import { useGlobalContext } from "../../globalProvider";
import LoginFormModal from "../loginForm/index";
import { toast } from 'react-hot-toast';
import { getWatchList } from "../utilis/index.";
import style from '../../styles/watchList.module.scss'
import WatchListForm from "../watchListForm/watchListForm";
import { useNavigate } from 'react-router-dom';


const Sidebar = () => {
  const navigate = useNavigate();
  const { userEmail, setUserEmail, userWatchListData, setUserWatchListData } = useGlobalContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [buttonText, setButtonText] = useState("Sign In");
  const [updateContent, setUpdateContent] = useState(1);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [filteredWatchList , setFilterWatchList]  = useState([]);
  const [searchTerm, setSearchTerm] = useState("");



  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        const filteredData = userWatchListData.filter((item) =>
          item.watchListName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilterWatchList(filteredData);
      } else {
        setFilterWatchList(userWatchListData);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, userWatchListData]);


  useEffect(() => {
        const list = getWatchList(userEmail);
        setUserWatchListData(list);
        setFilterWatchList(list);
  } , [userEmail , updateContent])

  const handleLogout = () => {
    setUserEmail('');
    navigate(`/`);
    toast.success('Logged out successfully.');
  };
  
  const handleLogin = (key) => {
     setButtonText(key);
     showModal();
  };

    const handleWatchListRoute = (data) => {
      const index = userWatchListData.findIndex(
        (listData) => listData.watchListName === data.watchListName
      );
      
      navigate(`/watchList/${index}`);
    };



  const menu = (
    <Menu>
      {userEmail ? (
        <Menu.Item key="logout" onClick={handleLogout}>
          Log out
        </Menu.Item>
      ) : (
        <>
          <Menu.Item key="logIn" onClick={() => handleLogin('logIn')}>
            Log In
          </Menu.Item>
          <Menu.Item key="signUp" onClick={() => handleLogin('signUp')}>
            Sign Up
          </Menu.Item>
        </>
      )}
    </Menu>
  );

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCreateWatchList = () => {
    if(userEmail){
        setIsFormModalOpen(true);
    } else {
       handleLogin('logIn');
    }
  }

  return (
    <>
      <WatchListForm
        isFormModalOpen={isFormModalOpen}
        setIsFormModalOpen={setIsFormModalOpen}
        userEmail={userEmail}
        updateContent={updateContent}
        setUpdateContent={setUpdateContent}
      />
      <LoginFormModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        buttonText={buttonText}
        setButtonText={setButtonText}
      />

      <div className="mainContainerSidebar border rounded h-100 d-flex flex-column justify-content-between">
        <div className="p-3 h-90">
          <div className="sidebarTopContainer">
          <div className="websiteName fw-bold text-center mainColor">
            WatchLists
          </div>
          <div className="mt-2">
            <Input
              placeholder="Search WatchList"
              disabled={!userWatchListData || userWatchListData.length === 0}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              prefix={
                <IconSearch
                  size={18}
                  style={{
                    color: "rgba(0,0,0,.25)",
                  }}
                />
              }
            />
          </div>
          <div className="bgMainColor d-flex gap-2  mt-4 rounded align-items-center  ps-2 cursorPointer" onClick={() => navigate(`/`)}>
            <IconHomeFilled size={18} color="white" />
            <div className="text-light">Home</div>
          </div>
          <div className="bgMainColor d-flex gap-2  mt-2 rounded align-items-center ps-2 cursorPointer" onClick={handleCreateWatchList}>
            <IconPlus size={18} color="white" />
            <div className="text-light">Create WatchList</div>
          </div>
          </div>
          <div className={`${style.sidebarWatchListContainer} d-flex flex-column mt-2 h-60`}>
              <div className="d-flex justify-content-center watchlistHeading fw-bold">My WatchList</div>
              <div className="d-flex gap-1 flex-column mt-2 watchListContainerDiv">
              {
                filteredWatchList?.length ? (<>
                {
                  filteredWatchList?.map((data , index) =>
                     (<div key={index} onClick={() => handleWatchListRoute(data)} className="watchListDiv fw-medium rounded p-1 ps-2">{data.watchListName}</div>))
                }
                </>) : <div className="d-flex justify-content-center fw-medium text-primary">No WatchList Added</div>
              }
              </div>
          </div>
        </div>
        <div className="userLogin d-flex justify-content-between align-items-center bgFooterColor rounded  ps-2 m-1">
          <div className="d-flex align-items-center gap-2">
            <FaRegUserCircle size={20} color="white" />
            <div className="text-light">{userEmail ? userEmail : "Guest"}</div>
          </div>
          <div className="">
            <Dropdown
              overlay={menu}
              trigger={["click"]}
              arrow
              placement="bottomRight"
            >
              <Button type="text" style={{ color: "white" }}>
                <IconDotsVertical size={20} />
              </Button>
            </Dropdown>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
