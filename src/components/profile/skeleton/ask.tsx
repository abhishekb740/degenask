export default function AskSkeleton() {
  return (
    <div className="w-full md:w-3/5 animate-pulse">
      <div className="mb-6">
        <div className="w-52 h-8 bg-neutral-300 mb-2 rounded-lg"></div>
        <div className="w-full h-32 bg-neutral-200 rounded-lg"></div>
      </div>
      <div>
        <div className="w-2/5 h-12 bg-violet-300 rounded-3xl"></div>
      </div>
    </div>
  );
}
