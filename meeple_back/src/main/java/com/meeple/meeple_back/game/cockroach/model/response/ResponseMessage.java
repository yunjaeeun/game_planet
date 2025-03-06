package com.meeple.meeple_back.game.cockroach.model.response;

import com.meeple.meeple_back.game.cockroach.model.entity.Room;
import com.meeple.meeple_back.user.model.User;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ResponseMessage {
    @Schema(description = "해당 게임방 pk", example = "1")
    private String roomId;

    @Schema(description = "메세지 발송자", example = "nick1")
    private String sender;

    @Schema(description = "메세지 내용", example = "내용")
    private String content;

    @Schema(description = "메세지 발송 시간", example = "20240120T12:12")
    private LocalDateTime timestamp;
}
