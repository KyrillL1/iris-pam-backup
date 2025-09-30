"use client";

import { Edit, EditFieldConfig } from "@components/edit";
import { myI18n, useTranslation } from "@i18n/i18n-provider";

// Add translations
myI18n.addResourceBundle("en", "payout/edit", {
  fields: {
    payout_proposal_item_id: "Payout Proposal Item Id",
    payout_slip_path: "Payout Slip Path",
    amount: "Amount",
  },
});

myI18n.addResourceBundle("pt", "payout/edit", {
  fields: {
    payout_proposal_item_id: "ID da Proposta de Pagamento",
    payout_slip_path: "Caminho do Comprovante de Pagamento",
    amount: "Valor",
  },
});

export default function PayoutsEdit() {
  const { t } = useTranslation("payout/edit");

  const fields: EditFieldConfig[] = [
    {
      name: "payout_proposal_item_id",
      label: t("fields.payout_proposal_item_id"),
      type: "text",
      isEditable: false,
      required: true,
    },
    {
      name: "payout_slip_path",
      label: t("fields.payout_slip_path"),
      type: "text",
      required: true,
    },
    {
      name: "amount",
      label: t("fields.amount"),
      type: "number",
      required: true,
    },
  ];

  return <Edit fields={fields} />;
}
