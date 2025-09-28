import { I18nProvider } from "@refinedev/core";
import { myI18n } from "./i18n-provider";

/**
 * This is only needed for internal refine rendering.
 *
 * For our code, we'll use useTranslation from @i18n/i18n-provider
 */
export const refineI18nProvider: I18nProvider = {
  translate: (key: string, options?: string | any, fallback?: any) => {
    // weird bug in refine that if options is undefined, it'll just pass (key, fallback)
    // triggering techincally "options" to become fallback
    let actualFallback: string = "";
    if (fallback === undefined && typeof options === "string") {
      actualFallback = options;
    }
    if (fallback !== undefined) {
      actualFallback = fallback;
    }

    let actualOptions = {};
    if (options && typeof options !== "string") {
      actualOptions = options;
    }

    return myI18n.t(key, {
      defaultValue: actualFallback || key,
      ...actualOptions,
    });
  },
  changeLocale: (lng: string) => myI18n.changeLanguage(lng),
  getLocale: () => myI18n.language,
};
