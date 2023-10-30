import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/shad-ui/ui/dropdown-menu";

import { User } from "lucide-react";
import { Badge } from "@/shared/shad-ui/ui/badge";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
const ProfileButton = () => {

  const auth = useAuth();

  const navigate = useNavigate();
  const getPersonalPageLink = (role: string) => {
    if (role === 'driver') {
      return <Link to="/driver/personal_page/">Personal page</Link>
    } else if (role === 'fueling') {
      return < Link to="/fueling/" > Personal page</Link >
    } else if (role === 'maintenance') {
      return < Link to="/maintenance/" > Personal page</Link >
    } else if (role === 'admin') {
      return < Link to="/admin/" > Admin page</Link >
    }
    return "";
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <span className="flex items-center bg-slate-50 px-4 py-1 rounded ">
          <User size="16" /> {auth.username}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="flex items-center">
          <span className="mr-2">Role</span> <Badge variant="secondary">{auth.role}</Badge>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          {getPersonalPageLink(auth.role)}
        </DropdownMenuItem>


        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            auth.logout();
            navigate("/");
          }}
        >Log Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileButton;
