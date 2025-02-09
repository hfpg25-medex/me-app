import { ClinicList } from "@/components/clinic-doctor-info/clinic-list";
import { DoctorList } from "@/components/clinic-doctor-info/doctor-list";

export default function Page() {
  return (
    <div className="container mx-auto px-3 w-full pt-8 pb-16">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-yellow-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.485 2.495c.873-1.512 3.157-1.512 4.03 0l8.166 14.15c.873 1.512-.218 3.405-2.015 3.405H2.334c-1.797 0-2.888-1.893-2.015-3.405l8.166-14.15zm1.015 3.505a1 1 0 00-1 1v5a1 1 0 002 0V7a1 1 0 00-1-1zm0 10a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              This page is currently under construction. Some features may be
              incomplete or not fully functional.
            </p>
          </div>
        </div>
      </div>
      <div className="my-6 space-y-8">
        <div className="mb-1">
          <h1 className="text-2xl font-bold tracking-tight">Manage Details</h1>
          <p className="text-muted-foreground mt-2">
            Update your clinic and doctor information
          </p>
        </div>

        <div className="space-y-8">
          <ClinicList />
          <DoctorList />
        </div>
      </div>
    </div>
  );
}
