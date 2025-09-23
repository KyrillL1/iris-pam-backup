"use client";

import { Create, CreateFieldConfig } from "@components/create";

export default function EmployeeCreate() {
  const fields: CreateFieldConfig[] = [
    { name: "first_name", label: "First Name", type: "text", required: true },
    { name: "last_name", label: "Last Name", type: "text", required: true },
    { name: "birthdate", label: "Birthdate", type: "date", required: true },
    {
      name: "gender",
      label: "Gender",
      type: "select",
      options: ["FEMALE", "MALE"],
      required: true,
    },
    {
      name: "household_size",
      label: "Household Size",
      type: "number",
      required: true,
      min: 0,
    },
    {
      name: "social_security_number",
      label: "Social Security Number",
      type: "text",
      required: true,
    },
    {
      name: "quickbooks_name",
      label: "QuickBooks Name",
      type: "text",
      required: true,
    },
  ];

  return <Create fields={fields} />;
}
