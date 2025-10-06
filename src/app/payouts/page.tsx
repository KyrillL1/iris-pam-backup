"use client";

import { List } from "@components/list";
import { useDataGrid } from "@refinedev/mui";
import { DataTable, DataTableAction, GridColDef } from "@components/data-table";
import { PayslipCell } from "@components/payslip-cell";
import { PayoutModel, PayoutModelWithRelations } from "./payout.model";
import { myI18n, useTranslation } from "@i18n/i18n-provider";
import { useTranslationCommon } from "./payouts.common";

export default function Payout() {
  const { t } = useTranslationCommon();

  const { dataGridProps } = useDataGrid<PayoutModelWithRelations>({
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

  const columns: GridColDef<PayoutModelWithRelations>[] = [
    {
      field: "contract_id",
      headerName: t("fields.employee_contract"),
      minWidth: 200,
      valueGetter: (_, row) => {
        const employeeName =
          `${row.payout_proposal_item?.employee?.first_name} ${row.payout_proposal_item?.employee?.last_name}`;
        const jobTitle = row.payout_proposal_item?.contract_job_title;
        return `${employeeName} (${jobTitle})`;
      },
    },
    {
      field: "amount",
      headerName: t("fields.amount"),
      minWidth: 150,
      type: "money",
    },
    {
      field: "payout_slip_path",
      headerName: t("fields.payout_slip"),
      minWidth: 150,
      type: "string",
      renderCell: (params) => (
        <PayslipCell
          path={params.value}
          fileName={`Payslip-${params.row.payout_proposal_item?.employee?.first_name} ${params.row.payout_proposal_item?.employee?.last_name}`}
        />
      ),
    },
  ];

  return (
    <List canCreate={false}>
      <DataTable<PayoutModelWithRelations>
        dataGridProps={dataGridProps}
        columns={columns}
      />
    </List>
  );
}
