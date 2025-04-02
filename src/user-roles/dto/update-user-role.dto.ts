export class UpdateUserRoleDto {
    UserRoleName: string;
    Active: boolean;
    permissions: {
      id: number;
      IsRead?: boolean;
      IsCreate?: boolean;
      IsUpdate?: boolean;
      IsDelete?: boolean;
      IsExecute?: boolean;
    }[];
  }