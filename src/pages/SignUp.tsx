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
  const { signUp, confirmSignUp } = useAuth();
  const [step, setStep] = useState<"signup" | "confirm">("signup");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { register, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema)
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      setError(null);
      if (step === "signup") {
        await signUp(values.email, values.password);
        setEmail(values.email);
        setStep("confirm");
        return;
      }
      if (values.confirmationCode) {
        await confirmSignUp(email, values.confirmationCode);
        navigate("/auth/sign-in");
      }
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
      <form className="space-y-4" onSubmit={onSubmit}>
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
            {...register("confirmationCode")}
            error={formState.errors.confirmationCode?.message}
          />
        )}
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        <Button type="submit" loading={formState.isSubmitting}>
          {step === "signup" ? "Send confirmation" : "Confirm sign up"}
        </Button>
      </form>
      <Link to="/auth/sign-in" className="text-sm text-gold">
        Already have an account? Sign in.
      </Link>
    </div>
  );
}
