package com.meeple.meeple_back.game.bluemarble.util;

import java.util.List;

public interface ExcelReader<T> {
	List<T> readExcelFile();
}
