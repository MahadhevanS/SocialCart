
export interface Review {
  id: string;
  author: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name:string;
  description: string;
  price: number;
  images: string[]; // URLs
  category: string;
  stock: number;
  reviews?: Review[]; // Optional reviews
  ecoFriendliness: number; // Percentage from 0 to 100
  imageHint: string;
}

export interface CartItemType extends Product {
  quantity: number;
}

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  bio: string;
  avatarUrl: string;
  followers: number;
  following: number;
  favorites: string[]; // array of product ids
  wishlist: string[]; // array of product ids
  followingIds: string[]; // array of user IDs this user is following
  ecoPoints: number;
  isOnline: boolean;
}

export interface ChatMessage {
  senderId: string;
  text: string;
}
