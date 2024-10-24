import { capitalizeLastName, capitalizeLastNameInUsers, groupUsersByPrefix, filterUsersByPrefix, orderUsersByName, userFullName, flattenUsers, getUsersWithFilter } from '../src/utils/users';
import { User } from '@prisma/client';
import { expect } from '@jest/globals';


describe('User Utils', () => {
  describe('#capitalizeLastName', () => {
    it('should capitalize the first letter of the last name', () => {
      const user: User = { id: "test", name: 'John', lastName: 'doe', about: "", createdAt: new Date(), email: "", encryptedPassword: "", updatedAt: new Date() };
      
      const result = capitalizeLastName(user);
      
      expect(result.lastName).toBe('Doe');
    });

    it('should capitalize the first letter of the last name with special characters', () => {
      const user: User = { id: "test", name: 'John', lastName: 'áoe', about: "", createdAt: new Date(), email: "", encryptedPassword: "", updatedAt: new Date() };
      
      const result = capitalizeLastName(user);
      
      expect(result.lastName).toBe('Áoe');
    });

    it('should return the user unchanged if last name is not present', () => {
      const user: User = { id: "test", name: 'John', lastName: '', about: "", createdAt: new Date(), email: "", encryptedPassword: "", updatedAt: new Date() };
      
      const result = capitalizeLastName(user);
      
      expect(result).toEqual(user);
    });

    it('should return the user unchanged if last name is already capitalized', () => {
      const user: User = { id: "test", name: 'John', lastName: 'Doe', about: "", createdAt: new Date(), email: "", encryptedPassword: "", updatedAt: new Date() };
      
      const result = capitalizeLastName(user);
      
      expect(result).toEqual(user);
    });

    it('should not modify the original user', () => {
      const user: User = { id: "test", name: 'John', lastName: 'doe', about: "", createdAt: new Date(), email: "", encryptedPassword: "", updatedAt: new Date() };
      const originalUser = structuredClone(user);

      capitalizeLastName(user);

      expect(user).toEqual(originalUser);
    });
  });


  describe('#userFullName', () => {
    it('should return the full name of the user', () => {
      const user: User = {
        id: "test",
        name: 'John',
        lastName: 'Doe',
        about: "",
        createdAt: new Date(),
        email: "",
        encryptedPassword: "",
        updatedAt: new Date()
      };

      const result = userFullName(user);

      expect(result).toBe('John Doe');
    });

    it('should return the first name if last name is not present', () => {
      const user: User = {
        id: "test",
        name: 'John',
        lastName: '',
        about: "",
        createdAt: new Date(),
        email: "",
        encryptedPassword: "",
        updatedAt: new Date()
      };

      const result = userFullName(user);

      expect(result).toBe('John');
    });

    it('should return the last name if first name is not present', () => {
      const user: User = {
        id: "test",
        name: '',
        lastName: 'Doe',
        about: "",
        createdAt: new Date(),
        email: "",
        encryptedPassword: "",
        updatedAt: new Date()
      };

      const result = userFullName(user);

      expect(result).toBe('Doe');
    });

    it('should return an empty string if both first and last name are not present', () => {
      const user: User = {
        id: "test",
        name: '',
        lastName: '',
        about: "",
        createdAt: new Date(),
        email: "",
        encryptedPassword: "",
        updatedAt: new Date()
      };

      const result = userFullName(user);

      expect(result).toBe('');
    });
  });


  describe('#getUsersWithFilter', ()=>{
    const users: User[] = [ 
      { id: "test", name: 'John', lastName: 'Doe', about: "", createdAt: new Date(), email: "", encryptedPassword: "", updatedAt: new Date() },
      { id: "test", name: 'Alice', lastName: 'smith', about: "", createdAt: new Date(), email: "", encryptedPassword: "", updatedAt: new Date() },
      { id: "test", name: 'Carlos', lastName: 'Martinez', about: "", createdAt: new Date(), email: "", encryptedPassword: "", updatedAt: new Date() },
      { id: "test", name: 'Bob', lastName: 'Smith', about: "", createdAt: new Date(), email: "", encryptedPassword: "", updatedAt: new Date() }
    ];

    it('should return all users if no filter is provided', ()=>{
      const res = getUsersWithFilter(users, undefined);
    
      expect(res).toEqual(users);
    });

    it('should return all users ordered alphabetically by name with capitalized last names', ()=>{
      const res = getUsersWithFilter(users, 'alphabetical');

      const names = ['Alice', 'Bob', 'Carlos', 'John'];
      
      if(!Array.isArray(res)) throw new Error('Expected array');

      expect(Array.isArray(res)).toBe(true);
      expect(names).toEqual(res.map(user => user.name));
    });

    it('should return all users grouped by prefix', ()=>{
      const res = getUsersWithFilter(users, 'withPrefix');

      const prefixes = ['a', 'b', 'c'];

      if(Array.isArray(res)) throw new Error('Expected record');

      expect(Object.keys(res).sort((a, b)=> a.localeCompare(b))).toEqual(prefixes);
    });
  })

  describe('#orderUsersByName', () => {
    const users: User[] = [ 
      { id: "test", name: 'John', lastName: 'Doe', about: "", createdAt: new Date(), email: "", encryptedPassword: "", updatedAt: new Date() },
      { id: "test", name: 'Alice', lastName: 'Smith', about: "", createdAt: new Date(), email: "", encryptedPassword: "", updatedAt: new Date() },
      { id: "test", name: 'Bob', lastName: 'Smith', about: "", createdAt: new Date(), email: "", encryptedPassword: "", updatedAt: new Date() }
    ];

    it('should order users by full name in descendent order', () => {
      const result = orderUsersByName(users);

      expect(result[2].name).toBe('John');
      expect(result[1].name).toBe('Bob');
      expect(result[0].name).toBe('Alice');
    });

    it('should not modify the original array', () => {
      const originalUsers = structuredClone(users);

      orderUsersByName(users);

      expect(users).toEqual(originalUsers);
    });

    it('should return an empty array if the input is empty', () => {
      const result = orderUsersByName([]);

      expect(result).toEqual([]);
    });
  });

  describe('#capitalizeLastNameInUsers', () => {
    it('should capitalize the first letter of the last name', () => {
      const users: User[] = [
        { id: "test", name: 'John', lastName: 'doe', about: "", createdAt: new Date(), email: "", encryptedPassword: "", updatedAt: new Date() },
        { id: "test", name: 'Alice', lastName: 'smith', about: "", createdAt: new Date(), email: "", encryptedPassword: "", updatedAt: new Date() },
      ];

      const result = capitalizeLastNameInUsers(users);

      expect(result[0].lastName).toBe('Doe');
      expect(result[1].lastName).toBe('Smith');
    });
 
    it('should not modify the original array', () => {
      const users: User[] = [
        { id: "test", name: 'John', lastName: 'doe', about: "", createdAt: new Date(), email: "", encryptedPassword: "", updatedAt: new Date() },
        { id: "test", name: 'Alice', lastName: 'smith', about: "", createdAt: new Date(), email: "", encryptedPassword: "", updatedAt: new Date() },
      ];
      const originalUsers = structuredClone(users);

      capitalizeLastNameInUsers(users);

      expect(users).toEqual(originalUsers);
    });
  });


  describe('#filterUsersByPrefix', () => {
    const users: User[] = [
      { id: "test", name: 'John', lastName: 'Doe', about: "", createdAt: new Date(), email: "", encryptedPassword: "", updatedAt: new Date() },
      { id: "test", name: 'Alice', lastName: 'Smith', about: "", createdAt: new Date(), email: "", encryptedPassword: "", updatedAt: new Date() },
      { id: "test", name: 'Bob', lastName: 'Smith', about: "", createdAt: new Date(), email: "", encryptedPassword: "", updatedAt: new Date() }
    ];

    it('should return the users whose full name starts with the prefix', () => {
      const result = filterUsersByPrefix(users, 'a');

      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Alice');
    });

    it('should return an empty array if no user matches the prefix', () => {
      const result = filterUsersByPrefix(users, 'z');

      expect(result).toEqual([]);
    });

    it('should not modify the original array', () => {
      const originalUsers = structuredClone(users);

      filterUsersByPrefix(users, 'a');

      expect(users).toEqual(originalUsers);
    });
  });

  describe('#filterByNPrefixes', () => {
      const users: User[] = [
        { id: "test", name: 'John', lastName: 'Doe', about: "", createdAt: new Date(), email: "", encryptedPassword: "", updatedAt: new Date() },
        { id: "test", name: 'Alice', lastName: 'Smith', about: "", createdAt: new Date(), email: "", encryptedPassword: "", updatedAt: new Date() },
        { id: "test", name: 'Bob', lastName: 'Smith', about: "", createdAt: new Date(), email: "", encryptedPassword: "", updatedAt: new Date() }
      ];

      it('should return the users whose full name starts with any of the given prefixes', () => {
        const result = groupUsersByPrefix(users, ['a', 'j']);

        expect(Object.keys(result).length).toBe(2);
        expect(result['j'].length).toBe(1);
        expect(result['a'].length).toBe(1);
      });

      it('should return an empty object if no user matches any of the prefixes', () => {
        const result = groupUsersByPrefix(users, ['z', 'x']);

        expect(result).toEqual({});
      });

      it('should not modify the original array', () => {
        const originalUsers = structuredClone(users);

        groupUsersByPrefix(users, ['a', 'j']);

        expect(users).toEqual(originalUsers);
      });

      it('should be case insensitive', () => {
        const result = groupUsersByPrefix(users, ['A', 'J']);

        expect(Object.keys(result).length).toBe(2);
        expect(result['J'].length).toBe(1);
        expect(result['A'].length).toBe(1);
      });
    });

    describe('#flattenUsers', () => {
      it('should return an array with all the users not grouped', () => {
        const users: Record<string, User[]> = {
          'j': [
            { id: "test", name: 'John', lastName: 'Doe', about: "", createdAt: new Date(), email: "", encryptedPassword: "", updatedAt: new Date() }
          ],
          'a': [
            { id: "test", name: 'Alice', lastName: 'Smith', about: "", createdAt: new Date(), email: "", encryptedPassword: "", updatedAt: new Date() }
          ]
        };

        const result = flattenUsers(users);

        expect(result.length).toBe(2);
        expect(result[0].name).toBe('John');
        expect(result[1].name).toBe('Alice');
      });

      it('should return an empty array if the input is empty', () => {
        const result = flattenUsers({});

        expect(result).toEqual([]);
      });

      it('should not modify the original object', () => {
        const users: Record<string, User[]> = {
          'j': [
            { id: "test", name: 'John', lastName: 'Doe', about: "", createdAt: new Date(), email: "", encryptedPassword: "", updatedAt: new Date() }
          ],
          'a': [
            { id: "test", name: 'Alice', lastName: 'Smith', about: "", createdAt: new Date(), email: "", encryptedPassword: "", updatedAt: new Date() }
          ]
        };
        const originalUsers = structuredClone(users);

        flattenUsers(users);

        expect(users).toEqual(originalUsers);
      });
    });
  });
