import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const schema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password required")
});

type FormValues = z.infer<typeof schema>;

export function SignIn() {
  const { signIn } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema)
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      setError(null);
      await signIn(values.email, values.password);
      notify({ title: "Welcome back", description: "You are signed in." });
      const redirect = searchParams.get("redirect") ?? "/account";
      navigate(redirect);
    } catch (err) {
      setError((err as Error).message);
    }
  });

  return (
    <div className="section-container max-w-xl space-y-6">
      <Helmet>
        <title>Sign In | VinoVeil</title>
      </Helmet>
      <h1 className="font-serif text-4xl">Sign in</h1>
      <form className="space-y-4" onSubmit={onSubmit}>
        <Input label="Email" {...register("email")} error={formState.errors.email?.message} />
        <Input
          label="Password"
          type="password"
          {...register("password")}
          error={formState.errors.password?.message}
        />
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        <Button type="submit" loading={formState.isSubmitting}>
          Sign in
        </Button>
      </form>
      <div className="flex items-center justify-between text-sm text-parchment/70">
        <Link to="/auth/forgot-password" className="text-gold">
          Forgot password?
        </Link>
        <Link to="/auth/sign-up" className="text-gold">
          Create account
        </Link>
      </div>
    </div>
  );
}
