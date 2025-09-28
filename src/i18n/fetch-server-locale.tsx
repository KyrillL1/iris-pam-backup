import { headers } from "next/headers";
import { fallbackLng, headerName } from "./settings";

export async function fetchServerLocale() {
    const lng = (await headers()).get(headerName) || fallbackLng;

    return lng;
}
