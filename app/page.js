import React from "react";
import {
  Book,
  Sparkles,
  Lock,
  Calendar,
  ChevronRight,
  BarChart2,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import TestimonialCarousel from "@/components/testimonial-carousel";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { getDailyPrompt } from "@/actions/public";
import faqs from "@/data/faqs";

const features = [
  {
    icon: Book,
    title: "Rich Text Editor",
    description:
      "Express yourself with a powerful editor supporting markdown, formatting, and more.",
  },
  {
    icon: Sparkles,
    title: "Daily Inspiration",
    description:
      "Get inspired with daily prompts and mood-based imagery to spark your creativity.",
  },
  {
    icon: Lock,
    title: "Secure & Private",
    description:
      "Your thoughts are safe with enterprise-grade security and privacy features.",
  },
  // Added mood analytics to feature list for completeness if needed, but sticking to original 3 for now.
];

/**
 * LandingPage
 * The public-facing homepage of the application.
 * Fetches a daily prompt server-side.
 */
export default async function LandingPage() {
  // Fetch daily prompt from action
  const result = await getDailyPrompt();
  const advice = result?.success ? result?.data : null;

  return (
    <div className="relative container mx-auto px-4 pt-16 pb-16">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto text-center space-y-16 animate-fade-in">
        <div className="space-y-8">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl gradient-title mb-8 leading-[1.05] tracking-tight drop-shadow-2xl">
            Silence the Chaos. <br /> Echo Your Clarity.
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-muted-foreground/90 mb-10 max-w-4xl mx-auto leading-relaxed font-light">
            A sanctuary where noise fades and clarity echoes. Untangle the chaos of your mind,
            track your emotional rhythms, and find the stillness designed for your personal growth.
          </p>
        </div>

        {/* Journal Preview Card with Daily Prompt */}
        <div className="relative max-w-5xl mx-auto group animate-slide-up">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-400/30 via-amber-400/25 to-orange-300/20 rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition-all duration-700 animate-pulse-slow"></div>
          <div className="relative glass-card rounded-3xl p-6 sm:p-8 shadow-2xl hover:shadow-orange-500/20 transition-all duration-500">
            <div className="border-b border-amber-200/50 pb-5 mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-sm">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
                </div>
                <span className="text-foreground font-semibold text-base sm:text-lg">
                  Today&rsquo;s Entry
                </span>
              </div>
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-amber-400/50 animate-pulse" />
                <div className="h-3 w-3 rounded-full bg-amber-500/70 animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="h-3 w-3 rounded-full bg-amber-600 animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
            <div className="space-y-4 sm:space-y-5 p-3 sm:p-5">
              <h3 className="text-xl sm:text-2xl font-serif font-medium text-foreground text-left italic leading-relaxed">
                {advice || "My Thoughts Today"}
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <Skeleton className="h-4 bg-amber-200/40 rounded-lg w-full sm:w-3/4 animate-pulse" />
                <Skeleton className="h-4 bg-amber-200/40 rounded-lg w-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                <Skeleton className="h-4 bg-amber-200/40 rounded-lg w-4/5 sm:w-2/3 animate-pulse" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-5 sm:gap-6 pt-10 animate-scale-in">
          <Link href="/dashboard">
            <Button
              variant="journal"
              size="lg"
              className="w-full sm:w-auto px-10 text-lg glow"
            >
              Start Writing <ChevronRight className="ml-2 h-6 w-6" />
            </Button>
          </Link>
          <Link href="#features">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto px-10 text-lg"
            >
              Learn More <ChevronRight className="ml-2 h-6 w-6" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Feature Cards Section */}
      <section
        id="features"
        className="mt-16 sm:mt-20 lg:mt-24 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 sm:mb-20 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 gradient-title">
              Why Choose EchoNote?
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground/90 max-w-3xl mx-auto leading-relaxed">
              Discover the features that make journaling a delightful daily habit
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {features.map((feature, index) => (
              <Card key={index} className="group glass-card glass-card-hover border-amber-200/30 shadow-xl overflow-hidden" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-8 sm:p-10 relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/15 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="h-16 w-16 sm:h-18 sm:w-18 bg-gradient-to-br from-amber-500/25 to-orange-500/15 rounded-2xl flex items-center justify-center mb-6 sm:mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg border border-amber-300/30">
                    <feature.icon className="h-8 w-8 sm:h-9 sm:w-9 text-amber-600" />
                  </div>
                  <h3 className="font-bold text-2xl sm:text-3xl text-amber-900 mb-4 sm:mb-5 group-hover:text-orange-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-amber-800/80 leading-relaxed text-base sm:text-lg">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Features Section */}
      <div className="mt-16 sm:mt-20 lg:mt-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-16 sm:space-y-20 lg:space-y-32">

          {/* Feature 1 - Rich Text Editor */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
            <div className="space-y-6 lg:space-y-8 flex flex-col justify-center">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 sm:h-14 sm:w-14 bg-gradient-to-br from-amber-500/20 to-orange-500/15 rounded-full flex items-center justify-center border border-amber-300/30">
                  <FileText className="h-6 w-6 sm:h-7 sm:w-7 text-amber-600" />
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-amber-400/40 to-transparent"></div>
              </div>
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-900">
                  Rich Text Editor
                </h3>
                <p className="text-base sm:text-lg text-amber-800/80 leading-relaxed">
                  Express yourself fully with our powerful editor featuring advanced formatting options and seamless writing experience.
                </p>
                <ul className="space-y-3 sm:space-y-4">
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-amber-500 flex-shrink-0" />
                    <span className="text-amber-800/80 text-sm sm:text-base">Format text with ease - bold, italic, lists, and more</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-amber-500 flex-shrink-0" />
                    <span className="text-amber-800/80 text-sm sm:text-base">Embed links and create rich content</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-amber-500 flex-shrink-0" />
                    <span className="text-amber-800/80 text-sm sm:text-base">Auto-save your thoughts as you write</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Editor Preview Visual */}
            <div className="glass-card rounded-2xl shadow-xl p-6 sm:p-8 border border-amber-200/40 order-first lg:order-last">
              <div className="space-y-4 sm:space-y-6">
                <div className="flex gap-2 pb-4 border-b border-amber-200/40">
                  <div className="h-6 w-6 sm:h-8 sm:w-8 rounded bg-gradient-to-br from-amber-400/30 to-orange-400/20"></div>
                  <div className="h-6 w-6 sm:h-8 sm:w-8 rounded bg-gradient-to-br from-amber-400/30 to-orange-400/20"></div>
                  <div className="h-6 w-6 sm:h-8 sm:w-8 rounded bg-gradient-to-br from-amber-400/30 to-orange-400/20"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-3 sm:h-4 bg-amber-200/50 rounded w-3/4"></div>
                  <div className="h-3 sm:h-4 bg-amber-200/50 rounded w-full"></div>
                  <div className="h-3 sm:h-4 bg-amber-200/50 rounded w-2/3"></div>
                  <div className="h-3 sm:h-4 bg-amber-200/50 rounded w-1/3"></div>
                  <div className="h-3 sm:h-4 bg-amber-200/50 rounded w-4/5"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 - Mood Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
            <div className="glass-card rounded-2xl shadow-xl p-6 sm:p-8 border border-amber-200/40">
              <div className="space-y-4 sm:space-y-6">
                <div className="h-32 sm:h-40 bg-gradient-to-t from-amber-500/20 via-orange-400/10 to-transparent rounded-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400/15 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div className="h-8 w-2 bg-amber-400/60 rounded-t"></div>
                    <div className="h-12 w-2 bg-amber-500/70 rounded-t"></div>
                    <div className="h-6 w-2 bg-amber-400/60 rounded-t"></div>
                    <div className="h-10 w-2 bg-orange-500/80 rounded-t"></div>
                    <div className="h-4 w-2 bg-amber-300/50 rounded-t"></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="text-center">
                      <div className="h-3 sm:h-4 w-12 sm:w-16 bg-amber-200/60 rounded mx-auto mb-1"></div>
                      <div className="h-2 w-8 sm:w-10 bg-amber-200/40 rounded mx-auto"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6 lg:space-y-8 flex flex-col justify-center">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 sm:h-14 sm:w-14 bg-gradient-to-br from-amber-500/20 to-orange-500/15 rounded-full flex items-center justify-center border border-amber-300/30">
                  <BarChart2 className="h-6 w-6 sm:h-7 sm:w-7 text-amber-600" />
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-amber-400/40 to-transparent"></div>
              </div>
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-900">
                  Mood Analytics
                </h3>
                <p className="text-base sm:text-lg text-amber-800/80 leading-relaxed">
                  Gain insights into your emotional journey with beautiful visualizations and meaningful patterns.
                </p>
                <ul className="space-y-3 sm:space-y-4">
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-amber-500 flex-shrink-0" />
                    <span className="text-amber-800/80 text-sm sm:text-base">Track mood trends over time</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-amber-500 flex-shrink-0" />
                    <span className="text-amber-800/80 text-sm sm:text-base">Discover emotional patterns</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-amber-500 flex-shrink-0" />
                    <span className="text-amber-800/80 text-sm sm:text-base">Get personalized insights</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TestimonialCarousel />

      {/* FAQ Section */}
      <div className="mt-16 sm:mt-20 lg:mt-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-base sm:text-lg text-amber-800/70">
              Everything you need to know about EchoNote
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="glass-card border border-amber-200/40 rounded-lg px-6">
                <AccordionTrigger className="text-amber-900 text-base sm:text-lg font-semibold hover:text-orange-600 py-4 sm:py-6 transition-colors duration-300">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-amber-800/80 text-sm sm:text-base leading-relaxed pb-4 sm:pb-6">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="mt-16 sm:mt-20 lg:mt-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-amber-100/90 via-orange-50/90 to-amber-100/90 border-2 border-amber-300/40 shadow-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-200/20 to-transparent"></div>
            <CardContent className="relative p-8 sm:p-12 lg:p-16 text-center">
              <div className="space-y-6 sm:space-y-8">
                <div className="space-y-4">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-900 leading-tight">
                    Start Reflecting on Your Journey Today
                  </h2>
                  <p className="text-base sm:text-lg text-amber-800/80 max-w-2xl mx-auto leading-relaxed">
                    Join thousands of writers who have already discovered the power of
                    digital journaling. Your story matters, and we&rsquo;re here to help you tell it.
                  </p>
                </div>
                <div className="pt-4">
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      variant="journal"
                      className="px-8 sm:px-12 text-base sm:text-lg font-bold glow"
                    >
                      Get Started for Free <ChevronRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6" />
                    </Button>
                  </Link>
                </div>
                <p className="text-xs sm:text-sm text-amber-700/70 font-medium">
                  No credit card required • Free forever plan available
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}