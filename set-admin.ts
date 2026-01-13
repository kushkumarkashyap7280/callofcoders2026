import prisma from './lib/prisma'

async function setAdminUser(email: string) {
  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.log(`❌ User with email ${email} not found`)
      return
    }

    // Update user to be admin
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { isAdmin: true }
    })

    console.log(`✅ Successfully set ${email} as admin`)
    console.log('User details:', {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      isAdmin: updatedUser.isAdmin
    })
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Get email from command line argument
const adminEmail = process.argv[2]

if (!adminEmail) {
  console.log('Usage: tsx set-admin.ts <admin-email>')
  console.log('Example: tsx set-admin.ts admin@example.com')
  process.exit(1)
}

setAdminUser(adminEmail)
