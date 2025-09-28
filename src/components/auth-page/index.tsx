"use client";

import { useLogin } from "@refinedev/core";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { AppIcon } from "@components/app-icon"; // your custom icon
import { Login } from "@mui/icons-material"; // MUI icon
import Image from "next/image";
import { myI18n, useLocale, useTranslation } from "@i18n/i18n-provider";
import { MZ, US } from "country-flag-icons/react/3x2";
import { useCallback } from "react";

myI18n.addResourceBundle("en", "authpage", {
  title: "Welcome To PAM",
  subtitle: "Sign into your account",
  email: "Email",
  password: "Password",
  remember: "Remember me",
  login: "Login",
  redirecting: "Redirecting...",
  errors: {
    emailRequired: "Email is required",
    passwordRequired: "Password is required",
  },
  changeLanguage: "Change to ",
});
myI18n.addResourceBundle("pt", "authpage", {
  title: "Bem-vindo ao PAM",
  subtitle: "Entre na sua conta",
  email: "E-mail",
  password: "Senha",
  remember: "Lembrar-me",
  login: "Entrar",
  redirecting: "Redirecionando...",
  errors: {
    emailRequired: "O e-mail é obrigatório",
    passwordRequired: "A senha é obrigatória",
  },
  changeLanguage: "Mudar ao",
});

type LoginFormValues = {
  email: string;
  password: string;
  remember: boolean;
};

export const AuthPage = () => {
  const { mutate: login, status } = useLogin<LoginFormValues>();

  const { handleSubmit, control } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    login(values);
  };

  const { t } = useTranslation("authpage");

  const { locale, changeLocale } = useLocale();
  const toggleLocale = () => {
    if (locale === "en") {
      changeLocale("pt");
      return;
    }
    changeLocale("en");
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Card sx={{ minWidth: 240, maxWidth: 500, p: 2 }}>
        <CardContent>
          <Stack justifyContent={"end"} direction={"row"}>
            <Button
              onClick={toggleLocale}
              sx={{ color: "black" }}
              endIcon={locale === "en"
                ? (
                  <MZ
                    style={{ marginRight: "12px" }}
                    width={24}
                    height={24}
                  />
                )
                : (
                  <US
                    style={{ marginRight: "12px" }}
                    width={24}
                    height={24}
                  />
                )}
            >
              {t("changeLanguage")}
            </Button>
          </Stack>
          <Box
            display="flex"
            justifyContent="center"
            sx={{ height: "124px", position: "relative", marginBottom: 5 }}
          >
            {/* Custom app icon */}{" "}
            <Image
              src={"/icons/iris-global.png"}
              alt="Iris global icon"
              fill
              style={{ objectFit: "contain" }}
            />
          </Box>{" "}
          <Typography variant="h5" align="center" gutterBottom>
            {t("title")}
          </Typography>{" "}
          <Typography align="center" gutterBottom>{t("subtitle")}</Typography>
          {" "}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="email"
              control={control}
              rules={{ required: t("errors.emailRequired") as string }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label={t("email")}
                  type="email"
                  margin="normal"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />{" "}
            <Controller
              name="password"
              control={control}
              rules={{ required: t("errors.passwordRequired") as string }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label={t("password")}
                  type="password"
                  margin="normal"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />{" "}
            <Controller
              name="remember"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} />}
                  label={t("remember")}
                />
              )}
            />{" "}
            {(status === "idle" || status === "pending" ||
              status === "error") && (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<Login />}
                sx={{ mt: 2 }}
              >
                {t("login")}
              </Button>
            )} {status === "success" && (
              <Button
                type="submit"
                variant="contained"
                color="success"
                fullWidth
                startIcon={<Login />}
                sx={{ mt: 2 }}
              >
                {t("redirecting")}
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};
