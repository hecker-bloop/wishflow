import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink, Calendar, Edit2, Clock } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface WishItem {
  id: string;
  name: string;
  description: string;
  targetDate: string;
  link: string;
  createdAt: string;
}

const RecentWishlist = () => {
  const [items, setItems] = useState<WishItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<WishItem>>({});

  useEffect(() => {
    const saved = localStorage.getItem("futureWishlist");
    if (saved) {
      const allItems = JSON.parse(saved);
      const sorted = [...allItems].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setItems(sorted);
    }
  }, []);

  const handleDelete = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    localStorage.setItem("futureWishlist", JSON.stringify(updated));
    toast.success("Item removed");
  };

  const startEdit = (item: WishItem) => {
    setEditingId(item.id);
    setEditForm(item);
  };

  const saveEdit = () => {
    if (!editForm.name?.trim()) {
      toast.error("Item name is required");
      return;
    }

    const updated = items.map((item) =>
      item.id === editingId ? { ...item, ...editForm } : item
    );
    setItems(updated);
    localStorage.setItem("futureWishlist", JSON.stringify(updated));
    setEditingId(null);
    toast.success("Item updated");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Recent Wishlist</h2>
        <p className="text-muted-foreground">Recently added items, newest first</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Card
            key={item.id}
            className="shadow-card hover:shadow-card-hover transition-smooth group"
          >
            <CardHeader className="space-y-2">
              <div className="flex justify-between items-start gap-2">
                {editingId === item.id ? (
                  <Input
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="text-lg font-semibold"
                  />
                ) : (
                  <CardTitle className="text-lg font-semibold">{item.name}</CardTitle>
                )}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-smooth">
                  {editingId === item.id ? (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={saveEdit}
                        className="hover:text-success"
                      >
                        ✓
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingId(null)}
                        className="hover:text-destructive"
                      >
                        ✕
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEdit(item)}
                        className="hover:text-primary"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item.id)}
                        className="hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {editingId === item.id ? (
                <>
                  <Textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    placeholder="Description"
                    className="text-sm"
                  />
                  <Input
                    type="date"
                    value={editForm.targetDate}
                    onChange={(e) => setEditForm({ ...editForm, targetDate: e.target.value })}
                    className="text-sm"
                  />
                  <Input
                    type="url"
                    value={editForm.link}
                    onChange={(e) => setEditForm({ ...editForm, link: e.target.value })}
                    placeholder="Link"
                    className="text-sm"
                  />
                </>
              ) : (
                <>
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
                  <p className="text-xs text-muted-foreground">
                    Added: {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {items.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="py-12 text-center">
            <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No recent items</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RecentWishlist;
