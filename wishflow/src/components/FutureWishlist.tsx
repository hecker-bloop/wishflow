import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, ExternalLink, Calendar, Heart } from "lucide-react";
import { toast } from "sonner";

interface WishItem {
  id: string;
  name: string;
  description: string;
  targetDate: string;
  link: string;
  createdAt: string;
}

const FutureWishlist = () => {
  const [items, setItems] = useState<WishItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState<Partial<WishItem>>({
    name: "",
    description: "",
    targetDate: "",
    link: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("futureWishlist");
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("futureWishlist", JSON.stringify(items));
  }, [items]);

  const handleAdd = () => {
    if (!newItem.name?.trim()) {
      toast.error("Please enter an item name");
      return;
    }

    const item: WishItem = {
      id: Date.now().toString(),
      name: newItem.name,
      description: newItem.description || "",
      targetDate: newItem.targetDate || "",
      link: newItem.link || "",
      createdAt: new Date().toISOString(),
    };

    setItems([...items, item]);
    setNewItem({ name: "", description: "", targetDate: "", link: "" });
    setIsAdding(false);
    toast.success("Item added to wishlist!");
  };

  const handleDelete = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
    toast.success("Item removed");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Future Wishlist</h2>
          <p className="text-muted-foreground">Items you wish to have in the future</p>
        </div>
        <Button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-gradient-primary hover:opacity-90 transition-smooth"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      {isAdding && (
        <Card className="shadow-card animate-in fade-in slide-in-from-top-2 duration-300">
          <CardHeader>
            <CardTitle className="text-lg">Add New Wish</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="e.g., New Laptop"
                className="transition-smooth"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="Optional details about this item"
                className="transition-smooth"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetDate">Target Date</Label>
              <Input
                id="targetDate"
                type="date"
                value={newItem.targetDate}
                onChange={(e) => setNewItem({ ...newItem, targetDate: e.target.value })}
                className="transition-smooth"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link">Link</Label>
              <Input
                id="link"
                type="url"
                value={newItem.link}
                onChange={(e) => setNewItem({ ...newItem, link: e.target.value })}
                placeholder="https://..."
                className="transition-smooth"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAdd} className="flex-1 bg-primary hover:bg-primary/90">
                Add to Wishlist
              </Button>
              <Button onClick={() => setIsAdding(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card
            key={item.id}
            className="shadow-card hover:shadow-card-hover transition-smooth group"
          >
            <CardHeader className="space-y-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-semibold">{item.name}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(item.id)}
                  className="opacity-0 group-hover:opacity-100 transition-smooth hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {item.description && (
                <p className="text-sm text-muted-foreground">{item.description}</p>
              )}
              {item.targetDate && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(item.targetDate).toLocaleDateString()}</span>
                </div>
              )}
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Link
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {items.length === 0 && !isAdding && (
        <Card className="shadow-card">
          <CardContent className="py-12 text-center">
            <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No items in your wishlist yet</p>
            <p className="text-sm text-muted-foreground mt-1">Click "Add Item" to get started!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FutureWishlist;
