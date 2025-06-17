import { Metadata } from "next";
import { Suspense } from "react";
import EditBusForm from "@/components/Forms/EditBusForm";

export const metadata: Metadata = {
  title: "Edit Bus | DMS Dipyo",
  description: "Edit bus details in the Next.js Admin Dashboard.",
};

export default function Page() {
  return (
    <div className="flex h-screen sm:grid-cols-2">
      <div className="flex w-full flex-col gap-9">
        <Suspense>
          <EditBusForm /> {/* Dibungkus dengan Suspense */}
        </Suspense>
      </div>
    </div>
  );
}
