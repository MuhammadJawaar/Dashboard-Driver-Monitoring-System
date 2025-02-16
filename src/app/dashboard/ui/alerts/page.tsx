import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import Alert from "@/components/Alerts/Alerts"; // Import komponen Alert

export const metadata: Metadata = {
  title: "Next.js Alerts | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Alerts page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const Alerts = () => {
  return (
    <div className="p-6">
      <Breadcrumb pageName="Alerts" />

      <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark md:p-6 xl:p-9">
        <div className="flex flex-col gap-7.5">
          {/* Alert - Warning */}
          <Alert
            type="warning"
            title="Attention needed"
            message="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
          />

          {/* Alert - Success */}
          <Alert
            type="success"
            title="Message Sent Successfully"
            message="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
          />

          {/* Alert - Error */}
          <Alert
            type="error"
            title="There were 1 errors with your submission"
            message="Lorem Ipsum is simply dummy text of the printing."
          />
        </div>
      </div>
    </div>
  );
};

export default Alerts;
