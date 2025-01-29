import { User } from '../types/user'

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Dr. John Doe',
    role: 'doctor',
    email: 'john.doe@example.com',
    mcr: 'M12345A'
  },
  {
    id: '2',
    name: 'Dr. Sarah Chen',
    role: 'doctor',
    email: 'sarah.chen@example.com',
    mcr: 'M67890B'
  },
  {
    id: '3',
    name: 'Jane Smith',
    role: 'nurse',
    email: 'jane.smith@example.com'
  },
  {
    id: '4',
    name: 'Mike Johnson',
    role: 'nurse',
    email: 'mike.johnson@example.com'
  }
]

interface Credentials {
  email: string
  password: string
}

export async function authenticate(credentials: Credentials): Promise<User | null> {
  // In a real app, you would hash the password and check against a database
  // For this mock version, we'll accept any password and just check the email
  const user = mockUsers.find(u => u.email === credentials.email)
  return user || null
}
