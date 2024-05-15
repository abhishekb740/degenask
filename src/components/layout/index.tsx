import Header from "../shared/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col min-h-screen justify-center items-center px-3 sm:px-10">
      <Header color="[#A36EFD]" />
      {children}
    </main>
  );
}
