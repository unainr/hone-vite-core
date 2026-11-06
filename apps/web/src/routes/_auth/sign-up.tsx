

import { SignUp } from "@/modules/auth/components/sign-up";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/sign-up")({
    component: SignUpPage,
});

function SignUpPage() {
  return (
    <>
     
      <SignUp />
    </>
  )
}