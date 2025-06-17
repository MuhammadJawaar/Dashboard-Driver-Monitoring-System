import Dashboard from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | DMS Dipyo",
  description: "This Home of DMS Dipyo, a Driving Monitoring System",
};

export default function Home() {
  return (
    <div className="min-h-screen">
      <Dashboard />
    </div>
  );
}
