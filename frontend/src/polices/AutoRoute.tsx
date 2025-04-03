import React from "react";
import { userService } from "./userService";
import NoPermission from "../components/noPermission";
import Login from "../components/login";

interface Props {
  component: React.ComponentType;
  path?: string;
  roles?: Array<any>;
}

export const AutoRout: React.FC<Props> = ({
  component: RouteComponent,
  roles,
}) => {
  const role = userService.currentRole;
  const user = userService.token;

  if (user != null) {
    if (role) {
      return <RouteComponent />;
    } else {
      return <NoPermission />;
    }
  } else {
    return <Login />;
  }
};
