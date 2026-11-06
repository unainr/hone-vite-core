import { useState } from "react";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { signUp } from "@/lib/auth-client";
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
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { GoogleButton } from "./google-button";
import { PasswordInput } from "./password-input";

const schema = z.object({
	name: z.string().trim().min(1, "Name is required"),
	email: z.email("Enter a valid email"),
	password: z.string().min(8, "Minimum 8 characters"),
});

export const SignUp = () => {
	const navigate = useNavigate();
	const router = useRouter();
	const [submitError, setSubmitError] = useState<string | null>(null);

	const form = useForm({
		defaultValues: { name: "", email: "", password: "" },
		validators: { onSubmit: schema },
		onSubmit: async ({ value }) => {
			setSubmitError(null);

			const { error } = await signUp.email(value);
			if (error) {
				setSubmitError(error.message ?? "Something went wrong");
				return;
			}

			// Better Auth signs the user in automatically after sign up
			await router.invalidate();
			navigate({ to: "/" });
		},
	});

	return (
		<div className="flex min-h-screen items-center justify-center  px-4 py-10">
			<Card className="w-full max-w-sm">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl">Create your account</CardTitle>
					<CardDescription>
						Already have an account?{" "}
						<Link
							to="/sign-in"
							className="font-medium text-foreground underline underline-offset-4">
							Sign in
						</Link>
					</CardDescription>
				</CardHeader>

				<CardContent>
					<form
						id="sign-up-form"
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							form.handleSubmit();
						}}>
						<FieldGroup>
							<form.Field name="name">
								{(field) => {
									const isInvalid =
										field.state.meta.isTouched && !field.state.meta.isValid;
									return (
										<Field data-invalid={isInvalid}>
											<FieldLabel htmlFor={field.name}>Name</FieldLabel>
											<Input
												id={field.name}
												name={field.name}
												autoComplete="name"
												placeholder="Your name"
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
												autoComplete="new-password"
												placeholder="Min. 8 characters"
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												aria-invalid={isInvalid}
											/>
											{isInvalid ? (
												<FieldError errors={field.state.meta.errors} />
											) : (
												<FieldDescription>
													Use at least 8 characters.
												</FieldDescription>
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
									form="sign-up-form"
									disabled={isSubmitting}
									className="w-full">
									{isSubmitting ? "Creating account..." : "Create account"}
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