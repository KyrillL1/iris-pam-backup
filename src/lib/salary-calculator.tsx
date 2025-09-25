export interface SalaryCalculatorPayAdjustment {
    name: string;
    amount: number;
}

export interface SalaryCalculatorOptions {
    baseSalary: number;
    calculationBasis: "HOURLY" | "MONTHLY";
    workQuantity: number; // days or hours
    workPercentage: number; // 0-100
    benefits?: SalaryCalculatorPayAdjustment[];
    deductions?: SalaryCalculatorPayAdjustment[];
}

export class SalaryCalculator {
    public baseSalary = 0;
    public grossSalary = 0;
    public benefitsTotal = 0;
    public deductionsTotal = 0;
    public netSalary = 0;

    constructor(
        {
            baseSalary,
            calculationBasis,
            workPercentage,
            workQuantity,
            benefits = [],
            deductions = [],
        }: SalaryCalculatorOptions,
    ) {
        this.baseSalary = this.cutNumber(baseSalary);

        const _grossSalary = calculationBasis === "HOURLY"
            ? baseSalary * workQuantity * workPercentage / 100
            : baseSalary * workQuantity / 30 * workPercentage / 100;
        this.grossSalary = this.cutNumber(_grossSalary);

        this.setPayAdjustments(benefits, deductions);
    }

    public setPayAdjustments(
        benefits: SalaryCalculatorPayAdjustment[],
        deductions: SalaryCalculatorPayAdjustment[],
    ) {
        const _benefitsTotal = benefits.reduce(
            (prev, curr) => prev + curr.amount,
            0,
        );
        this.benefitsTotal = this.cutNumber(_benefitsTotal);

        const _deductionsTotal = deductions.reduce(
            (prev, curr) => prev + curr.amount,
            0,
        );
        this.deductionsTotal = this.cutNumber(_deductionsTotal);

        const _netSalary = this.grossSalary + this.benefitsTotal -
            this.deductionsTotal;
        this.netSalary = this.cutNumber(_netSalary);
    }

    private cutNumber(n: number): number {
        return parseFloat(Number(n).toFixed(2));
    }
}
