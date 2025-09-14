// src/employee/user-account.resolver.ts

import { Resolver, Query, Mutation, Args, ObjectType, Field } from '@nestjs/graphql';
import { EmployeeService } from './employee.service';
import { CreateEmployeeInput, Employee, UpdateEmployeeInput } from './types/employee.type';

@ObjectType()
class ExcelFileResponse {
  @Field()
  filename: string;

  @Field()
  base64: string;
}

@Resolver(() => Employee)
export class EmployeeResolver {
  constructor(private readonly employeeService: EmployeeService) {}

  @Query(() => [Employee])
  async getEmployees() {
    return this.employeeService.getAll();
  }

  @Query(() => Employee)
  async getEmployeeById(@Args('id') id: string) {
    return this.employeeService.getById(id);
  }

  @Mutation(() => Employee)
  async createEmployee(@Args('data') data: CreateEmployeeInput) {
    return this.employeeService.create(data);
  }

  @Mutation(() => Employee)
  async updateEmployee(
    @Args('id') id: string,
    @Args('data') data: UpdateEmployeeInput,
  ) {
    return this.employeeService.update(id, data);
  }

  @Mutation(() => Boolean)
  async deleteEmployee(@Args('id') id: string) {
    await this.employeeService.delete(id);
    return true;
  }
  @Query(() => ExcelFileResponse)
  async exportEmployeesExcel() {
    try {
      const base64 = await this.employeeService.exportEmployees();
      console.log('Base64 length:', base64.length);
      console.log('Base64 preview:', base64.substring(0, 100));
      return {
        filename: 'employees.xlsx',
        base64,
      };
    } catch (error) {
      console.error('Error in exportEmployeesExcel:', error);
      throw new Error(`Failed to export Excel: ${error.message}`);
    }
  }
}
