package com.meeple.meeple_back.friend.model.entity;

import com.meeple.meeple_back.friend.model.FriendStatus;
import com.meeple.meeple_back.user.model.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tbl_friend")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Friend {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "friend_id")
    private int friendId;

    @Enumerated(EnumType.STRING)
    @Column(name = "friend_status", nullable = false)
    private FriendStatus friendStatus;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "friend_user_id", nullable = false)
    private User friend;
}
