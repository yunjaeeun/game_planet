package com.meeple.meeple_back.common.domain.exception;

public class ResourceNotFoundException extends RuntimeException {
	private long id;

	public ResourceNotFoundException(String datasource, long id) {
		super(datasource + "에서 ID " + id + "를 찾을 수 없습니다.");
		this.id = id;
	}

	public long getId() {
		return id;
	}
}
