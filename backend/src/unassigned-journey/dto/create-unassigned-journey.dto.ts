import { IsUUID, IsOptional, IsString } from 'class-validator';

export class CreateUnassignedJourneyDto {
  @IsUUID()
  journeyId: string;

  @IsOptional()
  @IsString()
  reason?: string;
}
