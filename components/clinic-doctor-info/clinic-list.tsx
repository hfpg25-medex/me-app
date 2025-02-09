"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getClinicList, updateClinic } from "@/lib/actions/clinic";
import { clinicSchema } from "@/lib/validations/clinicDoctorSchemas";
import { Building2, Loader2 } from "lucide-react";
import * as React from "react";
import { z } from "zod";

interface Clinic {
  id: string;
  name: string;
  hci: string;
  contactNumber: string;
  address: string;
}

interface ValidationErrors {
  [key: string]: string[];
}

export function ClinicList() {
  const [clinics, setClinics] = React.useState<Clinic[]>([]);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [validationErrors, setValidationErrors] = React.useState<
    Record<string, ValidationErrors>
  >({});
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadClinics = async () => {
      setIsLoading("loading");
      try {
        const result = await getClinicList();
        if (result.success && result.data) {
          setClinics(result.data);
        } else {
          setClinics([]);
          toast({
            variant: "destructive",
            title: "Error",
            description: result.error || "Failed to load clinics",
          });
        }
      } catch (error) {
        console.log(error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load clinics",
        });
      } finally {
        setIsLoading(null);
      }
    };
    loadClinics();
  }, [toast]);

  // const addClinic = () => {
  //   const newClinic: Clinic = {
  //     id: Math.random().toString(36).substr(2, 9),
  //     name: "",
  //     hci: "",
  //     contactNumber: "",
  //     address: "",
  //   };
  //   setClinics([...clinics, newClinic]);
  //   setEditingId(newClinic.id);
  //   setValidationErrors({ ...validationErrors, [newClinic.id]: {} });
  // };

  // const validateClinic = (clinic: Clinic) => {
  //   try {
  //     clinicSchema.parse(clinic)
  //     setValidationErrors({
  //       ...validationErrors,
  //       [clinic.id]: {}
  //     })
  //     return true
  //   } catch (error) {
  //     if (error instanceof z.ZodError) {
  //       const errors: ValidationErrors = {}
  //       error.errors.forEach((err) => {
  //         const path = err.path[0] as string
  //         if (!errors[path]) {
  //           errors[path] = []
  //         }
  //         errors[path].push(err.message)
  //       })
  //       setValidationErrors({
  //         ...validationErrors,
  //         [clinic.id]: errors
  //       })
  //     }
  //     return false
  //   }
  // }

  const handleSubmit = async (clinic: Clinic) => {
    try {
      // Clear previous validation errors for this clinic
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[clinic.id];
        return newErrors;
      });

      // Validate before sending to server
      try {
        clinicSchema.parse({
          name: clinic.name,
          hci: clinic.hci,
          contactNumber: clinic.contactNumber,
          address: clinic.address,
        });
      } catch (e) {
        if (e instanceof z.ZodError) {
          const errors = e.errors.reduce(
            (acc: { [key: string]: string[] }, curr) => {
              const field = curr.path[0] as string;
              if (!acc[field]) acc[field] = [];
              acc[field].push(curr.message);
              return acc;
            },
            {}
          );
          setValidationErrors((prev) => ({
            ...prev,
            [clinic.id]: errors,
          }));
          toast({
            variant: "destructive",
            title: "Validation Error",
            description: "Please check the form for errors",
          });
          return;
        }
      }

      setIsLoading(clinic.id);
      const result = await updateClinic(clinic.id, {
        name: clinic.name,
        hci: clinic.hci,
        contactNumber: clinic.contactNumber,
        address: clinic.address,
      });

      if (result.success) {
        setEditingId(null);
        toast({
          title: "Success",
          description: "Clinic information updated successfully.",
        });
        setClinics((prevClinics) =>
          prevClinics.map((c) =>
            c.id === clinic.id ? { ...c, ...result.data } : c
          )
        );
      } else {
        // Handle server-side validation errors
        if (result.validationErrors) {
          setValidationErrors((prev) => ({
            ...prev,
            [clinic.id]: result.validationErrors as unknown as ValidationErrors,
          }));
        }
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      }
    } catch (error) {
      console.error("Error updating clinic:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(null);
    }
  };

  const getFieldError = (clinicId: string, field: string) => {
    if (!validationErrors[clinicId]) return null;
    const errors = validationErrors[clinicId][field];
    return errors ? errors[0] : null;
  };

  return (
    <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          clinics.forEach((clinic) => handleSubmit(clinic));
        }}
        className="space-y-4 w-full"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Clinic Information</h2>
          </div>
          {/* <Button
            onClick={addClinic}
            variant="outline"
            size="sm"
            disabled={isLoading === "loading"}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Clinic
          </Button> */}
        </div>

        {isLoading === "loading" ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : clinics.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No clinics added yet. Click the button above to add a clinic.
          </p>
        ) : null}

        {clinics.map((clinic) => (
          <Card key={clinic.id} className="relative">
            <CardContent className="pt-6">
              <div className="absolute top-4 right-4 flex items-center space-x-2">
                {editingId === clinic.id ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleSubmit(clinic)}
                    disabled={isLoading === clinic.id}
                  >
                    {isLoading === clinic.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Save"
                    )}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingId(clinic.id)}
                    className="text-blue-600"
                  >
                    {/* <Pencil className="h-4 w-4" /> */}
                    Edit
                  </Button>
                )}
                {/* <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setClinics(clinics.filter((c) => c.id !== clinic.id));
                    const newValidationErrors = { ...validationErrors };
                    delete newValidationErrors[clinic.id];
                    setValidationErrors(newValidationErrors);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button> */}
              </div>

              <div className="grid gap-4 mt-4">
                <div className="grid gap-2">
                  <Label htmlFor={`name-${clinic.id}`}>Clinic Name</Label>
                  <Input
                    id={`name-${clinic.id}`}
                    maxLength={100}
                    value={clinic.name}
                    onChange={(e) =>
                      setClinics(
                        clinics.map((c) =>
                          c.id === clinic.id
                            ? { ...c, name: e.target.value }
                            : c
                        )
                      )
                    }
                    disabled={editingId !== clinic.id}
                  />
                  {getFieldError(clinic.id, "name") && (
                    <p className="text-sm text-red-500">
                      {getFieldError(clinic.id, "name")}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor={`hci-${clinic.id}`}>HCI Code</Label>
                  <Input
                    id={`hci-${clinic.id}`}
                    maxLength={7}
                    value={clinic.hci}
                    onChange={(e) =>
                      setClinics(
                        clinics.map((c) =>
                          c.id === clinic.id ? { ...c, hci: e.target.value } : c
                        )
                      )
                    }
                    disabled={editingId !== clinic.id}
                  />
                  {getFieldError(clinic.id, "hci") && (
                    <p className="text-sm text-red-500">
                      {getFieldError(clinic.id, "hci")}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor={`contactNumber-${clinic.id}`}>
                    Contact Number
                  </Label>
                  <Input
                    id={`contactNumber-${clinic.id}`}
                    maxLength={8}
                    value={clinic.contactNumber}
                    onChange={(e) =>
                      setClinics(
                        clinics.map((c) =>
                          c.id === clinic.id
                            ? { ...c, contactNumber: e.target.value }
                            : c
                        )
                      )
                    }
                    disabled={editingId !== clinic.id}
                  />
                  {getFieldError(clinic.id, "contactNumber") && (
                    <p className="text-sm text-red-500">
                      {getFieldError(clinic.id, "contactNumber")}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor={`address-${clinic.id}`}>Address</Label>
                  <Input
                    id={`address-${clinic.id}`}
                    maxLength={100}
                    value={clinic.address}
                    onChange={(e) =>
                      setClinics(
                        clinics.map((c) =>
                          c.id === clinic.id
                            ? { ...c, address: e.target.value }
                            : c
                        )
                      )
                    }
                    disabled={editingId !== clinic.id}
                  />
                  {getFieldError(clinic.id, "address") && (
                    <p className="text-sm text-red-500">
                      {getFieldError(clinic.id, "address")}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {/* <Button type="submit">Save Clinics</Button> */}

        {/* <Button type="button" onClick={addClinic} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Clinic
        </Button> */}
      </form>
    </div>
  );
}
