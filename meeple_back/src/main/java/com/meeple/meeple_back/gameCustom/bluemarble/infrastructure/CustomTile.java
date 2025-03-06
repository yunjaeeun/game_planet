package com.meeple.meeple_back.gameCustom.bluemarble.infrastructure;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tbl_custom_tile")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomTile {

	@EmbeddedId
	private CustomTileId id;

	@ManyToOne
	@MapsId("customId")
	@JoinColumn(name = "custom_id")
	private CustomElement customElement;

	@ManyToOne
	@MapsId("tileId")
	@JoinColumn(name = "tile_id")
	private Tile tile;
}