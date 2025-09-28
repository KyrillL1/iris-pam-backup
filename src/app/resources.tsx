import { myI18n } from "@i18n/i18n-provider";
import {
    AccountBalance,
    Badge,
    BookmarkAdd,
    CurrencyExchange,
    Description,
    Diversity3,
    Paid,
} from "@mui/icons-material";
import { ResourceProps } from "@refinedev/core";

myI18n.addResourceBundle("en", "resources", {
    employees: "Employees",
    departments: "Departments",
    contracts: "Contracts",
    pay_adjustments: "Benefits & Deductions",
    recipient_payout_info: "Recipient Payout Info",
    payouts: "Payouts",
    payout_proposals: "Payout Proposals",
});
myI18n.addResourceBundle("pt", "resources", {
    employees: "Trabalhadores",
    departments: "Departamentos",
    contracts: "Contratos",
    pay_adjustments: "Benefícios & Deduções",
    recipient_payout_info: "Info de Pagamento",
    payouts: "Pagamentos",
    payout_proposals: "Propostas de Pagamento",
});

export const getResources: () => ResourceProps[] = () => [
    {
        name: "employees",
        list: "/employees",
        create: "/employees/create",
        edit: "/employees/edit/:id",
        show: "/employees/show/:id",
        meta: {
            label: myI18n.t("resources:employees"),
            canDelete: true,
            icon: <Badge color="primary" />,
        },
    },
    {
        name: "departments",
        list: "/departments",
        meta: {
            label: myI18n.t("resources:departments"),
            icon: <Diversity3 color="primary" />,
        },
    },
    {
        name: "contracts",
        list: "/contracts",
        create: "/contracts/create",
        edit: "/contracts/edit/:id",
        show: "/contracts/show/:id",
        meta: {
            label: myI18n.t("resources:contracts"),
            canDelete: true,
            icon: <Description color="primary" />,
        },
    },
    {
        name: "pay_adjustments_to_employees",
        list: "/pay-adjustments-to-employees",
        create: "/pay-adjustments-to-employees/create",
        show: "/pay-adjustments-to-employees/show/:id",
        edit: "/pay-adjustments-to-employees/edit/:id",
        meta: {
            label: myI18n.t("resources:pay_adjustments"),
            icon: <BookmarkAdd color="primary" />,
            canDelete: true,
        },
    },
    {
        name: "recipient_payment_info",
        list: "/recipient-payment-info",
        create: "/recipient-payment-info/create",
        show: "/recipient-payment-info/show/:id",
        edit: "/recipient-payment-info/edit/:id",
        meta: {
            label: myI18n.t("resources:recipient_payout_info"),
            icon: <AccountBalance color="primary" />,
            canDelete: true,
        },
    },
    {
        name: "payouts",
        list: "/payouts",
        show: "/payouts/show/:id",
        edit: "/payouts/edit/:id",
        meta: {
            label: myI18n.t("resources:payouts"),
            icon: <Paid color="primary" />,
            canDelete: true,
        },
    },
    {
        name: "payout_proposals",
        list: "/payout-proposals",
        create: "/payout-proposals/create",
        show: "/payout-proposals/show/:id",
        meta: {
            label: myI18n.t("resources:payout_proposals"),
            icon: <CurrencyExchange color="primary" />,
            canDelete: true,
        },
    },
];
