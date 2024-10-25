import { User } from "@prisma/client";

export function userFullName(user: User): string {
    return `${user.name || ""} ${user.lastName || ""}`.trim();
}

export function orderUsersByName(users: User[]): User[] {
  const usersCopy = structuredClone(users);
  return usersCopy.sort((a, b) => userFullName(a).localeCompare(userFullName(b)));
}

export function capitalizeLastName(user: User): User {
    if (!user.lastName) {
        return user;
    }

    return {
        ...user,
        lastName:  user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1),
    };
}

export function capitalizeLastNameInUsers(users: User[]): User[] {
    return users.map(capitalizeLastName);
}

export function filterUsersByPrefix(users: User[], prefix: string): User[] {
  return users.filter((user) => userFullName(user).toLowerCase().startsWith(prefix.toLowerCase()));
}

export function groupUsersByPrefix(users: User[], prefixes: string[]): Record<string, User[]> {
  return users.reduce((acc, user) => {
    const prefixOfUser = prefixes.find((prefix) => userFullName(user).toLowerCase().startsWith(prefix.toLowerCase()));  
    if (prefixOfUser) {
      acc[prefixOfUser] = [user, ...(acc[prefixOfUser] || [])];
    }

    return acc;
  }, {} as Record<string, User[]>);
}

export function flattenUsers(users: Record<string, User[]>): User[] {
  return Object.values(users).flat();
}

