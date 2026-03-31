"use client";

import { SignInSchema, type SignInSchemaType } from "@/zod-schema/auth-schema";
import { authClient } from "@/server/better-auth/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  Card,
  FieldError,
  Form,
  Input,
  Label,
  Spinner,
  TextField,
  toast,
} from "@heroui/react";
import { ArrowRightToSquare } from "@gravity-ui/icons";

const SignUser = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const form = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
      // email: "alex@demo.com",
      // password: "demo1234",
    },
  });

  const { handleSubmit, control, reset } = form;

  const loginAction = async (values: SignInSchemaType) => {
    const parsedInput = SignInSchema.safeParse(values);
    if (!parsedInput.success) {
      throw new Error("Invalid Data");
    }

    const res = await authClient.signIn.email({
      email: parsedInput.data.email,
      password: parsedInput.data.password,
    });

    if (res.error) {
      throw new Error(res.error.message || "User Not Found");
    }
    return res.data;
  };

  const onSubmit = async (values: SignInSchemaType) => {
    setIsSubmitting(true);
    try {
      await loginAction(values);

      toast.success("Login Success");
      setIsSubmitting(false);
      router.push("/organizations");
    } catch (error: any) {
      setIsSubmitting(false);
      toast.danger(error.message);
    }
  };

  const handleDemoLogin = async () => {
    setIsSubmitting(true);

    try {
      await loginAction({
        email: "alex@demo.com",
        password: "demo1234",
      });

      toast.success("Logged in as demo user");
      router.push("/organizations");
    } catch (error: any) {
      toast.danger(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080a0f] p-6">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2">
          <h1
            className="text-2xl font-semibold tracking-tight text-white"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            FlowDesk
          </h1>
          <p className="text-sm text-zinc-500">Welcome back</p>
        </div>

        {/* card */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 shadow-2xl shadow-black/40 backdrop-blur-sm">
          <Form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              control={control}
              name="email"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  type="email"
                  isInvalid={fieldState.invalid}
                >
                  <Label className="mb-1.5 block text-xs font-medium text-zinc-400">
                    Email
                  </Label>
                  <Input variant="secondary" placeholder="john@example.com" />
                  <FieldError className="mt-1 text-xs text-red-400">
                    {fieldState.error?.message}
                  </FieldError>
                </TextField>
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  type="password"
                  isInvalid={fieldState.invalid}
                >
                  <Label className="mb-1.5 block text-xs font-medium text-zinc-400">
                    Password
                  </Label>
                  <Input variant="secondary" placeholder="••••••••" />
                  <FieldError className="mt-1 text-xs text-red-400">
                    {fieldState.error?.message}
                  </FieldError>
                </TextField>
              )}
            />

            <Button isPending={isSubmitting} type="submit" fullWidth>
              {({ isPending }) => (
                <span className="flex items-center justify-center gap-2">
                  {isPending && <Spinner color="current" size="sm" />}
                  {isPending ? "Signing in..." : "Sign in"}
                </span>
              )}
            </Button>
            <Button
              variant="outline"
              isPending={isSubmitting}
              onClick={handleDemoLogin}
              fullWidth
            >
              {({ isPending }) => (
                <span className="flex items-center justify-center gap-2">
                  {isPending && <Spinner color="current" size="sm" />}
                  {isPending ? "Signing in..." : "Demo Login"}
                </span>
              )}
            </Button>
          </Form>
        </div>

        <div className="mt-5 flex flex-col items-center gap-3">
          <p className="text-sm text-zinc-500">
            Don't have an account?{" "}
            <button
              onClick={() => router.push("/sign-up")}
              className="font-medium transition-colors hover:text-sky-300"
            >
              Sign up
            </button>
          </p>
          <button
            onClick={() => router.push("/")}
            className="text-xs text-zinc-600 transition-colors hover:text-zinc-400"
          >
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUser;
