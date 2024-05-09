export default function AskSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-6">
        <div className="w-52 h-8 bg-neutral-300 mb-2 rounded-lg"></div>
        <div className="w-full h-20 bg-neutral-200 rounded-lg"></div>
      </div>
      <div>
        <div className="w-full h-10 bg-indigo-300 rounded-lg"></div>
      </div>
    </div>
  );
}
