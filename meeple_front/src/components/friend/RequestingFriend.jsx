import React from "react";

const RequestingFriend = ({ requestingList }) => {
  console.log(requestingList);

  return (
    <div>
      {requestingList && requestingList.length > 0 ? (
        <ul>
          {requestingList.map((list, index) => (
            <li key={index}>
              <p>{list.friend.userNickname}</p>
              <button>취소</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>보낸 친구 요청이 없습니다.</p>
      )}
    </div>
  );
};

export default RequestingFriend;
