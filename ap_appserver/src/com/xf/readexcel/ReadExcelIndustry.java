package com.xf.readexcel;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.xf.entity.gov.Industry;
//第二产业企业数量调查表Excel导入

public class ReadExcelIndustry {
		
		public static final String OFFICE_EXCEL_2003_POSTFIX = "xls";
	    public static final String OFFICE_EXCEL_2010_POSTFIX = "xlsx";

	    public static final String EMPTY = "";
	    public static final String POINT = ".";
	    public static final String LIB_PATH = "lib";
	    public static final String STUDENT_INFO_XLS_PATH = LIB_PATH + "/student_info" + POINT + OFFICE_EXCEL_2003_POSTFIX;
	    public static final String STUDENT_INFO_XLSX_PATH = LIB_PATH + "/student_info" + POINT + OFFICE_EXCEL_2010_POSTFIX;
	    public static final String NOT_EXCEL_FILE = " : 不是 Excel 文件类型!";
	    public static final String PROCESSING = "正在读取...";
	    public static int rownum;
	    
		public List<Industry> readExcel(String path,int citynum) throws Exception {
			//判断路径是否为空
			if (path == null || EMPTY.equals(path)) {
				return null;
			} else {
				//截取文件后缀
				String postfix = getPostfix(path);
				if (!EMPTY.equals(postfix)) {
					//判断excel的格
					if (OFFICE_EXCEL_2003_POSTFIX.equals(postfix)) {
						return readXls(path,citynum);
					} else if (OFFICE_EXCEL_2010_POSTFIX.equals(postfix)) {
						return readXlsx(path,citynum);
					}
				} else {
					System.out.println(path + NOT_EXCEL_FILE);
				}
			}
			return null;
		}

		/**
		 * Read the Excel 2010
		 * 
		 * @param path
		 *            the path of the excel file
		 * @return
		 * @throws IOException
		 */
		public List<Industry> readXlsx(String path,int citynum) throws Exception {
			// 记录正在读取的行

			System.out.println(PROCESSING + path);
			InputStream is = new FileInputStream(path);
			XSSFWorkbook xssfWorkbook = new XSSFWorkbook(is);
			Industry Indu = null;
			List<Industry> list = new ArrayList<Industry>();
			// Read the Sheet
			
				for (int numSheet = 0; numSheet < xssfWorkbook.getNumberOfSheets(); numSheet++) {
					XSSFSheet xssfSheet = xssfWorkbook.getSheetAt(numSheet);
					if (xssfSheet == null) {
						continue;
					}
					// 读取
					for (int rowNum = 6; rowNum <= xssfSheet.getLastRowNum(); rowNum++) {
						XSSFRow xssfRow = xssfSheet.getRow(rowNum);
						if (xssfRow != null) {
							// 记录行号
							rownum = rowNum;

							try {
								Indu = new Industry();
								XSSFCell companyName = xssfRow.getCell(0);
								XSSFCell industryCode = xssfRow.getCell(1);
								XSSFCell province = xssfRow.getCell(2);
								if(getValue(province).equals("")){
									break;
								}
								XSSFCell city = xssfRow.getCell(3);
								XSSFCell town = xssfRow.getCell(4);
								XSSFCell country = xssfRow.getCell(5);
								XSSFCell street = xssfRow.getCell(6);
								XSSFCell openStatus = xssfRow.getCell(7);
								XSSFCell coalConsumption = xssfRow.getCell(8);
								Indu.setCompanyName(getValue(companyName));
								Indu.setIndustryCode(getValue(industryCode));
								Indu.setCityName(getValue(city));
								Indu.setCity(citynum);
								Indu.setTownName(getValue(town));
								Indu.setOpenStatus(getValue(openStatus));
								Indu.setCoalConsumption(Double.valueOf(getValue(coalConsumption)));
								Indu.setCountryname(getValue(country));
								Indu.setStreetname(getValue(street));
								list.add(Indu);
							} catch (Exception e) {
								
								e.printStackTrace();
								throw new MyException("导入第"+(rownum+1)+"行出错");
							}
						}
					}
				}
			
			return list;
		}

