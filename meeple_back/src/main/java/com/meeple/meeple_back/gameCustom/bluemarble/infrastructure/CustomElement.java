package com.meeple.meeple_back.gameCustom.bluemarble.infrastructure;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_game_custom_element")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomElement {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer customId;

	@Column(length = 20)
	private String customName;

	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
}
