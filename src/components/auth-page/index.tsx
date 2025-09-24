"use client";

import { useLogin } from "@refinedev/core";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { AppIcon } from "@components/app-icon"; // your custom icon
import { Login } from "@mui/icons-material"; // MUI icon
import Image from "next/image";

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

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Card sx={{ minWidth: 240, maxWidth: 500, p: 2 }}>
        <CardContent>
          <Box
            display="flex"
            justifyContent="center"
            sx={{ height: "124px", position: "relative", marginBottom: 3 }}
          >
            {/* Custom app icon */}
            <Image
              src={"/icons/iris-global.png"}
              alt="Iris global icon"
              fill
              objectFit="contain"
            />
          </Box>

          <Typography variant="h5" align="center" gutterBottom>
            Welcome To PAM
          </Typography>

          <Typography align="center" gutterBottom>
            Sign into your account
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="email"
              control={control}
              rules={{ required: "Email is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  margin="normal"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              rules={{ required: "Password is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Password"
                  type="password"
                  margin="normal"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="remember"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} />}
                  label="Remember me"
                />
              )}
            />

            {(status === "idle" || status === "pending" ||
              status === "error") && (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<Login />}
                loading={status === "pending"}
                sx={{ mt: 2 }}
              >
                Login
              </Button>
            )}
            {status === "success" && (
              <Button
                type="submit"
                variant="contained"
                color="success"
                fullWidth
                startIcon={<Login />}
                sx={{ mt: 2 }}
              >
                Redirecting...
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};
