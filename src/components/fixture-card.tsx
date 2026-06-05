import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Fixture } from '@/types/football';
import { formatKickoffDate, formatKickoffTime } from '@/lib/date-utils';
import { motion } from 'framer-motion';

export function FixtureCard({ fixture }: { fixture: Fixture }) {
  const homeTeam = fixture.homeTeam;
  const awayTeam = fixture.awayTeam;

  const isLive = fixture.status === 'IN_PLAY' || fixture.status === 'PAUSED';
  const isFinished = fixture.status === 'FINISHED';

  const getStatusBadge = () => {
    if (isLive) return <Badge variant="default" className="bg-[#EF4444] text-white hover:bg-[#EF4444]/80 animate-pulse border-none shadow-[0_0_10px_rgba(239,68,68,0.5)]">LIVE</Badge>;
    if (isFinished) return <Badge variant="secondary" className="bg-border text-white border-none">FT</Badge>;
    return <Badge variant="outline" className="text-muted-foreground border-border">{formatKickoffTime(fixture.utcDate)}</Badge>;
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="overflow-hidden bg-card border-border hover:border-primary/50 transition-colors shadow-lg shadow-black/20">
        <CardContent className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-5 pb-3 border-b border-border/50">
            <span className="text-xs text-muted-foreground uppercase tracking-widest font-heading font-semibold">
              {fixture.competition?.name || 'World Cup'} • Matchday {fixture.matchday}
            </span>
            {getStatusBadge()}
          </div>

          <div className="flex justify-between items-center">
            {/* Home Team */}
            <Link href={`/team/${homeTeam.id}`} className="flex flex-col items-center gap-3 w-1/3 group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-background rounded-full p-3 flex items-center justify-center border border-border group-hover:border-primary transition-colors shadow-inner">
                {homeTeam.crest ? (
                  <motion.img 
                    whileHover={{ scale: 1.1 }}
                    src={homeTeam.crest} 
                    alt={homeTeam.name} 
                    className="max-w-full max-h-full object-contain drop-shadow-md" 
                  />
                ) : (
                  <div className="w-10 h-10 bg-border rounded-full" />
                )}
              </div>
              <span className="font-semibold text-sm sm:text-base text-center group-hover:text-primary transition-colors">
                {homeTeam.shortName || homeTeam.name}
              </span>
            </Link>

            {/* Score / VS */}
            <div className="flex flex-col items-center justify-center w-1/3 px-2">
              {isFinished || isLive ? (
                <div className="text-3xl sm:text-5xl font-heading font-bold flex items-center gap-3">
                  <span className={isFinished && fixture.score.fullTime.home! > fixture.score.fullTime.away! ? "text-primary" : "text-foreground"}>
                    {fixture.score.fullTime.home ?? 0}
                  </span>
                  <span className="text-muted-foreground text-2xl">-</span>
                  <span className={isFinished && fixture.score.fullTime.away! > fixture.score.fullTime.home! ? "text-primary" : "text-foreground"}>
                    {fixture.score.fullTime.away ?? 0}
                  </span>
                </div>
              ) : (
                <div className="text-2xl font-heading text-muted-foreground/50">VS</div>
              )}
              <div className="text-xs text-muted-foreground mt-3 font-medium uppercase tracking-wider">
                {formatKickoffDate(fixture.utcDate)}
              </div>
            </div>

            {/* Away Team */}
            <Link href={`/team/${awayTeam.id}`} className="flex flex-col items-center gap-3 w-1/3 group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-background rounded-full p-3 flex items-center justify-center border border-border group-hover:border-primary transition-colors shadow-inner">
                {awayTeam.crest ? (
                  <motion.img 
                    whileHover={{ scale: 1.1 }}
                    src={awayTeam.crest} 
                    alt={awayTeam.name} 
                    className="max-w-full max-h-full object-contain drop-shadow-md" 
                  />
                ) : (
                  <div className="w-10 h-10 bg-border rounded-full" />
                )}
              </div>
              <span className="font-semibold text-sm sm:text-base text-center group-hover:text-primary transition-colors">
                {awayTeam.shortName || awayTeam.name}
              </span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

