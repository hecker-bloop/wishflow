import { useState, useEffect } from "react";
import Login from "@/components/Login";
import Navigation from "@/components/Navigation";
import FutureWishlist from "@/components/FutureWishlist";
import RecentWishlist from "@/components/RecentWishlist";
import Notes from "@/components/Notes";
import BuyList from "@/components/BuyList";
import BudgetPlanner from "@/components/BudgetPlanner";
import { Tabs, TabsContent } from "@/components/ui/tabs";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("future");

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout} />
        
        <main className="container mx-auto px-4 py-8">
          <TabsContent value="future" className="mt-0">
            <FutureWishlist />
          </TabsContent>
          
          <TabsContent value="recent" className="mt-0">
            <RecentWishlist />
          </TabsContent>
          
          <TabsContent value="notes" className="mt-0">
            <Notes />
          </TabsContent>
          
          <TabsContent value="buylist" className="mt-0">
            <BuyList />
          </TabsContent>
          
          <TabsContent value="budget" className="mt-0">
            <BudgetPlanner />
          </TabsContent>
        </main>
      </Tabs>
    </div>
  );
};

export default Index;
