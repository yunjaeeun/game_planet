package com.meeple.meeple_back.game.cockroach.model.entity;

import com.meeple.meeple_back.user.model.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Entity
@Table(name = "tbl_chat")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chat_id")
    private int chatId;

    @Column(name = "chat_time")
    private LocalDateTime timestamp;

    @Column(name = "chat_content")
    private String content;

    @JoinColumn(name = "send_user_id")
    @ManyToOne
    private User sender;

    @JoinColumn(name = "room_id")
    @ManyToOne
    private Room roomId;
}
