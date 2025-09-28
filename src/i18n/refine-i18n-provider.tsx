import { myI18n } from "./i18n-provider";

// KBAR
myI18n.addResourceBundle("en", "List", {
  "actions.list": "List",
});
myI18n.addResourceBundle("en", "Create", {
  "actions.create": "Create",
});
myI18n.addResourceBundle("en", "Delete", {
  "actions.delete": "Delete",
});

myI18n.addResourceBundle("pt", "List", {
  "actions.list": "Lista",
});
myI18n.addResourceBundle("pt", "Create", {
  "actions.create": "Criar",
});
myI18n.addResourceBundle("pt", "Delete", {
  "actions.delete": "Apagar",
});

export const refineI18nProvider = {
  translate: (key: string, ns?: string) => {
    return myI18n.t(key, { ns }).toString() || key;
  },
  changeLocale: (lng: string) => myI18n.changeLanguage(lng),
  getLocale: () => myI18n.language,
};
