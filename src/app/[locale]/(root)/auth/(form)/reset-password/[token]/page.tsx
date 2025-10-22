import FormLogin from "@/components/shared/FormAuth";

export default async function page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <FormLogin type="reset-password" token={token} />;
}
