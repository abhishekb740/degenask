export default function SetupSkeleton() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row w-full gap-3 mb-3 animate-pulse">
        <span className="flex flex-col w-full sm:w-[60%] gap-1.5">
          <div className="w-32 h-8 bg-neutral-300 rounded-lg"></div>
          <div className="h-10 w-full bg-neutral-200 rounded-lg"></div>
          <div className="w-52 h-5 bg-neutral-400 rounded"></div>
        </span>
        <span className="flex flex-col w-full sm:w-[40%] gap-1.5">
          <div className="w-32 h-8 bg-neutral-300 rounded-lg"></div>
          <div className="h-10 w-full bg-neutral-200 rounded-lg"></div>
          <div className="w-52 h-5 bg-neutral-400 rounded"></div>
        </span>
      </div>
      <div className="w-full h-10 bg-indigo-200 rounded-lg animate-pulse"></div>
    </div>
  );
}
