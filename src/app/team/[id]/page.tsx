'use client';

import { use } from 'react';
import { useTeam, useTeamFixtures } from '@/hooks/useFootball';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FixtureCard } from '@/components/fixture-card';
import { FixtureSkeleton } from '@/components/fixture-skeleton';
import Link from 'next/link';
import { MapPin, Globe, Calendar, Shirt, ChevronLeft, Flag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TeamDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data: team, isLoading, error } = useTeam(resolvedParams.id);
  const { data: fixtures, isLoading: isLoadingFixtures } = useTeamFixtures(resolvedParams.id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-8 pt-20">
        <div className="max-w-5xl mx-auto space-y-8">
          <Skeleton className="h-80 w-full rounded-3xl bg-card border-border" />
        </div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-8 flex justify-center items-center">
        <div className="text-destructive font-heading text-2xl">Error loading team profile.</div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background pb-20"
    >
      {/* Hero Banner */}
      <section className="relative pt-20 pb-32 px-4 overflow-hidden border-b border-border/50 bg-card">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(59,130,246,0.15),_transparent_70%)]"></div>
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center">
          <Link href="/" className="absolute left-0 top-0 inline-flex items-center text-primary hover:text-white transition-colors font-medium">
            <ChevronLeft className="w-5 h-5 mr-1" /> Back
          </Link>
          
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="w-48 h-48 sm:w-64 sm:h-64 bg-background/50 rounded-full p-8 flex items-center justify-center border-4 border-border shadow-2xl shadow-black/50 mb-8 backdrop-blur-md"
          >
            {team.crest ? (
              <img src={team.crest} alt={team.name} className="max-w-full max-h-full object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)]" />
            ) : (
              <Flag className="w-20 h-20 text-muted-foreground" />
            )}
          </motion.div>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h1 className="text-5xl sm:text-7xl font-heading font-extrabold text-white mb-2 tracking-wide uppercase drop-shadow-lg">
              {team.name}
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground font-medium flex items-center justify-center gap-2">
              <Flag className="w-5 h-5 text-secondary" /> 
              {team.address?.split(',').pop()?.trim() || team.tla}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 mt-[-40px] relative z-20 space-y-12">
        {/* Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Founded', value: team.founded || 'Unknown', icon: Calendar, color: 'text-primary' },
            { label: 'Stadium', value: team.venue || 'N/A', icon: MapPin, color: 'text-secondary' },
            { label: 'Website', value: team.website ? 'Visit Site' : 'N/A', icon: Globe, color: 'text-cyan-400', link: team.website },
            { label: 'Colors', value: team.clubColors || 'N/A', icon: Shirt, color: 'text-pink-400' }
          ].map((info, idx) => (
            <motion.div
              key={info.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (idx * 0.1) }}
            >
              <Card className="bg-card border-border shadow-lg hover:border-primary/50 transition-colors h-full">
                <CardContent className="p-6 flex flex-col items-center text-center justify-center">
                  <info.icon className={`w-8 h-8 mb-4 ${info.color} drop-shadow-md`} />
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">{info.label}</span>
                  {info.link ? (
                    <a href={info.link} target="_blank" rel="noreferrer" className="font-medium hover:text-primary transition-colors">
                      {info.value}
                    </a>
                  ) : (
                    <span className="font-medium text-foreground">{info.value}</span>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Upcoming Fixtures Section */}
        <section>
          <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
            <h2 className="text-3xl font-heading text-white flex items-center gap-3">
              <span className="w-2 h-8 bg-primary rounded-full"></span>
              Upcoming Fixtures
            </h2>
            <Link href={`/team/${team.id}/fixtures`} className="text-sm font-medium text-primary hover:text-white transition-colors">
              View All
            </Link>
          </div>
          
          {isLoadingFixtures ? (
            <div className="space-y-4">
              <FixtureSkeleton />
              <FixtureSkeleton />
            </div>
          ) : fixtures && fixtures.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {fixtures.filter(f => f.status !== 'FINISHED').slice(0, 4).map(fixture => (
                <FixtureCard key={fixture.id} fixture={fixture} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card rounded-3xl border border-border">
              <p className="text-muted-foreground text-lg">No upcoming fixtures found for this team.</p>
            </div>
          )}
        </section>
      </div>
    </motion.div>
  );
}

