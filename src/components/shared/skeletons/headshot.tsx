export default function HeadshotSkeleton() {
  return (
    <div className="flex flex-col w-full md:w-2/5 gap-4 font-primary animate-pulse">
      <span className="flex flex-row items-center gap-3">
        <span className="w-16 h-16 bg-violet-200 rounded-full object-cover" />
        <span className="flex flex-col gap-2 items-start">
          <span className="w-32 h-6 bg-neutral-300 rounded-lg" />
          <span className="w-20 h-5 bg-neutral-200 rounded-lg" />
        </span>
      </span>
      <span className="w-full h-5 bg-blue-100 rounded-lg" />
      <span className="w-full h-5 bg-blue-100 rounded-lg" />
      <span className="w-full h-5 bg-blue-100 rounded-lg" />
      <div className="flex flex-row gap-4 items-center">
        <span className="w-20 h-6 bg-neutral-200 rounded-lg"></span>
        <p className="w-10 h-6 bg-[#e1cfff] rounded-lg"></p>
        <span className="w-20 h-6 bg-neutral-200 rounded-lg"></span>
        <p className="w-10 h-6 bg-[#e1cfff] rounded-lg"></p>
      </div>
    </div>
  );
}
