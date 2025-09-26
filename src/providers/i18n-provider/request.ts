import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";
import { fallbackLng, headerName } from "./settings";

export default getRequestConfig(async () => {
    // Static for now, we'll change this later
    const requestedLang = (await headers()).get(headerName);
    const locale = requestedLang || fallbackLng;

    return {
        locale,
        messages: (await import(`./refine-messages.${locale}.json`)).default,
    };
});
