// Common translations

import { myI18n, useTranslation } from "@i18n/i18n-provider";

myI18n.addResourceBundle("en", "payoutproposal/common", {
    fields: {
        status: "Status",
    },
});

myI18n.addResourceBundle("pt", "payoutproposal/common", {
    fields: {
        status: "Estado",
    },
});

export function useTranslationCommon(additionalNs?: string) {
    return useTranslation([
        "payoutproposal/common",
        ...(additionalNs ? [additionalNs] : []),
    ]);
}
