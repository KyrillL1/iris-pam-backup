"use client";

import { useFetchEmployees } from "@lib/fetch-employees";
import {
  Autocomplete,
  Box,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { payAdjustmentOptionFactory } from "../pay-adjustment-option-factory";
import { useCallback, useState } from "react";
import { Create as RefineCreate, ListButton } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { Add } from "@mui/icons-material";
import { useHandleFormSave } from "./use-handle-form-save";
import {
  EMPLOYEE_FIELD_NAME,
  mapIndexToCommentFieldName,
  mapIndexToCustomUserInputName,
  mapIndexToEndDateFieldName,
  mapIndexToFieldName,
  mapIndexToStartDateFieldName,
} from "./constants";
import { useFetchPayAdjustments } from "@lib/fetch-pay-adjustments";
import { PayAdjustmentField } from "./pay-adjustment-field.model";
import { useGeneratePayAdjustmentField } from "./use-generate-pay-adjustment-field";
import { myI18n, useTranslation } from "@i18n/i18n-provider";
import { Controller, Path } from "react-hook-form";

// Add translation bundles
myI18n.addResourceBundle("en", "pay-adjustments-to-employees-create", {
  title: "Create Benefit / Deduction for Employee",
  employeeLabel: "Employee",
  employeeRequired: "Employee is required",
  addButton: "Add Benefit / Deduction",
});

myI18n.addResourceBundle("pt", "pay-adjustments-to-employees-create", {
  title: "Criar Benefício / Desconto para Funcionário",
  employeeLabel: "Funcionário",
  employeeRequired: "Funcionário é obrigatório",
  addButton: "Adicionar Benefício / Desconto",
});

export default function PayAdjustmentsToEmployeesCreate() {
  const { t } = useTranslation("pay-adjustments-to-employees-create");

  const { employeeIds, mapEmployeeIdToName } = useFetchEmployees();
  const { payAdjustmentIds, payAdjustments } = useFetchPayAdjustments();

  const form = useForm();
  const {
    register,
    unregister,
    control,
    formState: { errors },
    saveButtonProps,
    watch,
  } = form;

  const [payAdjustmentFields, setPayAdjustmentFields] = useState<
    PayAdjustmentField[]
  >([]);

  const handleAddPayAdjustment = useCallback(() => {
    setPayAdjustmentFields((prev) => {
      const nextIndex = prev.length + 1;
      return [
        ...prev,
        {
          name: mapIndexToFieldName(nextIndex),
          label: `${t("addButton")} ${nextIndex}`,
          key: mapIndexToFieldName(nextIndex),
          userInputName: mapIndexToCustomUserInputName(nextIndex),
          commentName: mapIndexToCommentFieldName(nextIndex),
          startDateName: mapIndexToStartDateFieldName(nextIndex),
          endDateName: mapIndexToEndDateFieldName(nextIndex),
        },
      ];
    });
  }, [t, payAdjustmentIds]);

  const handleRemovePayAdjustment = useCallback((field: PayAdjustmentField) => {
    setPayAdjustmentFields((prev) => prev.filter((p) => p.key !== field.key));
    unregister(field.name);
    unregister(field.commentName);
    unregister(field.userInputName);
  }, [unregister]);

  const { generatePayAdjustmentField } = useGeneratePayAdjustmentField({
    control,
    errors,
    watch,
    register,
    onRemovePayAdjustmentField: handleRemovePayAdjustment,
  });

  const { handleFormSave } = useHandleFormSave();

  return (
    <RefineCreate
      title={
        <Typography component="h5" fontSize="1.5rem">
          {t("title")}
        </Typography>
      }
      saveButtonProps={{
        ...saveButtonProps,
        onClick: form.handleSubmit((data) => handleFormSave(data)),
        disabled: payAdjustmentFields.length === 0,
      }}
      breadcrumb={false}
      headerButtons={({ defaultButtons }) => (
        <>
          {defaultButtons}
          <ListButton />
        </>
      )}
    >
      <Box
        component="form"
        sx={{
          display: "flex",
          gap: 4,
          flexDirection: "column",
        }}
      >
        <Controller
          rules={{ required: t("employeeRequired") }}
          key={EMPLOYEE_FIELD_NAME}
          name={EMPLOYEE_FIELD_NAME as Path<any>}
          control={control}
          defaultValue={"" as any}
          render={({ field: controllerField }) => (
            <Autocomplete
              options={employeeIds || []}
              getOptionLabel={mapEmployeeIdToName}
              value={employeeIds?.find((o) => o === controllerField.value) ||
                null}
              onChange={(_, value) => controllerField.onChange(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("employeeLabel")}
                  error={!!(errors as any)[EMPLOYEE_FIELD_NAME]?.message}
                  helperText={(errors as any)[EMPLOYEE_FIELD_NAME]?.message}
                  required
                />
              )}
            />
          )}
        />

        {payAdjustmentFields.map(generatePayAdjustmentField)}

        <Box sx={{ display: "flex", justifyContent: "end" }}>
          <IconButton
            onClick={handleAddPayAdjustment}
            disabled={!payAdjustments || payAdjustments.length === 0}
          >
            <Add />
          </IconButton>
        </Box>
      </Box>
    </RefineCreate>
  );
}
