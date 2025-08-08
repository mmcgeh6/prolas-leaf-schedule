import { NavLink, Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItem = (
  to: string,
  label: string
) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      cn(
        "px-3 py-2 rounded-md text-sm font-medium transition-colors",
        isActive ? "bg-accent text-accent-foreground" : "hover:text-primary"
      )
    }
  >
    {label}
  </NavLink>
);

const NavBar = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-14 items-center justify-between">
        <Link to="/" className="font-semibold tracking-tight">
          Prolas Ops Demo
        </Link>
        <div className="flex items-center gap-1">
          {navItem("/planner", "Planner")}
          {navItem("/supervisor", "Supervisor Check-In")}
          {navItem("/reporting", "Reporting")}
          {navItem("/seed", "Seed Data")}
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
