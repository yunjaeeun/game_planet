package com.meeple.meeple_back.game.bluemarble.util;

import com.meeple.meeple_back.game.bluemarble.domain.Tile;
import com.meeple.meeple_back.game.bluemarble.domain.TileType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class TileParser implements ExcelReader<Tile> {

	@Override
	public List<Tile> readExcelFile() {
		String excelFilePath = "resources/bluemarble-tile.xlsx";
		List<Tile> tiles = new ArrayList<>();

		try (InputStream fis = getClass().getResourceAsStream("/game-element/bluemarble-tile.xlsx");
		     Workbook workbook = new XSSFWorkbook(fis)) {

			Sheet sheet = workbook.getSheetAt(0);
			Iterator<Row> rowIterator = sheet.iterator();

			// 첫 번째 행(헤더) 건너뛰기
			rowIterator.next();

			while (rowIterator.hasNext()) {
				Row row = rowIterator.next();
				int id = row.getCell(0) != null ? (int) row.getCell(0).getNumericCellValue() : 0;
				String name = row.getCell(1) != null ? row.getCell(1).getStringCellValue() : "";
				String color = row.getCell(2) != null && !row.getCell(2).equals("null") ? row.getCell(2).getStringCellValue() : "";
				String type = row.getCell(3) != null ? row.getCell(3).getStringCellValue() : "";
				int price = row.getCell(4) != null && !row.getCell(4).equals("null") ? (int) row.getCell(4).getNumericCellValue() : 0;
				Tile tile = new Tile(id, name, 0, 0, false, getTileType(type), null, price);
				tiles.add(tile);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		System.out.println(tiles.toString());
		// 변환된 객체 출력
		return tiles;

	}

	private TileType getTileType(String type) {
		switch (type) {
			case "땅":
				return TileType.SEED_CERTIFICATE_CARD;
			case "텔레파시카드":
				return TileType.TELEPATHY_CARD;
			case "블랙홀":
				return TileType.BLACK_HOLE;
			case "타임머신":
				return TileType.TIME_MACHINE;
			case "헬리혜성":
				return TileType.HALLEYS_COMET;
			case "우주조난기지":
				return TileType.SPACE_AGENCY;
			case "뉴런의골짜기":
				return TileType.NEURONS_VALLEY_CARD;
			default:
				return TileType.SPACE_AGENCY;
		}
	}
}
