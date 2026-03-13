"use client";
// import PasswordStrength from "@/components/password-strength";

import {
  calculatePasswordStrength,
  SignUpSchema,
  type SignUpSchemaType,
} from "@/zod-schema/auth-schema";
import { authClient } from "@/server/better-auth/client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
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
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <Card.Header>
          <Card.Title>Sign Up</Card.Title>
        </Card.Header>

        <Card.Content>
          <Form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              control={control}
              name="name"
              render={({ field, fieldState }) => (
                <TextField {...field} isInvalid={fieldState.invalid}>
                  <Label>Name</Label>
                  <Input variant="secondary" placeholder="Wick" />
                  <FieldError>{fieldState.error?.message}</FieldError>
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
                  <Label>Email</Label>
                  <Input variant="secondary" placeholder="john@example.com" />
                  <FieldError>{fieldState.error?.message}</FieldError>
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
                  <Label>Password</Label>
                  <Input variant="secondary" placeholder="password" />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </TextField>
              )}
            />

            <Button isPending={isSubmitting} type="submit" className="w-full">
              {({ isPending }) => (
                <>
                  {isPending ? <Spinner color="current" size="sm" /> : null}
                  Sign Up
                </>
              )}
            </Button>
          </Form>
        </Card.Content>

        <Card.Footer className="flex flex-col justify-center gap-3 sm:flex-row">
          Already have an account?
          <Button
            variant={"ghost"}
            onPress={() => router.push("/sign-in")}
            className="w-full cursor-pointer sm:w-auto"
          >
            <ArrowRightToSquare className="mr-2 h-4 w-4" /> Sign in
          </Button>
        </Card.Footer>
        <Button
          onPress={() => router.push("/")}
          variant="ghost"
          className="w-full text-center"
        >
          Back Home
        </Button>
      </Card>
    </div>
  );
};

export default SignUpUser;
