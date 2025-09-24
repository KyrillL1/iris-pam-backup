"use client";

import { useFetchEmployees } from "@lib/fetch-employees";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { payAdjustmentOptionFactory } from "../pay-adjustment-option-factory";
import { useCallback, useEffect, useState } from "react";
import { Create as RefineCreate, ListButton } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { Controller, Path } from "react-hook-form";
import { Add, Remove } from "@mui/icons-material";
import { usePrintPayAdjustmentSubtext } from "./use-print-pay-adjustment-subtext";
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
import { DatePicker } from "@mui/x-date-pickers";
import { PayAdjustmentField } from "./pay-adjustment-field.model";
import { useGeneratePayAdjustmentField } from "./use-generate-pay-adjustment-field";

export default function PayAdjustmentsToEmployeesCreate() {
  const { employeeIds, mapEmployeeIdToName } = useFetchEmployees();

  const { payAdjustmentIds, payAdjustments, mapPayAdjustmentIdToName } =
    useFetchPayAdjustments();

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
          label: `Benefit/ Deduction ${nextIndex}`,
          key: mapIndexToFieldName(nextIndex),
          userInputName: mapIndexToCustomUserInputName(nextIndex),
          commentName: mapIndexToCommentFieldName(nextIndex),
          startDateName: mapIndexToStartDateFieldName(nextIndex),
          endDateName: mapIndexToEndDateFieldName(nextIndex),
        },
      ];
    });
  }, [payAdjustmentIds]);

  const handleRemovePayAdjustment = useCallback((field: PayAdjustmentField) => {
    setPayAdjustmentFields((prev) => {
      const payAdjustmentEntry = prev.find((p) => p.key === field.key);
      if (!payAdjustmentEntry) return prev;

      return prev.filter((p) => p.key !== field.key);
    });
    unregister(field.name);
    unregister(field.commentName);
    unregister(field.userInputName);
  }, []);

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
          Create Benefit / Deduction for Employee
        </Typography>
      }
      saveButtonProps={{
        ...saveButtonProps,
        onClick: form.handleSubmit((data) => {
          handleFormSave(data);
        }),
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
          rules={{ required: `Employee is required` }}
          key={EMPLOYEE_FIELD_NAME}
          name={EMPLOYEE_FIELD_NAME as Path<any>}
          control={control}
          defaultValue={"" as any}
          render={({ field: controllerField }) => (
            <Autocomplete
              options={employeeIds || []}
              getOptionLabel={mapEmployeeIdToName}
              value={employeeIds?.find(
                (o) => o === controllerField.value,
              ) || null}
              onChange={(_, value) => controllerField.onChange(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={"Employee"}
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
            loading={!payAdjustments || payAdjustments.length === 0}
          >
            <Add />
          </IconButton>
        </Box>
      </Box>
    </RefineCreate>
  );
}
