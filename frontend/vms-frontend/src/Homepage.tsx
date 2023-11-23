import { Link } from "react-router-dom";
import { Button } from "./shared/shad-ui/ui/button";


function DriversListPage() {
  return <div className="grid grid-cols-5 h-full gap-3">
    <div className="col-span-2  flex-1 p-8 flex flex-col justify-center">
      <h1 className="text-4xl font-bold mb-4">VMS - Vehicle Management System</h1>
      <p className="text-lg mb-6">The Vehicle Management System (VMS) is a comprehensive software solution designed to manage vehicle fleets efficiently. Effortlessly assign tasks, track your vehicles, and empower your organization with seamless vehicle management.</p>
      <Link to="login">
        <Button className="w-full font-bold bg-blue-500 hover:bg-blue-600 transition duration-300">
          Get Started
        </Button>
      </Link>
    </div>
    <div className="col-span-3 flex items-center">
      <img className="w-full h-auto mr-2"
        src={`/static/vehicleIcons/hero.jpg`} alt="" />
    </div>
  </div>;
}

export default DriversListPage;
