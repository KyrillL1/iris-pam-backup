"use client";

import { PayoutModelWithRelations } from "@app/payouts/payout.model";
import { PayslipCell } from "@components/payslip-cell";
import { Show, ShowField } from "@components/show";
import { useShow } from "@refinedev/core";
import { myI18n, useTranslation } from "@i18n/i18n-provider";
import { useTranslationCommon } from "../../payouts.common";

// Add translations
myI18n.addResourceBundle("en", "payout/show", {
  fields: {
    id: "ID",
    created_at: "Created At",
    updated_at: "Updated At",
  },
});

myI18n.addResourceBundle("pt", "payout/show", {
  fields: {
    id: "ID",
    created_at: "Criado em",
    updated_at: "Atualizado em",
  },
});

export default function PayoutsShow() {
  const { t } = useTranslationCommon("payout/show");

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
    { label: t("payout/show:fields.id"), value: record?.id },
    { label: t("payout/show:fields.created_at"), value: record?.created_at, type: "date" },
    { label: t("payout/show:fields.updated_at"), value: record?.updated_at, type: "date" },
    {
      label: t("fields.employee_contract"),
      value:
        `${record?.payout_proposal_item?.employee?.first_name} ${record?.payout_proposal_item?.employee?.last_name}`,
    },
    {
      label: t("fields.payslip"),
      value: record?.payout_slip_path,
      type: "custom",
      custom: (value: string) => (
        <PayslipCell
          path={value}
          fileName={`Payslip-${record?.payout_proposal_item?.employee?.first_name} ${record?.payout_proposal_item?.employee?.last_name}`}
        />
      ),
    },
    { label: t("fields.amount"), value: record?.amount, type: "number" },
  ];

  return <Show isLoading={isLoading} fields={fields} />;
}
