
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { usePomodoroSettings } from '@/hooks/usePomodoroSettings';

const PomodoroSettings = () => {
  const { settings, isLoading, createSettings, updateSettings } = usePomodoroSettings();
  
  const [localSettings, setLocalSettings] = React.useState({
    focus_duration: 25,
    short_break_duration: 5,
    long_break_duration: 15,
    cycles_until_long_break: 4,
    auto_start_breaks: false,
    auto_start_pomodoros: false,
    sound_focus: 'bell',
    sound_short_break: 'chime',
    sound_long_break: 'gong',
  });

  React.useEffect(() => {
    if (settings) {
      setLocalSettings({
        focus_duration: settings.focus_duration,
        short_break_duration: settings.short_break_duration,
        long_break_duration: settings.long_break_duration,
        cycles_until_long_break: settings.cycles_until_long_break,
        auto_start_breaks: settings.auto_start_breaks,
        auto_start_pomodoros: settings.auto_start_pomodoros,
        sound_focus: settings.sound_focus,
        sound_short_break: settings.sound_short_break,
        sound_long_break: settings.sound_long_break,
      });
    }
  }, [settings]);

  const handleSave = () => {
    if (settings) {
      updateSettings.mutate(localSettings);
    } else {
      createSettings.mutate(localSettings);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Timer Duration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Focus Duration: {localSettings.focus_duration} minutes</Label>
            <Slider
              value={[localSettings.focus_duration]}
              onValueChange={([value]) => setLocalSettings(prev => ({ ...prev, focus_duration: value }))}
              min={5}
              max={60}
              step={5}
              className="w-full"
            />
          </div>
          
          <div className="space-y-3">
            <Label>Short Break Duration: {localSettings.short_break_duration} minutes</Label>
            <Slider
              value={[localSettings.short_break_duration]}
              onValueChange={([value]) => setLocalSettings(prev => ({ ...prev, short_break_duration: value }))}
              min={1}
              max={15}
              step={1}
              className="w-full"
            />
          </div>
          
          <div className="space-y-3">
            <Label>Long Break Duration: {localSettings.long_break_duration} minutes</Label>
            <Slider
              value={[localSettings.long_break_duration]}
              onValueChange={([value]) => setLocalSettings(prev => ({ ...prev, long_break_duration: value }))}
              min={5}
              max={45}
              step={5}
              className="w-full"
            />
          </div>
          
          <div className="space-y-3">
            <Label>Cycles Until Long Break: {localSettings.cycles_until_long_break}</Label>
            <Slider
              value={[localSettings.cycles_until_long_break]}
              onValueChange={([value]) => setLocalSettings(prev => ({ ...prev, cycles_until_long_break: value }))}
              min={2}
              max={8}
              step={1}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Auto-Start Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-start-breaks">Auto-start breaks</Label>
            <Switch
              id="auto-start-breaks"
              checked={localSettings.auto_start_breaks}
              onCheckedChange={(checked) => setLocalSettings(prev => ({ ...prev, auto_start_breaks: checked }))}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-start-pomodoros">Auto-start pomodoros</Label>
            <Switch
              id="auto-start-pomodoros"
              checked={localSettings.auto_start_pomodoros}
              onCheckedChange={(checked) => setLocalSettings(prev => ({ ...prev, auto_start_pomodoros: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Sounds</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Focus Session Sound</Label>
            <Select
              value={localSettings.sound_focus}
              onValueChange={(value) => setLocalSettings(prev => ({ ...prev, sound_focus: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bell">Bell</SelectItem>
                <SelectItem value="chime">Chime</SelectItem>
                <SelectItem value="gong">Gong</SelectItem>
                <SelectItem value="ding">Ding</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Short Break Sound</Label>
            <Select
              value={localSettings.sound_short_break}
              onValueChange={(value) => setLocalSettings(prev => ({ ...prev, sound_short_break: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bell">Bell</SelectItem>
                <SelectItem value="chime">Chime</SelectItem>
                <SelectItem value="gong">Gong</SelectItem>
                <SelectItem value="ding">Ding</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Long Break Sound</Label>
            <Select
              value={localSettings.sound_long_break}
              onValueChange={(value) => setLocalSettings(prev => ({ ...prev, sound_long_break: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bell">Bell</SelectItem>
                <SelectItem value="chime">Chime</SelectItem>
                <SelectItem value="gong">Gong</SelectItem>
                <SelectItem value="ding">Ding</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={handleSave} 
        className="w-full"
        disabled={createSettings.isPending || updateSettings.isPending}
      >
        {createSettings.isPending || updateSettings.isPending ? 'Saving...' : 'Save Settings'}
      </Button>
    </div>
  );
};

export default PomodoroSettings;