		/**
		 * Read the Excel 2003-2007
		 * 
		 * @param path
		 *            the path of the Excel
		 * @return
		 * @throws IOException
		 */
		public List<Industry> readXls(String path,int citynum) throws Exception {
			// 记录正在读取的行

			InputStream is = new FileInputStream(path);
			HSSFWorkbook hssfWorkbook = new HSSFWorkbook(is);
			Industry Indu = null;
			List<Industry> list = new ArrayList<Industry>();
			// Read the Sheet
			try {
				for (int numSheet = 0; numSheet < hssfWorkbook.getNumberOfSheets(); numSheet++) {
					HSSFSheet hssfSheet = hssfWorkbook.getSheetAt(numSheet);
					if (hssfSheet == null) {
						continue;
					}
					// 读取
					for (int rowNum = 6; rowNum <= hssfSheet.getLastRowNum(); rowNum++) {
						HSSFRow hssfRow = hssfSheet.getRow(rowNum);
						if (hssfRow != null) {
							// 记录行号
							rownum = rowNum;

							try {
								Indu = new Industry();
								HSSFCell companyName = hssfRow.getCell(0);
								HSSFCell industryCode = hssfRow.getCell(1);
								HSSFCell province = hssfRow.getCell(2);
								if(getValue(province).equals("")){
									break;
								}
								HSSFCell city = hssfRow.getCell(3);
								HSSFCell town = hssfRow.getCell(4);
								HSSFCell country = hssfRow.getCell(5);
								HSSFCell street = hssfRow.getCell(6);
								HSSFCell openStatus = hssfRow.getCell(7);
								HSSFCell coalConsumption = hssfRow.getCell(8);
								Indu.setCompanyName(getValue(companyName));
								Indu.setIndustryCode(getValue(industryCode));
								Indu.setCity(citynum);
								Indu.setCityName(getValue(city));
								Indu.setTownName(getValue(town));
								Indu.setOpenStatus(getValue(openStatus));
								Indu.setCoalConsumption(Double.valueOf(getValue(coalConsumption)));
								Indu.setCountryname(getValue(country));
								Indu.setStreetname(getValue(street));
								list.add(Indu);
							} catch (Exception e) {
								e.printStackTrace();
								throw new MyException("导入第"+(rownum+1)+"行出错");
							}
						}
					}
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
			return list;
		}

		@SuppressWarnings("static-access")
		private static String getValue(XSSFCell xssfRow) {
			if (xssfRow.getCellType() == xssfRow.CELL_TYPE_BOOLEAN) {
				return String.valueOf(xssfRow.getBooleanCellValue());
			} else if (xssfRow.getCellType() == xssfRow.CELL_TYPE_NUMERIC) {
				return String.valueOf(xssfRow.getNumericCellValue());
			} else if (xssfRow.getCellType() == xssfRow.CELL_TYPE_FORMULA) {
				try {
					return String.valueOf(xssfRow.getNumericCellValue());
				} catch (IllegalStateException e) {
					return String.valueOf(xssfRow.getRichStringCellValue());
				}
			} else {
				return String.valueOf(xssfRow.getStringCellValue());
			}
		}

		@SuppressWarnings("static-access")
		private static String getValue(HSSFCell hssfCell) {
			if (hssfCell.getCellType() == hssfCell.CELL_TYPE_BOOLEAN) {
				return String.valueOf(hssfCell.getBooleanCellValue());
			} else if (hssfCell.getCellType() == hssfCell.CELL_TYPE_NUMERIC) {
				return String.valueOf(hssfCell.getNumericCellValue());
			} else if (hssfCell.getCellType() == hssfCell.CELL_TYPE_FORMULA) {
				try {
					return String.valueOf(hssfCell.getNumericCellValue());
				} catch (IllegalStateException e) {
					return String.valueOf(hssfCell.getRichStringCellValue());
				}
			} else {
				return String.valueOf(hssfCell.getStringCellValue());
			}
		}
		public static String getPostfix(String path) {
	        if (path == null || EMPTY.equals(path.trim())) {
	            return EMPTY;
	        }
	        if (path.contains(POINT)) {
	            return path.substring(path.lastIndexOf(POINT) + 1, path.length());
	        }
	        return EMPTY;
	    }
	}