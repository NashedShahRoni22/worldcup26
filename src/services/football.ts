import axios from 'axios';
import { Fixture, FixturesResponse, Team } from '@/types/football';

const api = axios.create({
  baseURL: '/api/football',
  headers: {
    'X-Auth-Token': process.env.NEXT_PUBLIC_API_FOOTBALL_TOKEN,
  },
});

export const getWorldCupFixtures = async (): Promise<Fixture[]> => {
  // 2000 is the World Cup competition ID in Football Data API
  const response = await api.get<FixturesResponse>('/competitions/2000/matches');
  return response.data.matches;
};

export const getTeamDetails = async (teamId: string): Promise<Team> => {
  const response = await api.get<Team>(`/teams/${teamId}`);
  return response.data;
};

export const getTeamFixtures = async (teamId: string): Promise<Fixture[]> => {
  const response = await api.get<FixturesResponse>(`/teams/${teamId}/matches`);
  return response.data.matches;
};
