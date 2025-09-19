"use client"

import { Edit, EditFieldConfig } from "@components/edit";
import { Employee } from "@lib/fetch-employees";

export default function EmployeeEdit() {

  const fields: EditFieldConfig[] = [
    { name: "first_name", label: "First Name", type: "text", required: true },
    { name: "last_name", label: "Last Name", type: "text", required: true },
    { name: "birthdate", label: "Birthdate", type: "date", required: true },
    { name: "gender", label: "Gender", type: "select", options: ["MALE", "FEMALE"], required: true },
    { name: "household_size", label: "Household Size", type: "number", min: 0, required: true },
    { name: "social_security_number", label: "SSN", type: "text", required: true },
    { name: "quickbooks_name", label: "QuickBooks Name", type: "text", required: true },
  ];

  return <Edit<Employee> fields={fields} />;
}
