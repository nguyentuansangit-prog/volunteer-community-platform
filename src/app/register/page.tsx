import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import RegisterForm from "@/components/register-form";

export default async function RegisterPage() {
  if ((await auth())?.user) redirect("/activities");
  return <RegisterForm />;
}
