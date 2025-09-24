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

  const { printPayAdjustmentSubtext } = usePrintPayAdjustmentSubtext();

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

        {payAdjustmentFields.map((field) => {
          const selectedPayAdjustmentId = watch(field.name) as
            | string
            | undefined;
          const selectedPayAdjustment = payAdjustments.find((p) =>
            p.id === selectedPayAdjustmentId
          );

          return (
            <Card
              key={field.key}
              sx={{
                padding: 2,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Box sx={{ display: "flex", width: "100%", gap: 2 }}>
                <Controller
                  key={field.key}
                  rules={{ required: `${field.label} is required` }}
                  name={field.name as Path<any>}
                  control={control}
                  defaultValue={"" as any}
                  render={({ field: controllerField }) => (
                    <Autocomplete
                      sx={{ flexGrow: "3", minWidth: 0 }}
                      options={payAdjustmentIds}
                      getOptionLabel={mapPayAdjustmentIdToName}
                      renderOption={(props, option) => {
                        const id = option;
                        const fullPayAdjustment = payAdjustments.find((p) =>
                          p.id === id
                        );

                        if (!fullPayAdjustment) {
                          return (
                            <MenuItem key={id} value={id}>
                              Missing Item
                            </MenuItem>
                          );
                        }

                        return (
                          <MenuItem {...props} key={id} value={id}>
                            {payAdjustmentOptionFactory(fullPayAdjustment)}
                          </MenuItem>
                        );
                      }}
                      onChange={(_, value) => controllerField.onChange(value)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={field.label}
                          error={!!(errors as any)[field.name]?.message}
                          helperText={(errors as any)[field.name]?.message}
                          required
                        />
                      )}
                    />
                  )}
                />
                <TextField
                  {...register(field.userInputName, {
                    valueAsNumber: true,
                    setValueAs: (v) => (v === "" ? -1 : v),
                  })}
                  sx={{ flexGrow: 1 }}
                  required={false}
                  defaultValue={""}
                  label={"Custom User Input"}
                  placeholder="Leave empty for default"
                  type={"number"}
                  slotProps={{
                    htmlInput: { min: 0 },
                    inputLabel: { shrink: true },
                  }}
                />
                <IconButton
                  color="error"
                  onClick={() => handleRemovePayAdjustment(field)}
                >
                  <Remove />
                </IconButton>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  gap: 2,
                  alignItems: "center",
                  paddingLeft: 4,
                }}
              >
                {printPayAdjustmentSubtext(selectedPayAdjustment)}
                <TextField
                  {...register(field.commentName)}
                  sx={{ flexGrow: 1 }}
                  multiline
                  required={false}
                  defaultValue={""}
                  label={"Comment"}
                  placeholder="Optional"
                  type={"text"}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                <Controller
                  key={field.startDateName}
                  name={field.startDateName}
                  control={control}
                  defaultValue={null} // or undefined
                  rules={{ required: "Start Date is required" }}
                  render={({ field: controllerField }) => (
                    <DatePicker
                      {...controllerField}
                      value={controllerField.value}
                      onChange={(value) => {
                        controllerField.onChange(
                          value,
                        );
                      }}
                      sx={{
                        flexGrow: 1,
                      }}
                      slotProps={{
                        textField: {
                          required: true,
                          label: "Start Date",
                          fullWidth: true,
                          error: !!(errors as any)[field.startDateName]
                            ?.message,
                          helperText: (errors as any)[field.startDateName]
                            ?.message,
                        },
                      }}
                    />
                  )}
                />
                <Controller
                  key={field.endDateName}
                  name={field.endDateName}
                  control={control}
                  defaultValue={null} // or undefined
                  render={({ field: controllerField }) => (
                    <DatePicker
                      {...controllerField}
                      value={controllerField.value}
                      onChange={(value) => {
                        controllerField.onChange(
                          value,
                        );
                      }}
                      sx={{
                        flexGrow: 1,
                      }}
                      slotProps={{
                        textField: {
                          label: "End Date",
                          fullWidth: true,
                        },
                      }}
                    />
                  )}
                />
              </Box>
            </Card>
          );
        })}

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
