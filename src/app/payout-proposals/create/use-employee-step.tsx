import { useFetchContractsWithRelations } from "@lib/fetch-contracts";
import {
    CheckBox as CheckboxIcon,
    CheckBoxOutlineBlank,
    IndeterminateCheckBox,
} from "@mui/icons-material";
import { Checkbox, Stack, Typography } from "@mui/material";
import {
    DataGrid,
    GRID_CHECKBOX_SELECTION_COL_DEF,
    GridColDef,
    GridRowSelectionModel,
} from "@mui/x-data-grid";
import { useCallback, useMemo, useState } from "react";

export function useEmployeeStep() {
    const { contractsWithRelations, loading } =
        useFetchContractsWithRelations();

    const [selectedContractIds, setSelectedContractIds] = useState<string[]>(
        [],
    );
    const [disableSelectFields, setDisableSelectFields] = useState(false);

    const handleCompleteEmployeeStep = () => {
        setDisableSelectFields(true);
    };

    const columns: GridColDef[] = useMemo(() => [
        {
            ...GRID_CHECKBOX_SELECTION_COL_DEF,
            width: 100,
            renderHeader: disableSelectFields
                ? (params) => {
                    if (selectedContractIds.length === 0) {
                        return <CheckBoxOutlineBlank />;
                    }
                    if (
                        selectedContractIds.length ===
                            contractsWithRelations.length
                    ) {
                        return <CheckboxIcon />;
                    }
                    return <IndeterminateCheckBox />;
                }
                : GRID_CHECKBOX_SELECTION_COL_DEF.renderHeader,
            renderCell: disableSelectFields
                ? (params) => {
                    return (
                        <Checkbox
                            disabled
                            checked={selectedContractIds.includes(
                                params.id as string,
                            )}
                        />
                    );
                }
                : GRID_CHECKBOX_SELECTION_COL_DEF.renderCell,
        },
        {
            field: "employee_name",
            headerName: "Employee",
            flex: 1,
        },
        {
            field: "department_name",
            headerName: "Department",
            flex: 1,
        },
    ], [selectedContractIds, disableSelectFields]);

    const rows: any[] = contractsWithRelations.map((c) => {
        return {
            id: c.id,
            employee_name: `${c.employee.first_name} ${c.employee.last_name}`,
            department_name: c.department.name,
        };
    });

    const employeeView = (
        <Stack gap={2}>
            <Stack gap={1}>
                <Typography variant="h5">Employees</Typography>
                <Typography variant="body2">
                    Specify which employees to include. This only shows
                    employees with a current contract.
                </Typography>
            </Stack>

            <DataGrid
                columns={columns}
                loading={loading}
                rows={rows}
                checkboxSelection
                disableRowSelectionOnClick={disableSelectFields}
                onRowSelectionModelChange={(
                    selectedIds: GridRowSelectionModel,
                ) => {
                    setSelectedContractIds(selectedIds as string[]);
                }}
            />
        </Stack>
    );

    return {
        employeeView,
        handleCompleteEmployeeStep,
        selectedContractIds,
    };
}
