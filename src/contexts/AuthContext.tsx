
'use client';

import type { UserProfile } from '@/lib/types';
import { mockUsers as initialUsers } from '@/lib/mockData';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface AuthContextType {
  currentUser: UserProfile | null;
  login: (username: string) => boolean;
  signup: (name: string, username: string) => boolean;
  logout: () => void;
  users: UserProfile[];
  getUserByUsername: (username: string) => UserProfile | undefined;
  toggleFollow: (userIdToFollow: string) => void;
  isFollowing: (userIdToFollow: string) => boolean;
  addEcoPoints: (points: number) => void;
  updateUser: (updatedProfile: Partial<Pick<UserProfile, 'name' | 'username' | 'bio' | 'avatarUrl'>>) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [users, setUsers] = useState<UserProfile[]>(initialUsers);

  // Load user data from localStorage on initial client-side render
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('socialCartCurrentUser');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
      const storedUsers = localStorage.getItem('socialCartUsers');
      // Only load users if there's a stored list, otherwise use initial mock data
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      }
    } catch (error) {
      console.error("Failed to parse auth data from localStorage", error);
      // Clear potentially corrupted data
      localStorage.removeItem('socialCartCurrentUser');
      localStorage.removeItem('socialCartUsers');
    }
  }, []);

  // Persist currentUser to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('socialCartCurrentUser', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('socialCartCurrentUser');
      }
    } catch (error) {
       console.error("Failed to save currentUser to localStorage", error);
    }
  }, [currentUser]);
  
  // Persist the entire user list to localStorage
  useEffect(() => {
    try {
      // Avoid writing initial mock data on first render unless it's already been modified
      if (users.length > initialUsers.length || localStorage.getItem('socialCartUsers')) {
        localStorage.setItem('socialCartUsers', JSON.stringify(users));
      }
    } catch (error) {
        console.error("Failed to save users to localStorage", error);
    }
  }, [users]);

  const getUserByUsername = (username: string): UserProfile | undefined => {
    return users.find(user => user.username === username);
  };

  const login = (username: string): boolean => {
    const user = getUserByUsername(username);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const signup = (name: string, username: string): boolean => {
    if (getUserByUsername(username)) {
      return false; // user exists
    }
    const newUser: UserProfile = {
      id: uuidv4(),
      name,
      username,
      bio: 'Just joined SocialCart! Ready to shop and connect.',
      avatarUrl: 'https://source.unsplash.com/150x150/?person',
      followers: 0,
      following: 0,
      favorites: [],
      wishlist: [],
      followingIds: [],
      ecoPoints: 0,
      isOnline: true,
    };
    setUsers(prevUsers => [...prevUsers, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    // Note: We are intentionally not resetting the `users` list on logout
    // so that created accounts persist for the demo.
  };

  const isFollowing = (userIdToFollow: string): boolean => {
    return currentUser?.followingIds?.includes(userIdToFollow) ?? false;
  };

  const toggleFollow = (userIdToFollow: string) => {
    if (!currentUser) return;
    
    const isCurrentlyFollowing = isFollowing(userIdToFollow);

    // Update the full user list state
    setUsers(prevUsers => 
      prevUsers.map(user => {
        // Update the current user's following list and count
        if (user.id === currentUser.id) {
          const newFollowingIds = isCurrentlyFollowing
            ? user.followingIds.filter(id => id !== userIdToFollow)
            : [...user.followingIds, userIdToFollow];
          return {
            ...user,
            followingIds: newFollowingIds,
            following: newFollowingIds.length,
          };
        }
        // Update the followed/unfollowed user's followers count
        if (user.id === userIdToFollow) {
          return {
            ...user,
            followers: isCurrentlyFollowing ? user.followers - 1 : user.followers + 1,
          };
        }
        return user;
      })
    );

    // Also update the currentUser state directly to ensure UI updates instantly
    setCurrentUser(prevCurrentUser => {
      if (!prevCurrentUser) return null;
      const newFollowingIds = isCurrentlyFollowing
        ? prevCurrentUser.followingIds.filter(id => id !== userIdToFollow)
        : [...prevCurrentUser.followingIds, userIdToFollow];
      return {
        ...prevCurrentUser,
        followingIds: newFollowingIds,
        following: newFollowingIds.length
      };
    });
  };

  const addEcoPoints = (points: number) => {
    if (!currentUser) return;

    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === currentUser.id 
          ? { ...user, ecoPoints: user.ecoPoints + points }
          : user
      )
    );

    setCurrentUser(prevUser => 
      prevUser ? { ...prevUser, ecoPoints: prevUser.ecoPoints + points } : null
    );
  };
  
  const updateUser = (updatedProfile: Partial<Pick<UserProfile, 'name' | 'username' | 'bio' | 'avatarUrl'>>): boolean => {
    if (!currentUser) return false;

    // Check if new username is already taken by another user
    if (updatedProfile.username && updatedProfile.username !== currentUser.username) {
        if (users.some(user => user.username === updatedProfile.username)) {
            return false; // Username already exists
        }
    }

    const updatedUser = { ...currentUser, ...updatedProfile };

    // Update the currentUser state
    setCurrentUser(updatedUser);

    // Update the user in the main users list
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === currentUser.id ? updatedUser : user
      )
    );
    
    return true;
  };


  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout, users, getUserByUsername, toggleFollow, isFollowing, addEcoPoints, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
