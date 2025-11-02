import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Clock, StickyNote, ShoppingCart, PiggyBank, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  onLogout: () => void;
}

const Navigation = ({ activeTab, onTabChange, onLogout }: NavigationProps) => {
  return (
    <nav className="sticky top-0 z-50 bg-gradient-subtle backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            WishFlow
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-muted-foreground hover:text-foreground transition-smooth"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="w-full grid grid-cols-5 h-auto p-1 bg-card shadow-card">
            <TabsTrigger 
              value="future" 
              className="flex flex-col md:flex-row items-center gap-1 md:gap-2 py-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground transition-smooth"
            >
              <Heart className="w-4 h-4" />
              <span className="text-xs md:text-sm">Future</span>
            </TabsTrigger>
            <TabsTrigger 
              value="recent" 
              className="flex flex-col md:flex-row items-center gap-1 md:gap-2 py-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground transition-smooth"
            >
              <Clock className="w-4 h-4" />
              <span className="text-xs md:text-sm">Recent</span>
            </TabsTrigger>
            <TabsTrigger 
              value="notes" 
              className="flex flex-col md:flex-row items-center gap-1 md:gap-2 py-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground transition-smooth"
            >
              <StickyNote className="w-4 h-4" />
              <span className="text-xs md:text-sm">Notes</span>
            </TabsTrigger>
            <TabsTrigger 
              value="buylist" 
              className="flex flex-col md:flex-row items-center gap-1 md:gap-2 py-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground transition-smooth"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="text-xs md:text-sm">Buy List</span>
            </TabsTrigger>
            <TabsTrigger 
              value="budget" 
              className="flex flex-col md:flex-row items-center gap-1 md:gap-2 py-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground transition-smooth"
            >
              <PiggyBank className="w-4 h-4" />
              <span className="text-xs md:text-sm">Budget</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </nav>
  );
};

export default Navigation;
