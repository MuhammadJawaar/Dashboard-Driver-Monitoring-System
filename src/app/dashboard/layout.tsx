import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import { auth } from "../../../auth";
// Sesuaikan path dengan lokasi konfigurasi NextAuth
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    // Ambil session dari server
    const session = await auth();

    return (
        <main className="dark:bg-boxdark-2 dark:text-bodydark">
            <DefaultLayout session={session}>
                {children}
            </DefaultLayout>
        </main>
    );
}
