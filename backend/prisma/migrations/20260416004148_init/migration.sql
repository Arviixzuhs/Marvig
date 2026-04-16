-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "paymentMethod" "PaymentMethod";

-- CreateTable
CREATE TABLE "ExpenseImage" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "expenseId" INTEGER NOT NULL,

    CONSTRAINT "ExpenseImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ExpenseImage" ADD CONSTRAINT "ExpenseImage_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "Expense"("id") ON DELETE CASCADE ON UPDATE CASCADE;
