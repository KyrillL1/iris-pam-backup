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

export const resources: ResourceProps[] = [
    {
        name: "employees",
        list: "/employees",
        create: "/employees/create",
        edit: "/employees/edit/:id",
        show: "/employees/show/:id",
        meta: {
            canDelete: true,
            icon: <Badge />,
        },
    },
    {
        name: "departments",
        list: "/departments",
        meta: {
            icon: <Diversity3 />,
        },
    },
    {
        name: "contracts",
        list: "/contracts",
        create: "/contracts/create",
        edit: "/contracts/edit/:id",
        show: "/contracts/show/:id",
        meta: {
            canDelete: true,
            icon: <Description />,
        },
    },
    {
        name: "pay_adjustments_to_employees",
        list: "/pay-adjustments-to-employees",
        create: "/pay-adjustments-to-employees/create",
        show: "/pay-adjustments-to-employees/show/:id",
        edit: "/pay-adjustments-to-employees/edit/:id",
        meta: {
            label: "Benefits & Deductions",
            icon: <BookmarkAdd />,
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
            label: "Recipient Payout Info",
            icon: <AccountBalance />,
            canDelete: true,
        },
    },
    {
        name: "payouts",
        list: "/payouts",
        show: "/payouts/show/:id",
        edit: "/payouts/edit/:id",
        meta: {
            icon: <Paid />,
            canDelete: false,
        },
    },
    {
        name: "payout_proposals",
        list: "/payout-proposals",
        create: "/payout-proposals/create",
        show: "/payout-proposals/show/:id",
        meta: {
            icon: <CurrencyExchange />,
        },
    },
];
