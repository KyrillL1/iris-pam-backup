// Common translations

import { myI18n, useTranslation } from "@i18n/i18n-provider";

myI18n.addResourceBundle("en", "employees/common", {
    fields: {
        first_name: "First Name",
        last_name: "Last Name",
        birthdate: "Birthdate",
        gender: "Gender",
        household_size: "Household Size",
        social_security_number: "SSN",
        quickbooks_name: "QuickBooks Name",
    },
    options: {
        gender: {
            MALE: "MALE",
            FEMALE: "FEMALE",
        },
    },
});

myI18n.addResourceBundle("pt", "employees/common", {
    fields: {
        first_name: "Nome",
        last_name: "Sobrenome",
        birthdate: "Data de Nascimento",
        gender: "Gênero",
        household_size: "Tamanho da Família",
        social_security_number: "Número de Segurança Social",
        quickbooks_name: "Nome no QuickBooks",
    },
    options: {
        gender: {
            MALE: "Masculino",
            FEMALE: "Feminino",
        },
    },
});

export function useTranslationCommon(additionalNs?: string) {
    return useTranslation([
        "employees/common",
        ...(additionalNs ? [additionalNs] : []),
    ]);
}
