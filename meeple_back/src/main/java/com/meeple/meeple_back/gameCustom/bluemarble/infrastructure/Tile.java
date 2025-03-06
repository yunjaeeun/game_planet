package com.meeple.meeple_back.gameCustom.bluemarble.infrastructure;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tbl_tile")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tile {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer tileId;

	@Column(length = 20)
	private String tileName;

	@Column(length = 50)
	private String tileType;

	@Column(length = 100)
	private String tileImageUrl;

	private Integer tilePrice;

	private Integer tileNumber;
}