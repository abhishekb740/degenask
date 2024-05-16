export default function FeedSkeleton() {
  return (
    <div className="flex flex-col w-full space-y-4 p-8 bg-white rounded-3xl">
      <div className="w-full items-start space-y-3 animate-pulse">
        <span className="flex flex-row gap-3 items-center">
          <div className="w-10 h-10 bg-violet-200 rounded-full"></div>
          <div className="h-8 w-52 bg-neutral-200 rounded-lg"></div>
        </span>
        <div className="h-8 w-full bg-neutral-300 rounded-lg"></div>
        <div className="h-6 w-full bg-neutral-200 rounded-lg"></div>
        <div className="h-6 w-full bg-neutral-200 rounded-lg"></div>
      </div>
    </div>
  );
}
