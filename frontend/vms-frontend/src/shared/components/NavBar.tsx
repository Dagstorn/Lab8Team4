import Container from "./Container";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/shad-ui/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/shared/shad-ui/ui/button";
import { Link } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import { useContext } from "react";
import { AuthContext } from "../contex/auth-context";
let routes = [
  {
    href: "/",
    label: "About Us",
  },
  {
    href: "/",
    label: "Services",
  },
  {
    href: "/",
    label: "Contacts",
  },
  {
    href: "/",
    label: "Staff",
  },
  {
    href: "/auction",
    label: "Auction vehicles",
  },


];
function NavBar() {
  const auth = useContext(AuthContext);
  return (
    <div className="sm:flex sm:justify-between px-3 border-b">
      <Container>
        <div className="relative px-0 sm:px-6 lg:px-3 flex h-14 items-center justify-between w-full">
          <div className="flex">
            <div className="flex items-center mr-12">
              <Sheet>
                <SheetTrigger>
                  <Menu className="h-6 md:hidden w-6" />
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <nav className="flex flex-col gap-4">
                    {routes.map((route, i) => (
                      <Button variant="ghost" key={i}>
                        {route.label}
                      </Button>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
              <h1 className="text-xl font-bold">
                <Link to="/">VMS</Link>
              </h1>
            </div>
            <nav className="lg:flex items-center space-x-4 lg:space-x-6 hidden md:block">
              {routes.map((route, i) => (
                <Link to={route.href} key={i}>
                  <Button variant="ghost" >
                    {route.label}
                  </Button>
                </Link>
              ))}


              {auth.isLoggedIn && auth.role == "driver" && <Link to="/appointments/add">
                <Button variant="ghost" >
                  Make an appointment
                </Button>
              </Link>
              }
              {auth.isLoggedIn && auth.role == "admin" && <Link to="/admin">
                <Button variant="ghost" >
                  Admin dashboard
                </Button>
              </Link>
              }
              {auth.isLoggedIn && auth.role == "maintenance" && <Link to="/maintenance">
                <Button variant="ghost" >
                  Maintenance dashboard
                </Button>
              </Link>
              }
            </nav>
          </div>

          {auth.isLoggedIn ?
            <ProfileButton /> :
            <Link to="login">
              <Button>
                Login
              </Button>
            </Link>
          }
        </div>
      </Container>
    </div>
  );
}

export default NavBar;
