"use client";

import {
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  GridCellEditStopParams,
  GridColDef,
  GridEventListener,
} from "@mui/x-data-grid";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFetchMissingWorkedHours } from "./use-fetch-missing-worked-hours";
import { useNavigation, useNotification } from "@refinedev/core";
import { useCreatePayoutProposal } from "./use-create-payout-proposal";
import { CurrencyExchange } from "@mui/icons-material";
import { ListButton } from "@refinedev/mui";
import { useStepper } from "./use-stepper";
import { useEmployeeStep } from "./use-employee-step";
import { useHoursStep } from "./use-hours-step";
import { useHandleStepperComplete } from "./use-handle-stepper-complete";

interface PayoutProposalCreateRow {
  employee_id: string;
  employee_name: string;
  id: string; // contract_id
  hours_worked: number | undefined;
}

export default function PayoutProposalCreate() {
  const { employeeView, handleCompleteEmployeeStep, selectedContractIds } =
    useEmployeeStep();
  const { hoursView, handleCompleteHoursStep, rows } = useHoursStep(
    selectedContractIds,
  );
  const { createPayoutProposalLoading, handleCompleteClick } =
    useHandleStepperComplete();

  const { stepper, buttonRow, activeStep } = useStepper({
    onFinish: () => {
      handleCompleteClick(rows, selectedContractIds);
    },
    onStepComplete: (index: number) => {
      if (index === 0) {
        handleCompleteEmployeeStep();
      }
      if (index === 1) {
        handleCompleteHoursStep();
      }
    },
    finishButtonProps: {
      loading: createPayoutProposalLoading,
    },
  });

  return (
    <Card>
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
            marginBottom: 1,
          }}
        >
          <Typography variant="h5">
            Payout Proposals
          </Typography>

          <Box>
            <ListButton />
          </Box>
        </Box>

        {stepper}

        <Box>
          {activeStep === 0 && employeeView}
          {activeStep === 1 && hoursView}
        </Box>

        {buttonRow}
      </CardContent>
    </Card>
  );
}
