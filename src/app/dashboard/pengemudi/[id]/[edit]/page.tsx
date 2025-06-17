import { Metadata } from "next";
import { Suspense } from "react";
import EditPengemudiForm from "@/components/Forms/EditPengemudiForm";

export const metadata: Metadata = {
  title: "Edit Bus | DMS Dipyo",
  description: "Edit bus details in the Next.js Admin Dashboard.",
};

export default function Page() {
  return (
    <div className="flex h-screen sm:grid-cols-2">
      <div className="w-full flex flex-col gap-9">
        <Suspense>
          <EditPengemudiForm /> {/* Dibungkus dengan Suspense */}
        </Suspense>
      </div>
    </div>
  );
}
