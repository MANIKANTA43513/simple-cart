import { supabase } from "@/integrations/supabase/client";
import { getUser } from "./auth";

export interface Item {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
}

export interface CartItem {
  id: string;
  cart_id: string;
  item_id: string;
  quantity: number;
  item?: Item;
}

export interface Order {
  id: string;
  user_id: string;
  total: number;
  created_at: string;
}

export const fetchItems = async (): Promise<Item[]> => {
  const { data, error } = await supabase.from("items").select("*");
  if (error) throw error;
  return data || [];
};

export const getOrCreateCart = async (userId: string): Promise<string> => {
  // Check for existing cart
  const { data: existingCart } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (existingCart) {
    return existingCart.id;
  }

  // Create new cart
  const { data: newCart, error } = await supabase
    .from("carts")
    .insert({ user_id: userId })
    .select("id")
    .single();

  if (error) throw error;
  return newCart.id;
};

export const addToCart = async (itemId: string): Promise<void> => {
  const user = getUser();
  if (!user) throw new Error("Not authenticated");

  const cartId = await getOrCreateCart(user.id);

  // Check if item already in cart
  const { data: existingItem } = await supabase
    .from("cart_items")
    .select("*")
    .eq("cart_id", cartId)
    .eq("item_id", itemId)
    .single();

  if (existingItem) {
    // Update quantity
    await supabase
      .from("cart_items")
      .update({ quantity: existingItem.quantity + 1 })
      .eq("id", existingItem.id);
  } else {
    // Add new item
    await supabase.from("cart_items").insert({
      cart_id: cartId,
      item_id: itemId,
      quantity: 1,
    });
  }
};

export const getCartItems = async (): Promise<CartItem[]> => {
  const user = getUser();
  if (!user) return [];

  const { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!cart) return [];

  const { data: cartItems } = await supabase
    .from("cart_items")
    .select("*, items(*)")
    .eq("cart_id", cart.id);

  return (cartItems || []).map((ci) => ({
    id: ci.id,
    cart_id: ci.cart_id,
    item_id: ci.item_id,
    quantity: ci.quantity,
    item: ci.items as unknown as Item,
  }));
};

export const checkout = async (): Promise<string> => {
  const user = getUser();
  if (!user) throw new Error("Not authenticated");

  const cartItems = await getCartItems();
  if (cartItems.length === 0) throw new Error("Cart is empty");

  // Calculate total
  const total = cartItems.reduce(
    (sum, ci) => sum + (ci.item?.price || 0) * ci.quantity,
    0
  );

  // Create order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({ user_id: user.id, total })
    .select("id")
    .single();

  if (orderError) throw orderError;

  // Add order items
  const orderItems = cartItems.map((ci) => ({
    order_id: order.id,
    item_id: ci.item_id,
    quantity: ci.quantity,
    price: ci.item?.price || 0,
  }));

  await supabase.from("order_items").insert(orderItems);

  // Clear cart
  const { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (cart) {
    await supabase.from("cart_items").delete().eq("cart_id", cart.id);
  }

  return order.id;
};

export const getOrders = async (): Promise<Order[]> => {
  const user = getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return data || [];
};
