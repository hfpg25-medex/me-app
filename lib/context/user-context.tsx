"use client";

import { ReactNode, createContext, useContext } from "react";
import { User, UserPermissions, rolePermissions } from "../types/user";

interface UserContextType {
  user: User | null;
  permissions: UserPermissions;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: User | null;
}) {
  const permissions = initialUser
    ? rolePermissions[initialUser.role]
    : {
        canEditPersonalDetails: false,
        canEditClinicDetails: false,
        canEditMedicalHistory: false,
        canEditClinicalExamination: false,
        canEditTests: false,
        canSubmitReport: false,
        canViewAllReports: false,
      };

  return (
    <UserContext.Provider value={{ user: initialUser, permissions }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
