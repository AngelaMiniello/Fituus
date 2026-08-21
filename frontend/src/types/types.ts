export interface ILoginProps {
  email: string;
  password: string;
}

export interface IRegisterProps {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IProfileSetup {
  height?: number;
  weight?: number;
  gender?: string;
  activityLevel?: string;
  goal?: string;
}

export interface IUserSession {
  token: string;
  user: {
    id: string | number;
    name: string;
    email: string;
    address: string;
    phone: string;
    orders: any[];
    profilePic: string;
  } & IProfileSetup; // Combino las métricas al objeto usuario con un Intersection Type
}

export type IUser = {
  id: string;
  name: string;
};

export interface Exercise {
  id: string | number;
  name: string;
  duration: number;
  caloriesBurned: number;
}