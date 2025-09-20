import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTeamDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
}
