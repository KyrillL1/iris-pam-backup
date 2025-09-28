"use client";

import { Edit, EditFieldConfig } from "@components/edit";
import { Employee } from "@lib/fetch-employees";
import { myI18n, useTranslation } from "@i18n/i18n-provider";

// Add i18n resources
myI18n.addResourceBundle("en", "employees/edit", {
  fields: {
    first_name: "First Name",
    last_name: "Last Name",
    birthdate: "Birthdate",
    gender: "Gender",
    household_size: "Household Size",
    social_security_number: "SSN",
    quickbooks_name: "QuickBooks Name",
  },
  options: {
    gender: {
      MALE: "Male",
      FEMALE: "Female",
    },
  },
});

myI18n.addResourceBundle("pt", "employees/edit", {
  fields: {
    first_name: "Primeiro Nome",
    last_name: "Sobrenome",
    birthdate: "Data de Nascimento",
    gender: "Gênero",
    household_size: "Número de Pessoas no Lar",
    social_security_number: "Número de Segurança Social",
    quickbooks_name: "Nome no QuickBooks",
  },
  options: {
    gender: {
      MALE: "Masculino",
      FEMALE: "Feminino",
    },
  },
});

export default function EmployeeEdit() {
  const { t } = useTranslation("employees/edit");

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
        { value: "MALE", label: t("options.gender.MALE") },
        { value: "FEMALE", label: t("options.gender.FEMALE") },
      ],
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
