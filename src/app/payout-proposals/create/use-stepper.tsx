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
    ButtonProps,
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
    finishButtonProps?: ButtonProps;
}

export function useStepper(
    { onFinish, onStepComplete, finishButtonProps }: UseStepperOptions,
) {
    const [steps] = useState([
        "Employees",
        "Hours",
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
        // as we dont show the complete button for the last step, manually call
        handleStepCompleteClick(steps.length - 1);
        onFinish?.();
    }, [onFinish, handleStepCompleteClick]);

    const isStepLast = (index: number) => steps.length - 1 === index;
    const isStepFirst = (index: number) => index === 0;
    const isStepCompleted = (index: number) => completedSteps.includes(index);
    const showFinishButton = (index: number) =>
        ((completedSteps.length === steps.length) ||
            (completedSteps.length === steps.length - 1)) &&
        (isStepLast(index));
    const showCompleteButton = (index: number) =>
        !completedSteps.includes(index) && !showFinishButton(index);

    const stepper = useMemo(
        () => (
            <Stack direction={"row"} justifyContent={"center"}>
                <Stepper
                    activeStep={activeStep}
                    nonLinear
                    sx={{
                        width: 600,
                    }}
                >
                    {steps.map((label, index) => {
                        return (
                            <Step
                                key={label}
                                completed={isStepCompleted(index)}
                            >
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
            </Stack>
        ),
        [activeStep, completedSteps],
    );

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
                                >
                                    Back
                                </Button>
                            )}
                    </Box>

                    <Stack gap={2} direction={"row"}>
                        {showCompleteButton(activeStep) &&
                            (
                                <Button
                                    variant="contained"
                                    startIcon={<Check />}
                                    onClick={() =>
                                        handleStepCompleteClick(activeStep)}
                                >
                                    Complete
                                </Button>
                            )}
                        {!isStepLast(activeStep) &&
                            (
                                <Button
                                    onClick={handleNext}
                                    endIcon={<ArrowRight />}
                                >
                                    Next
                                </Button>
                            )}
                        {showFinishButton(activeStep) && (
                            <Button
                                color="success"
                                variant="contained"
                                onClick={handleFinish}
                                startIcon={<CurrencyExchange />}
                                {...finishButtonProps}
                            >
                                Create Proposal
                            </Button>
                        )}
                    </Stack>
                </Stack>
            </>
        );
    }, [activeStep, completedSteps, finishButtonProps]);

    return {
        stepper,
        buttonRow,
        activeStep,
    };
}
