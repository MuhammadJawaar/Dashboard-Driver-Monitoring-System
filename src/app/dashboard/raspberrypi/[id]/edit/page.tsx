import { Metadata } from "next";
import { Suspense } from "react";
import EditRaspberryPiForm from "@/components/Forms/EditRaspberryPiForm";

export const metadata: Metadata = {
  title: "Edit Raspberry Pi | DMS Dipyo",
  description: "Edit Raspberry Pi details in the Next.js Admin Dashboard.",
};

export default function Page() {
  return (
    <div className="flex h-screen sm:grid-cols-2">
      <div className="flex w-full flex-col gap-9">
        <Suspense>
          <EditRaspberryPiForm /> {/* Dibungkus dengan Suspense */}
        </Suspense>
      </div>
    </div>
  );
}
