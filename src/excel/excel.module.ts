import { Module } from '@nestjs/common';
import { ExcelService } from './excel.service';

@Module({
  providers: [ExcelService],
  exports: [ExcelService], // 👈 export để module khác dùng được
})
export class ExcelModule {}
