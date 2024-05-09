export default function FeedSkeleton() {
  return (
    <div className="flex flex-col space-y-4 p-5 bg-neutral-100 rounded-lg">
      <div className="w-full items-start space-y-2 animate-pulse">
        <div className="h-8 w-52 bg-neutral-200 rounded-lg"></div>
        <div className="h-4 w-20 bg-indigo-300 rounded"></div>
        <div className="h-5 w-full bg-neutral-300 rounded"></div>
        <div className="h-5 w-full bg-neutral-300 rounded"></div>
      </div>
    </div>
  );
}
