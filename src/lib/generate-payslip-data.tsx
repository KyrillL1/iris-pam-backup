import { useCallback } from "react";
import { useFetchPayAdjustmentsForEmployee } from "./fetch-pay-adjustments";
import { useFetchEmployees } from "./fetch-employees";
import { useFetchCurrentContract } from "./fetch-contracts";
import { useCalculatePayAdjustmentAmount } from "./calculate-pay-adjustment-amount";
import { useFetchHoursWorked } from "./fetch-hours-worked";
import { useFetchDepartments } from "./fetch-departments";
import { useFetchRecipientPayoutInformationForEmployee } from "./fetch-payout-information";

interface GeneratePayslipDataPayAdjustment {
    name: string;
    key: string;
    amount: number;
}

interface GeneratePayslipDataReturnData {
    date: Date;
    dateOfJoining: Date;
    calculationBasis: "MONTHLY" | "HOURLY";
    workedQuanitity: number;
    employeeName: string;
    jobTitle: string;
    baseSalary: number;
    department: string;
    benefits: GeneratePayslipDataPayAdjustment[];
    deductions: GeneratePayslipDataPayAdjustment[];
    workPercentage: number;
    payoutInformation: string;
}

interface GeneratePayslipDataReturn {
    data: GeneratePayslipDataReturnData | null;
    error: Error | null
}

export function useGeneratePayslipDataForEmployee() {
    const { fetch: fetchPayAdjustments } = useFetchPayAdjustmentsForEmployee();
    const { employees } = useFetchEmployees();
    const { fetchCurrentContract } = useFetchCurrentContract();
    const { calculatePayAdjustmentAmount } = useCalculatePayAdjustmentAmount();
    const { fetchHoursWorked } = useFetchHoursWorked();
    const { departments } = useFetchDepartments();
    const { fetchRecipientPayoutInformationForEmployee } = useFetchRecipientPayoutInformationForEmployee();

    const generatePayslipDataForEmployee = useCallback(async (employeeId: string): Promise<GeneratePayslipDataReturn> => {
        const payAdjustments = await fetchPayAdjustments(employeeId);

        if (payAdjustments === undefined) {
            return {
                data: null,
                error: new Error(`PayAdjustmentsToEmployee is missing. EmployeeId: ${employeeId}`)
            }
        }

        const employee = employees.find(e => e.id === employeeId);
        if (!employee) {
            return {
                data: null,
                error: new Error(`Missing employee with id ${employeeId}`)
            }
        }

        const currentContract = await fetchCurrentContract(employeeId);
        if (!currentContract) {
            return {
                data: null,
                error: new Error(`Missing current contract`)
            }
        }

        const benefits: GeneratePayslipDataPayAdjustment[] = [];
        const deductions: GeneratePayslipDataPayAdjustment[] = [];
        const hoursWorked = (await fetchHoursWorked(employeeId)).data || undefined;
        for (const p of payAdjustments) {
            const amount = await calculatePayAdjustmentAmount(p.id, hoursWorked);
            if (p.pay_adjustment?.is_credit) {
                benefits.push({
                    name: p.pay_adjustment?.name || "",
                    key: `${p.pay_adjustment?.name}`,
                    amount
                });
            } else {
                deductions.push({
                    name: p.pay_adjustment?.name || "",
                    key: `${p.pay_adjustment?.name}`,
                    amount
                })
            }
        }

        const payoutInfo = await fetchRecipientPayoutInformationForEmployee(employeeId);

        const department = departments.find(d => d.id === currentContract?.department_id);
        const data: GeneratePayslipDataReturnData = {
            date: new Date(),
            dateOfJoining: new Date(currentContract.start_date),
            calculationBasis: currentContract.calculation_basis,
            workedQuanitity: currentContract.calculation_basis === "MONTHLY" ? 30 : (hoursWorked || 0),
            employeeName: `${employee.first_name} ${employee.last_name}`,
            jobTitle: currentContract.job_title,
            baseSalary: currentContract.base_salary,
            department: department?.name || "",
            benefits,
            deductions,
            workPercentage: currentContract.work_percentage,
            payoutInformation: `${payoutInfo.data?.[0].means_of_payment}`
        };

        return {
            data,
            error: null
        }

    }, [employees]);

    return {
        generatePayslipDataForEmployee
    }
}
