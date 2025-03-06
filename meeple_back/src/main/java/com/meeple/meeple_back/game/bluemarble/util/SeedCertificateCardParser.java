package com.meeple.meeple_back.game.bluemarble.util;

import com.meeple.meeple_back.game.bluemarble.domain.SeedCertificateCard;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class SeedCertificateCardParser implements ExcelReader<SeedCertificateCard> {

	@Override
	public List<SeedCertificateCard> readExcelFile() {
		List<SeedCertificateCard> cards = new ArrayList<>();

		try (InputStream fis = getClass().getResourceAsStream("/game-element/seed-card.xlsx");
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
				String description = row.getCell(4).getStringCellValue();
				String cardColor = row.getCell(5).getStringCellValue();
				int seedCount = (int) row.getCell(6).getNumericCellValue();
				int baseConstructionCost = (int) row.getCell(7).getNumericCellValue();
				int headquartersUsageFee = (int) row.getCell(8).getNumericCellValue();
				int baseUsageFee = (int) row.getCell(9).getNumericCellValue();

				cards.add(new SeedCertificateCard(id, number, name, cardColor, seedCount, description, baseConstructionCost, headquartersUsageFee, baseUsageFee));
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return cards;
	}

}
