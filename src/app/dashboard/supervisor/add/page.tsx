import { Metadata } from "next";
import AddSupervisorForm from "@/components/Forms/AddSupervisorForm";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Add Supervisor | Next.js Admin Dashboard",
  description: "Add Supervisor details in the Next.js Admin Dashboard.",
};

export default function Page() {
  return (
    <div className="flex h-screen sm:grid-cols-2">
      <div className="w-full flex flex-col gap-9">
        <Suspense>
        <AddSupervisorForm  /> {/* Kirim props ke Client Component */}
        </Suspense>
      </div>
    </div>
  );
}
