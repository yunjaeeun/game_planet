package com.meeple.meeple_back.game.bluemarble.util;

import com.meeple.meeple_back.game.bluemarble.domain.CardType;
import com.meeple.meeple_back.game.bluemarble.domain.NeuronsValleyCard;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class NeuronsValleyParser implements ExcelReader<NeuronsValleyCard> {
	@Override
	public List<NeuronsValleyCard> readExcelFile() {
		List<NeuronsValleyCard> cards = new ArrayList<>();

		try (InputStream fis = getClass().getResourceAsStream("/game-element/neurons-valley.xlsx");
		     Workbook workbook = new XSSFWorkbook(fis)) {

			Sheet sheet = workbook.getSheetAt(0);
			Iterator<Row> rowIterator = sheet.iterator();

			// 첫 번째 행(헤더) 건너뛰기
			rowIterator.next();

			while (rowIterator.hasNext()) {
				Row row = rowIterator.next();
				int id = (int) row.getCell(0).getNumericCellValue();
				int number = (int) row.getCell(1).getNumericCellValue();
				String name = row.getCell(2).getStringCellValue();
				String description = row.getCell(3).getStringCellValue();

				cards.add(new NeuronsValleyCard(id, number, name, CardType.NEURONS_VALLEY_CARD, description));
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return cards;
	}
}
