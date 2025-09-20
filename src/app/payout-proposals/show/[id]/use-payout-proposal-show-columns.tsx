import { PayoutProposalItem } from "@app/payout-proposals/payout-proposal-model";
import { CollapsibleHeaderGroup } from "@components/collapsible-header-group";
import { GridColDef, GridColumnGroupingModel } from "@mui/x-data-grid";

export function usePayoutProposalShowColumns(items?: PayoutProposalItem[]) {
    const columns: GridColDef[] = [
        {
            field: "employee_name",
            headerName: "Employee Name",
            minWidth: 150,
        },
    ];

    const contractColumns: GridColDef[] = [{
        field: "department_name",
        headerName: "Department Name",
        minWidth: 150,
    }, {
        field: "contract_job_title",
        headerName: "Job Title",
    }, {
        field: "contract_base_salary",
        headerName: "Base Salary",
        type: "number",
    }, {
        field: "contract_work_percentage",
        minWidth: 150,
        headerName: "Work Percentage",
        type: "number",
    }, {
        field: "contract_calculation_basis",
        minWidth: 150,
        headerName: "Calculation Basis",
        type: "number",
    }];
    columns.push(
        ...contractColumns.map((c) => ({
            ...c,
            headerClassName: "header-warning",
        })),
    );

    // --- Collect unique benefit & deduction names ---
    const benefitIds = new Set<string>();
    const deductionIds = new Set<string>();

    (items || []).forEach((item) => {
        item.benefits?.forEach((b) => benefitIds.add(b.id));
        item.deductions?.forEach((d) => deductionIds.add(d.id));
    });

    const mapBenefitIdToName = (id: string): string => {
        for (const item of items || []) {
            const match = item.benefits?.find((b) => b.id === id);
            if (match) return match.name;
        }
        return id; // fallback to id if not found
    };

    const mapDeductionIdToName = (id: string): string => {
        for (const item of items || []) {
            const match = item.deductions?.find((d) => d.id === id);
            if (match) return match.name;
        }
        return id; // fallback to id if not found
    };
    // --- Build dynamic benefit columns ---
    const benefitColumns: GridColDef[] = Array.from(benefitIds).map((
        id,
    ) => ({
        field: `benefit_${id}`,
        headerName: mapBenefitIdToName(id),
        type: "number",
        minWidth: 150,
        valueGetter: (_, item: PayoutProposalItem) => {
            return item.benefits?.find((b) => b.id === id)?.amount ?? null;
        },
    }));

    // --- Build dynamic deduction columns ---
    const deductionColumns: GridColDef[] = Array.from(deductionIds).map(
        (id) => ({
            field: `deduction_${id}`,
            headerName: mapDeductionIdToName(id),
            type: "number",
            minWidth: 150,
            valueGetter: (_, item: PayoutProposalItem) => {
                return item.deductions?.find((d) => d.id === id)?.amount ??
                    null;
            },
        }),
    );
    columns.push(
        ...benefitColumns.map((c) => ({
            ...c,
            headerClassName: "header-success",
        })),
    );
    columns.push(...deductionColumns.map((c) => ({
        ...c,
        headerClassName: "header-error",
    })));

    const salaryColumns: GridColDef[] = [
        { field: "gross_salary", headerName: "Gross Salary", type: "number" },
        {
            field: "hours_worked",
            headerName: "Hours Worked",
            type: "number",
            minWidth: 150,
        },
        { field: "net_salary", headerName: "Net Salary", type: "number" },
        {
            field: "net_salary_last_month",
            headerName: "Net Salary Last Month",
            type: "number",
            minWidth: 150,
        },
    ];
    columns.push(
        ...salaryColumns.map((c) => ({
            ...c,
            headerClassName: "header-primary",
        })),
    );

    const recipientPayoutInfoColumns = [
        { field: "rpi_name", headerName: "Recipient Name", minWidth: 150 },
        {
            field: "rpi_payment_means",
            headerName: "Means of Payment",
            minWidth: 150,
        },
        { field: "rpi_account", headerName: "Account", minWidth: 150 },
        {
            field: "rpi_bank_routing",
            headerName: "Bank Routing",
            minWidth: 150,
        },
        { field: "rpi_bank_name", headerName: "Bank Name" },
    ];
    columns.push(
        ...recipientPayoutInfoColumns.map((c) => ({
            ...c,
            headerClassName: "header-primary",
        })),
    );

    const internalColumns: GridColDef[] = [
        { field: "item_id", headerName: "Item Id", minWidth: 150 },
        { field: "created_at", headerName: "Created At", type: "date" },
        { field: "updated_at", headerName: "Updated At", type: "date" },
    ];
    columns.push(
        ...internalColumns.map((c) => ({
            ...c,
            headerClassName: "header-primary",
        })),
    );

    const columnGroupingModel: GridColumnGroupingModel = [
        {
            groupId: "contract",
            headerName: "Contract",
            children: [
                { field: "department_name" },
                { field: "contract_job_title" },
                { field: "contract_base_salary" },
                { field: "contract_work_percentage" },
                { field: "contract_calculation_basis" },
            ],
            headerClassName: "header-warning",
            renderHeaderGroup: (params) => {
                return (
                    <CollapsibleHeaderGroup
                        {...params}
                        collapseFields={[
                            "contract_job_title",
                            "contract_base_salary",
                            "contract_work_percentage",
                            "contract_calculation_basis",
                        ]}
                    />
                );
            },
        },
        {
            groupId: "Benefits",
            headerName: "Benefits",
            children: benefitColumns.map((col) => ({
                field: col.field,
            })),
            headerClassName: "header-success",
            renderHeaderGroup: (params) => (
                <CollapsibleHeaderGroup
                    {...params}
                    collapseFields={benefitColumns.map((col, ind) => {
                        if (ind === 0) return "";
                        return col.field;
                    })}
                />
            ),
        },
        {
            groupId: "deductions",
            headerName: "Deductions",
            children: deductionColumns.map((col) => ({
                field: col.field,
            })),
            headerClassName: "header-error",
            renderHeaderGroup: (params) => (
                <CollapsibleHeaderGroup
                    {...params}
                    collapseFields={deductionColumns.map((col, ind) => {
                        if (ind === 0) return "";
                        return col.field;
                    })}
                />
            ),
        },
        {
            groupId: "salary",
            headerName: "Salary",
            children: [
                { field: "gross_salary" },
                { field: "hours_worked" },
                { field: "net_salary" },
                { field: "net_salary_last_month" },
            ],
            headerClassName: "header-primary",
            renderHeaderGroup: (params) => {
                return (
                    <CollapsibleHeaderGroup
                        {...params}
                        collapseFields={[
                            "hours_worked",
                            "net_salary",
                            "net_salary_last_month",
                        ]}
                    />
                );
            },
        },
        {
            groupId: "recipient",
            headerName: "Recipient",
            children: [
                { field: "rpi_name" },
                { field: "rpi_payment_means" },
                { field: "rpi_account" },
                { field: "rpi_bank_routing" },
                { field: "rpi_bank_name" },
            ],
            headerClassName: "header-primary",
            renderHeaderGroup: (params) => {
                return (
                    <CollapsibleHeaderGroup
                        {...params}
                        collapseFields={[
                            "rpi_payment_means",
                            "rpi_account",
                            "rpi_bank_routing",
                            "rpi_bank_name",
                        ]}
                    />
                );
            },
        },
        {
            groupId: "internal",
            headerName: "Internal",
            children: [{ field: "item_id" }, { field: "created_at" }, {
                field: "updated_at",
            }],
            headerClassName: "header-primary",
            renderHeaderGroup: (params) => {
                return (
                    <CollapsibleHeaderGroup
                        {...params}
                        collapseFields={["created_at", "updated_at"]}
                    />
                );
            },
        },
    ];

    return {
        columns,
        columnGroupingModel,
    };
}
