package com.meeple.meeple_back.gameInfo.controller;

import com.meeple.meeple_back.gameInfo.model.request.commnity.RequestCreateComment;
import com.meeple.meeple_back.gameInfo.model.request.commnity.RequestCreateCommunity;
import com.meeple.meeple_back.gameInfo.model.request.commnity.RequestUpdateComment;
import com.meeple.meeple_back.gameInfo.model.request.commnity.RequestUpdateCommunity;
import com.meeple.meeple_back.gameInfo.model.request.gameInfo.RequestCreateGameInfo;
import com.meeple.meeple_back.gameInfo.model.request.gameReview.RequestCreateReview;
import com.meeple.meeple_back.gameInfo.model.request.gameInfo.RequestUpdateGameInfo;
import com.meeple.meeple_back.gameInfo.model.request.gameReview.RequestUpdateReview;
import com.meeple.meeple_back.gameInfo.model.response.community.*;
import com.meeple.meeple_back.gameInfo.model.response.gameInfo.*;
import com.meeple.meeple_back.gameInfo.model.response.gameReview.ResponseCreateReview;
import com.meeple.meeple_back.gameInfo.model.response.gameReview.ResponseReviewList;
import com.meeple.meeple_back.gameInfo.model.response.gameReview.ResponseUpdateReview;
import com.meeple.meeple_back.gameInfo.service.GameInfoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/game-info")
@Tag(name = "GameInfo", description = "게임 정보 관련 API")
public class GameInfoController {
    private final GameInfoService gameInfoService;

    @Autowired
    public GameInfoController(GameInfoService gameInfoService) {
        this.gameInfoService = gameInfoService;
    }


