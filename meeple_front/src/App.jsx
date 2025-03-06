// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminPage from "./pages/admin/AdminPage";
import BoardPage from "./pages/gameInfo/board/BoardPage";
import BurumabulPage from "./pages/game/burumabul/BurumabulPage";
import GameInfoPage from "./pages/gameInfo/GameInfoPage";
import HomePage from "./pages/home/HomePage";
import ProfilePage from "./pages/profile/ProfilePage";
import CustomPage from "./pages/proposal/CustomPage";
import CockroachPokerPage from "./pages/game/CockroachPokerPage";
import MainPage from "./pages/main/MainPage";
import TopLayout from "./components/layout/TopLayout";
import SideLayout from "./components/layout/SideLayout";
import Introduce from "./pages/introduce/Introduce";
import ScrollToTop from "./components/layout/ScrollToTop";
import CatchMindPage from "./pages/game/CatchMindPage";
import FriendModalLayout from "./components/layout/FriendModalLayout";
import CatchMindListPage from "./components/game/catchMind/roomList/CatchMindListPage";

import NewArticlePage from "./pages/gameInfo/board/NewArticlePage";
import GameRulePage from "./pages/gameInfo/GameRulePage";
import ArticleDetailPage from "./pages/gameInfo/board/ArticleDetailPage";
import ReviewPage from "./pages/gameInfo/ReviewPage";
import GameVideoPage from "./pages/gameInfo/GameVideoPage";

import CockroachRoom from "./components/game/cockroachcard/CockroachRoom";
import BurumabulRoomListPage from "./pages/game/burumabul/BurumabulRoomListPage";
import SocketLayout from "./components/layout/SocketLayout";
import EditArticlePage from "./pages/gameInfo/board/EditArticlePage";
import FallingStars from "./components/background/FallingStars";

import ErrorPage from "./pages/error/ErrorPage";
import CustomEditor from "./components/info/gamecustom/CustomEditor";
import BackGroundMusic from "./components/background/BackGroundMusic";
import CustomDetail from "./components/info/gamecustom/CustomDetail";
import BackgroundMusic from "./components/background/BackGroundMusic";
import ReportDetail from "./components/admin/ReportDetail";



function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <BackGroundMusic />
      <TopLayout>
        <SideLayout>
          <FallingStars />
          <FriendModalLayout>
            <Routes>
              {/* Admin */}
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/report/:reportId" element={<ReportDetail />} />

              {/* Board */}
              <Route path="/board" element={<BoardPage />} />
              <Route path="/board/:boardId" element={<BoardPage />} />

              {/* Game */}
              <Route
                path="/game/burumabul/start/:roomId"
                element={
                  <SocketLayout>
                    <BurumabulPage />
                  </SocketLayout>
                }
              />
              <Route
                path="/burumabul/room-list"
                element={
                  <SocketLayout>
                    <BurumabulRoomListPage />
                  </SocketLayout>
                }
              />

              {/* GameInfo */}
              <Route path="/game-info/:gameInfoId" element={<GameInfoPage />} />
              <Route
                path="/game-info/:gameInfoId/rule"
                element={<GameRulePage />}
              />
              <Route
                path="/game-info/:gameInfoId/board"
                element={<BoardPage />}
              />
              <Route
                path="/game-info/:gameInfoId/board/write"
                element={<NewArticlePage />}
              />
              <Route
                path="/game-info/:gameInfoId/board/detail/:gameCommunityId"
                element={<ArticleDetailPage />}
              />
              <Route
                path="/game-info/:gameInfoId/board/edit/:gameCommunityId"
                element={<EditArticlePage />}
              />
              <Route
                path="/game-info/:gameInfoId/review"
                element={<ReviewPage />}
              />
              <Route
                path="/game-info/:gameInfoId/video"
                element={<GameVideoPage />}
              />

              <Route path="/catch-mind/:roomId" element={<CatchMindPage />} />
              <Route path="/catch-mind" element={<CatchMindListPage />} />

              {/* Home & Main */}
              <Route path="/home" element={<HomePage />} />
              <Route path="/" element={<MainPage />} />

              {/* GameInfo */}
              <Route path="/game/:gameId" element={<GameInfoPage />} />

              {/* Profile */}
              <Route path="/profile/:userId" element={<ProfilePage />} />

              {/* custom */}
              <Route
                path="/game-info/:gameInfoId/custom"
                element={<CustomPage />}
              />
              <Route path="/game-info/:gameInfoId/custom/editor" 
              element={<CustomEditor/>}/>
              <Route path="/game-info/:gameInfoId/custom/detail/:customId"
              element={<CustomDetail/>}/>


              {/* Cockroach Room List */}
              <Route path="/test/cockroach" element={<CockroachRoom />} />

              {/* INTRODUCE */}
              <Route path="/introduce" element={<Introduce />} />

              {/* ERROR */}
              <Route path="/errorpage" element={<ErrorPage />} />
            </Routes>
          </FriendModalLayout>
        </SideLayout>
      </TopLayout>
    </BrowserRouter>
  );
}

export default App;
