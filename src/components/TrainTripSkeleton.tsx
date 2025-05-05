import React from "react";

const TrainTripSkeleton = () => {
  return (
    <div className="flex h-screen">
      {/* Main Content */}
      <div className="flex-1 p-4 overflow-auto">
        {/* Train Trip Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array(8)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 bg-white shadow-sm"
              >
                {/* Train Name and Times */}
                <div className="flex justify-between items-center mb-2">
                  <div className="h-6 w-20 bg-gray-200 animate-pulse rounded" />
                  <div className="h-6 w-24 bg-gray-200 animate-pulse rounded" />
                </div>
                <div className="flex justify-between items-center mb-2">
                  <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
                  <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
                </div>
                {/* Station Info */}
                <div className="flex justify-between items-center mb-2">
                  <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
                  <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
                </div>
                {/* Available Seats */}
                <div className="h-4 w-16 bg-gray-200 animate-pulse rounded mb-2" />
                {/* Train Icon */}
                <div className="h-16 w-full bg-gray-200 animate-pulse rounded" />
              </div>
            ))}
        </div>

        {/* Selected Train Details */}
        <div className="mt-4 border rounded-lg p-4 bg-white shadow-sm">
          {/* Train Icon and Carriage Info */}
          <div className="flex items-center mb-4">
            <div className="h-12 w-24 bg-gray-200 animate-pulse rounded mr-4" />
            <div className="h-6 w-32 bg-gray-200 animate-pulse rounded" />
          </div>
          {/* Seats */}
          <div className="flex flex-wrap gap-2">
            {Array(12)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="h-8 w-8 bg-gray-200 animate-pulse rounded"
                />
              ))}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 p-4 bg-gray-50 border-l">
        {/* Selected Train Info */}
        <div className="mb-4">
          <div className="h-6 w-32 bg-gray-200 animate-pulse rounded mb-2" />
          <div className="h-4 w-full bg-gray-200 animate-pulse rounded mb-1" />
          <div className="h-4 w-full bg-gray-200 animate-pulse rounded mb-1" />
          <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
        </div>
        <div className="mb-4">
          <div className="h-6 w-32 bg-gray-200 animate-pulse rounded mb-2" />
          <div className="h-4 w-full bg-gray-200 animate-pulse rounded mb-1" />
          <div className="h-4 w-full bg-gray-200 animate-pulse rounded mb-1" />
          <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
        </div>
        {/* Journey Information */}
        <div className="mb-4">
          <div className="h-6 w-40 bg-gray-200 animate-pulse rounded mb-2" />
          <div className="h-10 w-full bg-gray-200 animate-pulse rounded mb-2" />
          <div className="h-10 w-full bg-gray-200 animate-pulse rounded mb-2" />
          <div className="flex items-center mb-2">
            <div className="h-4 w-20 bg-gray-200 animate-pulse rounded mr-2" />
            <div className="h-4 w-20 bg-gray-200 animate-pulse rounded" />
          </div>
          <div className="h-10 w-full bg-gray-200 animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
};

export default TrainTripSkeleton;
