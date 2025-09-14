import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ExcelService {
  async exportToExcel(
    data: any[],
    columns: { header: string; key: string; width?: number }[],
    sheetName: string,
  ): Promise<string> {
    try {
      console.log('Data received:', JSON.stringify(data, null, 2));
      console.log('Columns:', columns);

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(sheetName);

      worksheet.columns = columns;

      data.forEach((item) => {
        worksheet.addRow(item);
      });

      const arrayBuffer = await workbook.xlsx.writeBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString('base64');

      console.log('Base64 length:', base64.length);
      console.log('Base64 preview:', base64.substring(0, 100));

      // Kiểm tra chuỗi base64 hợp lệ
      const isValidBase64 = /^[A-Za-z0-9+/=]+$/.test(base64);
      if (!isValidBase64) {
        throw new Error('Generated base64 string is invalid');
      }

      return base64;
    } catch (error) {
      console.error('Error generating Excel file:', error);
      throw new Error(`Failed to generate Excel file: ${error.message}`);
    }
  }
}