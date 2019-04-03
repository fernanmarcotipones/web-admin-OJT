import { ProgramInterface } from './program'
export interface UserProgramRoleInterface {
  objectId: String;
  createdAt: String;
  updatedAt: String;
  level: Object;
  program: ProgramInterface;
  role: Object;
  selected: Boolean;
  user: Object;
}
