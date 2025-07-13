import React, { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Youtube, Play, Settings, Copy, Save, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const YouTubeNoteTakerPage = () => {
  const [activeTab, setActiveTab] = useState('generator');
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [summaryCards, setSummaryCards] = useState([]);
  const [aiConfig, setAiConfig] = useState({
    provider: 'OpenAI',
    apiKey: '',
    model: 'gpt-4o-mini'
  });
  const [showAiConfig, setShowAiConfig] = useState(false);

  const loadVideo = async () => {
    if (!videoUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a YouTube video URL",
        variant: "destructive"
      });
      return;
    }

    if (!aiConfig.apiKey) {
      setShowAiConfig(true);
      toast({
        title: "Configuration Required",
        description: "Configure your AI settings to enable transcript summarization",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Extract video ID from URL
      const videoId = extractVideoId(videoUrl);
      if (!videoId) {
        throw new Error('Invalid YouTube URL');
      }

      // Mock video data for now
      setVideoData({
        id: videoId,
        title: 'React JS Explained In 10 Minutes',
        duration: '10:00',
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      });

      toast({
        title: "Video Loaded",
        description: "Video loaded successfully. Generate summary cards below.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to load video",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const extractVideoId = (url) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const generateSummaryCards = async () => {
    if (!videoData) return;

    setIsLoading(true);
    try {
      // Mock summary card generation
      const mockCard = {
        id: Date.now().toString(),
        title: 'Core Concepts Every React Developer Should Know',
        timeRange: '0:00 - 10:00',
        summary: `# Core Concepts Every React Developer Should Know ## Introduction to React - React is a JavaScript library for building user interfaces. - Used by major websites like Facebook, Netflix, and Airbnb. - Provides tools and structure for faster UI development. ## Single Page Applications (SPAs) - SPAs use one single template, updating components within the DOM. - Misleading term as it suggests only one page exists. - Components are independent, reusable pieces of the UI. ## Components - Components can be JavaScript classes or functions returning HTML (JSX). - Components can be nested to any depth. - Functional components are becoming more popular with the advent of hooks.`,
        videoTitle: videoData.title,
        savedAt: new Date().toISOString(),
        tags: ['youtube', 'recap', 'ai-summary']
      };

      setSummaryCards(prev => [mockCard, ...prev]);
      
      toast({
        title: "Summary Generated",
        description: "AI summary cards created successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate summary cards",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const saveAiConfig = () => {
    if (!aiConfig.apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter your API key",
        variant: "destructive"
      });
      return;
    }

    setShowAiConfig(false);
    toast({
      title: "Configuration Saved",
      description: "AI settings have been saved successfully",
    });
  };

  const copyCard = (card) => {
    navigator.clipboard.writeText(card.summary);
    toast({
      title: "Copied",
      description: "Summary copied to clipboard",
    });
  };

  const saveCard = (card) => {
    toast({
      title: "Saved",
      description: "Card saved to your collection",
    });
  };

  const deleteCard = (cardId) => {
    setSummaryCards(prev => prev.filter(card => card.id !== cardId));
    toast({
      title: "Deleted",
      description: "Card removed from your collection",
    });
  };

  return (
    <MainLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-2">
            <div className="p-2.5 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-sm">
              <Youtube className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-slate-800 text-xl">
                YouTube NoteTaker
              </h1>
              <p className="text-slate-600 mt-1 font-normal">
                Transform any YouTube video into structured, AI-powered summary cards
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-white shadow-sm border border-gray-200 p-1 rounded-lg">
              <TabsTrigger 
                value="generator" 
                className="flex items-center gap-2 px-6 py-3 data-[state=active]:bg-gray-900 data-[state=active]:text-white"
              >
                <Play className="h-4 w-4" />
                Generator
              </TabsTrigger>
              <TabsTrigger 
                value="saved-cards"
                className="flex items-center gap-2 px-6 py-3 data-[state=active]:bg-gray-900 data-[state=active]:text-white"
              >
                <Save className="h-4 w-4" />
                Saved Cards
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Generator Tab */}
          <TabsContent value="generator" className="space-y-8">
            {/* URL Input Section */}
            <Card className="bg-white border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-200 rounded-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                    <Play className="h-5 w-5 text-blue-600" />
                    Enter YouTube Video URL
                  </CardTitle>
                  <Dialog open={showAiConfig} onOpenChange={setShowAiConfig}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Settings className="h-5 w-5" />
                          AI Configuration
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="provider">AI Provider</Label>
                          <Select value={aiConfig.provider} onValueChange={(value) => setAiConfig(prev => ({...prev, provider: value}))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="OpenAI">OpenAI</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="apiKey">API Key</Label>
                          <Input
                            id="apiKey"
                            type="password"
                            placeholder="Enter your API key"
                            value={aiConfig.apiKey}
                            onChange={(e) => setAiConfig(prev => ({...prev, apiKey: e.target.value}))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="model">Model (optional)</Label>
                          <Input
                            id="model"
                            placeholder="Default: gpt-4o-mini"
                            value={aiConfig.model}
                            onChange={(e) => setAiConfig(prev => ({...prev, model: e.target.value}))}
                          />
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button onClick={saveAiConfig} className="flex-1">
                            Save Configuration
                          </Button>
                          <Button variant="outline" onClick={() => setShowAiConfig(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={loadVideo}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                  >
                    {isLoading ? 'Loading...' : 'Load Video'}
                  </Button>
                </div>
                {!aiConfig.apiKey && (
                  <div className="flex items-center gap-2 text-orange-600 bg-orange-50 p-3 rounded-lg border border-orange-200">
                    <Settings className="h-4 w-4" />
                    <span className="text-sm">Configure your AI settings to enable transcript summarization</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Video Preview */}
            {videoData && (
              <Card className="bg-white border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-200 rounded-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Youtube className="h-5 w-5 text-red-500" />
                    {videoData.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-slate-100 rounded-lg mb-4 flex items-center justify-center">
                    <iframe
                      src={`https://www.youtube.com/embed/${videoData.id}`}
                      className="w-full h-full rounded-lg"
                      allowFullScreen
                    />
                  </div>
                  <Button 
                    onClick={generateSummaryCards}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-3"
                  >
                    {isLoading ? 'Generating...' : '🤖 Generate AI Summary Cards'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Generated Summary Cards */}
            {summaryCards.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">AI-Generated Summary Cards</h2>
                <div className="space-y-6">
                  {summaryCards.map((card) => (
                    <Card key={card.id} className="bg-white border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-200 rounded-lg">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-xl mb-2">{card.title}</CardTitle>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                              <Badge variant="outline">{card.timeRange}</Badge>
                              <span>Saved: {new Date(card.savedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => copyCard(card)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => saveCard(card)}>
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => deleteCard(card.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="prose prose-sm max-w-none">
                          <pre className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed">
                            {card.summary}
                          </pre>
                        </div>
                        <div className="flex gap-2 mt-4">
                          {card.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Saved Cards Tab */}
          <TabsContent value="saved-cards">
            <Card className="bg-white border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-200 rounded-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Save className="h-5 w-5 text-slate-600" />
                  Saved Cards ({summaryCards.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {summaryCards.length === 0 ? (
                  <div className="text-center py-12">
                    <Save className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-600 mb-2">No Saved Cards</h3>
                    <p className="text-slate-500">Generate some summaries and save them to see them here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Input placeholder="Search saved cards..." className="mb-4" />
                    <div className="grid gap-4 md:grid-cols-2">
                      {summaryCards.map((card) => (
                        <Card key={card.id} className="bg-gray-50 border border-gray-200 hover:shadow-sm transition-shadow duration-200">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg">{card.title}</CardTitle>
                            <p className="text-sm text-slate-600">From: {card.videoTitle}</p>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-slate-700 line-clamp-3 mb-3">
                              {card.summary.substring(0, 150)}...
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex gap-2">
                                {card.tags.slice(0, 2).map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <Button variant="ghost" size="sm" onClick={() => deleteCard(card.id)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center text-slate-500 text-sm mt-12">
          Powered by AI • Transform your video learning experience
        </div>
      </div>
    </MainLayout>
  );
};

export default YouTubeNoteTakerPage;