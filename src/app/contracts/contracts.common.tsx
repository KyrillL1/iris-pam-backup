// Common translations

import { myI18n, useTranslation } from "@i18n/i18n-provider";

myI18n.addResourceBundle("en", "contracts/common", {
    fields: {
        employee_name: "Employee",
        department_name: "Department",
        job_title: "Job Title",
        contract_type: "Contract Type",
        determined: "Determined",
        work_percentage: "Work %",
        start_date: "Start Date",
        end_date: "End Date",
        calculation_basis: "Calculation",
        base_salary: "Base Salary",
    },
    options: {
        contract_type: {
            FREELANCER: "Freelancer",
            REGULAR: "Regular",
            TEMPORARY: "Temporary",
        },
        calculation_basis: {
            MONTHLY: "Monthly",
            HOURLY: "Hourly",
        },
    },
});

myI18n.addResourceBundle("pt", "contracts/common", {
    fields: {
        employee_name: "Funcionário",
        department_name: "Departamento",
        job_title: "Cargo",
        contract_type: "Tipo de Contrato",
        determined: "Determinada",
        work_percentage: "Trabalho %",
        start_date: "Data Início",
        end_date: "Data Fim",
        calculation_basis: "Cálculo",
        base_salary: "Salário Base",
    },
    options: {
        contract_type: {
            FREELANCER: "Freelancer",
            REGULAR: "Regular",
            TEMPORARY: "Temporário",
        },
        calculation_basis: {
            MONTHLY: "Mensal",
            HOURLY: "Horária",
        },
    },
});

export function useTranslationCommon(additionalNs?: string) {
    return useTranslation([
        "contracts/common",
        ...(additionalNs ? [additionalNs] : []),
    ]);
}
