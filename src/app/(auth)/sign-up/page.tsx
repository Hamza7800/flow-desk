"use client";
import { SignUpSchema, type SignUpSchemaType } from "@/zod-schema/auth-schema";
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
import Link from "next/link";
import Image from "next/image";

const SignUpUser = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const form = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const { handleSubmit, control, reset } = form;

  const sigUpAction = async (values: SignUpSchemaType) => {
    const parsedInput = SignUpSchema.safeParse(values);
    if (!parsedInput.success) {
      throw new Error("Invalid Data");
    }

    const res = await authClient.signUp.email({
      name: parsedInput.data.name,
      email: parsedInput.data.email,
      password: parsedInput.data.password,
    });

    if (res.error) {
      throw new Error(res.error.message || "Unable to create account");
    }
    return res.data;
  };

  const onSubmit = async (values: SignUpSchemaType) => {
    setIsSubmitting(true);
    try {
      await sigUpAction(values);

      toast.success("Account created");
      setIsSubmitting(false);
      router.push("/onboarding");
    } catch (error: any) {
      setIsSubmitting(false);
      toast.danger(error.message);
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
          <Link href={"/"} className="">
            <Image width={80} height={80} alt="logo" src={"/flow-logo.png"} />
          </Link>
          {/* <h1
            className="text-2xl font-semibold tracking-tight text-white"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            FlowDesk
          </h1> */}
          <p className="text-sm text-zinc-500">Create your account</p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 shadow-2xl shadow-black/40 backdrop-blur-sm">
          <Form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              control={control}
              name="name"
              render={({ field, fieldState }) => (
                <TextField {...field} isInvalid={fieldState.invalid}>
                  <Label className="mb-1.5 block text-xs font-medium text-zinc-400">
                    Full name
                  </Label>
                  <Input variant="secondary" placeholder="John Wick" />
                  <FieldError className="mt-1 text-xs text-red-400">
                    {fieldState.error?.message}
                  </FieldError>
                </TextField>
              )}
            />

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
                  {isPending ? "Creating account..." : "Create account"}
                </span>
              )}
            </Button>
          </Form>
        </div>

        {/* footer */}
        <div className="mt-5 flex flex-col items-center gap-3">
          <p className="text-sm text-zinc-500">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/sign-in")}
              className="font-medium transition-colors hover:text-sky-300"
            >
              Sign in
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

export default SignUpUser;
