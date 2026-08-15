import React from 'react';

export default function ProductSkeleton({ count = 8 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col justify-between animate-pulse"
        >
          <div>
            <div className="aspect-4/3 bg-gray-200 rounded-xl mb-4" />
            <div className="flex justify-between mb-2">
              <div className="h-3 bg-gray-200 rounded w-1/4" />
              <div className="h-3 bg-gray-200 rounded w-1/4" />
            </div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
            <div className="h-3 bg-gray-200 rounded w-1/3" />
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col gap-3">
            <div className="h-5 bg-gray-200 rounded w-1/2" />
            <div className="h-8 bg-gray-200 rounded-xl w-full" />
          </div>
        </div>
      ))}
    </>
  );
}
