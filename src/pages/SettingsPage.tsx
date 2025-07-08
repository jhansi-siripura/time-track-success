
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Settings } from 'lucide-react';

const SettingsPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 sm:p-6">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2.5 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl shadow-sm">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-foreground">
                Settings
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">Manage your account and preferences</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid gap-4 sm:gap-6">
            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-lg font-semibold text-foreground">Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={user?.email || ''} 
                    disabled 
                    className="bg-muted/50 border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-foreground">Display Name</Label>
                  <Input 
                    id="name" 
                    type="text" 
                    placeholder="Enter your display name"
                    className="border-border"
                  />
                </div>
                <div className="pt-2">
                  <Button className="h-10">Save Changes</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-lg font-semibold text-foreground">Study Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="space-y-2">
                  <Label htmlFor="timezone" className="text-sm font-medium text-foreground">Default Timezone</Label>
                  <Input 
                    id="timezone" 
                    type="text" 
                    placeholder="UTC"
                    disabled
                    className="bg-muted/50 border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="daily-goal" className="text-sm font-medium text-foreground">Daily Study Goal (hours)</Label>
                  <Input 
                    id="daily-goal" 
                    type="number" 
                    placeholder="2"
                    step="0.5"
                    min="0"
                    className="border-border"
                  />
                </div>
                <div className="pt-2">
                  <Button className="h-10">Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
