import { useState } from "react";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { GoogleButton } from "./google-button";
import { PasswordInput } from "./password-input";

const schema = z.object({
	email: z.email("Enter a valid email"),
	password: z.string().min(1, "Password is required"),
});

export const SignIn = () => {
	const navigate = useNavigate();
	const router = useRouter();
	const [submitError, setSubmitError] = useState<string | null>(null);

	const form = useForm({
		defaultValues: { email: "", password: "" },
		validators: { onSubmit: schema },
		onSubmit: async ({ value }) => {
			setSubmitError(null);

			const { error } = await signIn.email(value);
			if (error) {
				setSubmitError(error.message ?? "Something went wrong");
				return;
			}

			await router.invalidate();
			navigate({ to: "/" });
		},
	});

	return (
		<div className="flex min-h-screen items-center justify-center  px-4 py-10">
			<Card className="w-full max-w-sm">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl">Welcome back</CardTitle>
					<CardDescription>
						No account?{" "}
						<Link
							to="/sign-up"
							className="font-medium text-foreground underline underline-offset-4">
							Sign up
						</Link>
					</CardDescription>
				</CardHeader>

				<CardContent>
					<form
						id="sign-in-form"
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							form.handleSubmit();
						}}>
						<FieldGroup>
							<form.Field name="email">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>Email</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												type="email"
												autoComplete="email"
												placeholder="you@example.com"
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
											/>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
							</form.Field>

							<form.Field name="password">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>Password</FieldLabel>
											<PasswordInput
												id={field.name}
												name={field.name}
												autoComplete="current-password"
												placeholder="Your password"
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
											/>
											{isInvalid && (
												<FieldError errors={field.state.meta.errors} />
											)}
										</Field>
									);
								}}
							</form.Field>
						</FieldGroup>

						{submitError && (
							<p
								role="alert"
								className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
								{submitError}
							</p>
						)}
					</form>
				</CardContent>

				<CardFooter className="flex flex-col gap-4">
					<form.Subscribe selector={(s) => s.isSubmitting}>
						{(isSubmitting) => (
							<>
								<Button
									type="submit"
									form="sign-in-form"
									disabled={isSubmitting}
									className="w-full">
									{isSubmitting ? "Signing in..." : "Sign in"}
								</Button>

								<div className="flex w-full items-center gap-3 text-xs text-muted-foreground">
									<span className="h-px flex-1 bg-border" />
									or
									<span className="h-px flex-1 bg-border" />
								</div>

								<GoogleButton
									disabled={isSubmitting}
									onError={setSubmitError}
								/>
							</>
						)}
					</form.Subscribe>
				</CardFooter>
			</Card>
		</div>
	);
};