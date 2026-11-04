export type AuthUser = {
  id: number;
  name: string;
  email: string;
};

export type AuthPayload = {
  user: AuthUser;
  permissions: string[];
  roles: string[];
};