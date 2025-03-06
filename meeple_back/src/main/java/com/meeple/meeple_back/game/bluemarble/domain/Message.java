package com.meeple.meeple_back.game.bluemarble.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {

	private String type;
	private int sender;
	private String content;
}