export interface User {
  id:any;
  username:string,
  email:string,
}

// export interface Profile {
//   confirmPassword: any;
//   password: any;
//   length: number;
//   username:string,
//   email:string,
//   image?:string,
// }



// src/app/user.ts
export interface Profile {
  username: string;
  email: string;
  image?: string;
  password?: string; // For form
  confirmPassword?: string; // For form
}