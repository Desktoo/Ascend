export class UserRankUpEvent {
  constructor(
    public readonly userId: string,
    public readonly newRank: string,
    public readonly newLevel?: number,
  ) {}
}
