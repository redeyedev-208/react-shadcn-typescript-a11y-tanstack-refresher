import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Menu, 
  X, 
  Shield, 
  Zap, 
  Users, 
  Award, 
  CheckCircle,
  ArrowRight,
  Github,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AccessibilityTester } from '@/components/AccessibilityTester';

function App() {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const features = [
    {
      icon: Shield,
      title: t('features.wcag.title'),
      description: t('features.wcag.description')
    },
    {
      icon: Zap,
      title: t('features.realtime.title'),
      description: t('features.realtime.description')
    },
    {
      icon: Users,
      title: t('features.collaboration.title'),
      description: t('features.collaboration.description')
    },
    {
      icon: Award,
      title: t('features.expertise.title'),
      description: t('features.expertise.description')
    }
  ];

  const technologies = [
    'React 19', 'TypeScript', 'Vite', 'ShadCN UI', 'TanStack Query', 
    'TanStack Table', 'Tailwind CSS', 'i18next', 'Jest', 'Cypress', 'pa11y'
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
            <h1 className="text-xl font-bold">{t('app.title')}</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <a href="#features" className="hover:text-foreground/80">{t('navigation.features')}</a>
            <a href="#testing" className="hover:text-foreground/80">{t('navigation.testing')}</a>
            <a href="#showcase" className="hover:text-foreground/80">{t('navigation.components')}</a>
            <a href="#about" className="hover:text-foreground/80">{t('navigation.about')}</a>
          </nav>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <Button variant="outline" size="sm" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </a>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">{t('navigation.title')}</h2>
            <nav className="space-y-2">
              <a href="#hero" className="block px-3 py-2 rounded-md hover:bg-accent">{t('navigation.home')}</a>
              <a href="#features" className="block px-3 py-2 rounded-md hover:bg-accent">{t('navigation.features')}</a>
              <a href="#testing" className="block px-3 py-2 rounded-md hover:bg-accent">{t('navigation.testing')}</a>
              <a href="#showcase" className="block px-3 py-2 rounded-md hover:bg-accent">{t('navigation.components')}</a>
              <a href="#about" className="block px-3 py-2 rounded-md hover:bg-accent">{t('navigation.about')}</a>
            </nav>
            
            {/* Dashboard Language Controls */}
            <div className="pt-4 border-t border-border">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">{t('dashboard.settings')}</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{t('dashboard.language')}</span>
                  <LanguageToggle />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{t('dashboard.theme')}</span>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 space-y-12">
          {/* Hero Section */}
          <section id="hero" className="text-center space-y-6 py-12">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              {t('hero.title')}
              <span className="text-primary"> {t('hero.showcase')}</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {t('hero.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="#testing">
                  {t('hero.startTesting')} <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#showcase">
                  {t('hero.viewComponents')} <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">{t('features.title')}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t('features.description')}
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <feature.icon className="h-12 w-12 mx-auto text-primary" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Technology Stack */}
          <section className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">{t('technology.title')}</h2>
              <p className="text-muted-foreground">
                {t('technology.description')}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center">
              {technologies.map((tech, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>

          {/* Accessibility Testing Section */}
          <section id="testing" className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">{t('testing.title')}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t('testing.description')}
              </p>
            </div>
            
            <AccessibilityTester />
          </section>

          {/* Component Showcase */}
          <section id="showcase" className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">{t('showcase.title')}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t('showcase.description')}
              </p>
            </div>

            <Tabs defaultValue="buttons" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="buttons">{t('showcase.tabs.buttons')}</TabsTrigger>
                <TabsTrigger value="forms">{t('showcase.tabs.forms')}</TabsTrigger>
                <TabsTrigger value="data">{t('showcase.tabs.data')}</TabsTrigger>
                <TabsTrigger value="feedback">{t('showcase.tabs.feedback')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="buttons" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('showcase.buttons.title')}</CardTitle>
                    <CardDescription>
                      {t('showcase.buttons.description')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Button>{t('showcase.buttons.primary')}</Button>
                      <Button variant="secondary">{t('showcase.buttons.secondary')}</Button>
                      <Button variant="outline">{t('showcase.buttons.outline')}</Button>
                      <Button variant="ghost">{t('showcase.buttons.ghost')}</Button>
                      <Button variant="destructive">{t('showcase.buttons.destructive')}</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm">{t('showcase.buttons.small')}</Button>
                      <Button size="default">{t('showcase.buttons.default')}</Button>
                      <Button size="lg">{t('showcase.buttons.large')}</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="forms" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Form Components</CardTitle>
                    <CardDescription>
                      Accessible form elements with proper labeling and validation feedback.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Form showcase components will be implemented with proper accessibility patterns.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="data" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Data Tables</CardTitle>
                    <CardDescription>
                      TanStack Table integration with ShadCN components for accessible data presentation.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Advanced data table components with sorting, filtering, and pagination.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="feedback" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Feedback Components</CardTitle>
                    <CardDescription>
                      Toast notifications, alerts, and loading states with proper accessibility support.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      User feedback components following WCAG guidelines for notifications.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </section>

          {/* About Section */}
          <section id="about" className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">About This Project</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Created to establish patterns for Accessibility Champions Programs 
                in organizations, providing tools and knowledge for inclusive design.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Goals & Objectives
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>• Refresh and demonstrate A11y SME skills</p>
                  <p>• Create internal accessibility testing tools</p>
                  <p>• Reduce dependency on costly external services</p>
                  <p>• Establish organizational accessibility patterns</p>
                  <p>• Empower Accessibility Champions Programs</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-blue-500" />
                    Technical Excellence
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>• WCAG 2.2 AA/AAA compliance testing</p>
                  <p>• Modern React development patterns</p>
                  <p>• Comprehensive testing strategies</p>
                  <p>• Internationalization & RTL support</p>
                  <p>• Professional VPAT experience applied</p>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
