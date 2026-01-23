import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";

const requestSchema = z.object({
  email: z.string().email("Valid email required")
});

const confirmSchema = z.object({
  email: z.string().email("Valid email required"),
  code: z.string().min(4, "Code required"),
  newPassword: z.string().min(8, "New password required")
});

type RequestValues = z.infer<typeof requestSchema>;

type ConfirmValues = z.infer<typeof confirmSchema>;

export function ForgotPassword() {
  const { forgotPassword, confirmResetPassword } = useAuth();
  const [step, setStep] = useState<"request" | "confirm">("request");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const requestForm = useForm<RequestValues>({ resolver: zodResolver(requestSchema) });
  const confirmForm = useForm<ConfirmValues>({ resolver: zodResolver(confirmSchema) });

  const onRequest = requestForm.handleSubmit(async (values) => {
    try {
      setError(null);
      await forgotPassword(values.email);
      setEmail(values.email);
      setStep("confirm");
    } catch (err) {
      setError((err as Error).message);
    }
  });

  const onConfirm = confirmForm.handleSubmit(async (values) => {
    try {
      setError(null);
      await confirmResetPassword(values.email, values.code, values.newPassword);
      setStep("request");
    } catch (err) {
      setError((err as Error).message);
    }
  });

  return (
    <div className="section-container max-w-xl space-y-6">
      <Helmet>
        <title>Reset Password | VinoVeil</title>
      </Helmet>
      <h1 className="font-serif text-4xl">Reset password</h1>
      {step === "request" ? (
        <form className="space-y-4" onSubmit={onRequest}>
          <Input
            label="Email"
            {...requestForm.register("email")}
            error={requestForm.formState.errors.email?.message}
          />
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
          <Button type="submit" loading={requestForm.formState.isSubmitting}>
            Send reset code
          </Button>
        </form>
      ) : (
        <form className="space-y-4" onSubmit={onConfirm}>
          <Input
            label="Email"
            defaultValue={email}
            {...confirmForm.register("email")}
            error={confirmForm.formState.errors.email?.message}
          />
          <Input
            label="Confirmation code"
            {...confirmForm.register("code")}
            error={confirmForm.formState.errors.code?.message}
          />
          <Input
            label="New password"
            type="password"
            {...confirmForm.register("newPassword")}
            error={confirmForm.formState.errors.newPassword?.message}
          />
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
          <Button type="submit" loading={confirmForm.formState.isSubmitting}>
            Update password
          </Button>
        </form>
      )}
      <Link to="/auth/sign-in" className="text-sm text-gold">
        Back to sign in
      </Link>
    </div>
  );
}
