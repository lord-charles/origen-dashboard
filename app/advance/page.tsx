import AdvanceModule from "@/components/advance/advance";
import { Header } from "@/components/header";
import { advanceService } from "@/services/advance-service";
import { Toaster } from "@/components/ui/sonner";

export default async function Page() {
  try {
    const initialData = await advanceService.getAdvances({});

    return (
      <div>
        <Toaster />
        <Header />
        <AdvanceModule initialData={initialData} />
      </div>
    );
  } catch (error) {
    return (
      <div>
        <Toaster />
        <Header />
        <div className="flex min-h-[400px] flex-col items-center justify-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Unable to load advances
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
  }
}
