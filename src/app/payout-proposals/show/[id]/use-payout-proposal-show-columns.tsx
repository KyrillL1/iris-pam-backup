import { GridColDef, GridColumnGroupingModel } from "@mui/x-data-grid";

export function usePayoutProposalShowColumns() {
    const columns: GridColDef[] = [
        { field: "employee_name", headerName: "Employee Name", minWidth: 150 },

        // Contract
        {
            field: "department_name",
            headerName: "Department Name",
            minWidth: 150,
        },
        { field: "contract_job_title", headerName: "Job Title" },
        {
            field: "contract_base_salary",
            headerName: "Base Salary",
            type: "number",
        },
        {
            field: "contract_work_percentage",
            minWidth: 150,
            headerName: "Work Percentage",
            type: "number",
        },
        {
            field: "contract_calculation_basis",
            minWidth: 150,
            headerName: "Calculation Basis",
            type: "number",
        },
        // Pay Adjustments
        // TODO

        // Salary
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

        // Recipient Payout Info
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

        // Internal
        { field: "item_id", headerName: "Item Id" },
        { field: "created_at", headerName: "Created At", type: "date" },
        { field: "updated_at", headerName: "Updated At", type: "date" },
    ];

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
        },
        {
            groupId: "internal",
            headerName: "Internal",
            children: [{ field: "item_id" }, { field: "created_at" }, {
                field: "updated_at",
            }],
        },
    ];

    return {
        columns,
        columnGroupingModel,
    };
}
