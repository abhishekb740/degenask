import { User } from "@/types";
import Header from "../shared/header";

export default function Layout({ users, children }: { users: User[]; children: React.ReactNode }) {
  return (
    <>
      <Header users={users} />
      <main className="flex flex-col min-h-screen justify-center items-center px-5 sm:px-20 md:px-32 lg:px-44 xl:px-64 2xl:px-80">
        {children}
      </main>
    </>
  );
}
