import { IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
    GridColDef,
    GridColumnGroupHeaderParams,
    GridColumnGroupingModel,
    gridColumnVisibilityModelSelector,
    useGridApiContext,
    useGridSelector,
} from "@mui/x-data-grid";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const COLLAPSIBLE_COLUMN_GROUPS: Record<string, Array<string>> = {
    internal: ["updated_at", "created_at"],
};

const ColumnGroupRoot = styled("div")({
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
});

const ColumnGroupTitle = styled("span")({
    overflow: "hidden",
    textOverflow: "ellipsis",
});

function CollapsibleHeaderGroup({
    groupId,
    headerName,
}: GridColumnGroupHeaderParams) {
    const apiRef = useGridApiContext();
    const columnVisibilityModel = useGridSelector(
        apiRef,
        gridColumnVisibilityModelSelector,
    );

    if (!groupId) {
        return null;
    }

    const isCollapsible = Boolean(COLLAPSIBLE_COLUMN_GROUPS[groupId]);
    const isGroupCollapsed = COLLAPSIBLE_COLUMN_GROUPS[groupId].every(
        (field) => columnVisibilityModel[field] === false,
    );

    return (
        <ColumnGroupRoot>
            <ColumnGroupTitle>{headerName ?? groupId}</ColumnGroupTitle>{" "}
            {isCollapsible && (
                <IconButton
                    sx={{ ml: 0.5 }}
                    onClick={() => {
                        const newModel = { ...columnVisibilityModel };
                        COLLAPSIBLE_COLUMN_GROUPS[groupId].forEach((field) => {
                            newModel[field] = !!isGroupCollapsed;
                        });
                        apiRef.current.setColumnVisibilityModel(newModel);
                    }}
                >
                    {isGroupCollapsed
                        ? <KeyboardArrowRightIcon fontSize="small" />
                        : <KeyboardArrowDownIcon fontSize="small" />}
                </IconButton>
            )}
        </ColumnGroupRoot>
    );
}

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
            renderHeaderGroup: (params) => {
                return <CollapsibleHeaderGroup {...params} />;
            },
        },
    ];

    return {
        columns,
        columnGroupingModel,
    };
}
