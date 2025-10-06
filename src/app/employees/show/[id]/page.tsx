"use client";

import { useTranslationCommon } from "../../employees.common";
import { Show, ShowField } from "@components/show";
import { myI18n } from "@i18n/i18n-provider";
import { Employee } from "@lib/fetch-employees";
import { useShow } from "@refinedev/core";

export default function EmployeeShow() {
  const { t } = useTranslationCommon("employees/show");
  const { query } = useShow<Employee>({});
  const { data, isLoading } = query;

  const record = data?.data;

  const fields: ShowField[] = [
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

  return <Show isLoading={isLoading} fields={fields} record={record} />;
}