    @Operation(summary = "게임 정보 목록 조회", description = "게임 정보 목록을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "성공적으로 게임 정보 목록을 반환함")
    })
    @GetMapping
    public ResponseEntity<ResponseGameInfoList> findGameInfoList() {

        ResponseGameInfoList response = gameInfoService.getGameInfoList();

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "게임 정보 생성", description = "새로운 게임 정보를 생성합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "게임 정보가 성공적으로 생성됨"),
            @ApiResponse(responseCode = "400", description = "요청 데이터가 올바르지 않음")
    })
    @PostMapping
    public ResponseEntity<ResponseCreateGameInfo> createGameInfo(
            @RequestBody RequestCreateGameInfo request
    ) {

        ResponseCreateGameInfo response = gameInfoService.createGameInfo(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "게임 정보 조회", description = "특정 게임 정보를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "게임 정보 반환"),
            @ApiResponse(responseCode = "404", description = "게임 정보를 찾을 수 없음")
    })
    @GetMapping("/{gameInfoId}")
    public ResponseEntity<ResponseGameInfo> findGameInfo(
            @PathVariable int gameInfoId
    ) {
        ResponseGameInfo response = gameInfoService.getGameInfo(gameInfoId);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{gameInfoId}/{gameCommunityId}")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "게임 정보가 성공적으로 수정됨"),
            @ApiResponse(responseCode = "404", description = "게임 정보를 찾을 수 없음"),
            @ApiResponse(responseCode = "400", description = "요청 데이터가 올바르지 않음")
    })
    public ResponseEntity<ResponseCommunity> findcommunity(
            @PathVariable int gameInfoId,
            @PathVariable int gameCommunityId
    ) {
        ResponseCommunity response = gameInfoService.findCommunity(gameInfoId, gameCommunityId);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "게임 정보 수정", description = "특정 게임 정보를 수정합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "게임 정보가 성공적으로 수정됨"),
            @ApiResponse(responseCode = "404", description = "게임 정보를 찾을 수 없음"),
            @ApiResponse(responseCode = "400", description = "요청 데이터가 올바르지 않음")
    })
    @PutMapping("/{gameInfoId}")
    public ResponseEntity<String> updateGameInfo(
            @PathVariable int gameInfoId,
            @RequestBody RequestUpdateGameInfo request
    ) {
        ResponseUpdateGameInfo response = gameInfoService.updateGameInfo(gameInfoId, request);

        return ResponseEntity.status(response.getCode()).body(response.getMessage());
    }

    @Operation(summary = "게임 정보 삭제", description = "특정 게임 정보를 삭제합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "게임 정보가 성공적으로 삭제됨"),
            @ApiResponse(responseCode = "404", description = "게임 정보를 찾을 수 없음")
    })
    @DeleteMapping("/{gameInfoId}")
    public ResponseEntity<String> deleteGameInfo(
            @PathVariable int gameInfoId
    ) {
        ResponseDeleteGameInfo deleteGameInfo = gameInfoService.deleteGameInfo(gameInfoId);

        return ResponseEntity.status(deleteGameInfo.getCode()).body(deleteGameInfo.getMessage());
    }

    @Operation(summary = "게임 리뷰 등록", description = "리뷰를 등록합니다.")
    @PostMapping("/review")
    public ResponseEntity<ResponseCreateReview> craeteGameReivew(
            @RequestBody RequestCreateReview request
    ) {
        ResponseCreateReview response = gameInfoService.createReview(request);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @Operation(summary = "게임 리뷰 목록 조회", description = "해당 게임의 리뷰를 전부 조회합니다.")
    @GetMapping("/review")
    public ResponseEntity<ResponseReviewList> getReviewList(
            @RequestParam int gameInfoId
    ) {
        ResponseReviewList response = gameInfoService.getReviewList(gameInfoId);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "게임 리뷰 삭제", description = "리뷰를 삭제합니다.")
    @DeleteMapping("/review/{reviewId}")
    public ResponseEntity<String> deleteReview(
            @PathVariable int reviewId
    ) {
        gameInfoService.deleteReview(reviewId);

        return ResponseEntity.ok("삭제 성공");
    }

    @Operation(summary = "게임 리뷰 수정", description = "리뷰를 수정합니다.")
    @PutMapping("/review/{reviewId}")
    public ResponseEntity<ResponseUpdateReview> updateReview(
            @PathVariable int reviewId,
            @RequestBody RequestUpdateReview request
    ) {
        ResponseUpdateReview response = gameInfoService.updateReview(reviewId, request);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "커뮤니티 게시글 등록", description = "게시글을 등록합니다.")
    @PostMapping("/community")
    public ResponseEntity<ResponseCreateCommunity> createCommunity(
            @RequestBody RequestCreateCommunity request
    ) {
        ResponseCreateCommunity response = gameInfoService.createCommunity(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "커뮤니티 게시글 조회", description = "해당 게임 정보의 커뮤니티 게시글 목록을 조회합니다.")
    @GetMapping("/community")
    public ResponseEntity<List<ResponseCommunityList>> getCommunityList(
            @RequestParam int gameInfoId
    ) {
        List<ResponseCommunityList> response = gameInfoService.getCommunityList(gameInfoId);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "커뮤니티 게시글 수정", description = "게시글을 수정합니다.")
    @PutMapping("/community/{gameCommunityId}")
    public ResponseEntity<ResponseUpdateCommunity> updateCommunity(
            @PathVariable int gameCommunityId,
            @RequestBody RequestUpdateCommunity request
    ) {
        ResponseUpdateCommunity response = gameInfoService.updateCommunity(gameCommunityId, request);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "커뮤니티 게시글 삭제", description = "게시글을 삭제합니다.")
    @DeleteMapping("/community/{gameCommunityId}")
    public ResponseEntity<ResponseDeleteCommunity> deleteCommunity(
            @PathVariable int gameCommunityId
    ) {
        ResponseDeleteCommunity response = gameInfoService.deleteCommunity(gameCommunityId);

        return ResponseEntity.ok(response);
    }


    @Operation(summary = "커뮤니티 게시글 댓글 등록", description = "게시글 댓글을 등록합니다")
    @PostMapping("/comment")
    public ResponseEntity<ResponseCreateComment> createComment(
            @RequestBody RequestCreateComment request
    ) {
        ResponseCreateComment response = gameInfoService.createComment(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "커뮤니티 게시글 댓글 수정", description = "게시글 댓글을 수정합니다.")
    @PutMapping("/comment/{gameCommunityCommentId}")
    public ResponseEntity<ResponseUpdateComment> updateComment(
            @PathVariable int gameCommunityCommentId,
            @RequestBody RequestUpdateComment request
    ) {
        ResponseUpdateComment response = gameInfoService.updateComment(gameCommunityCommentId, request);

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "커뮤니티 게시글 삭제", description = "게시글을 삭제합니다.")
    @DeleteMapping("/community/{gameCommunityCommentId}")
    public ResponseEntity<ResponseDeleteComment> deleteComment(
            @PathVariable int gameCommunityCommentId
    ) {
        ResponseDeleteComment response = gameInfoService.deleteComment(gameCommunityCommentId);

        return ResponseEntity.ok(response);
    }
}

