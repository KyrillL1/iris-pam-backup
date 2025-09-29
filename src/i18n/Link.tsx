import React, { PropsWithChildren } from "react";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { useLocale } from "./i18n-provider";

export interface LinkProps extends NextLinkProps, PropsWithChildren {
}

export const Link: React.FC<LinkProps> = (props) => {
    const { locale } = useLocale();

    const hrefPrefixed = `/${locale}${props.href}`;

    return <NextLink {...props} href={hrefPrefixed}>{props.children}</NextLink>;
};
