import { LoginForm } from "@/components/login-form";
import { PageHeader } from "@/components/page-header";

export default function LoginPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Auth"
        title="Simple email login"
        description="Scaffolded for internal use with Supabase magic-link authentication."
      />
      <LoginForm />
    </div>
  );
}
