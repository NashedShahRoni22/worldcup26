"use client";

import { use } from "react";
import { useTeam, useTeamFixtures } from "@/hooks/useFootball";
import { Skeleton } from "@/components/ui/skeleton";
import { FixtureCard } from "@/components/fixture-card";
import { FixtureSkeleton } from "@/components/fixture-skeleton";
import Link from "next/link";
import {
  MapPin,
  Globe,
  Calendar,
  Shirt,
  ChevronLeft,
  Flag,
} from "lucide-react";
import { motion } from "framer-motion";

export default function TeamDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { data: team, isLoading, error } = useTeam(resolvedParams.id);
  const { data: fixtures, isLoading: isLoadingFixtures } = useTeamFixtures(
    resolvedParams.id,
  );

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto p-4 sm:p-8 pt-24 space-y-6">
        <div className="flex gap-4 items-center mb-6">
          <Skeleton className="w-16 h-16 rounded-full bg-card" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48 bg-card" />
            <Skeleton className="h-4 w-32 bg-card" />
          </div>
        </div>
        <Skeleton className="h-40 w-full rounded-xl bg-card" />
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="min-h-[50vh] flex justify-center items-center">
        <div className="text-destructive font-heading text-xl">
          Error loading team profile.
        </div>
      </div>
    );
  }

  const teamMeta = [
    { label: "Founded", value: team.founded || "—", icon: Calendar },
    { label: "Stadium", value: team.venue || "—", icon: MapPin },
    { label: "Colors", value: team.clubColors || "—", icon: Shirt },
    {
      label: "Website",
      value: team.website ? "Visit Site" : "—",
      icon: Globe,
      link: team.website,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto px-4 sm:px-8 pt-24 pb-16 space-y-8"
    >
      {/* Back Navigation */}
      <Link
        href="/"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to dashboard
      </Link>

      {/* Clean Compact Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-border/60">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-card rounded-xl p-2 flex items-center justify-center border border-border shadow-sm">
            {team.crest ? (
              <img
                src={team.crest}
                alt={team.name}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <Flag className="w-8 h-8 text-muted-foreground" />
            )}
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
              {team.name}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1">
              <Flag className="w-3.5 h-3.5" />
              {team.address?.split(",").pop()?.trim() || team.tla}
            </p>
          </div>
        </div>

        {/* Minimalist Info Row */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-border/40">
          {teamMeta.map((info) => (
            <div
              key={info.label}
              className="flex items-center gap-2 text-muted-foreground"
            >
              <info.icon className="w-4 h-4 text-muted-foreground/70 shrink-0" />
              <span className="text-xs font-medium min-w-[55px]">
                {info.label}:
              </span>
              {info.link ? (
                <a
                  href={info.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-foreground font-medium hover:underline hover:text-primary transition-colors truncate max-w-[120px]"
                >
                  {info.value}
                </a>
              ) : (
                <span className="text-foreground font-medium truncate max-w-[120px]">
                  {info.value}
                </span>
              )}
            </div>
          ))}
        </div>
      </header>

      {/* Prioritized Upcoming Fixtures */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-4xl font-heading font-extrabold text-white mb-2 uppercase tracking-wide">
            Upcoming <span className="text-primary">Fixtures</span>
          </h1>
          <Link
            href={`/team/${team.id}/fixtures`}
            className="text-xs font-medium text-primary hover:underline"
          >
            View All
          </Link>
        </div>

        {isLoadingFixtures ? (
          <div className="space-y-3">
            <FixtureSkeleton />
            <FixtureSkeleton />
          </div>
        ) : fixtures && fixtures.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fixtures
              .filter((f) => f.status !== "FINISHED")
              .slice(0, 4)
              .map((fixture) => (
                <FixtureCard key={fixture.id} fixture={fixture} />
              ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card/50 rounded-xl border border-border border-dashed">
            <p className="text-muted-foreground text-sm">
              No upcoming fixtures found.
            </p>
          </div>
        )}
      </section>
    </motion.div>
  );
}
