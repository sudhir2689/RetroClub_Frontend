import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCustomerCartAndCheckoutStore } from "@/features/customer/cart-and-checkout/store";
import { useCustomerOrdersStore } from "@/features/customer/orders/store";
import { useCustomerProfileStore } from "@/features/customer/profile/store";
import { useCustomerWishlistStore } from "@/features/customer/wishlist/store";
import { useAuth } from "@clerk/react";
import {
  Heart,
  LogIn,
  LogOut,
  Menu,
  ShoppingBag,
  ShoppingBasket,
  ShoppingCart,
  User,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { BrandLogo } from "@/components/admin/common/BrandLogo";

type CustomerMobileNavbarProps = {
  isSignedIn: boolean;
};

export type NavItem = {
  label: string;
  href?: string;
  onClick?: () => void;
  icon: LucideIcon;
};

const iconLink =
  "relative inline-flex h-10 w-10 items-center justify-center rounded-xl text-white/90 transition hover:bg-white/10 hover:text-white cursor-pointer";

const mobileWrap = "ml-auto flex items-center gap-2 lg:hidden";

const menuButton =
  "h-10 w-10 rounded-xl border border-white/15 bg-white/5 text-white hover:bg-white/10";

// Sheet border stays monochrome without golden border to maintain "except the navbar"
const sheetContent =
  "w-[340px] max-w-[88vw] border-r border-white/15 bg-black text-white p-0 sm:w-[400px]";

const brandWrap = "flex items-center gap-3";

const brandBlock = "px-6 py-5";

const drawerSection = "space-y-3 px-6 py-5";

const drawerTitle = "text-xs font-semibold uppercase tracking-wider text-muted-foreground";

const drawerItemsWrap = "space-y-1";

const drawerItemLink =
  "flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-left text-base font-medium text-white transition hover:bg-white/10";

const cartBadge =
  "absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-amber-400 px-1.5 text-[11px] font-semibold leading-5 text-black";

function DrawerSection({
  title,
  items,
  onNavigate,
}: {
  title: string;
  items: NavItem[];
  onNavigate: () => void;
}) {
  return (
    <section className={drawerSection}>
      <p className={drawerTitle}>{title}</p>
      <div className={drawerItemsWrap}>
        {items.map((item) => {
          const Icon = item.icon;

          if (item.onClick) {
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  onNavigate();
                  item.onClick?.();
                }}
                className={drawerItemLink}
              >
                <Icon className="h-4.5 w-4.5" />
                <span>{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              to={item.href || "/"}
              onClick={onNavigate}
              className={drawerItemLink}
            >
              <Icon className="h-4.5 w-4.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function CustomerMobileNavbar({
  isSignedIn,
}: CustomerMobileNavbarProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { signOut } = useAuth();

  const { cart } = useCustomerCartAndCheckoutStore(
    (state) => state,
  );
  const { openProfile } = useCustomerProfileStore((state) => state);
  const { setOpen: setWishlistOpen } = useCustomerWishlistStore(
    (state) => state,
  );
  const { openOrders } = useCustomerOrdersStore((state) => state);

  const collectionsPage: NavItem = {
    label: "Collections",
    href: "/collections",
    icon: ShoppingBag,
  };

  const cartPage: NavItem = {
    label: `My Cart (${cart?.items?.length ?? 0})`,
    href: "/cart",
    icon: ShoppingCart,
  };

  const mobileAccountItems: NavItem[] = isSignedIn
    ? [
        {
          label: "My Account",
          onClick: () => void openProfile(),
          icon: User,
        },
        {
          label: "My Orders",
          onClick: () => void openOrders(),
          icon: ShoppingBasket,
        },
        {
          label: "Wishlist",
          onClick: () => setWishlistOpen(true),
          icon: Heart,
        },
        {
          label: "Logout",
          onClick: () => void signOut(),
          icon: LogOut,
        },
      ]
    : [
        {
          label: "Login",
          href: "/sign-in",
          icon: LogIn,
        },
      ];

  return (
    <div className={mobileWrap}>
      <Link
        to="/cart"
        className={iconLink}
        aria-label="View Cart"
      >
        <ShoppingCart className="h-5 w-5" />
        <span className={cartBadge}>{cart?.items?.length ?? 0}</span>
      </Link>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button variant={"ghost"} size={"icon"} className={menuButton} aria-label="Open Menu">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className={sheetContent}>
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
          </SheetHeader>
          <div className={brandBlock}>
            <Link
              to={"/"}
              onClick={() => setSheetOpen(false)}
              className={brandWrap}
            >
              <BrandLogo className="h-9 w-auto text-white" />
            </Link>
          </div>
          <Separator className="bg-white/10" />
          <DrawerSection
            title="Browse"
            items={[collectionsPage, cartPage]}
            onNavigate={() => setSheetOpen(false)}
          />

          <Separator className="bg-white/10" />
          <DrawerSection
            title="Account & Orders"
            items={mobileAccountItems}
            onNavigate={() => setSheetOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default CustomerMobileNavbar;
