'use client';

import { use } from 'react';
import { useTeamFixtures } from '@/hooks/useFootball';
import { Skeleton } from '@/components/ui/skeleton';
import { FixtureCard } from '@/components/fixture-card';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TeamFixtures({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data: fixtures, isLoading, error } = useTeamFixtures(resolvedParams.id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-8 pt-20">
        <div className="max-w-4xl mx-auto space-y-8">
          <Skeleton className="h-20 w-1/3 rounded-xl mb-8 bg-card" />
          <Skeleton className="h-40 w-full rounded-2xl bg-card" />
          <Skeleton className="h-40 w-full rounded-2xl bg-card" />
        </div>
      </div>
    );
  }

  if (error || !fixtures) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-8 flex justify-center items-center">
        <div className="text-destructive font-heading text-2xl">Error loading fixtures.</div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background pb-20"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-8 pt-12 sm:pt-20">
        <Link href={`/team/${resolvedParams.id}`} className="inline-flex items-center text-primary hover:text-white transition-colors mb-8 font-medium">
          <ChevronLeft className="w-5 h-5 mr-1" /> Back to Team
        </Link>
        
        <div className="mb-12">
          <h1 className="text-4xl sm:text-6xl font-heading font-extrabold text-white mb-2 uppercase tracking-wide">
            Match <span className="text-primary">Schedule</span>
          </h1>
          <p className="text-muted-foreground text-lg">All upcoming and past fixtures</p>
        </div>

        <div className="relative border-l-2 border-border/50 ml-4 sm:ml-6 pl-6 sm:pl-10 py-4 space-y-12">
          {fixtures.map((fixture, idx) => (
            <motion.div 
              key={fixture.id} 
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="absolute -left-[35px] sm:-left-[51px] top-6 w-6 h-6 rounded-full bg-background border-4 border-primary z-10 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
              <FixtureCard fixture={fixture} />
            </motion.div>
          ))}
          {fixtures.length === 0 && (
            <div className="text-center py-16 bg-card rounded-3xl border border-border">
              <p className="text-muted-foreground text-lg">No fixtures found for this team.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
