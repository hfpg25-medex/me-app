import { User } from "../types/user";

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Dr. John Doe",
    role: "doctor",
    uen: "201234567A",
    corpPassId: "DOCTOR001",
    mcr: "M12345A",
  },
  {
    id: "2",
    name: "Dr. Sarah Chen",
    role: "doctor",
    uen: "201234567B",
    corpPassId: "DOCTOR002",
    mcr: "M67890B",
  },
  {
    id: "3",
    name: "Jane Smith",
    role: "nurse",
    uen: "201234567C",
    corpPassId: "NURSE001",
  },
  {
    id: "4",
    name: "Mike Johnson",
    role: "nurse",
    uen: "201234567D",
    corpPassId: "NURSE002",
  },
];

interface Credentials {
  uen: string;
  corpPassId: string;
}

export async function authenticate(
  credentials: Credentials
): Promise<User | null> {
  // Find user by UEN and CorpPass ID
  const user = mockUsers.find(
    (u) => u.uen === credentials.uen && u.corpPassId === credentials.corpPassId
  );
  return user || null;
}
