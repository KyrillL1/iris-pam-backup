"use client";

import { Show, ShowField } from "@components/show";
import { useShow } from "@refinedev/core";

export default function EmployeeShow() {
  const { query } = useShow({});
  const { data, isLoading } = query;

  const record = data?.data;

  const fields: ShowField[] = [
    { label: "ID", value: record?.id },
    { label: "Created At", value: record?.created_at, type: "date" },
    { label: "Updated At", value: record?.updated_at, type: "date" },
    { label: "First Name", value: record?.first_name },
    { label: "Last Name", value: record?.last_name },
    { label: "Birthdate", value: record?.birthdate, type: "date" },
    { label: "Gender", value: record?.gender },
    { label: "Household Size", value: record?.household_size, type: "number" },
    { label: "Social Security Number", value: record?.social_security_number },
    { label: "QuickBooks Name", value: record?.quickbooks_name },
  ];

  return <Show isLoading={isLoading} fields={fields} />;
}
