"use client";

import { Create, CreateFieldConfig } from "@components/create";
import { useTranslationCommon } from "../employees.common";

export default function EmployeeCreate() {
  const { t } = useTranslationCommon();

  const fields: CreateFieldConfig[] = [
    {
      name: "first_name",
      label: t("fields.first_name"),
      type: "text",
      required: true,
    },
    {
      name: "last_name",
      label: t("fields.last_name"),
      type: "text",
      required: true,
    },
    {
      name: "birthdate",
      label: t("fields.birthdate"),
      type: "date",
      required: true,
    },
    {
      name: "gender",
      label: t("fields.gender"),
      type: "select",
      options: [
        "MALE",
        "FEMALE",
      ],
      mapOptionToLabel: (option: string) => {
        if (option === "") return "";
        return t(`options.gender.${option}`);
      },
      required: true,
    },
    {
      name: "household_size",
      label: t("fields.household_size"),
      type: "number",
      required: true,
      min: 0,
    },
    {
      name: "social_security_number",
      label: t("fields.social_security_number"),
      type: "text",
      required: true,
    },
    {
      name: "quickbooks_name",
      label: t("fields.quickbooks_name"),
      type: "text",
      required: true,
    },
  ];

  return (
    <Create
      fields={fields}
    />
  );
}
