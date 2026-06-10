"use client";

import { useState, useEffect } from "react";
import { useWorldCupFixtures } from "@/hooks/useFootball";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Star, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function FavouritePage() {
  const { data: fixtures, isLoading, error } = useWorldCupFixtures();
  const [favouriteTeamIds, setFavouriteTeamIds] = useState<string[]>([]);

  useEffect(() => {
    // Read array from localStorage on mount
    const saved = localStorage.getItem("favouriteTeamIds");
    if (saved) {
      try {
        setFavouriteTeamIds(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse favorites", e);
      }
    }
  }, []);

  const handleToggleSelect = (teamId: string) => {
    let updated: string[];
    if (favouriteTeamIds.includes(teamId)) {
      updated = favouriteTeamIds.filter((id) => id !== teamId);
    } else {
      updated = [...favouriteTeamIds, teamId];
    }
    setFavouriteTeamIds(updated);
    localStorage.setItem("favouriteTeamIds", JSON.stringify(updated));
  };

  const getTeams = () => {
    if (!fixtures) return [];
    const teamsMap = new Map();
    fixtures.forEach((fixture) => {
      if (fixture.homeTeam.crest && !teamsMap.has(fixture.homeTeam.id)) {
        teamsMap.set(fixture.homeTeam.id, fixture.homeTeam);
      }
      if (fixture.awayTeam.crest && !teamsMap.has(fixture.awayTeam.id)) {
        teamsMap.set(fixture.awayTeam.id, fixture.awayTeam);
      }
    });

    return Array.from(teamsMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  };

  const allTeams = getTeams();

  // Extract currently selected teams for the top quick-access horizontal layout
  const favouriteTeams = allTeams.filter((team) =>
    favouriteTeamIds.includes(String(team.id)),
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full pb-20 pt-8 sm:pt-16"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-12">
        <div className="text-center">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl sm:text-6xl font-bold text-white mb-4 tracking-tight"
          >
            Select Your <span className="text-primary">Favourite</span> Teams
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Choose the countries you are supporting. Tap a selection below to
            toggle, or view team centers directly.
          </motion.p>
        </div>

        {isLoading ? (
          <div className="space-y-10">
            {/* Skeleton for Top navigation links */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-48 bg-card" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Skeleton className="h-20 w-full rounded-2xl bg-card" />
                <Skeleton className="h-20 w-full rounded-2xl bg-card" />
              </div>
            </div>
            {/* Skeleton for Main grid */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-36 bg-card" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center p-4 sm:p-6 rounded-2xl border border-border bg-card space-y-4"
                  >
                    <Skeleton className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-background/50" />
                    <Skeleton className="h-4 w-24 bg-background/50" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-destructive/10 rounded-2xl text-destructive border border-destructive/20">
            <h3 className="text-2xl font-bold mb-2">Error Loading Teams</h3>
            <p className="text-muted-foreground">
              Please check your API token or connection.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Horizontal Navigation Cards for Favourites at the Top */}
            <AnimatePresence mode="popLayout">
              {favouriteTeams.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Star className="w-4 h-4 fill-primary text-primary" /> My
                    Team Hubs
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {favouriteTeams.map((team) => (
                      <motion.div
                        key={`hub-${team.id}`}
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="flex items-center justify-between p-4 rounded-2xl border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors shadow-md group"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-12 h-12 rounded-xl bg-background border border-border p-2 flex items-center justify-center shrink-0">
                            <img
                              src={team.crest}
                              alt={team.name}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-foreground text-sm block truncate">
                              {team.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Selected Favorite
                            </span>
                          </div>
                        </div>
                        <Link
                          href={`/team/${team.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-background border border-border group-hover:border-primary/40 px-3 py-2 rounded-xl transition-all shadow-sm"
                        >
                          Check Fixture
                          <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            {/* Complete, Alphabetical Grid List */}
            <section className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                All Competing Countries
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                {allTeams.map((team, idx) => {
                  const isSelected = favouriteTeamIds.includes(String(team.id));

                  return (
                    <motion.button
                      key={team.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: Math.min(idx * 0.01, 0.3) }}
                      onClick={() => handleToggleSelect(String(team.id))}
                      className={cn(
                        "group relative flex flex-col items-center p-4 sm:p-6 rounded-2xl border transition-all duration-300 shadow-md",
                        isSelected
                          ? "bg-primary/10 border-primary scale-[1.02] shadow-primary/5"
                          : "bg-card border-border hover:border-primary/40 hover:bg-card/60 hover:-translate-y-0.5",
                      )}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 text-primary">
                          <Star className="w-4 h-4 fill-primary drop-shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "w-16 h-16 sm:w-20 sm:h-20 mb-3 rounded-full flex items-center justify-center p-3 sm:p-4 border transition-colors",
                          isSelected
                            ? "bg-background border-primary"
                            : "bg-background border-border group-hover:border-primary/40",
                        )}
                      >
                        <img
                          src={team.crest}
                          alt={team.name}
                          className={cn(
                            "max-w-full max-h-full object-contain drop-shadow-sm transition-transform",
                            isSelected ? "scale-105" : "group-hover:scale-105",
                          )}
                        />
                      </div>
                      <span
                        className={cn(
                          "font-semibold text-xs sm:text-sm text-center transition-colors line-clamp-1 w-full px-1",
                          isSelected
                            ? "text-primary font-bold"
                            : "text-foreground/90 group-hover:text-primary",
                        )}
                      >
                        {team.name}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </section>
          </div>
        )}
      </div>
    </motion.div>
  );
}
