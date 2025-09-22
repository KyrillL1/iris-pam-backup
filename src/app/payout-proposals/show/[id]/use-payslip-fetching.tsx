import { GeneratePayslipBlobData } from "@app/api/generate-payslip-blob/route";
import { useEffect, useState } from "react";

export function usePayslipFetching(rows?: any[]) {
    const [finalRows, setFinalRows] = useState<
        { payslip_blob: Blob & any }[]
    >();
    const [payslipFetchingError, setPayslipFetchingError] = useState<Error>();

    useEffect(() => {
        if (!rows) return;

        let active = true;

        (async () => {
            try {
                const enriched = await Promise.all(
                    rows.map(async (row) => {
                        const body: Partial<GeneratePayslipBlobData> = {
                            date: new Date().toISOString(),
                            date_of_joining: row.created_at,
                            calculation_basis: row.contract_calculation_basis,
                            work_quantity: row.hours_worked,
                            employee_name: row.employee_name,
                            job_title: row.contract_job_title,
                            base_salary: row.contract_base_salary,
                            department: row.department_name,
                            benefits: row.benefits.map((b: any) => {
                                return {
                                    key: b.key,
                                    amount: b.amount,
                                    name: b.name,
                                };
                            }),
                            deductions: row.deductions.map((d: any) => {
                                return {
                                    key: d.key,
                                    amount: d.amount,
                                    name: d.name,
                                };
                            }),
                            work_percentage: row.contract_work_percentage,
                            payout_information:
                                `${row.rpi_payment_means}: ${row.rpi_account} ${
                                    row.rpi_payment_means === "BANK"
                                        ? `Routing : ${row.rpi_bank_routing}`
                                        : ""
                                }`,
                        };
                        const res = await fetch("/api/generate-payslip-blob", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(body),
                        });

                        if (!res.ok) {
                            throw new Error(
                                `Failed to fetch payslip for ${row.employee_name}`,
                            );
                        }

                        const pdfBlob = await res.blob();

                        return {
                            ...row,
                            payslip_blob: pdfBlob,
                        };
                    }),
                );

                if (active) {
                    setFinalRows(enriched);
                }
            } catch (err) {
                if (active) {
                    setPayslipFetchingError(
                        err instanceof Error ? err : new Error(String(err)),
                    );
                }
            }
        })();

        return () => {
            active = false;
        };
    }, [rows]);

    return {
        finalRows,
        payslipFetchingError,
    };
}
