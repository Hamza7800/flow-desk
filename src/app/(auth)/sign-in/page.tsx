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
    },
  });

  const { handleSubmit, control, reset } = form;

  const loginAction = async (values: SignInSchemaType) => {
    // await new Promise((res) => setTimeout(res, 5000));

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
    toast.promise(loginAction(values), {
      loading: "Authenticating...",
      success: (data) => {
        router.push("/");
        setIsSubmitting(false);
        reset();
        return `Welcome back! ${data.user.name}`;
      },
      error: (err) => {
        setIsSubmitting(false);
        return err.message;
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <Card.Header>
          <Card.Title>Sign in</Card.Title>
        </Card.Header>

        <Card.Content>
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
                  Sign In
                </>
              )}
            </Button>
          </Form>
        </Card.Content>

        <Card.Footer className="flex flex-col justify-center gap-3 sm:flex-row">
          Don't have an account?
          <Button
            variant={"ghost"}
            onPress={() => router.push("/sign-up")}
            className="w-full cursor-pointer sm:w-auto"
          >
            <ArrowRightToSquare className="mr-2 h-4 w-4" /> Sign up
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

export default SignUser;
