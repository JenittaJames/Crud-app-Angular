// app.state.ts
import { Profile, User } from './user';

export interface UserState {
  allUser: User[];
  profile: Profile | null; // Update to single Profile or null
}