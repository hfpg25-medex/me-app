import { ClinicList } from "@/components/clinic-doctor-info/clinic-list";
import { DoctorList } from "@/components/clinic-doctor-info/doctor-list";

export default function Page() {
  return (
    <div className="min-h-svh p-4 max-w-[760px] mx-auto">
      <div className="container  mx-auto">
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
