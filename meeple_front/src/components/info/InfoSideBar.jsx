
// import { isAction } from "@reduxjs/toolkit";
// import React, { useEffect, useState } from "react";
// import { useLocation, Link } from "react-router-dom";
// import { useSelector } from "react-redux";

// const InfoSideBar = ({ onMenuSelect }) => {

//   const { token } = useSelector((state) => state.user);
//   const location = useLocation();
//   const userId = token ? JSON.parse(atob(token.split(".")[1])).sub : null;

//   const [activeLink, setActiveLink] = useState(location.pathname);

//   const linkStyle =
//       "text-white hover:text-[#D7C3F1] transition-colors duration-300 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-[#9694FF] after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300";
  
//   const textShadow = "0 0 5px #9694FF, 0 0 10px #9694FF, 0 0 20px #EBEAFF";
  
//   useEffect(() => {
//     setActiveLink(location.pathname);
//   }, [location.pathname]);

//   return (
//       <div>
        
//           <div style={{ userSelect: "none" }} className="h-screen">
//             <div className="flex flex-row">
//               <div className="flex w-2/7 bg-gradient-to-r from-gray-800 to-gray-800 h-screen border-2">
//                 <div className="flex-1 m-2 border-2 box-border">
//                   <div className="flex flex-col m-2 text-center py-2 text-[33px]">
//                     {/* INFO */}
//                     <div className="m-2">
//                       <Link
//                         to="/home"
//                         className={linkStyle}
//                         onClick={() => setActiveLink("/home")}
//                         style={
//                           activeLink === "/home"
//                             ? {
//                                 color: "#D7C3F1",
//                                 textShadow: textShadow,
//                               }
//                             : {
//                                 textShadow: textShadow,
//                               }
//                         }
//                       >
//                         INFO
//                       </Link>
//                     </div>
  
//                     {/* RULE */}
//                     <div className="m-2">
//                       <Link
//                         to="/board"
//                         className={linkStyle}
//                         onClick={() => setActiveLink("/board")}
//                         style={
//                           activeLink === "/board"
//                             ? {
//                                 color: "#D7C3F1",
//                                 textShadow: textShadow,
//                               }
//                             : {
//                                 textShadow: textShadow,
//                               }
//                         }
//                       >
//                         RULE
//                       </Link>
//                     </div>
  
//                     {/* COMMUNITY */}
//                     <div className="m-2">
//                       <Link
//                         to="/tournament"
//                         className={linkStyle}
//                         onClick={() => setActiveLink("/tournament")}
//                         style={
//                           activeLink === "/tournament"
//                             ? {
//                                 color: "#D7C3F1",
//                                 textShadow: textShadow,
//                               }
//                             : {
//                                 color: "white",
//                                 textShadow: textShadow,
//                               }
//                         }
//                       >
//                         COMMUNITY
//                       </Link>
//                     </div>
  
//                     {/* GAME REVIEW */}
//                     <div className="m-2">
//                       <Link
//                         to="/proposal"
//                         className={linkStyle}
//                         onClick={() => setActiveLink("/proposal")}
//                         style={
//                           activeLink === "/proposal"
//                             ? {
//                                 color: "#D7C3F1",
//                                 textShadow: textShadow,
//                               }
//                             : {
//                                 textShadow: textShadow,
//                               }
//                         }
//                       >
//                         GAME REVIEW
//                       </Link>
//                     </div>
  
//                     {/* 플레이 영상 */}
//                     <div className="m-2">
//                       <Link
//                         to="/introduce"
//                         className={linkStyle}
//                         onClick={() => setActiveLink("/introduce")}
//                         style={
//                           activeLink === "/introduce"
//                             ? {
//                                 color: "#D7C3F1",
//                                 textShadow: textShadow,
//                               }
//                             : {
//                                 textShadow: textShadow,
//                               }
//                         }
//                       >
//                         PLAYVIDEO
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               {/* <div className="flex-1">{children}</div> */}
//             </div>
//           </div>
//       </div>
//     );



  // return (
  //   <div className="sidebar">
  //     <button onClick={() => onMenuSelect("gameinfo")}>gameinfo</button>
  //     <button onClick={() => onMenuSelect("gamerule")}>gamerule</button>

  //     <button onClick={() => onMenuSelect("gamecommunity")}>gamecommunity</button>
  //     <button onClick={() => onMenuSelect("gamereview")}>review</button>
  //     <button onClick={() => onMenuSelect("playvideo")}>playvideo</button>
  //   </div>
  // )
// };

import React from "react";
import { useSelector } from "react-redux";

const InfoSideBar = ({ onMenuSelect }) => {
  const { token } = useSelector((state) => state.user);
  const userId = token ? JSON.parse(atob(token.split(".")[1])).sub : null;
  
  const linkStyle =
    "text-white hover:text-[#D7C3F1] transition-colors duration-300 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-[#9694FF] after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300";
  
  const textShadow = "0 0 5px #9694FF, 0 0 10px #9694FF, 0 0 20px #EBEAFF";

  return (
    <div style={{ userSelect: "none" }} className="h-screen">
      <div className="flex w-64 bg-gradient-to-r from-gray-800 to-gray-800 h-screen border-2">
        <div className="flex-1 m-2 border-2 box-border">
          <div className="flex flex-col m-2 text-center py-2 text-[33px]">
            {/* Game Info */}
            <div className="m-2">
              <button
                className={linkStyle}
                onClick={() => onMenuSelect("gameinfo")}
                style={{ textShadow: textShadow }}
              >
                GAME INFO
              </button>
            </div>

            {/* Game Rule */}
            <div className="m-2">
              <button
                className={linkStyle}
                onClick={() => onMenuSelect("gamerule")}
                style={{ textShadow: textShadow }}
              >
                GAME RULE
              </button>
            </div>

            {/* Community */}
            <div className="m-2">
              <button
                className={linkStyle}
                onClick={() => onMenuSelect("gamecommunity")}
                style={{ textShadow: textShadow }}
              >
                COMMUNITY
              </button>
            </div>

            {/* Review */}
            <div className="m-2">
              <button
                className={linkStyle}
                onClick={() => onMenuSelect("review")}
                style={{ textShadow: textShadow }}
              >
                REVIEW
              </button>
            </div>

            {/* Play Video */}
            <div className="m-2">
              <button
                className={linkStyle}
                onClick={() => onMenuSelect("playvideo")}
                style={{ textShadow: textShadow }}
              >
                PLAY VIDEO
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoSideBar;

