import Header from "../shared/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col min-h-screen justify-center items-center px-5 sm:px-20 md:px-32 lg:px-44 xl:px-64 2xl:px-80">
      <Header color="[#A36EFD]" />
      {children}
    </main>
  );
}
