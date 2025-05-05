import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm h-16 flex items-center px-6">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleSidebar} 
        className="md:hidden mr-4 text-gray-600"
      >
        <Menu className="h-5 w-5" />
      </Button>
      <h2 className="text-lg font-medium">Database Integration Test</h2>
      <div className="ml-auto flex items-center space-x-4">
        <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
          <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
          Connected
        </div>
        <div className="relative">
          <Button variant="ghost" className="flex items-center focus:outline-none p-0 h-8 w-8">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-sm">U</span>
            </div>
          </Button>
        </div>
      </div>
    </header>
  );
}
