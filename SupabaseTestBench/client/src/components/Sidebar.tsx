import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Database, Settings, HelpCircle } from "lucide-react";

interface SidebarProps {
  open: boolean;
}

export default function Sidebar({ open }: SidebarProps) {
  const [location] = useLocation();

  const links = [
    {
      href: "/",
      icon: <Database className="w-5 h-5 mr-3" />,
      label: "Database Testing",
    },
    {
      href: "/settings",
      icon: <Settings className="w-5 h-5 mr-3" />,
      label: "Settings",
    },
    {
      href: "/help",
      icon: <HelpCircle className="w-5 h-5 mr-3" />,
      label: "Help",
    },
  ];

  if (!open) {
    return null;
  }

  return (
    <div className="w-64 bg-white shadow-md hidden md:block">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-primary">Supabase Tester</h1>
      </div>
      <nav className="py-4">
        <ul>
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={cn(
                "flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 transition-colors",
                location === link.href && "bg-blue-50 text-primary"
              )}>
                {link.icon}
                <span>{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
