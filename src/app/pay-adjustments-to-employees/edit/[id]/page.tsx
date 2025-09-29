"use client";

import { payAdjustmentOptionFactory } from "../../pay-adjustment-option-factory";
import { Edit, EditFieldConfig } from "@components/edit";
import { Employee, useFetchEmployees } from "@lib/fetch-employees";
import { useFetchPayAdjustments } from "@lib/fetch-pay-adjustments";
import { MenuItem } from "@mui/material";
import { myI18n, useTranslation } from "@i18n/i18n-provider";

// Add translation bundle for this component
myI18n.addResourceBundle("en", "pay-adjustments-edi", {
  employee: "Employee",
  benefitDeduction: "Benefit / Deduction",
  missingItem: "Missing Item",
  comment: "Comment",
  userInput: "User Input",
  startDate: "Start Date",
  endDate: "End Date",
  payAdjustmentNames: {
    NIGHT_SHIFT_BONUS: "Night Shift Bonus",
    LIFE_RISK_BONUS: "Life Risk Bonus",
    OTHER_DEDUCTION: "Other Deduction",
    INSS: "INSS",
    FLEXIBLE_HOURS_BONUS: "Flexible Hours Bonus",
    PUBLIC_HOLIDAYS_BONUS: "Public Holidays Bonus",
    CHRISTMAS_BONUS: "Christmas Bonus",
    IRPS: "IRPS",
    LOANS: "Loans",
    MISSED_WORKDAYS: "Missed Work Days",
    SINDICATO: "Sindicato",
    ADVANCES: "Advances",
    MISSED_WORKHOURS: "Missed Work Hours",
    CHRONIC_DISEASE_BONUS: "Chronic Disease Bonus",
    SUPERVISOR_BONUS: "Supervisor Bonus",
    EXTRA_HOURS: "Extra Hours",
    SPECIAL_EXTRA_HOURS: "Special Extra Hours",
    OTHER_BENEFIT: "Other Benefit",
    SCHOOL_HOURS_ADDITIONAL: "School Hours Additional",
  },
});

myI18n.addResourceBundle("pt", "pay-adjustments-edi", {
  employee: "Funcionário",
  benefitDeduction: "Benefício / Desconto",
  missingItem: "Item Ausente",
  comment: "Comentário",
  userInput: "Entrada do Usuário",
  startDate: "Data de Início",
  endDate: "Data de Fim",
  payAdjustmentNames: {
    NIGHT_SHIFT_BONUS: "Bônus Turno Noturno",
    LIFE_RISK_BONUS: "Bônus Risco de Vida",
    OTHER_DEDUCTION: "Outro Desconto",
    INSS: "INSS",
    FLEXIBLE_HOURS_BONUS: "Bônus Horas Flexíveis",
    PUBLIC_HOLIDAYS_BONUS: "Bônus Feriados",
    CHRISTMAS_BONUS: "Bônus Natal",
    IRPS: "IRPS",
    LOANS: "Adiantamentos",
    MISSED_WORK_DAYS: "Dias de Falta",
    SINDICATO: "Sindicato",
    ADVANCES: "Adiantamentos",
    MISSED_WORK_HOURS: "Horas de Falta",
    CHRONIC_DISEASE_BONUS: "Bônus Doença Crônica",
    SUPERVISOR_BONUS: "Bônus Supervisor",
    EXTRA_HOURS: "Horas Extras",
    SPECIAL_EXTRA_HOURS: "Horas Extras Especiais",
    OTHER_BENEFIT: "Outro Benefício",
    SCHOOL_HOURS_ADDITIONAL: "Horas Adicionais Escola",
  },
});

export default function PayAdjustmentsToEmployeesEdi() {
  const { t } = useTranslation("pay-adjustments-edi");
  const { employeeIds, mapEmployeeIdToName } = useFetchEmployees();
  const { payAdjustmentIds, mapPayAdjustmentIdToName, payAdjustments } =
    useFetchPayAdjustments();

  const fields: EditFieldConfig[] = [
    {
      name: "employee_id",
      label: t("employee"),
      type: "select",
      required: true,
      options: employeeIds,
      mapOptionToLabel: mapEmployeeIdToName,
    },
    {
      name: "pay_adjustment_id",
      label: t("benefitDeduction"),
      type: "select",
      required: true,
      options: payAdjustmentIds,
      mapOptionToLabel: (id: string) => {
        const name = mapPayAdjustmentIdToName(id);
        return t(`payAdjustmentNames.${name}`);
      },
      renderOption: (props, option) => {
        const id = option;
        const fullPayAdjustment = payAdjustments.find((p) => p.id === id);

        if (!fullPayAdjustment) {
          return <MenuItem key={id} value={id}>{t("missingItem")}</MenuItem>;
        }

        return (
          <MenuItem {...props} key={id} value={id}>
            {payAdjustmentOptionFactory(fullPayAdjustment)}
          </MenuItem>
        );
      },
    },
    {
      name: "comment",
      label: t("comment"),
      type: "text",
      multiline: true,
    },
    {
      name: "user_input",
      label: t("userInput"),
      type: "number",
    },
    {
      name: "start_date",
      label: t("startDate"),
      type: "date",
      required: true,
    },
    {
      name: "end_date",
      label: t("endDate"),
      type: "date",
    },
  ];

  return <Edit<Employee> fields={fields} />;
}
