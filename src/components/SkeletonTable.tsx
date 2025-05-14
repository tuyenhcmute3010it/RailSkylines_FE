export default function ArticleListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Tiêu đề skeleton */}
      <div className="h-8 w-32 mx-auto bg-gray-200 rounded animate-pulse"></div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="flex flex-col items-start space-y-2">
            {/* Thumbnail skeleton */}
            <div className="w-full h-40 bg-gray-200 rounded-lg animate-pulse"></div>
            {/* Tiêu đề skeleton */}
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
