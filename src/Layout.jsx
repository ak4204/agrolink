import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Plus, User, LogOut, Home as HomeIcon, Menu, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = React.useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  const handleLogout = () => {
    base44.auth.logout();
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-stone-800">Agro</span>
                <span className="text-xl font-bold text-emerald-600">Link</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-3">
              <Link to={createPageUrl("Home")}>
                <Button variant="ghost" className="gap-2 text-stone-700 hover:text-emerald-600 hover:bg-emerald-50">
                  <HomeIcon className="w-4 h-4" />
                  Browse Equipment
                </Button>
              </Link>
              
              <Link to={createPageUrl("FarmingHub")}>
                <Button variant="ghost" className="gap-2 text-stone-700 hover:text-emerald-600 hover:bg-emerald-50">
                  <BookOpen className="w-4 h-4" />
                  Farming Hub
                </Button>
              </Link>
              
              {user ? (
                <>
                  <Link to={createPageUrl("AddTool")}>
                    <Button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 gap-2 shadow-md hover:shadow-lg transition-all">
                      <Plus className="w-4 h-4" />
                      List Equipment
                    </Button>
                  </Link>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="rounded-full border-2 border-stone-200 hover:border-emerald-600">
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                          <span className="text-emerald-700 font-semibold text-sm">
                            {user.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                          </span>
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="px-2 py-3 border-b border-stone-100">
                        <p className="font-semibold text-stone-800">{user.full_name}</p>
                        <p className="text-sm text-stone-600">{user.email}</p>
                      </div>
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl("Profile")} className="cursor-pointer flex items-center gap-2 py-2">
                          <User className="w-4 h-4" />
                          My Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={handleLogout}
                        className="cursor-pointer text-red-600 flex items-center gap-2 py-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button 
                  onClick={() => base44.auth.redirectToLogin()}
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                >
                  Sign In
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <DropdownMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to={createPageUrl("Home")} className="cursor-pointer flex items-center gap-2 py-2">
                      <HomeIcon className="w-4 h-4" />
                      Browse Equipment
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={createPageUrl("FarmingHub")} className="cursor-pointer flex items-center gap-2 py-2">
                      <BookOpen className="w-4 h-4" />
                      Farming Hub
                    </Link>
                  </DropdownMenuItem>
                  {user ? (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl("AddTool")} className="cursor-pointer flex items-center gap-2 py-2">
                          <Plus className="w-4 h-4" />
                          List Equipment
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={createPageUrl("Profile")} className="cursor-pointer flex items-center gap-2 py-2">
                          <User className="w-4 h-4" />
                          My Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={handleLogout}
                        className="cursor-pointer text-red-600 flex items-center gap-2 py-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem 
                      onClick={() => base44.auth.redirectToLogin()}
                      className="cursor-pointer"
                    >
                      Sign In
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-4rem)]">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-green-700 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
                <span className="text-xl font-bold">AgroLink</span>
              </div>
              <p className="text-stone-400">
                Connecting farmers nationwide to share equipment and resources efficiently.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2 text-stone-400">
                <li><Link to={createPageUrl("Home")} className="hover:text-emerald-400 transition-colors">Browse Equipment</Link></li>
                <li><Link to={createPageUrl("FarmingHub")} className="hover:text-emerald-400 transition-colors">Farming Hub</Link></li>
                <li><Link to={createPageUrl("AddTool")} className="hover:text-emerald-400 transition-colors">List Equipment</Link></li>
                <li><Link to={createPageUrl("Profile")} className="hover:text-emerald-400 transition-colors">My Profile</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Support</h3>
              <ul className="space-y-2 text-stone-400">
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">Help Center</li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">Safety Guidelines</li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">Contact Us</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-stone-800 pt-8 text-center text-stone-500">
            <p>© 2025 AgroLink - Farm Equipment Rental Marketplace</p>
            <p className="mt-2 text-sm">Empowering farmers through shared resources</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
