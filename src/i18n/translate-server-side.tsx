import { myI18n } from "./i18n-provider";

export function tServer(ns: string) {
    return myI18n.getFixedT(myI18n.language, ns);
}
