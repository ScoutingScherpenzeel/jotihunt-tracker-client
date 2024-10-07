export interface User {
  _id: string;
  email: string;
  name: string;
  admin: boolean;
  password: string;
  requiresPasswordChange: boolean;
}
