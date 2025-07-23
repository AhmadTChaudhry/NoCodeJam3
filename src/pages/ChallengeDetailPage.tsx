import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { mockChallenges, mockSubmissions } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Star, CheckCircle, Clock, User, ExternalLink, Send } from 'lucide-react';

export function ChallengeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [solutionUrl, setSolutionUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const challenge = mockChallenges.find(c => c.id === id);
  const userSubmission = mockSubmissions.find(s => s.challengeId === id && s.userId === user?.id);
  const approvedSubmissions = mockSubmissions.filter(s => s.challengeId === id && s.status === 'approved');

  if (!challenge) {
    return <Navigate to="/challenges" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!solutionUrl.trim()) {
      toast({
        title: "Invalid URL",
        description: "Please provide a valid solution URL.",
        variant: "destructive",
      });
      return;
    }

    // Basic URL validation
    try {
      new URL(solutionUrl);
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please provide a valid URL starting with http:// or https://",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Solution submitted!",
      description: "Your solution has been submitted for review. You'll be notified once it's reviewed.",
    });
    
    setSolutionUrl('');
    setIsSubmitting(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Challenge Header */}
        <Card className="mb-8 overflow-hidden">
          <div className="relative">
            <img
              src={challenge.imageUrl}
              alt={challenge.title}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-end">
              <div className="p-6 text-white">
                <div className="flex items-center space-x-3 mb-2">
                  <Badge className={getDifficultyColor(challenge.difficulty)}>
                    {challenge.difficulty}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="font-medium">{challenge.xpReward} XP</span>
                  </div>
                </div>
                <h1 className="text-3xl font-bold">{challenge.title}</h1>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Challenge Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {challenge.description}
                </p>
                
                <h3 className="font-semibold text-gray-900 mb-3">Requirements:</h3>
                <ul className="space-y-2">
                  {challenge.requirements.map((req, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Submit Solution */}
            {!userSubmission && (
              <Card>
                <CardHeader>
                  <CardTitle>Submit Your Solution</CardTitle>
                  <CardDescription>
                    Share the URL of your completed solution
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="solutionUrl">Solution URL</Label>
                      <Input
                        id="solutionUrl"
                        type="url"
                        value={solutionUrl}
                        onChange={(e) => setSolutionUrl(e.target.value)}
                        placeholder="https://your-solution.com"
                        required
                        className="mt-1"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Provide a live URL where your solution can be viewed and tested
                      </p>
                    </div>
                    <Button type="submit" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Submit Solution
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* User's Submission Status */}
            {userSubmission && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {userSubmission.status === 'approved' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-yellow-600" />
                    )}
                    <span>Your Submission</span>
                  </CardTitle>
                  <CardDescription>
                    Submitted on {userSubmission.submittedAt.toLocaleDateString()}
                  </CardDescription>
                  </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Status:</span>
                      <Badge
                        variant={userSubmission.status === 'approved' ? 'default' : 
                               userSubmission.status === 'pending' ? 'secondary' : 'destructive'}
                      >
                        {userSubmission.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Solution URL:</span>
                      <Button variant="outline" size="sm" asChild>
                        <a href={userSubmission.solutionUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View
                        </a>
                      </Button>
                    </div>
                    {userSubmission.feedback && (
                      <div>
                        <span className="font-medium">Feedback:</span>
                        <p className="text-gray-700 mt-1 p-3 bg-gray-50 rounded-lg">
                          {userSubmission.feedback}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Challenge Info */}
            <Card>
              <CardHeader>
                <CardTitle>Challenge Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Difficulty:</span>
                  <Badge className={getDifficultyColor(challenge.difficulty)}>
                    {challenge.difficulty}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">XP Reward:</span>
                  <span className="font-medium text-purple-600">{challenge.xpReward} XP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span>{challenge.createdAt.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Submissions:</span>
                  <span>{approvedSubmissions.length} approved</span>
                </div>
              </CardContent>
            </Card>

            {/* Approved Solutions */}
            {approvedSubmissions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Community Solutions</CardTitle>
                  <CardDescription>
                    Approved submissions from other developers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {approvedSubmissions.slice(0, 5).map((submission) => (
                      <div key={submission.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium">User Solution</span>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={submission.solutionUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}