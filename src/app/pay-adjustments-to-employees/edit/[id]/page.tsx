"use client";

import { Edit, EditFieldConfig } from "@components/edit";
import { Employee, useFetchEmployees } from "@lib/fetch-employees";
import { useFetchPayAdjustments } from "@lib/fetch-pay-adjustments";
import { MenuItem } from "@mui/material";
import { myI18n } from "@i18n/i18n-provider";
import { usePayAdjustmentOptionFactory } from "../../pay-adjustment-option-factory";
import { useTranslationCommon } from "../../pay-adjustments.common";
import { useMemo } from "react";

myI18n.addResourceBundle("en", "pay-adjustments-edit", {
  missingItem: "Missing Item",
});

myI18n.addResourceBundle("pt", "pay-adjustments-edit", {
  missingItem: "Item Ausente",
});

export default function PayAdjustmentsToEmployeesEdi() {
  const { t } = useTranslationCommon("pay-adjustments-edit");
  const { employeeIds, mapEmployeeIdToName, loading: loadingEmployees } =
    useFetchEmployees();
  const {
    payAdjustmentIds,
    mapPayAdjustmentIdToName,
    payAdjustments,
    loading: loadingPA,
  } = useFetchPayAdjustments();
  const payAdjustmentOptionFactory = usePayAdjustmentOptionFactory();
  const loading = useMemo(() => {
    return loadingEmployees || loadingPA;
  }, [loadingEmployees, loadingPA]);

  const fields: EditFieldConfig[] = [
    {
      name: "employee_id",
      label: t("fields.employee_name"),
      type: "select",
      required: true,
      options: employeeIds,
      mapOptionToLabel: mapEmployeeIdToName,
    },
    {
      name: "pay_adjustment_id",
      label: t("fields.pay_adjustment_id"),
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
          return (
            <MenuItem key={id} value={id}>
              {t("pay-adjustments-edit:missingItem")}
            </MenuItem>
          );
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
      label: t("fields.comment"),
      type: "text",
      multiline: true,
    },
    {
      name: "user_input",
      label: t("fields.user_input"),
      type: "number",
    },
    {
      name: "start_date",
      label: t("fields.start_date"),
      type: "date",
      required: true,
    },
    {
      name: "end_date",
      label: t("fields.end_date"),
      type: "date",
    },
  ];

  return <Edit<Employee> fields={fields} isLoading={loading} />;
}
