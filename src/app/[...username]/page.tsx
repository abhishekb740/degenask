import { Profile } from "@/components";

export const fetchCache = "force-no-store";

export default async function Creator({ params }: { params: { username: string } }) {
  const user = await fetch(
    `${process.env.NEXT_PUBLIC_HOST_URL}/api/getCreator?username=${params.username}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  const response = await user.json();

  if (response?.data[0]?.username) {
    return <Profile user={response?.data[0]} />;
  } else {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-5 p-20">
        <h1 className="text-[2.5rem] font-title font-semibold text-neutral-700">
          404: User not found
        </h1>
      </main>
    );
  }
}
