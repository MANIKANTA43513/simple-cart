import { useEffect, useState } from "react";
import { fetchItems, addToCart, Item } from "@/lib/api";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";

interface ItemListProps {
  onCartUpdate: () => void;
}

export const ItemList = ({ onCartUpdate }: ItemListProps) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data = await fetchItems();
      setItems(data);
    } catch (err) {
      toast.error("Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (item: Item) => {
    setAddingId(item.id);
    try {
      await addToCart(item.id);
      toast.success(`${item.name} added to cart!`);
      onCartUpdate();
    } catch (err) {
      toast.error("Failed to add to cart");
    } finally {
      setAddingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground">Shop Items</h2>
        <p className="text-muted-foreground">Click on an item to add it to your cart</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="card-product group"
            onClick={() => handleAddToCart(item)}
          >
            <div className="aspect-square bg-muted relative overflow-hidden">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No Image
                </div>
              )}
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors flex items-center justify-center">
                {addingId === item.id ? (
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                ) : (
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus className="w-6 h-6 text-accent-foreground" />
                  </div>
                )}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-foreground">{item.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {item.description}
              </p>
              <p className="text-lg font-bold text-accent mt-2">
                ${Number(item.price).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
