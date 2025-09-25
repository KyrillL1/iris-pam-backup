import { NextRequest, NextResponse } from "next/server";
import React from "react";
import { renderToStream } from "@react-pdf/renderer";
import { PayslipPdf, PayslipPdfProps } from "@components/payslip-pdf";

export interface GeneratePayslipBlobData {
    date: string;
    date_of_joining: string;
    calculation_basis: "MONTHLY" | "HOURLY";
    work_quantity: number;
    employee_name: string;
    job_title: string;
    base_salary: number;
    department: string;
    benefits: {
        key: string;
        amount: number;
        name: string;
    }[];
    deductions: {
        key: string;
        amount: number;
        name: string;
    }[];
    work_percentage: number;
    means_of_payment: string;
    recipient_account: string;
    bank_name?: string;
    bank_routing_number?: string;
}

export async function POST(req: NextRequest) {
    try {
        const body: Partial<GeneratePayslipBlobData> = await req.json();
        const payload: PayslipPdfProps = {
            date: body.date ? new Date(body.date) : new Date(0),
            dateOfJoining: body.date_of_joining
                ? new Date(body.date_of_joining)
                : new Date(0),
            calculationBasis: body.calculation_basis || "MONTHLY",
            workedQuanitity: body.work_quantity || -1,
            employeeName: body.employee_name || "Employee ?",
            jobTitle: body.job_title || "Employee Job ? ",
            baseSalary: body.base_salary || -1,
            department: body.department || "Employee Department ?",
            benefits: body.benefits || [],
            deductions: body.deductions || [],
            workPercentage: body.work_percentage || 0,
            meansOfPayment: body.means_of_payment || "Missing",
            recipientAccount: body.recipient_account || "Missing",
            bankName: body.bank_name,
            bankRoutingNumber: body.bank_routing_number,
        };

        const element = <PayslipPdf {...payload} />;

        const stream = await renderToStream(element);

        const chunks: Uint8Array[] = [];
        for await (const chunk of stream) {
            chunks.push(chunk as Uint8Array);
        }
        const pdfBuffer = Buffer.concat(chunks);

        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": "inline; filename=payslip.pdf",
            },
        });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
