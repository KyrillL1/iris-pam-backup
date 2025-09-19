"use client";

import { Show, ShowField } from "@components/show";
import { PayAdjustmentsToEmployeesWithRelations } from "@lib/fetch-pay-adjustments";
import { useShow } from "@refinedev/core";

export default function PayAdjustmentsToEmployeesShow() {
  const { query } = useShow<PayAdjustmentsToEmployeesWithRelations>({
    meta: {
      select: `
        *,
        employee:employees(first_name, last_name),
        pay_adjustment:pay_adjustments(id, name)
        `
    }
  });
  const { data, isLoading } = query;

  const record = data?.data;

  const fields: ShowField[] = [
    { label: "ID", value: record?.id },
    { label: "Created At", value: record?.created_at, type: "date" },
    { label: "Updated At", value: record?.updated_at, type: "date" },
    { label: "Employee Name", value: `${record?.employee?.first_name} ${record?.employee?.last_name}` },
    {
      label: "Type", value: record?.pay_adjustment?.is_credit ? "Benefit" : "Deduction"
    },
    { label: `${record?.pay_adjustment?.is_credit ? "Benefit" : "Deduction"} Name`, value: record?.pay_adjustment?.name },
    { label: "Comment", value: record?.comment || "-" },
    { label: "User Input", value: record?.userInput || "-" },
    { label: "Start Date", value: record?.start_date, type: "date" },
    { label: "End Date", value: record?.end_date, type: "date" },
  ];

  return <Show isLoading={isLoading} fields={fields} />;
}
