export default function HeadshotSkeleton() {
  return (
    <div>
      <div className="flex flex-row items-start justify-between animate-pulse">
        <span className="flex gap-2 md:gap-8">
          <div className="w-[7rem] h-[4rem] md:h-[6rem] lg:w-[6rem] lg:h-[5rem] xl:h-[6rem] bg-sky-200 rounded-full object-fill" />
          <div className="flex flex-col gap-2 mt-2">
            <div className="md:w-40 lg:w-48 xl:w-full h-8 w-16 bg-neutral-300 rounded-lg"></div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-end">
              <div className="md:w-28 w-24 h-6 bg-indigo-300 rounded-lg"></div>
              <div className="flex gap-4">
                <span className="flex md:w-20 w-16 h-6 bg-neutral-400 items-center rounded-lg"></span>
                <span className="flex md:w-20 w-16 h-6 bg-neutral-400 items-center rounded-lg"></span>
              </div>
            </div>
            <div className="md:w-3/4 w-40 h-4 bg-neutral-300 rounded-lg"></div>
            <div className="md:w-3/4 w-40 h-4 bg-neutral-300 rounded-lg"></div>
          </div>
        </span>
        <span className="absolute right-5 bg-lime-100 p-4 rounded-full"></span>
        <span className="absolute right-[6.8rem] bg-indigo-100 p-4 rounded-full"></span>
        <span className="absolute right-[4rem] bg-red-100 p-4 rounded-full"></span>
      </div>
      <hr className="my-5 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25" />
    </div>
  );
}
