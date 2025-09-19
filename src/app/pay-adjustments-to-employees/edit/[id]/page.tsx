"use client"

import { payAdjustmentOptionFactory } from "../../pay-adjustment-option-factory";
import { Edit, EditFieldConfig } from "@components/edit";
import { Employee, useFetchEmployees } from "@lib/fetch-employees";
import { useFetchPayAdjustments } from "@lib/fetch-pay-adjustments";
import { MenuItem } from "@mui/material";

export default function PayAdjustmentsToEmployeesEdi() {
  const { employeeIds, mapEmployeeIdToName } = useFetchEmployees();
  const { payAdjustmentIds, mapPayAdjustmentIdToName, payAdjustments } = useFetchPayAdjustments();

  const fields: EditFieldConfig[] = [
    {
      name: "employee_id",
      label: "Employee",
      type: "select",
      required: true,
      options: employeeIds,
      mapOptionToLabel: mapEmployeeIdToName
    },
    {
      name: "pay_adjustment_id",
      label: "Benefit/ deduction",
      type: "select",
      required: true,
      options: payAdjustmentIds,
      mapOptionToLabel: mapPayAdjustmentIdToName,
      renderOption: (props, option) => {
        const id = option;
        const fullPayAdjustment = payAdjustments.find(p => p.id === id);

        if (!fullPayAdjustment) {
          return <MenuItem key={id} value={id}>Missing Item</MenuItem>
        }

        return <MenuItem {...props} key={id} value={id}>
          {payAdjustmentOptionFactory(fullPayAdjustment)}
        </MenuItem>;
      }
    },
    {
      name: "comment",
      label: "Comment",
      type: "text",
      multiline: true,
    },
    {
      name: "user_input",
      label: "User Input",
      type: "number",
    },
    {
      name: "start_date",
      label: "Start Date",
      type: "date",
      required: true
    },
    {
      name: "end_date",
      label: "End Date",
      type: "date"
    },
  ];

  return <Edit<Employee> fields={fields} />;
}
