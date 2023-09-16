import Container from "./Container";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/shad-ui/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/shared/shad-ui/ui/button";
import { Link } from "react-router-dom";
import ProfileButton from "./ProfileButton";

let routes = [
  {
    href: "/",
    label: "About Us",
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
    href: "/",
    label: "Vehicles",
  },
  {
    href: "/appointments/add",
    label: "Make an appointment",
  },
];
function NavBar() {
  return (
    <div className="sm:flex sm:justify-between px-3 border-b">
      <Container>
        <div className="relative px-0 sm:px-6 lg:px-3 flex h-14 items-center justify-between w-full">
          <div className="flex items-center">
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
          <nav className="mx-6 flex items-center space-x-4 lg:space-x-6 hidden md:block">
            {routes.map((route, i) => (
              <Link to={route.href} key={i}>
                <Button variant="ghost" >
                  {route.label}
                </Button>
              </Link>
            ))}
          </nav>
          <ProfileButton></ProfileButton>
        </div>
      </Container>
    </div>
  );
}

export default NavBar;
