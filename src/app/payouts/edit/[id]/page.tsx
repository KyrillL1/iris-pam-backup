"use client";

import { useTranslationCommon } from "../../payouts.common";
import { Edit, EditFieldConfig } from "@components/edit";
import { myI18n, useTranslation } from "@i18n/i18n-provider";

// Add translations
myI18n.addResourceBundle("en", "payout/edit", {
  fields: {
    payout_proposal_item_id: "Payout Proposal Item Id",
  },
});

myI18n.addResourceBundle("pt", "payout/edit", {
  fields: {
    payout_proposal_item_id: "ID da Proposta de Pagamento",
  },
});

export default function PayoutsEdit() {
  const { t } = useTranslationCommon("payout/edit");

  const fields: EditFieldConfig[] = [
    {
      name: "payout_proposal_item_id",
      label: t("payout/edit:fields.payout_proposal_item_id"),
      type: "text",
      isEditable: false,
      required: true,
    },
    {
      name: "payout_slip_path",
      label: t("fields.payout_slip"),
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
