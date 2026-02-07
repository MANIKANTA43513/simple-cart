import { Button } from "@/components/ui/button";
import { ShoppingCart, ClipboardList, LogOut, Package } from "lucide-react";
import { logout, getUser } from "@/lib/auth";
import { getCartItems, getOrders } from "@/lib/api";
import { toast } from "sonner";

interface NavbarProps {
  onLogout: () => void;
  onCheckout: () => void;
  cartCount: number;
}

export const Navbar = ({ onLogout, onCheckout, cartCount }: NavbarProps) => {
  const user = getUser();

  const handleLogout = async () => {
    await logout();
    onLogout();
  };

  const handleViewCart = async () => {
    try {
      const cartItems = await getCartItems();
      if (cartItems.length === 0) {
        window.alert("Your cart is empty");
        return;
      }
      const cartInfo = cartItems
        .map((ci) => `• ${ci.item?.name} (x${ci.quantity})`)
        .join("\n");
      window.alert(`Cart Items:\n${cartInfo}`);
    } catch (err) {
      toast.error("Failed to load cart");
    }
  };

  const handleViewOrders = async () => {
    try {
      const orders = await getOrders();
      if (orders.length === 0) {
        window.alert("No orders found");
        return;
      }
      const orderInfo = orders
        .map(
          (o) =>
            `Order #${o.id.slice(0, 8)} - $${Number(o.total).toFixed(2)}`
        )
        .join("\n");
      window.alert(`Order History:\n${orderInfo}`);
    } catch (err) {
      toast.error("Failed to load orders");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">ShopCart</h1>
              <p className="text-xs text-muted-foreground">
                Welcome, {user?.username}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewCart}
              className="relative"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center font-semibold">
                  {cartCount}
                </span>
              )}
            </Button>

            <Button variant="outline" size="sm" onClick={handleViewOrders}>
              <ClipboardList className="w-4 h-4 mr-2" />
              Orders
            </Button>

            <Button size="sm" className="btn-accent" onClick={onCheckout}>
              Checkout
            </Button>

            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
