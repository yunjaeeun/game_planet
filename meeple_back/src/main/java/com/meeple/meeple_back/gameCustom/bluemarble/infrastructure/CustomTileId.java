package com.meeple.meeple_back.gameCustom.bluemarble.infrastructure;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomTileId implements java.io.Serializable {
	private Integer customId;
	private Integer tileId;
}
