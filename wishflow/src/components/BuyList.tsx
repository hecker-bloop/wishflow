import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, RefreshCw, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

interface BuyItem {
  id: string;
  name: string;
  price: number;
  bought: boolean;
}

const BuyList = () => {
  const [items, setItems] = useState<BuyItem[]>([]);
  const [newItem, setNewItem] = useState({ name: "", price: "" });

  useEffect(() => {
    const saved = localStorage.getItem("buyList");
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("buyList", JSON.stringify(items));
  }, [items]);

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
  const remainingPrice = items
    .filter((item) => !item.bought)
    .reduce((sum, item) => sum + item.price, 0);

  const handleAdd = () => {
    if (!newItem.name.trim()) {
      toast.error("Please enter item name");
      return;
    }
    if (!newItem.price || parseFloat(newItem.price) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    const item: BuyItem = {
      id: Date.now().toString(),
      name: newItem.name,
      price: parseFloat(newItem.price),
      bought: false,
    };

    setItems([...items, item]);
    setNewItem({ name: "", price: "" });
    toast.success("Item added to buy list!");
  };

  const toggleBought = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, bought: !item.bought } : item
      )
    );
  };

  const handleDelete = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
    toast.success("Item removed");
  };

  const resetAll = () => {
    setItems(items.map((item) => ({ ...item, bought: false })));
    toast.success("All items reset");
  };

  const clearBought = () => {
    setItems(items.filter((item) => !item.bought));
    toast.success("Bought items cleared");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Buy List</h2>
          <p className="text-muted-foreground">Track what you need to buy</p>
        </div>
      </div>

      <Card className="shadow-card bg-gradient-primary text-primary-foreground">
        <CardContent className="py-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-90">Total Price</p>
              <p className="text-3xl font-bold">₹{totalPrice.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">Remaining</p>
              <p className="text-3xl font-bold">₹{remainingPrice.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Add New Item</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Item name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="flex-1 transition-smooth"
            />
            <Input
              type="number"
              placeholder="Price"
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
              className="w-32 transition-smooth"
              min="0"
              step="0.01"
            />
            <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button onClick={resetAll} variant="outline" className="flex-1">
          <RefreshCw className="w-4 h-4 mr-2" />
          Reset All
        </Button>
        <Button onClick={clearBought} variant="outline" className="flex-1">
          <Trash2 className="w-4 h-4 mr-2" />
          Clear Bought
        </Button>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <Card
            key={item.id}
            className="shadow-card hover:shadow-card-hover transition-smooth group"
          >
            <CardContent className="py-4">
              <div className="flex items-center gap-4">
                <Checkbox
                  checked={item.bought}
                  onCheckedChange={() => toggleBought(item.id)}
                  className="data-[state=checked]:bg-success data-[state=checked]:border-success"
                />
                <div className="flex-1">
                  <p
                    className={`font-medium transition-smooth ${
                      item.bought ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {item.name}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p
                    className={`font-bold transition-smooth ${
                      item.bought ? "line-through text-muted-foreground" : "text-primary"
                    }`}
                  >
                    ₹{item.price.toFixed(2)}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item.id)}
                    className="opacity-0 group-hover:opacity-100 transition-smooth hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {items.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="py-12 text-center">
            <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">Your buy list is empty</p>
            <p className="text-sm text-muted-foreground mt-1">Add items to get started!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BuyList;
