import React from "https://esm.sh/react@18.2.0";
import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "https://esm.sh/@react-pdf/renderer@3.3.7";

// util
function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export interface PayTableRow {
  name: string;
  key: string;
  amount: number;
}

export interface PayslipPayload {
  date: string;
  dateOfJoining: string;
  calculationBasis: "MONTHLY" | "HOURLY";
  workedQuanitity: number;
  employeeName: string;
  jobTitle: string;
  baseSalary: number;
  department: string;
  benefits: PayTableRow[];
  deductions: PayTableRow[];
  workPercentage: number;
  payoutInformation: string;
}

export const PayslipPdf: React.FC<PayslipPayload> = ({
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
}: PayslipPayload) => {
  const styles = StyleSheet.create({
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
  });

  const d = new Date(date);
  const doj = new Date(dateOfJoining);

  const totalBenefits = benefits.reduce((s, b) => s + b.amount, 0);
  const totalDeductions = deductions.reduce((s, d) => s + d.amount, 0);
  const netPay = baseSalary + totalBenefits - totalDeductions;

  const rowCount = Math.max(benefits.length, deductions.length);
  const rows = Array.from({ length: rowCount }, (_, i) => ({
    benefit: benefits[i] || { name: "", amount: 0, key: `b-${i}` },
    deduction: deductions[i] || { name: "", amount: 0, key: `d-${i}` },
  }));

  return (
    <Document>
      <Page size="A4" style={{ padding: 24, fontSize: 14 }}>
        {/* Heading */}
        <View>
          <Text style={{ fontSize: 20, textAlign: "center", marginBottom: 20 }}>
            Payslip for {d.getMonth() + 1}/{d.getFullYear()}
          </Text>
        </View>

        {/* Info */}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <Text>Date: {d.toDateString()}</Text>
            <Text>Date of Joining: {doj.toDateString()}</Text>
            <Text>
              Worked {calculationBasis === "MONTHLY" ? "Days" : "Hours"}:{" "}
              {workedQuanitity}
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text>Employee Name: {employeeName}</Text>
            <Text>Job Title: {jobTitle}</Text>
            <Text>Department: {department}</Text>
          </View>
        </View>

        {/* Base Salary */}
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontWeight: 700 }}>
            Base Salary: {formatMoney(baseSalary)} ({calculationBasis},{" "}
            {workPercentage}%)
          </Text>
        </View>

        {/* Table */}
        <View style={{ marginTop: 20 }}>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.tableHeader}>Earnings</Text>
            <Text style={styles.tableHeader}>Amount</Text>
            <Text style={styles.tableHeader}>Deductions</Text>
            <Text style={styles.tableHeader}>Amount</Text>
          </View>
          {rows.map((row, i) => (
            <View key={i} style={{ flexDirection: "row" }}>
              <Text style={styles.tableRow}>{row.benefit.name}</Text>
              <Text style={styles.tableRowAmount}>
                {row.benefit.amount ? formatMoney(row.benefit.amount) : ""}
              </Text>
              <Text style={styles.tableRow}>{row.deduction.name}</Text>
              <Text style={styles.tableRowAmount}>
                {row.deduction.amount ? formatMoney(row.deduction.amount) : ""}
              </Text>
            </View>
          ))}
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.tableRow}>Total</Text>
            <Text style={styles.tableRowAmount}>
              {formatMoney(totalBenefits)}
            </Text>
            <Text style={styles.tableRow}>Total</Text>
            <Text style={styles.tableRowAmount}>
              {formatMoney(totalDeductions)}
            </Text>
          </View>
        </View>

        {/* Net Pay */}
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontWeight: 700 }}>
            Net Pay: {formatMoney(netPay)}
          </Text>
        </View>

        {/* Payout */}
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontWeight: 700, fontSize: 16 }}>Payout Via</Text>
          <Text>{payoutInformation}</Text>
        </View>
      </Page>
    </Document>
  );
};
