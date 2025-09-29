"use client";

import { List } from "@components/list";
import { useDataGrid } from "@refinedev/mui";
import { DataTable, DataTableAction } from "@components/data-table";
import { GridColDef } from "@mui/x-data-grid";
import { Department } from "./department.model";
import { myI18n, useTranslation } from "@i18n/i18n-provider";
import { useMemo } from "react";

// Add i18n resources
myI18n.addResourceBundle("en", "departments/list", {
    columns: {
        name: "Name",
    },
    departmentNames: {
        PRESCHOOL: "Preschool",
        GARDENING: "Gardening",
        MEDIA: "Media",
        MAINTENANCE: "Maintenance",
        PROGRAMS: "Programs",
        CLINIC: "Clinic",
        BIBLE_DISTRIBUTION: "Bible Distribution",
        AVIATION: "Aviation",
        BOARDING: "Boarding",
        HIGH_SCHOOL: "High School",
        ADMINISTRATION_OFFICE: "Administration Office",
        MATERNITY: "Maternity",
        ADMINISTRATION: "Administration",
        REINTEGRATION: "Reintegration",
        CLEANING: "Cleaning",
        OPERATIONS: "Operations",
        SCHOOL_SNACK_PROGRAM: "School - Snack Program",
        TRANSPORT: "Transport",
        SCHOOL: "School",
        CHURCH: "Church",
        GOODS_AND_SERVICES: "Goods and Services",
        KITCHEN: "Kitchen",
        IRIS_THEOLOGICAL_COLLEGE: "Iris Theological College",
        IRIS_SHALOM: "Iris Shalom",
        SCHOOL_BADGIA: "School - Badgia",
        NAMPULA: "Nampula",
        WATER_WELLS: "Water Wells",
        AGAPE: "Agape",
        SECURITY: "Security",
        FINANCE: "Finance",
        DISTRIBUTION: "Distribution",
        CHUIBA: "Chuiba",
        HUMAN_RESOURCES: "Human Resources",
        BOARDING_CASA_SHALOM: "Boarding - Casa Shalom",
        NOVIANE: "Noviane",
        SOCIAL_SUPPORT: "Social Support",
    },
});

myI18n.addResourceBundle("pt", "departments/list", {
    columns: {
        name: "Nome",
    },
    departmentNames: {
        PRESCHOOL: "Escolinha",
        GARDENING: "Jardinagem",
        MEDIA: "Media",
        MAINTENANCE: "Manutenção",
        PROGRAMS: "Programas",
        CLINIC: "Clinica",
        BIBLE_DISTRIBUTION: "Distribuição Biblias",
        AVIATION: "Aviação",
        BOARDING: "Internato",
        HIGH_SCHOOL: "E. Secundaria",
        ADMINISTRATION_OFFICE: "Escritorio Direção",
        MATERNITY: "Maternidade",
        ADMINISTRATION: "Administração",
        REINTEGRATION: "Reintegração",
        CLEANING: "Limpeza",
        OPERATIONS: "Operacoes",
        SCHOOL_SNACK_PROGRAM: "Escola - Snack Program",
        TRANSPORT: "Transportes",
        SCHOOL: "Escola",
        CHURCH: "Igreja",
        GOODS_AND_SERVICES: "Bens e Serviços",
        KITCHEN: "Cozinha",
        IRIS_THEOLOGICAL_COLLEGE: "Colegio Teologico Iris",
        IRIS_SHALOM: "Iris Shalom",
        SCHOOL_BADGIA: "Escola - Badgia",
        NAMPULA: "Nampula",
        WATER_WELLS: "Furos de Agua",
        AGAPE: "Agape",
        SECURITY: "Seguranca",
        FINANCE: "Finanças",
        DISTRIBUTION: "Distribuição",
        CHUIBA: "Chuiba",
        HUMAN_RESOURCES: "Recursos Humanos",
        BOARDING_CASA_SHALOM: "Internato-Casa Shalom",
        NOVIANE: "Noviane",
        SOCIAL_SUPPORT: "Apoio Social",
    },
});

export default function Departments() {
    const { t } = useTranslation("departments/list");
    const { dataGridProps } = useDataGrid<Department>({});

    const columns: GridColDef<Department>[] = useMemo(() => [
        {
            field: "name",
            headerName: t("columns.name"),
            minWidth: 300,
            valueGetter: (value: string) => {
                return t(`departmentNames.${value}`);
            },
        },
    ], [t]);

    return (
        <List canCreate={false}>
            <DataTable<Department>
                dataGridProps={dataGridProps}
                columns={columns}
                hideActions={[
                    DataTableAction.DELETE,
                    DataTableAction.EDIT,
                    DataTableAction.SHOW,
                ]}
            />
        </List>
    );
}
