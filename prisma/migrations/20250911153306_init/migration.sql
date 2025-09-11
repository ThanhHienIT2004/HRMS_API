-- DropForeignKey
ALTER TABLE "public"."BonusDiscipline" DROP CONSTRAINT "BonusDiscipline_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Contract" DROP CONSTRAINT "Contract_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Employee_Allowance" DROP CONSTRAINT "Employee_Allowance_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Insurance" DROP CONSTRAINT "Insurance_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Overtime" DROP CONSTRAINT "Overtime_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."PositionAssignment" DROP CONSTRAINT "PositionAssignment_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."SalaryAdvance" DROP CONSTRAINT "SalaryAdvance_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Timekeeping" DROP CONSTRAINT "Timekeeping_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserAccount" DROP CONSTRAINT "UserAccount_employee_id_fkey";

-- AlterTable
ALTER TABLE "public"."Employee" ALTER COLUMN "avatar_url" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."PositionAssignment" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

-- DropEnum
DROP TYPE "public"."Gender";

-- CreateTable
CREATE TABLE "public"."LeaveType" (
    "leave_type_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "max_days" INTEGER,

    CONSTRAINT "LeaveType_pkey" PRIMARY KEY ("leave_type_id")
);

-- CreateTable
CREATE TABLE "public"."Leave" (
    "leave_id" SERIAL NOT NULL,
    "employee_id" TEXT NOT NULL,
    "leave_type_id" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Leave_pkey" PRIMARY KEY ("leave_id")
);

-- AddForeignKey
ALTER TABLE "public"."PositionAssignment" ADD CONSTRAINT "PositionAssignment_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "public"."Employee"("employee_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserAccount" ADD CONSTRAINT "UserAccount_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "public"."Employee"("employee_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BonusDiscipline" ADD CONSTRAINT "BonusDiscipline_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "public"."Employee"("employee_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Overtime" ADD CONSTRAINT "Overtime_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "public"."Employee"("employee_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SalaryAdvance" ADD CONSTRAINT "SalaryAdvance_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "public"."Employee"("employee_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Timekeeping" ADD CONSTRAINT "Timekeeping_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "public"."Employee"("employee_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Employee_Allowance" ADD CONSTRAINT "Employee_Allowance_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "public"."Employee"("employee_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Insurance" ADD CONSTRAINT "Insurance_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "public"."Employee"("employee_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contract" ADD CONSTRAINT "Contract_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "public"."Employee"("employee_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Leave" ADD CONSTRAINT "Leave_leave_type_id_fkey" FOREIGN KEY ("leave_type_id") REFERENCES "public"."LeaveType"("leave_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Leave" ADD CONSTRAINT "Leave_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "public"."Employee"("employee_id") ON DELETE CASCADE ON UPDATE CASCADE;
