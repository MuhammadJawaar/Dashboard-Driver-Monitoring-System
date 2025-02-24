import { Metadata } from "next";
import AddBusForm from "@/components/Forms/AddBusForm";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Add Bus | Next.js Admin Dashboard",
  description: "Add bus details in the Next.js Admin Dashboard.",
};

export default function Page() {
  return (
    <div className="flex h-screen sm:grid-cols-2">
      <div className="w-full flex flex-col gap-9">
        <Suspense>
        <AddBusForm  /> {/* Kirim props ke Client Component */}
        </Suspense>
      </div>
    </div>
  );
}
