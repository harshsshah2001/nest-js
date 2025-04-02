export class CreateUserRoleDto {
    UserRoleName: string;
    permissions: {
      id: number;
      IsRead?: boolean;
      IsCreate?: boolean;
      IsUpdate?: boolean;
      IsDelete?: boolean;
      IsExecute?: boolean;
    }[];
  }