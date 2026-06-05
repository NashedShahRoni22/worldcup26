import { useQuery } from '@tanstack/react-query';
import { getWorldCupFixtures, getTeamDetails, getTeamFixtures } from '@/services/football';

export const useWorldCupFixtures = () => {
  return useQuery({
    queryKey: ['worldCupFixtures'],
    queryFn: getWorldCupFixtures,
  });
};

export const useTeam = (teamId: string) => {
  return useQuery({
    queryKey: ['team', teamId],
    queryFn: () => getTeamDetails(teamId),
    enabled: !!teamId,
  });
};

export const useTeamFixtures = (teamId: string) => {
  return useQuery({
    queryKey: ['teamFixtures', teamId],
    queryFn: () => getTeamFixtures(teamId),
    enabled: !!teamId,
  });
};
