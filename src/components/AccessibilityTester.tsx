import React, { useState } from 'react';
import {
  TestTube,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AccessibilityIssue {
  type: 'error' | 'warning' | 'notice';
  code: string;
  message: string;
  context: string;
  selector: string;
}

interface AccessibilityResults {
  url: string;
  issues: AccessibilityIssue[];
  pageTitle: string;
  documentTitle: string;
}

export const AccessibilityTester: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AccessibilityResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Mock pa11y results for demonstration (in real implementation, this would call a backend service)
  const runAccessibilityTest = async () => {
    if (!url) return;

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock results - in production, this would call your backend that runs pa11y
      const mockResults: AccessibilityResults = {
        url,
        pageTitle: 'Test Page',
        documentTitle: `Accessibility Test Results for ${url}`,
        issues: [
          {
            type: 'error',
            code: 'WCAG2AA.Principle1.Guideline1_3.1_3_1.H44.NoLabelText',
            message: 'Label text is empty.',
            context: '<label for="search"></label>',
            selector: 'html > body > main > form > label',
          },
          {
            type: 'warning',
            code: 'WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail',
            message:
              'This element has insufficient contrast at this conformance level.',
            context: '<p style="color: #999;">Low contrast text</p>',
            selector: 'html > body > main > p:nth-child(3)',
          },
          {
            type: 'notice',
            code: 'WCAG2AA.Principle2.Guideline2_4.2_4_2.H25.1.NoTitleEl',
            message: 'A title should be provided for the document.',
            context: '<head>...</head>',
            selector: 'html > head',
          },
        ],
      };

      setResults(mockResults);
    } catch {
      setError('Failed to run accessibility test. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <XCircle className='h-4 w-4 text-destructive' />;
      case 'warning':
        return (
          <AlertTriangle className='h-4 w-4 text-orange-700 dark:text-orange-400' />
        );
      case 'notice':
        return (
          <CheckCircle className='h-4 w-4 text-blue-700 dark:text-blue-400' />
        );
      default:
        return <AlertTriangle className='h-4 w-4' />;
    }
  };

  const getIssuesByType = (type: string) => {
    return results?.issues.filter((issue) => issue.type === type) || [];
  };

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <TestTube className='h-5 w-5' />
            Accessibility Testing Tool
          </CardTitle>
          <CardDescription>
            Test any website for WCAG 2.2 compliance using pa11y. Enter a URL to
            analyze accessibility issues.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='url-input'>Website URL</Label>
            <div className='flex gap-2'>
              <Input
                id='url-input'
                type='url'
                placeholder='https://example.com'
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className='flex-1'
                disabled={isLoading}
              />
              <Button
                onClick={runAccessibilityTest}
                disabled={!url || isLoading}
                className='min-w-[120px]'
              >
                {isLoading ? (
                  <>
                    <Loader2
                      className='mr-2 h-4 w-4 animate-spin'
                      data-testid='loading-spinner'
                    />
                    Testing...
                  </>
                ) : (
                  'Run Test'
                )}
              </Button>
            </div>
          </div>

          {error && (
            <div className='p-4 border border-destructive/50 rounded-md bg-destructive/10'>
              <p className='text-sm text-destructive'>{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results for {results.url}</CardTitle>
            <CardDescription>
              Found {results.issues.length} accessibility issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue='all'>
              <TabsList className='grid w-full grid-cols-4'>
                <TabsTrigger value='all'>
                  All ({results.issues.length})
                </TabsTrigger>
                <TabsTrigger
                  value='errors'
                  className='text-destructive'
                >
                  Errors ({getIssuesByType('error').length})
                </TabsTrigger>
                <TabsTrigger
                  value='warnings'
                  className='text-orange-700 dark:text-orange-400'
                >
                  Warnings ({getIssuesByType('warning').length})
                </TabsTrigger>
                <TabsTrigger
                  value='notices'
                  className='text-blue-700 dark:text-blue-400'
                >
                  Notices ({getIssuesByType('notice').length})
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value='all'
                className='space-y-4'
              >
                {results.issues.map((issue, index) => (
                  <div
                    key={index}
                    className='border rounded-lg p-4 space-y-2'
                  >
                    <div className='flex items-start gap-2'>
                      {getIssueIcon(issue.type)}
                      <div className='flex-1'>
                        <h4 className='font-medium'>{issue.message}</h4>
                        <p className='text-sm text-muted-foreground'>
                          {issue.code}
                        </p>
                      </div>
                    </div>
                    <div className='ml-6 space-y-1'>
                      <p className='text-sm'>
                        <strong>Selector:</strong> {issue.selector}
                      </p>
                      <details className='text-sm'>
                        <summary className='cursor-pointer hover:underline'>
                          View context
                        </summary>
                        <pre className='mt-2 p-2 bg-muted rounded text-xs overflow-x-auto'>
                          {issue.context}
                        </pre>
                      </details>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value='errors'>
                {getIssuesByType('error').map((issue, index) => (
                  <div
                    key={index}
                    className='border border-destructive/50 rounded-lg p-4 space-y-2'
                  >
                    <div className='flex items-start gap-2'>
                      {getIssueIcon(issue.type)}
                      <div className='flex-1'>
                        <h4 className='font-medium'>{issue.message}</h4>
                        <p className='text-sm text-muted-foreground'>
                          {issue.code}
                        </p>
                      </div>
                    </div>
                    <div className='ml-6 space-y-1'>
                      <p className='text-sm'>
                        <strong>Selector:</strong> {issue.selector}
                      </p>
                      <details className='text-sm'>
                        <summary className='cursor-pointer hover:underline'>
                          View context
                        </summary>
                        <pre className='mt-2 p-2 bg-muted rounded text-xs overflow-x-auto'>
                          {issue.context}
                        </pre>
                      </details>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value='warnings'>
                {getIssuesByType('warning').map((issue, index) => (
                  <div
                    key={index}
                    className='border border-orange-500/50 rounded-lg p-4 space-y-2'
                  >
                    <div className='flex items-start gap-2'>
                      {getIssueIcon(issue.type)}
                      <div className='flex-1'>
                        <h4 className='font-medium'>{issue.message}</h4>
                        <p className='text-sm text-muted-foreground'>
                          {issue.code}
                        </p>
                      </div>
                    </div>
                    <div className='ml-6 space-y-1'>
                      <p className='text-sm'>
                        <strong>Selector:</strong> {issue.selector}
                      </p>
                      <details className='text-sm'>
                        <summary className='cursor-pointer hover:underline'>
                          View context
                        </summary>
                        <pre className='mt-2 p-2 bg-muted rounded text-xs overflow-x-auto'>
                          {issue.context}
                        </pre>
                      </details>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value='notices'>
                {getIssuesByType('notice').map((issue, index) => (
                  <div
                    key={index}
                    className='border border-blue-700/50 dark:border-blue-400/50 rounded-lg p-4 space-y-2'
                  >
                    <div className='flex items-start gap-2'>
                      {getIssueIcon(issue.type)}
                      <div className='flex-1'>
                        <h4 className='font-medium'>{issue.message}</h4>
                        <p className='text-sm text-muted-foreground'>
                          {issue.code}
                        </p>
                      </div>
                    </div>
                    <div className='ml-6 space-y-1'>
                      <p className='text-sm'>
                        <strong>Selector:</strong> {issue.selector}
                      </p>
                      <details className='text-sm'>
                        <summary className='cursor-pointer hover:underline'>
                          View context
                        </summary>
                        <pre className='mt-2 p-2 bg-muted rounded text-xs overflow-x-auto'>
                          {issue.context}
                        </pre>
                      </details>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
