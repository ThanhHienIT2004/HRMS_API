import { Field, ObjectType, Query, Resolver } from '@nestjs/graphql';

@ObjectType()
export class ExcelFile {
  @Field()
  filename: string;

  @Field()
  base64: string; // Nội dung file excel được encode
}// employee.resolver.ts



