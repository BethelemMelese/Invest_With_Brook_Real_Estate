function getCurrentUser(): any {
  const result = localStorage.getItem("user");
  const data = result ? JSON.parse(result) : null;
  return data;
}
function accountRoles(): any {
  const data = JSON.parse(localStorage.getItem("user.userRoles") || "");

  return data;
}

function currentUserPermission(type: string): boolean {
  const data: any = JSON.parse(localStorage.getItem("user") || "");
  if (data !== undefined) {
    return data.userPermissions.some((a: any) => {
      return a.userPermissionCategoryLists.some((up: any) => {
        return up.permission.some((p: any) => p.permissionName === type);
      });
    });
  } else {
    return false;
  }
}

function currentRole(type: string): boolean {
  const data: any = JSON.parse(localStorage.getItem("user") || "");
  if (data !== undefined) {
    return data.userPermissions.some((a: any) => {
      return a.roles.some((p: any) => p.name === type);
    });
  }
  return false;
}

export const userStorageService = {
  getCurrentUser,
  accountRoles,
  currentRole,
  currentUserPermission,
};
