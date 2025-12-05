export interface IUser {
  _id: string;
  display_name: string;
  photo_url: string;
  email?: string;
  role?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
