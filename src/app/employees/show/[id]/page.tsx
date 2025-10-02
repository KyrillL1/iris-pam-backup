"use client";

import { useTranslationCommon } from "../../employees.common";
import { Show, ShowField } from "@components/show";
import { myI18n } from "@i18n/i18n-provider";
import { useShow } from "@refinedev/core";

// Add i18n resources
myI18n.addResourceBundle("en", "employees/show", {
  fields: {
    id: "ID",
    created_at: "Created At",
    updated_at: "Updated At",
  },
});

myI18n.addResourceBundle("pt", "employees/show", {
  fields: {
    id: "ID",
    created_at: "Criado em",
    updated_at: "Atualizado em",
  },
});

export default function EmployeeShow() {
  const { t } = useTranslationCommon("employees/show");
  const { query } = useShow({});
  const { data, isLoading } = query;

  const record = data?.data;

  const fields: ShowField[] = [
    { label: t("fields.id"), value: record?.id },
    {
      label: t("fields.created_at"),
      value: record?.created_at,
      type: "datetime",
    },
    {
      label: t("fields.updated_at"),
      value: record?.updated_at,
      type: "datetime",
    },
    { label: t("fields.first_name"), value: record?.first_name },
    { label: t("fields.last_name"), value: record?.last_name },
    { label: t("fields.birthdate"), value: record?.birthdate, type: "date" },
    { label: t("fields.gender"), value: record?.gender },
    {
      label: t("fields.household_size"),
      value: record?.household_size,
      type: "number",
    },
    {
      label: t("fields.social_security_number"),
      value: record?.social_security_number,
    },
    { label: t("fields.quickbooks_name"), value: record?.quickbooks_name },
  ];

  return <Show isLoading={isLoading} fields={fields} />;
}
