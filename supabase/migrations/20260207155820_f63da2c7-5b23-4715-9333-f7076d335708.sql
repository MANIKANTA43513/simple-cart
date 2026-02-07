-- Users table with token for single-device session
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  token TEXT DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Items table
CREATE TABLE public.items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Carts table (one cart per user)
CREATE TABLE public.carts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Cart items (items in a cart)
CREATE TABLE public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cart_id UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  total DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Order items
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Items are publicly readable
CREATE POLICY "Items are viewable by everyone" ON public.items FOR SELECT USING (true);

-- Users table policies (allow insert for registration, allow API to manage)
CREATE POLICY "Allow user registration" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow reading users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow updating users" ON public.users FOR UPDATE USING (true);

-- Carts policies
CREATE POLICY "Users can view carts" ON public.carts FOR SELECT USING (true);
CREATE POLICY "Users can create carts" ON public.carts FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update carts" ON public.carts FOR UPDATE USING (true);
CREATE POLICY "Users can delete carts" ON public.carts FOR DELETE USING (true);

-- Cart items policies
CREATE POLICY "Users can view cart items" ON public.cart_items FOR SELECT USING (true);
CREATE POLICY "Users can add cart items" ON public.cart_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update cart items" ON public.cart_items FOR UPDATE USING (true);
CREATE POLICY "Users can delete cart items" ON public.cart_items FOR DELETE USING (true);

-- Orders policies
CREATE POLICY "Users can view orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Users can create orders" ON public.orders FOR INSERT WITH CHECK (true);

-- Order items policies
CREATE POLICY "Users can view order items" ON public.order_items FOR SELECT USING (true);
CREATE POLICY "Users can add order items" ON public.order_items FOR INSERT WITH CHECK (true);

-- Insert sample items
INSERT INTO public.items (name, description, price, image_url) VALUES
('Wireless Headphones', 'Premium noise-canceling headphones', 149.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300'),
('Smart Watch', 'Fitness tracking smartwatch', 299.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300'),
('Laptop Stand', 'Ergonomic aluminum laptop stand', 79.99, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300'),
('Mechanical Keyboard', 'RGB mechanical gaming keyboard', 129.99, 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=300'),
('Wireless Mouse', 'Ergonomic wireless mouse', 49.99, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300'),
('USB-C Hub', '7-in-1 USB-C hub with HDMI', 59.99, 'https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=300');