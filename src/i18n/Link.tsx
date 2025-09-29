import React, { PropsWithChildren, useEffect } from "react";
import NextLink, { LinkProps as NextLinkProps, useLinkStatus } from "next/link";
import { useLocale } from "./i18n-provider";

export interface LinkProps extends NextLinkProps, PropsWithChildren {
}

export const Link: React.FC<LinkProps> = (props) => {
    const { locale } = useLocale();

    const hrefPrefixed = `/${locale}${props.href}`;

    const { pending } = useLinkStatus();
    useEffect(() => {
        if (pending) {
            console.log({ pending });
        }
    }, [pending]);

    return <NextLink {...props} href={hrefPrefixed}>{props.children}</NextLink>;
};
