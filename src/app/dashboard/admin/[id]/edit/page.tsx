import { Metadata } from "next";
import { Suspense } from "react";
import EditAdminForm from "@/components/Forms/EditAdminForm";

export const metadata: Metadata = {
  title: "Edit Bus | DMS Dipyo",
  description: "Edit bus details in the Next.js Admin Dashboard.",
};

export default function Page() {
  return (
    <div className="flex h-screen sm:grid-cols-2">
      <div className="w-full flex flex-col gap-9">
        <Suspense>
          <EditAdminForm /> {/* Dibungkus dengan Suspense */}
        </Suspense>
      </div>
    </div>
  );
}
