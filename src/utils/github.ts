export interface ContributionDay {
  date: string;
  contributionCount: number;
  color: string;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

export interface GitHubContributionsResponse {
  user: {
    contributionsCollection: {
      contributionCalendar: ContributionCalendar;
    };
  };
}

export async function fetchGitHubContributions(username: string): Promise<ContributionCalendar | null> {
  try {
    const response = await fetch(`/api/github/contributions?username=${encodeURIComponent(username)}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch contributions');
    }

    const data: GitHubContributionsResponse = await response.json();
    return data.user.contributionsCollection.contributionCalendar;
  } catch (error) {
    console.error('Error fetching GitHub contributions:', error);
    return null;
  }
}

// 날짜 범위 유틸리티 함수들
export function getContributionIntensity(count: number): 'none' | 'low' | 'medium' | 'high' | 'very-high' {
  if (count === 0) return 'none';
  if (count <= 2) return 'low';
  if (count <= 4) return 'medium';
  if (count <= 7) return 'high';
  return 'very-high';
}

export function formatContributionDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}