export interface RolePermission {
  id: number;
  name: string;
}

export interface UserRole {
  id: number;
  name: string;
  permissions: RolePermission[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  roles: UserRole[];
}

export interface UserRawData {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  userRoles: UserRole[];
}
