import { User } from "@prisma/client";
import { capitalizeLastNameInUsers, groupUsersByPrefix, orderUsersByName } from "./users";

export function getUsersWithFilter(users: User[], appliedFilter?: string): User[] | Record<string, User[]> {
    const filters: Record<string, (users: User[])=>User[] | Record<string, User[]>> = {
      "alphabetical": (users: User[])=> capitalizeLastNameInUsers(orderUsersByName(users)),
      "withPrefix": (users: User[]) => groupUsersByPrefix(users, ["a", "b", "c"]),
    }
  
    return appliedFilter ? filters[appliedFilter](users) : users;
}