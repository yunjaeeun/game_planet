import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MessageDetail from "./MessageDetail";
import { deleteMessage } from "../../sources/api/FriendApi";

const ReceivedMessage = ({ messages }) => {
  const userId = useSelector((state) => state.user.userId);
  const [messageList, setMessageList] = useState();
  console.log("받은 쪽지 목록");

  useEffect(() => {
    setMessageList(messages);
  }, [messages]);

  const [activeTab, setActiveTab] = useState("");
  const [message, setMessage] = useState([]);
  const [showDetail, setShowDetail] = useState(false);

  const goToDetailMessage = (message) => {
    setShowDetail(true);
    setActiveTab("MessageDetail");
    setMessage(message);
  };

  const handleDelete = async (friendMessageId) => {
    try {
      const response = await deleteMessage(friendMessageId);
      setShowDetail(false);
      console.log(response.message);
    } catch (error) {
      console.error("쪽지 삭제 중 에러 발생 : ", error);
    }
  };

  return (
    <>
      {!showDetail && (
        <div className="my-2">
          {messageList && messageList.length > 0 ? (
            <ul>
              {messageList.map((message, index) => (
                <li
                  key={index}
                  className="p-2 border-b flex flex-row justify-between"
                >
                  <p>{message.sender.userName}</p>
                  <div>
                    <button onClick={() => goToDetailMessage(message)}>
                      상세 보기
                    </button>
                    <button
                      onClick={() => handleDelete(message.friendMessageId)}
                    >
                      삭제
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>받은 쪽지가 없습니다.</p>
          )}
        </div>
      )}
      {showDetail && (
        <div>
          <div>작성자 : {message.sender.userName}</div>
          <div>
            <div>{message.content}</div>
          </div>
          <div>
            <button onClick={() => handleDelete(message.friendMessageId)}>
              삭제
            </button>
            <button>답장하기</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ReceivedMessage;
