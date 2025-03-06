package com.meeple.meeple_back.gameCustom.bluemarble.infrastructure;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomCardId implements java.io.Serializable {
	private Integer customId;
	private Integer cardId;
}
