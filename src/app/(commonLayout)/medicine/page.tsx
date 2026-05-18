import { Suspense } from "react";

import MedicinePublicPage from "@/components/modules/Medicine/MedicinePublicPage";

function MedicinePageSkeleton() {
  return (
    <section className="w-full bg-gray-50">
      <div className="px-4 py-8 md:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="hidden h-96 w-80 shrink-0 animate-pulse rounded border bg-white lg:block" />
          <main className="flex-1 space-y-4">
            <div className="h-9 w-full max-w-sm animate-pulse rounded bg-gray-200" />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-72 animate-pulse rounded-lg border bg-white"
                />
              ))}
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}

const MedicinePage = () => {
  return (
    <Suspense fallback={<MedicinePageSkeleton />}>
      <MedicinePublicPage />
    </Suspense>
  );
};

export default MedicinePage;
