import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeInput, UpdateEmployeeInput } from './types/employee.type';
import { ExcelService } from '../excel/excel.service';

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService,     private excelService: ExcelService ) {}

  async getAll() {
    return this.prisma.employee.findMany({
        include:{
          positionAssignments:{
            include: {
              department: true,
              position: true,
            },
          },
        },
      }
    );
  }

  async getById(id: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { employee_id: id },
    });
    if (!employee) {
      throw new NotFoundException(`Employee with ID "${id}" not found`);
    }
    return employee;
  }

  async create(data: CreateEmployeeInput) {
    return this.prisma.employee.create({
      data: {
        ...data,
        employee_id: `NV${Date.now()}`, // Tạo ID tự động, có thể thay bằng UUID
      },
    });
  }

  async update(id: string, data: UpdateEmployeeInput) {
    const { department_id, position_id, ...rest } = data;

    return this.prisma.employee.update({
      where: { employee_id: id },
      data: {
        ...rest,
        positionAssignments: department_id && position_id
          ? {
            upsert: {
              create: {
                department_id,
                position_id,
              },
              update: {
                department_id,
                position_id,
              },
              where: {
                employee_id_department_id_position_id: {
                  employee_id: id,
                  department_id,
                  position_id,
                },
              },
            },
          }
          : undefined,
      },
      include: {
        positionAssignments: {
          include: {
            department: true,
            position: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    await this.getById(id);
    return this.prisma.employee.delete({
      where: { employee_id: id },
    });
  }
  async exportEmployees(): Promise<string> {
    try {
      const employees = await this.prisma.employee.findMany({
        include: {
          positionAssignments: {
            include: {
              department: true,
              position: true,
            },
          },
        },
      });

      // Làm phẳng dữ liệu
      const flattenedData = employees.map(employee => ({
        employee_id: employee.employee_id || '',
        full_name: employee.full_name || '',
        dob: employee.dob ? employee.dob.toISOString().split('T')[0] : '',
        gender: employee.gender || '',
        place_of_birth: employee.place_of_birth || '',
        hometown: employee.hometown || '',
        nationality: employee.nationality || '',
        ethnicity: employee.ethnicity || '',
        religion: employee.religion || '',
        marital_status: employee.marital_status || '',
        health_status: employee.health_status || '',
        avatar_url: employee.avatar_url || '',
      }));

      console.log('Flattened data:', JSON.stringify(flattenedData, null, 2));

      return await this.excelService.exportToExcel(
        flattenedData,
        [
          { header: 'Mã NV', key: 'employee_id', width: 20 },
          { header: 'Họ tên', key: 'full_name', width: 30 },
          { header: 'Ngày sinh', key: 'dob', width: 20 },
          { header: 'Giới tính', key: 'gender', width: 15 },
          { header: 'Nơi sinh', key: 'place_of_birth', width: 30 },
          { header: 'Quê quán', key: 'hometown', width: 30 },
          { header: 'Quốc tịch', key: 'nationality', width: 20 },
          { header: 'Dân tộc', key: 'ethnicity', width: 20 },
          { header: 'Tôn giáo', key: 'religion', width: 20 },
          { header: 'Tình trạng hôn nhân', key: 'marital_status', width: 25 },
          { header: 'Tình trạng sức khỏe', key: 'health_status', width: 25 },
          { header: 'Ảnh đại diện', key: 'avatar_url', width: 40 },
        ],
        'Employees',
      );
    } catch (error) {
      console.error('Error exporting employees:', error);
      throw new Error(`Failed to export employees: ${error.message}`);
    }
  }

}
