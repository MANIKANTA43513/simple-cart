import { useState, useEffect, useCallback } from "react";
import { Login } from "@/components/Login";
import { Navbar } from "@/components/Navbar";
import { ItemList } from "@/components/ItemList";
import { isAuthenticated } from "@/lib/auth";
import { checkout, getCartItems } from "@/lib/api";
import { toast } from "sonner";

const Index = () => {
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = useCallback(async () => {
    if (!loggedIn) return;
    try {
      const items = await getCartItems();
      const count = items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    } catch {
      // Ignore errors
    }
  }, [loggedIn]);

  useEffect(() => {
    updateCartCount();
  }, [updateCartCount]);

  const handleCheckout = async () => {
    try {
      const orderId = await checkout();
      toast.success("Order successful!");
      setCartCount(0);
      window.alert(`Order placed successfully!\nOrder ID: ${orderId.slice(0, 8)}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Checkout failed";
      toast.error(message);
    }
  };

  if (!loggedIn) {
    return <Login onSuccess={() => setLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        onLogout={() => setLoggedIn(false)}
        onCheckout={handleCheckout}
        cartCount={cartCount}
      />
      <ItemList onCartUpdate={updateCartCount} />
    </div>
  );
};

export default Index;
