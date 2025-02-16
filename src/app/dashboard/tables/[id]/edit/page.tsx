import { Metadata } from "next";
import EditBusForm from "@/components/Forms/EditBusForm";

export const metadata: Metadata = {
  title: "Edit Bus | Next.js Admin Dashboard",
  description: "Edit bus details in the Next.js Admin Dashboard.",
};

export default function Page({ params }: { params: { id: string } }) {
  return (
    <div className="flex h-screen sm:grid-cols-2">
      <div className="w-full flex flex-col gap-9">

          <EditBusForm busId={params.id} />

      </div>
    </div>
  );
}
