
import type { Product, UserProfile } from './types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Noise-Cancelling Headphones',
    description:
      'Experience immersive sound with these comfortable, long-lasting wireless headphones. Featuring active noise-cancellation and a sleek design.',
    price: 199.99,
    images: ['/images/wireless-headphones.png'],
    category: 'Electronics',
    stock: 50,
    ecoFriendliness: 40,
    imageHint: 'wireless headphones',
    reviews: [
      { id: 'r1', author: 'Jane D.', rating: 5, comment: 'Amazing sound quality and very comfortable!', date: '2023-05-10' },
      { id: 'r2', author: 'John S.', rating: 4, comment: 'Great headphones, but they came in a huge box with lots of non-recyclable plastic packaging.', date: '2023-05-15' },
    ],
  },
  {
    id: '2',
    name: 'Smart Fitness Tracker Watch',
    description:
      'Track your workouts, monitor your health, and stay connected with this stylish smart fitness tracker. Water-resistant and with multiple sport modes.',
    price: 89.50,
    images: ['/images/fitness-tracker.png'],
    category: 'Wearables',
    stock: 120,
    ecoFriendliness: 65,
    imageHint: 'fitness tracker',
    reviews: [
      { id: 'r3', author: 'Alice B.', rating: 5, comment: 'Love it! Tracks my sleep and workouts perfectly.', date: '2023-06-01' },
    ],
  },
  {
    id: '3',
    name: 'Organic Cotton T-Shirt',
    description:
      'Soft, breathable, and eco-friendly. This organic cotton t-shirt is a wardrobe staple available in various colors.',
    price: 25.00,
    images: ['/images/cotton-t-shirt.png'],
    category: 'Apparel',
    stock: 200,
    ecoFriendliness: 95,
    imageHint: 'cotton t-shirt',
  },
  {
    id: '4',
    name: 'Portable Bluetooth Speaker',
    description:
      'Take your music anywhere with this compact and powerful Bluetooth speaker. Features a long battery life and rugged, water-resistant design.',
    price: 59.99,
    images: ['/images/bluetooth-speaker.png'],
    category: 'Electronics',
    stock: 75,
    ecoFriendliness: 50,
    imageHint: 'bluetooth speaker',
    reviews: [
      { id: 'r4', author: 'Mike C.', rating: 4, comment: 'Good sound for its size, very portable.', date: '2023-04-20' },
    ],
  },
  {
    id: '5',
    name: 'Stainless Steel Water Bottle',
    description:
      'Stay hydrated with this durable, double-walled insulated water bottle. Keeps drinks cold for 24 hours or hot for 12 hours.',
    price: 22.95,
    images: ['/images/steel-bottle.png'],
    category: 'Home & Kitchen',
    stock: 150,
    ecoFriendliness: 90,
    imageHint: 'steel bottle',
    reviews: [
      { id: 'r5', author: 'EcoWarrior22', rating: 5, comment: 'This is my third purchase, I bought them for my whole family! So durable and helps us avoid plastic bottles.' , date: '2023-07-12' },
      { id: 'r6', author: 'Chris P.', rating: 5, comment: 'It feels really solid and has already survived a few drops. I expect this to last for years.', date: '2023-08-01' }
    ]
  },
  {
    id: '6',
    name: 'Yoga Mat with Carrying Strap',
    description:
      'High-density, non-slip yoga mat for all types of yoga and exercise. Includes a convenient carrying strap.',
    price: 35.00,
    images: ['/images/yoga-mat.png'],
    category: 'Sports & Outdoors',
    stock: 90,
    ecoFriendliness: 80,
    imageHint: 'yoga mat',
  },
  {
    id: '7',
    name: 'Reusable Beeswax Food Wraps',
    description: 'A sustainable alternative to plastic wrap. Keep your food fresh with these natural, reusable, and biodegradable wraps.',
    price: 18.50,
    images: ['/images/food-wraps.png'],
    category: 'Home & Kitchen',
    stock: 110,
    ecoFriendliness: 98,
    imageHint: 'food wraps',
  },
  {
    id: '8',
    name: 'Bamboo Cutlery Set',
    description: 'Ditch single-use plastic with this lightweight and durable bamboo cutlery set. Perfect for travel, work, or picnics. Comes in a handy travel pouch.',
    price: 15.99,
    images: ['/images/bamboo-cutlery.png'],
    category: 'Home & Kitchen',
    stock: 130,
    ecoFriendliness: 92,
    imageHint: 'bamboo cutlery',
  },
  {
    id: '9',
    name: 'Solar-Powered Phone Charger',
    description: 'Harness the power of the sun to charge your devices on the go. This portable solar charger is perfect for camping, hiking, and emergencies.',
    price: 45.00,
    images: ['/images/solar-charger.png'],
    category: 'Electronics',
    stock: 60,
    ecoFriendliness: 75,
    imageHint: 'solar charger',
  },
  {
    id: '10',
    name: 'Recycled Paper Notebook',
    description: 'Jot down your thoughts in this stylish notebook made from 100% recycled paper. A perfect gift for the eco-conscious writer or artist.',
    price: 12.00,
    images: ['/images/recycled-notebook.png'],
    category: 'Office',
    stock: 180,
    ecoFriendliness: 90,
    imageHint: 'recycled notebook',
  }
];

export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(product => product.id === id);
};

export const mockUsers: UserProfile[] = [
  {
    id: 'u1',
    username: 'janedoe',
    name: 'Jane Doe',
    bio: 'Fashion lover & tech enthusiast. Finding the best products so you don\'t have to.',
    avatarUrl: '/images/fitness-tracker.png',
    followers: 1258,
    following: 0,
    favorites: ['1', '4'],
    wishlist: ['2', '6'],
    followingIds: [],
    ecoPoints: 150,
    isOnline: true,
  },
  {
    id: 'u2',
    username: 'johnsmith',
    name: 'John Smith',
    bio: 'Gadget reviewer and outdoor adventurer.',
    avatarUrl: '/images/fitness-tracker.png',
    followers: 876,
    following: 0,
    favorites: ['2', '4', '5'],
    wishlist: ['1'],
    followingIds: [],
    ecoPoints: 80,
    isOnline: false,
  }
];