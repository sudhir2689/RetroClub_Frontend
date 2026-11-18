import { Outlet, Link } from "react-router-dom";
import { AdminSidebar, AdminSidebarNav } from "../admin/common/sidebar";
import { UserButton } from "@clerk/react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Plus, ShoppingBag } from "lucide-react";
import { BrandLogo } from "../admin/common/BrandLogo";
import { ScrollToTop } from "../common/ScrollToTop";

export function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-foreground">
      <ScrollToTop />
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <AdminSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Header */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-[#D4AF37]/30 bg-black/90 px-4 backdrop-blur-md lg:px-8">
            {/* Mobile Menu Button & Brand */}
            <div className="flex items-center gap-3 lg:hidden">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-xl border border-[#D4AF37]/40 bg-black/50 text-[#D4AF37] hover:bg-[#D4AF37]/10"
                    aria-label="Open Admin Menu"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>

                <SheetContent
                  side="left"
                  className="w-[280px] border-r border-[#D4AF37]/40 bg-black p-0 text-white"
                >
                  <SheetHeader className="border-b border-[#D4AF37]/20 p-5 text-left">
                    <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
                    <BrandLogo className="h-8 w-auto text-white" />
                  </SheetHeader>

                  <div className="py-4">
                    <AdminSidebarNav onNavigate={() => setMobileMenuOpen(false)} />
                  </div>

                  <div className="border-t border-[#D4AF37]/20 p-4">
                    <Link
                      to="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 rounded-xl border border-[#D4AF37]/40 px-3 py-2 text-xs font-semibold text-[#D4AF37] hover:bg-[#D4AF37]/10"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      View Customer Store
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>

              <BrandLogo className="h-8 w-auto text-white" />
            </div>

            {/* Quick Actions in Header */}
            <div className="ml-auto flex items-center gap-3">
              <Button
                asChild
                size="sm"
                className="hidden sm:inline-flex rounded-xl bg-[#D4AF37] text-black font-semibold hover:bg-[#e5c158] transition-colors"
              >
                <Link to="/admin/products?create=true">
                  <Plus className="h-4 w-4 mr-1.5" />
                  Add Product
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="sm"
                className="hidden md:inline-flex rounded-xl border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/10 text-xs"
              >
                <Link to="/">Storefront</Link>
              </Button>

              <div className="flex items-center rounded-xl p-1">
                <UserButton />
              </div>
            </div>
          </header>

          <main className="flex-1 bg-black p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
