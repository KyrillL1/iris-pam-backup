export const formatMoney = (amount: number, currency: string = "MZN", locale: string = "pt-MZ") => {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
    }).format(amount);
};
