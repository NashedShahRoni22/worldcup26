"use client";

import { useState, useEffect } from "react";
import { useWorldCupFixtures } from "@/hooks/useFootball";
import { FixtureCard } from "@/components/fixture-card";
import { FixtureSkeleton } from "@/components/fixture-skeleton";
import {
  isToday,
  isTomorrow,
  isAfter,
  addDays,
  parseISO,
  isSameDay,
  format,
  differenceInSeconds,
} from "date-fns";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon, Search, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";

function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const target = parseISO(targetDate);
    const interval = setInterval(() => {
      const now = new Date();
      const diff = differenceInSeconds(target, now);
      if (diff <= 0) {
        clearInterval(interval);
        return;
      }
      setTimeLeft({
        d: Math.floor(diff / (3600 * 24)),
        h: Math.floor((diff % (3600 * 24)) / 3600),
        m: Math.floor((diff % 3600) / 60),
        s: diff % 60,
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex gap-3 sm:gap-6 justify-center items-center mt-8">
      {[
        { label: "Days", value: timeLeft.d },
        { label: "Hours", value: timeLeft.h },
        { label: "Mins", value: timeLeft.m },
        { label: "Secs", value: timeLeft.s },
      ].map((item) => (
        <div key={item.label} className="flex flex-col items-center">
          <div className="bg-card border border-border w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
            <span className="text-4xl sm:text-6xl font-heading font-bold text-primary drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]">
              {item.value.toString().padStart(2, "0")}
            </span>
          </div>
          <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-[0.2em] mt-3 font-semibold">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const { data: fixtures, isLoading, error } = useWorldCupFixtures();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const filteredFixtures = fixtures?.filter((fixture) => {
    const searchLower = searchQuery.toLowerCase();
    const homeName = (fixture.homeTeam?.name || "").toLowerCase();
    const awayName = (fixture.awayTeam?.name || "").toLowerCase();
    const matchesSearch =
      homeName.includes(searchLower) || awayName.includes(searchLower);

    if (selectedDate) {
      const fixtureDate = parseISO(fixture.utcDate);
      return matchesSearch && isSameDay(fixtureDate, selectedDate);
    }
    return matchesSearch;
  });

  const getGroupedFixtures = () => {
    if (!filteredFixtures)
      return { today: [], upcoming: [], nextMatch: null, popularTeams: [] };

    const now = new Date();
    const today: typeof filteredFixtures = [];
    const upcomingByStage: Record<string, typeof filteredFixtures> = {
      "Group Stage": [],
      "Round of 16 (Knockout)": [],
      "Quarter Final": [],
      "Semi Final": [],
      "Final": [],
    };
    let nextMatch: any = null;

    // Extract unique teams with crests for Popular Teams section
    const teamsMap = new Map();

    filteredFixtures.forEach((fixture) => {
      const date = parseISO(fixture.utcDate);
      if (isToday(date)) today.push(fixture);
      else if (isAfter(date, now)) {
        const m = date.getMonth() + 1; // 1-12
        const d = date.getDate();
        let stage = "Group Stage";
        if ((m === 6 && d >= 29) || (m === 7 && d <= 8)) stage = "Round of 16 (Knockout)";
        else if (m === 7 && d >= 10 && d <= 12) stage = "Quarter Final";
        else if (m === 7 && d >= 15 && d <= 16) stage = "Semi Final";
        else if (m === 7 && d >= 19) stage = "Final";
        
        upcomingByStage[stage].push(fixture);
      }

      if (!nextMatch && isAfter(date, now) && fixture.status !== "FINISHED") {
        nextMatch = fixture;
      }

      if (fixture.homeTeam.crest && !teamsMap.has(fixture.homeTeam.id)) {
        teamsMap.set(fixture.homeTeam.id, fixture.homeTeam);
      }
      if (fixture.awayTeam.crest && !teamsMap.has(fixture.awayTeam.id)) {
        teamsMap.set(fixture.awayTeam.id, fixture.awayTeam);
      }
    });

    const popularTeamsArray = Array.from(teamsMap.values());
    popularTeamsArray.sort((a, b) => {
      const priorityTeams = ["France", "Spain", "Argentina", "England", "Brazil"];
      const aIndex = priorityTeams.indexOf(a.name);
      const bIndex = priorityTeams.indexOf(b.name);
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return 0;
    });

    return {
      today,
      upcomingByStage,
      nextMatch,
      popularTeams: popularTeamsArray.slice(0, 12), // Top 12 unique teams
    };
  };

  const { today, upcomingByStage, nextMatch, popularTeams } = getGroupedFixtures();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full pb-20"
    >
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-24 sm:pb-32 px-4 overflow-hidden border-b border-border/50 bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_center,_rgba(34,197,94,0.15),_transparent_50%)]"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl sm:text-8xl font-heading font-extrabold tracking-tight text-white mb-6 uppercase drop-shadow-2xl"
          >
            FIFA World Cup{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">
              2026
            </span>
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg sm:text-2xl max-w-2xl mx-auto"
          >
            Follow every fixture, team, and match of the FIFA World Cup 2026 in
            real-time.
          </motion.p>

          {nextMatch && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              <Countdown targetDate={nextMatch.utcDate} />
            </motion.div>
          )}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 mt-12 space-y-16">
        {/* Filters */}
        <section className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search by country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-10 bg-card border-border focus-visible:ring-primary/50 focus-visible:border-primary rounded-2xl h-14 text-base shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          <div className="w-full sm:w-auto">
            <Popover>
              <PopoverTrigger
                className={cn(
                  "flex items-center w-full sm:w-[260px] justify-start text-left font-medium bg-card border border-border hover:border-primary hover:text-white h-14 px-4 rounded-2xl transition-all shadow-sm",
                  !selectedDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-3 h-5 w-5 text-primary" />
                {selectedDate ? (
                  format(selectedDate, "MMMM do, yyyy")
                ) : (
                  <span className="text-base">Filter by Date</span>
                )}
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 bg-card border-border shadow-2xl rounded-2xl overflow-hidden"
                align="end"
              >
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="bg-transparent text-foreground"
                />
                {selectedDate && (
                  <div className="p-3 border-t border-border bg-background/50">
                    <Button
                      variant="ghost"
                      className="w-full text-destructive hover:text-red-300 hover:bg-destructive/10 rounded-xl h-10"
                      onClick={() => setSelectedDate(undefined)}
                    >
                      Clear Filter
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>
        </section>

        {isLoading ? (
          <div className="space-y-6">
            <FixtureSkeleton />
            <FixtureSkeleton />
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-destructive/10 rounded-2xl text-destructive border border-destructive/20">
            <h3 className="font-heading text-2xl mb-2">Error Loading Data</h3>
            <p className="text-muted-foreground">
              Please check your API token or connection.
            </p>
          </div>
        ) : (
          <>
            {/* Contextual Results (Searched/Date filtered) */}
            {searchQuery || selectedDate ? (
              <section className="space-y-6">
                <h2 className="text-3xl font-heading text-white mb-6 flex items-center gap-3">
                  <span className="w-2 h-8 bg-primary rounded-full"></span>
                  Search Results
                </h2>
                {filteredFixtures && filteredFixtures.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredFixtures.map((fixture) => (
                      <FixtureCard key={fixture.id} fixture={fixture} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-card rounded-3xl border border-border">
                    <p className="text-muted-foreground text-lg">
                      No matches found for your search.
                    </p>
                  </div>
                )}
              </section>
            ) : (
              <>
                {/* Popular Teams Grid */}
                {popularTeams.length > 0 && (
                  <section>
                    <h2 className="text-3xl font-heading text-white mb-6 flex items-center gap-3">
                      <span className="w-2 h-8 bg-secondary rounded-full"></span>
                      Popular Teams
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {popularTeams.map((team, idx) => (
                        <motion.div
                          key={team.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          <Link
                            href={`/team/${team.id}`}
                            className="group block bg-card hover:bg-card/80 border border-border hover:border-primary/50 transition-all duration-300 rounded-2xl p-6 text-center shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
                          >
                            <div className="w-16 h-16 mx-auto mb-4 bg-background rounded-full flex items-center justify-center p-3 border border-border group-hover:border-primary/50 transition-colors">
                              <img
                                src={team.crest}
                                alt={team.name}
                                className="max-w-full max-h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform"
                              />
                            </div>
                            <span className="block font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                              {team.name}
                            </span>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </section>
                )}
                {/* Today's Matches */}
                <section>
                  <h2 className="text-3xl font-heading text-white mb-6 flex items-center gap-3">
                    <span className="w-2 h-8 bg-destructive rounded-full"></span>
                    Today's Matches
                  </h2>
                  {today.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {today.map((fixture) => (
                        <FixtureCard key={fixture.id} fixture={fixture} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-card rounded-3xl border border-border">
                      <p className="text-muted-foreground text-lg">
                        No matches scheduled for today.
                      </p>
                    </div>
                  )}
                </section>

                {/* Upcoming Matches */}
                <section>
                  <h2 className="text-3xl font-heading text-white mb-6 flex items-center gap-3">
                    <span className="w-2 h-8 bg-primary rounded-full"></span>
                    Upcoming Matches
                  </h2>
                  
                  {Object.entries(upcomingByStage).map(([stage, matches]) => {
                    if (matches.length === 0) return null;
                    return (
                      <div key={stage} className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                          <h3 className="text-xl font-heading text-white">{stage}</h3>
                          <span className="px-3 py-1 bg-secondary/20 text-secondary text-xs rounded-full font-medium">
                            {matches.length} Matches
                          </span>
                        </div>
                        <div className="overflow-x-auto bg-card border border-border rounded-2xl shadow-sm">
                          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[600px]">
                            <thead>
                              <tr className="border-b border-border bg-muted/30">
                                <th className="p-4 text-muted-foreground font-medium text-sm">Date & Time</th>
                                <th className="p-4 text-muted-foreground font-medium text-sm">Match</th>
                                <th className="p-4 text-muted-foreground font-medium text-sm">Group / Venue</th>
                                <th className="p-4 text-muted-foreground font-medium text-sm text-right">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {matches.map((fixture) => (
                                <tr key={fixture.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                                  <td className="p-4 text-sm">
                                    {format(parseISO(fixture.utcDate), "MMM dd, yyyy - hh:mm a")}
                                  </td>
                                  <td className="p-4">
                                    <div className="flex items-center gap-4">
                                      <div className="flex items-center gap-2 w-32 justify-end">
                                        <span className="font-semibold text-sm truncate">{fixture.homeTeam.name || "TBD"}</span>
                                        {fixture.homeTeam.crest ? (
                                          <img src={fixture.homeTeam.crest} alt="" className="w-6 h-6 object-contain" />
                                        ) : (
                                          <div className="w-6 h-6 bg-muted rounded-full"></div>
                                        )}
                                      </div>
                                      <span className="text-muted-foreground text-xs font-bold bg-muted/50 px-2 py-1 rounded">VS</span>
                                      <div className="flex items-center gap-2 w-32">
                                        {fixture.awayTeam.crest ? (
                                          <img src={fixture.awayTeam.crest} alt="" className="w-6 h-6 object-contain" />
                                        ) : (
                                          <div className="w-6 h-6 bg-muted rounded-full"></div>
                                        )}
                                        <span className="font-semibold text-sm truncate">{fixture.awayTeam.name || "TBD"}</span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-4 text-sm text-muted-foreground">
                                    {fixture.group ? fixture.group : fixture.venue || "TBD"}
                                  </td>
                                  <td className="p-4 text-right">
                                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full uppercase font-medium">
                                      {fixture.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
                  {Object.values(upcomingByStage).every(arr => arr.length === 0) && (
                    <div className="text-center py-16 bg-card rounded-3xl border border-border">
                      <p className="text-muted-foreground text-lg">
                        No upcoming matches found.
                      </p>
                    </div>
                  )}
                </section>
              </>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
