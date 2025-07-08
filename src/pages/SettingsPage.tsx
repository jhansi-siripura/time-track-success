
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
      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-2">
            <div className="p-2 bg-gradient-to-br from-slate-500 to-slate-600 rounded-lg shadow-md">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Settings
              </h1>
              <p className="text-gray-600 mt-1">Manage your account and preferences</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid gap-6">
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardHeader className="bg-white">
                <CardTitle className="text-lg font-semibold text-gray-900">Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 bg-white">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={user?.email || ''} 
                    disabled 
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input 
                    id="name" 
                    type="text" 
                    placeholder="Enter your display name"
                  />
                </div>
                <Button>Save Changes</Button>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border border-gray-200">
              <CardHeader className="bg-white">
                <CardTitle className="text-lg font-semibold text-gray-900">Study Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 bg-white">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Default Timezone</Label>
                  <Input 
                    id="timezone" 
                    type="text" 
                    placeholder="UTC"
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="daily-goal">Daily Study Goal (hours)</Label>
                  <Input 
                    id="daily-goal" 
                    type="number" 
                    placeholder="2"
                    step="0.5"
                    min="0"
                  />
                </div>
                <Button>Save Preferences</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
