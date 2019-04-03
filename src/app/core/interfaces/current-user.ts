import { ProgramInterface } from './program'
export interface CurrentUserInterface {
  objectId: any,
  userProgramRoles: any,
  activeUserProgramRole: {
    program: ProgramInterface
  }
}
