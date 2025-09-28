"use client";

import { Create, CreateFieldConfig } from "@components/create";
import { myI18n, useTranslation } from "@i18n/i18n-provider";
import { ListItem, MenuItem, Typography } from "@mui/material";

myI18n.addResourceBundle("en", "employees/create", {
  title: "Create Employees",
  fields: {
    first_name: "First Name",
    last_name: "Last Name",
    birthdate: "Birthdate",
    gender: "Gender",
    household_size: "Household Size",
    social_security_number: "Social Security Number",
    quickbooks_name: "QuickBooks Name",
  },
  options: {
    gender: {
      FEMALE: "Female",
      MALE: "Male",
    },
  },
});

myI18n.addResourceBundle("pt", "employees/create", {
  title: "Criar Funcionários",
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
      FEMALE: "Feminino",
      MALE: "Masculino",
    },
  },
});

export default function EmployeeCreate() {
  const { t } = useTranslation("employees/create");

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
        { value: "FEMALE", label: t("options.gender.FEMALE") },
        { value: "MALE", label: t("options.gender.MALE") },
      ],
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
      title={<Typography variant="h5">{t("title")}</Typography>}
    />
  );
}
