"use client";

import { Box, Card, CardContent, Typography } from "@mui/material";
import { ListButton } from "@refinedev/mui";
import { useStepper } from "./use-stepper";
import { useEmployeeStep } from "./use-employee-step";
import { useHoursStep } from "./use-hours-step";
import { useHandleStepperComplete } from "./use-handle-stepper-complete";

export default function PayoutProposalCreate() {
  const { employeeView, handleCompleteEmployeeStep } = useEmployeeStep();
  const { hoursView, handleCompleteHoursStep } = useHoursStep();

  const { createPayoutProposalLoading, handleCompleteClick } =
    useHandleStepperComplete();

  const { stepper, buttonRow, activeStep } = useStepper({
    onFinish: () => {
      handleCompleteClick();
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
