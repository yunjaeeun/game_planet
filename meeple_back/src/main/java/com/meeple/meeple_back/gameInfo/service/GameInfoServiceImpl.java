package com.meeple.meeple_back.gameInfo.service;

import com.meeple.meeple_back.game.game.model.Game;
import com.meeple.meeple_back.game.repo.GameRepository;
import com.meeple.meeple_back.gameInfo.dto.SimpleUserDTO;
import com.meeple.meeple_back.gameInfo.model.entity.GameCommunity;
import com.meeple.meeple_back.gameInfo.model.entity.GameCommunityComment;
import com.meeple.meeple_back.gameInfo.model.entity.GameInfo;
import com.meeple.meeple_back.gameInfo.model.entity.GameReview;
import com.meeple.meeple_back.gameInfo.model.request.commnity.RequestCreateComment;
import com.meeple.meeple_back.gameInfo.model.request.commnity.RequestCreateCommunity;
import com.meeple.meeple_back.gameInfo.model.request.commnity.RequestUpdateComment;
import com.meeple.meeple_back.gameInfo.model.request.commnity.RequestUpdateCommunity;
import com.meeple.meeple_back.gameInfo.model.request.gameReview.RequestUpdateReview;
import com.meeple.meeple_back.gameInfo.model.response.community.*;
import com.meeple.meeple_back.gameInfo.model.response.gameReview.ResponseCreateReview;
import com.meeple.meeple_back.gameInfo.model.request.gameInfo.RequestCreateGameInfo;
import com.meeple.meeple_back.gameInfo.model.request.gameReview.RequestCreateReview;
import com.meeple.meeple_back.gameInfo.model.request.gameInfo.RequestUpdateGameInfo;
import com.meeple.meeple_back.gameInfo.model.response.gameInfo.*;
import com.meeple.meeple_back.gameInfo.model.response.gameReview.ResponseReviewList;
import com.meeple.meeple_back.gameInfo.model.response.gameReview.ResponseUpdateReview;
import com.meeple.meeple_back.gameInfo.repository.GameCommunityCommentRepository;
import com.meeple.meeple_back.gameInfo.repository.GameCommunityRepository;
import com.meeple.meeple_back.gameInfo.repository.GameInfoRepository;
import com.meeple.meeple_back.gameInfo.repository.GameReviewRepository;
import com.meeple.meeple_back.user.model.User;
import com.meeple.meeple_back.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class GameInfoServiceImpl implements GameInfoService {

    private final GameCommunityRepository gameCommunityRepository;
    private final GameInfoRepository gameInfoRepository;
    private final GameReviewRepository gameReviewRepository;
    private final GameCommunityCommentRepository gameCommunityCommentRepository;
    private final GameRepository gameRepository;
    private final UserRepository userRepository;
    private final ModelMapper mapper;


    @Override
    public ResponseGameInfoList getGameInfoList() {
        List<GameInfo> gameInfoList = gameInfoRepository.findAll();

        ResponseGameInfoList response = ResponseGameInfoList.builder()
                .gameInfoList(gameInfoList)
                .build();

        return response;
    }

    @Override
    @Transactional
    public ResponseCreateGameInfo createGameInfo(RequestCreateGameInfo request) {
        Game game = gameRepository.findById(request.getGameId()).get();

        GameInfo gameInfo = GameInfo.builder()
                .gameInfoContent(request.getGameInfoContent())
                .gameRule(request.getGameRule())
                .game(game)
                .build();

        GameInfo createdGameInfo = gameInfoRepository.save(gameInfo);

        ResponseCreateGameInfo response = ResponseCreateGameInfo.builder()
                .gameInfoId(createdGameInfo.getGameInfoId())
                .game(createdGameInfo.getGame())
                .build();

        return response;
    }

    @Override
    public ResponseGameInfo getGameInfo(int gameInfoId) {
        GameInfo gameInfo = gameInfoRepository.findById(gameInfoId).get();

        ResponseGameInfo response = ResponseGameInfo.builder()
                .gameInfoId(gameInfo.getGameInfoId())
                .gameInfoContent(gameInfo.getGameInfoContent())
                .gameRule(gameInfo.getGameRule())
                .gameInfoFile(gameInfo.getGameInfoFile())
                .game(gameInfo.getGame())
                .build();

        return response;
    }

    @Override
    @Transactional
    public ResponseUpdateGameInfo updateGameInfo(int gameInfoId, RequestUpdateGameInfo request) {
        GameInfo gameInfo = gameInfoRepository.findById(gameInfoId)
                .orElseThrow(() -> new EntityNotFoundException("게임 정보를 찾을 수 없습니다."));

        if (request.getGameInfoContent() != null) {
            gameInfo.setGameInfoContent(request.getGameInfoContent());
        }

        if (request.getGameRule() != null) {
            gameInfo.setGameRule(request.getGameRule());
        }

        gameInfoRepository.save(gameInfo);

        return new ResponseUpdateGameInfo(200, gameInfoId + "번 게임 정보 업데이트 성공");
    }

    @Override
    public ResponseDeleteGameInfo deleteGameInfo(int gameInfoId) {
        GameInfo gameInfo = gameInfoRepository.findById(gameInfoId)
                .orElseThrow(() -> new EntityNotFoundException("게임 정보를 찾을 수 없습니다."));

        try {
            gameInfoRepository.delete(gameInfo);

            ResponseDeleteGameInfo response = ResponseDeleteGameInfo
                    .builder()
                    .code(200)
                    .message("삭제 성공")
                    .build();

            return response;
        } catch (Exception e) {
            ResponseDeleteGameInfo response = ResponseDeleteGameInfo.builder()
                    .code(500)
                    .message("삭제 실패")
                    .build();
            return response;
        }
    }

    @Override
    public ResponseCreateReview createReview(RequestCreateReview request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 유저입니다."));

        GameInfo gameInfo = gameInfoRepository.findById(request.getGameInfoId())
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 게임 정보입니다."));

        GameReview gameReview = GameReview.builder()
                .gameReviewContent(request.getGameReviewContent())
                .gameReviewStar(request.getGameReviewStar())
                .gameInfo(gameInfo)
                .user(user)
                .build();

        GameReview savedReview = gameReviewRepository.save(gameReview);

        ResponseCreateReview response = ResponseCreateReview.builder()
                .reviewId(savedReview.getGameReviewId())
                .user(user)
                .gameInfo(gameInfo)
                .build();

        return response;
    }

    @Override
    public ResponseReviewList getReviewList(int gameInfoId) {
        List<GameReview> gameReviews = gameReviewRepository.findByGameInfo_GameInfoId(gameInfoId);

        double averageStar = gameReviews.stream()
                .mapToInt(GameReview::getGameReviewStar)
                .average()
                .orElse(0.0);


        ResponseReviewList response = ResponseReviewList.builder()
                .reviewList(gameReviews)
                .starAvg(averageStar)
                .build();

        return response;
    }

    @Override
    public void deleteReview(int reviewId) {
        GameReview gameReview = gameReviewRepository.findById(reviewId)
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 리뷰입니다"));

        gameReviewRepository.delete(gameReview);
    }

    @Override
    public ResponseUpdateReview updateReview(int reviewId, RequestUpdateReview request) {
        GameReview gameReview = gameReviewRepository.findById(reviewId)
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 리뷰입니다"));

        if (!request.getGameReviewContent().equals(gameReview.getGameReviewContent())) {
            gameReview.setGameReviewContent(request.getGameReviewContent());
        }

        if (request.getGameReviewStar() != gameReview.getGameReviewStar()) {
            gameReview.setGameReviewStar(request.getGameReviewStar());
        }

        GameReview savedGameReview = gameReviewRepository.save(gameReview);


        ResponseUpdateReview response = ResponseUpdateReview.builder()
                .gameReviewId(savedGameReview.getGameReviewId())
                .gameReviewContent(savedGameReview.getGameReviewContent())
                .gameReviewStar(savedGameReview.getGameReviewStar())
                .gameInfo(savedGameReview.getGameInfo())
                .user(savedGameReview.getUser())
                .build();

        return response;
    }

    @Override
    public ResponseCreateCommunity createCommunity(RequestCreateCommunity request) {
        GameCommunity gameCommunity = new GameCommunity();

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 회원"));

        GameInfo gameInfo = gameInfoRepository.findById(request.getGameInfoId())
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 게임 정보"));

        gameCommunity.setUser(user);
        gameCommunity.setGameInfo(gameInfo);
        gameCommunity.setCreateAt(Date.valueOf(LocalDate.now()));
        gameCommunity.setGameCommunityContent(request.getGameCommunityContent());

        GameCommunity savedCommunity = gameCommunityRepository.save(gameCommunity);

        ResponseCreateCommunity response = ResponseCreateCommunity.builder()
                .gameCommunityId(savedCommunity.getGameCommunityId())
                .createAt(savedCommunity.getCreateAt())
                .user(savedCommunity.getUser())
                .gameInfo(savedCommunity.getGameInfo())
                .build();

        return response;
    }

    @Override
    public List<ResponseCommunityList> getCommunityList(int gameInfoId) {
        List<GameCommunity> gameCommunityList = gameCommunityRepository
                .findByGameInfo_GameInfoIdAndDeletedAtIsNull(gameInfoId);
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);


        return gameCommunityList.stream().map(gameCommunity -> {
            // 게시글 DTO 변환
            ResponseCommunityList response = mapper.map(gameCommunity, ResponseCommunityList.class);

            // 작성자 정보 변환
            SimpleUserDTO simpleUserDTO = new SimpleUserDTO();
            simpleUserDTO.setUserId(gameCommunity.getUser().getUserId());
            simpleUserDTO.setNickname(gameCommunity.getUser().getUserNickname());
            response.setUser(simpleUserDTO);

            // 해당 게시글의 댓글 리스트 조회
            List<GameCommunityComment> commentList = gameCommunityCommentRepository
                    .findByGameCommunity_GameCommunityIdAndDeletedAtIsNull(gameCommunity.getGameCommunityId());

            // 댓글 DTO 변환
            List<ResponseCommentList> responseComments = commentList.stream().map(comment -> {
                ResponseCommentList commentDTO = new ResponseCommentList();
                commentDTO.setGameCommunityCommentId(comment.getGameCommunityCommentId());
                commentDTO.setGameCommunityCommentContent(comment.getGameCommunityCommentContent());
                commentDTO.setCreateAt(comment.getCreateAt());

                // 댓글 작성자 정보 설정
                SimpleUserDTO commentUser = new SimpleUserDTO();
                commentUser.setUserId(comment.getUser().getUserId());
                commentUser.setNickname(comment.getUser().getUserNickname());
                commentDTO.setUser(commentUser);

                return commentDTO;
            }).collect(Collectors.toList());

            // 댓글 리스트 설정
            response.setCommentList(responseComments);

            return response;
        }).collect(Collectors.toList());
    }

    @Override
    public ResponseCommunity findCommunity(int gameInfoId, int gameCommunityId) {
        GameCommunity gameCommunity = gameCommunityRepository.findById(gameCommunityId)
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 커뮤니티 게시글입니다."));

        ResponseCommunity response = ResponseCommunity.builder()
                .code(200)
                .message("조회 성공")
                .gameCommunity(gameCommunity)
                .build();

        return response;
    }

    @Override
    public ResponseCreateComment createComment(RequestCreateComment request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 회원"));
        GameCommunity gameCommunity = gameCommunityRepository.findById(request.getGameCommunityId())
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 게시글"));

        GameCommunityComment comment = GameCommunityComment.builder()
                .user(user)
                .gameCommunityCommentContent(request.getContent())
                .gameCommunity(gameCommunity)
                .createAt(Date.valueOf(LocalDate.now()))
                .build();

        GameCommunityComment savedComment = gameCommunityCommentRepository.save(comment);

        ResponseCreateComment response = ResponseCreateComment.builder()
                .gameCommunityCommentId(savedComment.getGameCommunityCommentId())
                .createdAt(savedComment.getCreateAt())
                .userName(user.getUserNickname())
                .build();

        return response;
    }

    @Override
    public ResponseUpdateCommunity updateCommunity(int gameCommunityId, RequestUpdateCommunity request) {
        GameCommunity gameCommunity = gameCommunityRepository.findById(gameCommunityId)
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 게시글입니다."));

        if (!request.getGameCommunityContent().equals(gameCommunity.getGameCommunityContent())) {
            gameCommunity.setGameCommunityContent(request.getGameCommunityContent());
        }

        gameCommunityRepository.save(gameCommunity);

        ResponseUpdateCommunity response = ResponseUpdateCommunity.builder()
                .code(200)
                .message("성공적으로 업데이트 됨")
                .build();

        return response;
    }

    @Override
    public ResponseDeleteCommunity deleteCommunity(int gameCommunityId) {
        GameCommunity gameCommunity = gameCommunityRepository.findById(gameCommunityId)
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 게시글입니다."));

        gameCommunity.setDeletedAt(Date.valueOf(LocalDate.now()));

        GameCommunity deletedCommunity = gameCommunityRepository.save(gameCommunity);

        ResponseDeleteCommunity response = ResponseDeleteCommunity.builder()
                .code(200)
                .message("성공적으로 삭제 됨")
                .deletedDate(deletedCommunity.getDeletedAt())
                .build();

        return response;
    }

    @Override
    public ResponseUpdateComment updateComment(int gameCommunityCommentId, RequestUpdateComment request) {
        GameCommunityComment comment = gameCommunityCommentRepository.findById(gameCommunityCommentId)
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 댓글입니다."));

        if (!request.getContent().equals(comment.getGameCommunityCommentContent())) {
            comment.setGameCommunityCommentContent(request.getContent());
        }

        gameCommunityCommentRepository.save(comment);

        ResponseUpdateComment response = ResponseUpdateComment.builder()
                .code(200)
                .message("성공적으로 업데이트 됨")
                .build();

        return response;
    }

    @Override
    public ResponseDeleteComment deleteComment(int gameCommunityCommentId) {
        GameCommunityComment comment = gameCommunityCommentRepository.findById(gameCommunityCommentId)
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 댓글입니다."));

        comment.setDeletedAt(Date.valueOf(LocalDate.now()));

        GameCommunityComment deleteComment = gameCommunityCommentRepository.save(comment);

        ResponseDeleteComment response = ResponseDeleteComment.builder()
                .code(200)
                .message("성공적으로 업데이트 됨")
                .deletedDate(deleteComment.getDeletedAt())
                .build();

        return response;
    }
}
