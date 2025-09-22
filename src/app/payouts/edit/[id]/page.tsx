"use client";

import { Edit, EditFieldConfig } from "@components/edit";

export default function PayoutsEdit() {
  const fields: EditFieldConfig[] = [
    {
      name: "payout_proposal_item_id",
      label: "Payout Proposal Item Id",
      type: "text",
      isEditable: false,
      required: true,
    },
    {
      name: "payout_slip_path",
      label: "Payout Slip Path",
      type: "text",
      required: true,
    },
    {
      name: "amount",
      label: "Amount",
      type: "number",
      required: true,
    },
  ];

  return <Edit fields={fields} />;
}
