import {
    ArrowLeft,
    ArrowRight,
    Check,
    CurrencyExchange,
    Save,
} from "@mui/icons-material";
import {
    Box,
    Button,
    Stack,
    Step,
    StepButton,
    StepLabel,
    Stepper,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";

export interface UseStepperOptions {
    onFinish?: () => void;
    onStepComplete?: (index: number) => void;
}

export function useStepper({ onFinish, onStepComplete }: UseStepperOptions) {
    const [steps] = useState([
        "Employees",
        "Hours",
        "Last Month",
    ]);
    const [activeStep, setActiveStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);

    const handleStepClick = useCallback((index: number) => {
        setActiveStep(index);
    }, []);

    const handleStepCompleteClick = useCallback((index: number) => {
        setCompletedSteps((prev) => [...prev, index]);
        onStepComplete?.(index);
    }, []);

    const handleNext = useCallback(() => {
        setActiveStep((prevActiveStep) => {
            return prevActiveStep === steps.length - 1
                ? prevActiveStep
                : prevActiveStep + 1;
        });
    }, []);

    const handleBack = useCallback(() => {
        setActiveStep((prevActiveStep) => {
            return prevActiveStep === 0 ? prevActiveStep : prevActiveStep - 1;
        });
    }, []);

    const handleFinish = useCallback(() => {
        onFinish?.();
    }, [onFinish]);

    const isStepLast = (index: number) => steps.length - 1 === index;
    const isStepFirst = (index: number) => index === 0;
    const isStepCompleted = (index: number) => completedSteps.includes(index);
    const completedAll = completedSteps.length === steps.length;

    const stepper = useMemo(() => (
        <Stepper activeStep={activeStep} nonLinear>
            {steps.map((label, index) => {
                return (
                    <Step key={label} completed={isStepCompleted(index)}>
                        <StepButton
                            color="inherit"
                            onClick={() => handleStepClick(index)}
                        >
                            {label}
                        </StepButton>
                    </Step>
                );
            })}
        </Stepper>
    ), [activeStep, completedSteps]);

    const buttonRow = useMemo(() => {
        return (
            <>
                <Stack justifyContent={"space-between"} direction={"row"}>
                    <Box>
                        {!isStepFirst(activeStep) &&
                            (
                                <Button
                                    onClick={handleBack}
                                    startIcon={<ArrowLeft />}
                                    variant="contained"
                                >
                                    Back
                                </Button>
                            )}
                    </Box>

                    <Stack gap={2} direction={"row"}>
                        {!isStepCompleted(activeStep) && (
                            <Button
                                variant="contained"
                                startIcon={<Check />}
                                onClick={() =>
                                    handleStepCompleteClick(activeStep)}
                            >
                                Complete
                            </Button>
                        )}
                        {!isStepLast(activeStep) && (
                            <Button
                                onClick={handleNext}
                                endIcon={<ArrowRight />}
                                variant="contained"
                            >
                                Next
                            </Button>
                        )}
                        {completedAll && (
                            <Button
                                color="success"
                                variant="contained"
                                onClick={handleFinish}
                                startIcon={<CurrencyExchange />}
                            >
                                Create Proposal
                            </Button>
                        )}
                    </Stack>
                </Stack>
            </>
        );
    }, [activeStep, completedSteps]);

    return {
        stepper,
        buttonRow,
        activeStep,
    };
}
