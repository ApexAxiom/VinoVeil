import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";

const schema = z
  .object({
    email: z.string().email("Valid email required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmationCode: z.string().optional()
  })
  .refine((values) => values.password.length >= 8, {
    path: ["password"],
    message: "Password must be at least 8 characters"
  });

type FormValues = z.infer<typeof schema>;

export function SignUp() {
  const { signUp, confirmSignUp, resendConfirmation } = useAuth();
  const [step, setStep] = useState<"signup" | "confirm">("signup");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState, getValues } = useForm<FormValues>({
    resolver: zodResolver(schema)
  });
  const confirmationForm = useForm<{ confirmationCode: string }>({
    resolver: zodResolver(z.object({ confirmationCode: z.string().min(1, "Confirmation code required") }))
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      setError(null);
      await signUp(values.email, values.password);
      setEmail(values.email);
      setStep("confirm");
    } catch (err) {
      setError((err as Error).message);
    }
  });
  const onConfirm = confirmationForm.handleSubmit(async (values) => {
    try {
      setError(null);
      await confirmSignUp(email, values.confirmationCode);
      navigate("/auth/sign-in");
    } catch (err) {
      setError((err as Error).message);
    }
  });

  return (
    <div className="section-container max-w-xl space-y-6">
      <Helmet>
        <title>Create Account | VinoVeil</title>
      </Helmet>
      <h1 className="font-serif text-4xl">Create account</h1>
      <form className="space-y-4" onSubmit={step === "signup" ? onSubmit : onConfirm}>
        {step === "signup" ? (
          <>
            <Input label="Email" {...register("email")} error={formState.errors.email?.message} />
            <Input
              label="Password"
              type="password"
              {...register("password")}
              error={formState.errors.password?.message}
            />
          </>
        ) : (
          <Input
            label="Confirmation code"
            {...confirmationForm.register("confirmationCode")}
            error={confirmationForm.formState.errors.confirmationCode?.message}
          />
        )}
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        <Button type="submit" loading={formState.isSubmitting || confirmationForm.formState.isSubmitting}>
          {step === "signup" ? "Create account" : "Confirm sign up"}
        </Button>
      </form>
      {step === "confirm" ? <p className="text-sm text-parchment/70">Enter the code from your email. If it hasn’t arrived, resend confirmation.</p> : null}
      <Button variant="secondary" loading={resending} onClick={async () => {
        setResending(true);
        try {
          setError(null);
          const target = email || getValues("email");
          await resendConfirmation(target);
          setEmail(target);
          setStep("confirm");
        } catch (failure) {
          setError(failure instanceof Error ? failure.message : "Confirmation could not be sent.");
        } finally { setResending(false); }
      }}>Resend confirmation</Button>
      <Link to="/auth/sign-in" className="text-sm text-gold">
        Already have an account? Sign in.
      </Link>
    </div>
  );
}
