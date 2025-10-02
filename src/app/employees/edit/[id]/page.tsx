"use client";

import { useTranslationCommon } from "../../employees.common";
import { Edit, EditFieldConfig } from "@components/edit";
import { Employee } from "@lib/fetch-employees";

export default function EmployeeEdit() {
  const { t } = useTranslationCommon();

  const fields: EditFieldConfig[] = [
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
        "FEMALE",
        "MALE",
      ],
      mapOptionToLabel: (option: string) => {
        return t(`options.gender.${option}`);
      },
      required: true,
    },
    {
      name: "household_size",
      label: t("fields.household_size"),
      type: "number",
      min: 0,
      required: true,
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

  return <Edit<Employee> fields={fields} />;
}
