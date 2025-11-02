import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calculator, TrendingUp, Calendar, Coins, ShoppingCart, PiggyBank } from "lucide-react";
import { toast } from "sonner";

interface BuyItem {
  id: string;
  name: string;
  price: number;
  bought: boolean;
}

interface BudgetPlan {
  totalBudget: number;
  duration: number;
  dailySavings: number;
  hasDailySavings: boolean;
}

const BudgetPlanner = () => {
  const [items, setItems] = useState<BuyItem[]>([]);
  const [budget, setBudget] = useState<BudgetPlan>({
    totalBudget: 0,
    duration: 0,
    dailySavings: 0,
    hasDailySavings: false,
  });
  const [showPlan, setShowPlan] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("buyList");
    if (saved) setItems(JSON.parse(saved));
  }, []);

  const unboughtItems = items
    .filter((item) => !item.bought)
    .sort((a, b) => a.price - b.price);

  const totalRequired = unboughtItems.reduce((sum, item) => sum + item.price, 0);

  const calculatePlan = () => {
    if (budget.totalBudget <= 0 || budget.duration <= 0) {
      toast.error("Please enter valid budget and duration");
      return;
    }

    if (budget.hasDailySavings && budget.dailySavings <= 0) {
      toast.error("Please enter valid daily savings amount");
      return;
    }

    const reserveFund = budget.totalBudget * 0.1;
    const availableBudget = budget.totalBudget - reserveFund;

    if (totalRequired > availableBudget) {
      toast.error("Total items cost exceeds available budget (after 10% reserve)");
      return;
    }

    setShowPlan(true);
    toast.success("Budget plan calculated!");
  };

  const getDailyGoal = () => {
    const reserveFund = budget.totalBudget * 0.1;
    const availableBudget = budget.totalBudget - reserveFund;
    return availableBudget / budget.duration;
  };

  const getPurchaseSchedule = () => {
    if (!budget.hasDailySavings || budget.dailySavings <= 0) return [];

    const schedule: Array<{ item: BuyItem; day: number; accumulated: number }> = [];
    let accumulated = 0;

    unboughtItems.forEach((item) => {
      const daysNeeded = Math.ceil((item.price - accumulated) / budget.dailySavings);
      accumulated += budget.dailySavings * daysNeeded;
      schedule.push({
        item,
        day: daysNeeded,
        accumulated,
      });
    });

    return schedule;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Smart Budget Planner</h2>
        <p className="text-muted-foreground">Plan your purchases with intelligent savings</p>
      </div>

      <Card className="shadow-card bg-gradient-primary text-primary-foreground">
        <CardContent className="py-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm opacity-90">Items to Buy</p>
              <p className="text-3xl font-bold">{unboughtItems.length}</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">Total Required</p>
              <p className="text-3xl font-bold">₹{totalRequired.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Budget Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalBudget">Total Budget (₹)</Label>
              <Input
                id="totalBudget"
                type="number"
                placeholder="e.g., 8000"
                value={budget.totalBudget || ""}
                onChange={(e) =>
                  setBudget({ ...budget, totalBudget: parseFloat(e.target.value) || 0 })
                }
                className="transition-smooth"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Time Duration (days)</Label>
              <Input
                id="duration"
                type="number"
                placeholder="e.g., 30"
                value={budget.duration || ""}
                onChange={(e) =>
                  setBudget({ ...budget, duration: parseInt(e.target.value) || 0 })
                }
                className="transition-smooth"
                min="1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="hasDailySavings"
                checked={budget.hasDailySavings}
                onChange={(e) =>
                  setBudget({ ...budget, hasDailySavings: e.target.checked })
                }
                className="rounded"
              />
              <Label htmlFor="hasDailySavings">I will save a fixed amount daily</Label>
            </div>
            {budget.hasDailySavings && (
              <Input
                type="number"
                placeholder="Daily savings amount (₹)"
                value={budget.dailySavings || ""}
                onChange={(e) =>
                  setBudget({ ...budget, dailySavings: parseFloat(e.target.value) || 0 })
                }
                className="transition-smooth"
                min="0"
              />
            )}
          </div>

          <Button
            onClick={calculatePlan}
            className="w-full bg-gradient-primary hover:opacity-90"
            disabled={unboughtItems.length === 0}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Calculate Smart Plan
          </Button>
        </CardContent>
      </Card>

      {showPlan && budget.totalBudget > 0 && (
        <>
          <Card className="shadow-card border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Coins className="w-5 h-5" />
                Budget Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Daily Goal</p>
                  <p className="text-2xl font-bold text-foreground">
                    ₹{getDailyGoal().toFixed(2)}
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Reserve Fund (10%)</p>
                  <p className="text-2xl font-bold text-foreground">
                    ₹{(budget.totalBudget * 0.1).toFixed(2)}
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Available Budget</p>
                  <p className="text-2xl font-bold text-primary">
                    ₹{(budget.totalBudget * 0.9).toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Recommended Purchase Order
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Items sorted by price (buy cheapest first to maximize purchases)
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {unboughtItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="w-8 h-8 flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <p className="font-medium">{item.name}</p>
                    </div>
                    <p className="font-bold text-primary">₹{item.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {budget.hasDailySavings && budget.dailySavings > 0 && (
            <Card className="shadow-card bg-success/5 border-success/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-success">
                  <Calendar className="w-5 h-5" />
                  Purchase Schedule
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Based on ₹{budget.dailySavings.toFixed(2)}/day savings
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getPurchaseSchedule().map((schedule, index) => (
                    <div
                      key={schedule.item.id}
                      className="p-4 rounded-lg bg-card border border-border"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-semibold">{schedule.item.name}</p>
                        <Badge variant="secondary">Day {schedule.day}</Badge>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Item price: ₹{schedule.item.price.toFixed(2)}</span>
                        <span>Accumulated: ₹{schedule.accumulated.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {unboughtItems.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="py-12 text-center">
            <PiggyBank className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No items in your buy list</p>
            <p className="text-sm text-muted-foreground mt-1">
              Add items to the Buy List tab to create a budget plan
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BudgetPlanner;
