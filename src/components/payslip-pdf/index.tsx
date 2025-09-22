import {
    Document,
    Image,
    Page,
    StyleSheet,
    Text,
    View,
} from "@react-pdf/renderer";
import { formatMoney } from "@utils/format-money";

interface PayTableRowCombined {
    key: string;
    benefitName: string;
    benefitAmount: number;
    deductionName: string;
    deductionAmount: number;
}

export interface PayTableRow {
    name: string;
    key: string;
    amount: number;
}

export interface PayslipPdfProps {
    date: Date;
    dateOfJoining: Date;
    calculationBasis: "MONTHLY" | "HOURLY";
    workedQuanitity: number; // either days or hours
    employeeName: string;
    jobTitle: string;
    baseSalary: number;
    department: string;
    benefits: PayTableRow[];
    deductions: PayTableRow[];
    workPercentage: number;
    payoutInformation: string;
}

export const PayslipPdf: React.FC<PayslipPdfProps> = ({
    date,
    dateOfJoining,
    calculationBasis,
    workedQuanitity,
    employeeName,
    jobTitle,
    department,
    baseSalary,
    benefits,
    deductions,
    workPercentage,
    payoutInformation,
}) => {
    const styles = StyleSheet.create({
        informationOverviewCol: {
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            flexGrow: 2,
        },
        tableHeader: {
            width: "25%",
            padding: 6,
            fontWeight: 700,
            border: "1px solid #ccc",
            backgroundColor: "#0093D0",
            color: "white",
        },
        tableRow: {
            width: "25%",
            padding: 6,
            border: "1px solid #ccc",
        },
        tableRowAmount: {
            width: "25%",
            padding: 6,
            border: "1px solid #ccc",
            textAlign: "right",
        },
        tableFooterTotal: {
            width: "25%",
            padding: 6,
            border: "1px solid #ccc",
            fontWeight: 700,
        },
        tableFooterAmount: {
            width: "25%",
            padding: 6,
            border: "1px solid #ccc",
            textAlign: "right",
        },
        netPayCol: {
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            width: "25%",
        },
    });

    const tableRows = (() => {
        if (benefits.length === 0 && deductions.length === 0) return [];

        let rowAmount = benefits.length > deductions.length
            ? benefits.length
            : deductions.length;

        const rows: PayTableRowCombined[] = [];
        for (let i = 0; i < rowAmount; i++) {
            const ifEmpty: PayTableRow = {
                key: `empty-${i}`,
                name: "",
                amount: 0,
            };
            const b = benefits[i] || ifEmpty;
            const d = deductions[i] || ifEmpty;
            rows.push({
                key: `${b.key}-${d}`,
                benefitName: b.name,
                benefitAmount: b.amount,
                deductionName: d.name,
                deductionAmount: d.amount,
            });
        }
        return rows;
    })();

    const totalAmounts = (() => {
        if (benefits.length === 0 && deductions.length === 0) {
            return {
                benefits: 0,
                deductions: 0,
            };
        }

        return {
            benefits: benefits.reduce((prev, b) => b.amount + prev, 0),
            deductions: deductions.reduce((prev, d) => d.amount + prev, 0),
        };
    })();

    const grossSalary = calculationBasis === "HOURLY"
        ? baseSalary * (workedQuanitity || 0)
        : baseSalary * workPercentage / 100;

    const netPay = grossSalary + totalAmounts.benefits -
        totalAmounts.deductions;

    return (
        <Document>
            <Page
                size="A4"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "48px",
                    padding: "24px",
                    fontSize: 14,
                }}
            >
                {/** Icon */}
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                    }}
                >
                    <Image
                        src="/icons/iris-global.png"
                        style={{
                            width: 300,
                            objectFit: "contain",
                        }}
                    />
                </View>

                {/** Heading */}
                <View>
                    <Text
                        style={{
                            fontSize: 24,
                            fontWeight: 700,
                            textAlign: "center",
                        }}
                    >
                        Payslip for the month of{" "}
                        {`${date.getMonth() + 1} / ${date.getFullYear()}`}
                    </Text>
                </View>

                {/** Information Overview */}
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <View style={styles.informationOverviewCol}>
                        <Text>Date:</Text>
                        <Text>Date of Joining:</Text>
                        <Text>
                            Worked{" "}
                            {calculationBasis === "MONTHLY" ? "Days" : "Hours"}:
                        </Text>
                        <Text>Calculation Basis:</Text>
                    </View>
                    <View
                        style={{
                            ...styles.informationOverviewCol,
                            textAlign: "right",
                        }}
                    >
                        <Text>{date.toDateString()}</Text>
                        <Text>{dateOfJoining.toDateString()}</Text>
                        <Text>{workedQuanitity}</Text>
                        <Text>{calculationBasis}</Text>
                    </View>

                    <View style={{ flexGrow: 1 }}>
                        <Text></Text>
                    </View>

                    <View style={styles.informationOverviewCol}>
                        <Text>Employee Name:</Text>
                        <Text>Job Title:</Text>
                        <Text>Department:</Text>
                        <Text>Work Percentage:</Text>
                    </View>
                    <View
                        style={{
                            ...styles.informationOverviewCol,
                            alignItems: "flex-end",
                        }}
                    >
                        <Text>{employeeName}</Text>
                        <Text>{jobTitle}</Text>
                        <Text>{department}</Text>
                        <Text>{workPercentage}</Text>
                    </View>
                </View>

                {/** Pay Overview */}
                <View
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "24px",
                    }}
                >
                    <Text style={{ fontWeight: 700 }}>
                        Base Salary: {formatMoney(baseSalary)}
                    </Text>

                    <View style={{ display: "flex", flexDirection: "column" }}>
                        {/* Table Header */}
                        <View style={{ flexDirection: "row" }}>
                            <Text style={styles.tableHeader}>Earnings</Text>
                            <Text style={styles.tableHeader}>Amount</Text>
                            <Text style={styles.tableHeader}>Deductions</Text>
                            <Text style={styles.tableHeader}>Amount</Text>
                        </View>

                        {/* Table Rows */}

                        {tableRows.map((row) => {
                            return (
                                <View
                                    key={row.key}
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                    }}
                                >
                                    <Text style={styles.tableRow}>
                                        {row.benefitName}
                                    </Text>
                                    <Text style={styles.tableRowAmount}>
                                        {row.benefitAmount}
                                    </Text>
                                    <Text style={styles.tableRow}>
                                        {row.deductionName}
                                    </Text>
                                    <Text style={styles.tableRowAmount}>
                                        {row.deductionAmount}
                                    </Text>
                                </View>
                            );
                        })}

                        {/* Total */}
                        <View style={{ flexDirection: "row" }}>
                            <Text style={styles.tableFooterTotal}>Total</Text>
                            <Text style={styles.tableFooterAmount}>
                                {formatMoney(totalAmounts.benefits)}
                            </Text>
                            <Text style={styles.tableFooterTotal}>Total</Text>
                            <Text style={styles.tableFooterAmount}>
                                {formatMoney(totalAmounts.deductions)}
                            </Text>
                        </View>
                    </View>
                </View>

                {/** Net Pay Calculation */}
                <View style={{ display: "flex", flexDirection: "row" }}>
                    <View style={styles.netPayCol}>
                        <Text>Gross Pay</Text>
                        <Text>Benefits</Text>
                        <Text>Deductions</Text>
                        <Text style={{ fontWeight: 700 }}>Net Pay</Text>
                    </View>

                    <View style={{ ...styles.netPayCol, textAlign: "right" }}>
                        <Text>{formatMoney(grossSalary)}</Text>
                        <Text>+ {formatMoney(totalAmounts.benefits)}</Text>
                        <Text style={{ borderBottom: "1px solid black" }}>
                            - {formatMoney(totalAmounts.deductions)}
                        </Text>
                        <Text style={{ fontWeight: 700 }}>
                            {formatMoney(netPay)}
                        </Text>
                    </View>
                </View>

                {/** Payout Information */}
                <View
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                    }}
                >
                    <Text style={{ fontWeight: 700, fontSize: 18 }}>
                        Payout Via
                    </Text>
                    <Text>{payoutInformation}</Text>
                </View>
            </Page>
        </Document>
    );
};
