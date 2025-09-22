"use client";

import { PayoutModelWithRelations } from "@app/payouts/payout.model";
import { PayslipCell } from "@components/payslip-cell";
import { Show, ShowField } from "@components/show";
import { OpenInNew } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { useShow } from "@refinedev/core";

export default function PayoutsShow() {
  const { query } = useShow<PayoutModelWithRelations>({
    meta: {
      select: `
        *,
        payout_proposal_item:payout_proposal_items(
          contract_job_title,
          employee_id, 
          employee:employees(
            first_name,
            last_name
          )
        )
        `,
    },
  });
  const { data, isLoading } = query;

  const record = data?.data;

  const fields: ShowField[] = [
    { label: "ID", value: record?.id },
    { label: "Created At", value: record?.created_at, type: "date" },
    { label: "Updated At", value: record?.updated_at, type: "date" },
    {
      label: "Employee Name",
      value:
        `${record?.payout_proposal_item?.employee?.first_name} ${record?.payout_proposal_item?.employee?.last_name}`,
    },
    {
      label: "Payslip",
      value: record?.payout_slip_path,
      type: "custom",
      custom: (value: string) => {
        return (
          <PayslipCell
            path={value}
            fileName={`Payslip-${record?.payout_proposal_item?.employee?.first_name} ${record?.payout_proposal_item?.employee?.last_name}`}
          />
        );
      },
    },
    {
      label: "Amount",
      value: record?.amount,
      type: "number",
    },
  ];

  return <Show isLoading={isLoading} fields={fields} />;
}
