import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker';
import { addUser } from '../src/use-cases/user';
import { CreateUser } from '../src/types/users';

const prisma = new PrismaClient()

async function main() {
    // Generate 100 random users
    const users = Array.from({ length: 100 }).map(() => ({
        name: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: "password",
        about: faker.lorem.paragraph(),
    } as CreateUser));

    for (const user of users) {
        await addUser(user);
    }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })