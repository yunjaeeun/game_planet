package com.meeple.meeple_back.gameInfo.model.entity;

import com.meeple.meeple_back.user.model.User;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;

@Entity
@Table(name = "tbl_game_community_comment")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GameCommunityComment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "game_community_comment_id")
    private int gameCommunityCommentId;

    @Column(name = "game_community_comment_content")
    private String gameCommunityCommentContent;

    @Column(name = "created_at")
    private Date createAt;

    @Column(name = "deleted_at")
    private Date deletedAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "game_community_id")
    private GameCommunity gameCommunity;
}
