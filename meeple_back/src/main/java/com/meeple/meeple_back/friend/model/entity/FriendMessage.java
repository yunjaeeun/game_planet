package com.meeple.meeple_back.friend.model.entity;

import com.meeple.meeple_back.user.model.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_friend_message")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class FriendMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "friend_message_id")
    private int friendMessageId;

    @Column(name = "friend_message_content")
    private String content;

    @Column(name = "friend_message_created_at")
    private LocalDateTime createdAt;

    @Column(name = "friend_message_deleted_at")
    private LocalDateTime deletedAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "sender_id")
    private User sender;
}
