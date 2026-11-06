import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
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

const schema = z.object({
	email: z.string().email("Enter a valid email"),
	password: z.string().min(1, "Password is required"),
});

export const SignIn = () => {
	const navigate = useNavigate();

	const form = useForm({
		defaultValues: { email: "", password: "" },
		validators: { onSubmit: schema },
		onSubmit: async ({ value }) => {
			const { error } = await signIn.email(value);
			if (error) {
				form.setErrorMap({
  onSubmit: {
    form: error.message ?? "Something went wrong",
    fields: {},
  },
})
				return;
			}
			navigate({ to: "/" });
		},
	});

	return (
		<div className="flex min-h-screen items-center justify-center px-4">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle>Welcome back</CardTitle>
					<CardDescription>
						No account?{" "}
						<Link
							to="/sign-up"
							className="font-medium text-foreground underline underline-offset-2">
							Sign up
						</Link>
					</CardDescription>
				</CardHeader>

				<CardContent>
					<form
						id="sign-in-form"
						onSubmit={(e) => {
							e.preventDefault();
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
											<Input
												id={field.name}
												name={field.name}
												type="password"
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

					{form.state.errorMap.onSubmit && (
  <p className="mt-3 text-sm text-destructive">
    {(form.state.errorMap.onSubmit as { form?: string })?.form}
  </p>
)}
					</form>
				</CardContent>

				<CardFooter>
					<form.Subscribe selector={(s) => s.isSubmitting}>
						{(isSubmitting) => (
							<Button
								type="submit"
								form="sign-in-form"
								disabled={isSubmitting}
								className="w-full">
								{isSubmitting ? "Signing in..." : "Sign in"}
							</Button>
						)}
					</form.Subscribe>
				</CardFooter>
			</Card>
		</div>
	);
};
