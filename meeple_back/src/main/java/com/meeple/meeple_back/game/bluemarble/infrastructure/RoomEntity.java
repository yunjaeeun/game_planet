package com.meeple.meeple_back.game.bluemarble.infrastructure;

import com.meeple.meeple_back.game.game.model.Game;
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
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tbl_room")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "room_id")
	private int roomId;

	@Column(name = "room_name")
	private String roomName;

	@Column(name = "create_time")
	private LocalDateTime createTime;

	@JoinColumn(name = "game_id")
	@ManyToOne
	private Game game;

}

