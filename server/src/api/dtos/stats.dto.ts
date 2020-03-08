export class StatsDto {
  readonly numPerformances: { [key: string]: number }[];
  readonly numPerformancesPerDay: { [key: string]: number }[];
  readonly meanNumPerformancesPerDay: { [key: string]: number }[];
  readonly numPerformancesOutside: { [key: string]: number }[];
  readonly numPerformancesByType: {
    [key: string]: {
      O: number;
      SO: number;
      SB: number;
      WO: number;
    }
  }[];
  readonly audienceCounts: { [key: string]: number }[];
}
