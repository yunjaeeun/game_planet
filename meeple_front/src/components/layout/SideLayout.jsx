import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";

const SideLayout = ({ children }) => {
  const { token } = useSelector((state) => state.user);
  const location = useLocation();
  const userId = token ? JSON.parse(atob(token.split(".")[1])).sub : null;
  const gameInfo = location.state?.gameInfo;

  const notShowSidebar =
    !location.pathname.includes("/game-info")
  const [activeLink, setActiveLink] = useState(location.pathname);

  const linkStyle =
    "text-white hover:text-[#D7C3F1] transition-colors duration-300 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-[#9694FF] after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300";

  const textShadow = "0 0 5px #9694FF, 0 0 10px #9694FF, 0 0 20px #EBEAFF";

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  return (
    <div>
      {!notShowSidebar && gameInfo ? (
        <div style={{ userSelect: "none" }} className="h-screen">
          <div className="flex flex-row">
            <div className="flex w-2/7 bg-gradient-to-r from-gray-900/60 to-gray-900/60 h-screen border border-">
              <div className="flex-1 m-2 border-2 box-border">
                <div className="flex flex-col m-2 text-center py-2 text-[33px]">
                  {/* GAME INFO */}
                  <div className="m-2">
                    <Link
                      to={`/game-info/${gameInfo.gameInfoId}`}
                      className={linkStyle}
                      onClick={() =>
                        setActiveLink(`/game-info/${gameInfo.gameInfoId}`)
                      }
                      state={{ gameInfo }}
                      style={
                        activeLink === `/game-info/${gameInfo.gameInfoId}`
                          ? {
                              color: "#D7C3F1",
                              textShadow: textShadow,
                            }
                          : {
                              textShadow: textShadow,
                            }
                      }
                    >
                      GAME INFO
                    </Link>
                  </div>

                  {/* COMMUNITY */}
                  <div className="m-2">
                    <Link
                      to={`/game-info/${gameInfo.gameInfoId}/board`}
                      className={linkStyle}
                      onClick={() =>
                        setActiveLink(`/game-info/${gameInfo.gameInfoId}/board`)
                      }
                      state={{ gameInfo }}
                      style={
                        activeLink === `/game-info/${gameInfo.gameInfoId}/board`
                          ? {
                              color: "#D7C3F1",
                              textShadow: textShadow,
                            }
                          : {
                              color: "white",
                              textShadow: textShadow,
                            }
                      }
                    >
                      COMMUNITY
                    </Link>
                  </div>

                  {/* GAME REVIEW */}
                  <div className="m-2">
                    <Link
                      to={`/game-info/${gameInfo.gameInfoId}/review`}
                      className={linkStyle}
                      onClick={() =>
                        setActiveLink(
                          `/game-info/${gameInfo.gameInfoId}/review`
                        )
                      }
                      state={{ gameInfo }}
                      style={
                        activeLink ===
                        `/game-info/${gameInfo.gameInfoId}/review`
                          ? {
                              color: "#D7C3F1",
                              textShadow: textShadow,
                            }
                          : {
                              textShadow: textShadow,
                            }
                      }
                    >
                      GAME REVIEW
                    </Link>
                  </div>

                  {/* VIDEO */}
                  <div className="m-2">
                    <Link
                      to={`/game-info/${gameInfo.gameInfoId}/video`}
                      className={linkStyle}
                      onClick={() =>
                        setActiveLink(`/game-info/${gameInfo.gameInfoId}/video`)
                      }
                      state={{ gameInfo }}
                      style={
                        activeLink === `/game-info/${gameInfo.gameInfoId}/video`
                          ? {
                              color: "#D7C3F1",
                              textShadow: textShadow,
                            }
                          : {
                              textShadow: textShadow,
                            }
                      }
                    >
                      VIDEO
                    </Link>
                  </div>

                  {/* CUSTOM */}
                  <div className="m-2">
                    <Link
                      to={`/game-info/${gameInfo.gameInfoId}/custom`}
                      className={linkStyle}
                      onClick={() =>
                        setActiveLink(
                          `/game-info/${gameInfo.gameInfoId}/custom`
                        )
                      }
                      state={{ gameInfo }}
                      style={
                        activeLink ===
                        `/game-info/${gameInfo.gameInfoId}/custom`
                          ? {
                              color: "#D7C3F1",
                              textShadow: textShadow,
                            }
                          : {
                              textShadow: textShadow,
                            }
                      }
                    >
                      GAME CUSTOM
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1">{children}</div>
          </div>
        </div>
      ) : (
        <main>{children}</main>
      )}
    </div>
  );
};

export default SideLayout;
