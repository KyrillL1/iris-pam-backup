"use client";

import { List } from "@components/list";
import { useDataGrid } from "@refinedev/mui";
import { DataTable, DataTableAction, GridColDef } from "@components/data-table";
import { PayslipCell } from "@components/payslip-cell";
import { PayoutModel, PayoutModelWithRelations } from "./payout.model";
import { myI18n, useTranslation } from "@i18n/i18n-provider";

// Add translations
myI18n.addResourceBundle("en", "payout/list", {
  columns: {
    employee_contract: "Employee + Contract",
    amount: "Amount",
    payout_slip: "Payout Slip",
  },
});

myI18n.addResourceBundle("pt", "payout/list", {
  columns: {
    employee_contract: "Funcionário + Contrato",
    amount: "Valor",
    payout_slip: "Comprovante de Pagamento",
  },
});

export default function Payout() {
  const { t } = useTranslation("payout/list");

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
      headerName: t("columns.employee_contract"),
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
      headerName: t("columns.amount"),
      minWidth: 150,
      type: "money",
    },
    {
      field: "payout_slip_path",
      headerName: t("columns.payout_slip"),
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
