const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('\n🧪 Testando criação de link de compartilhamento...\n');
  
  // Buscar um projeto
  const project = await prisma.project.findFirst({
    include: {
      _count: {
        select: { videos: true }
      }
    }
  });
  
  if (!project) {
    console.log('❌ Nenhum projeto encontrado!');
    return;
  }
  
  console.log(`📁 Projeto selecionado: ${project.name} (${project._count.videos} vídeos)`);
  
  // Criar link
  const token = crypto.randomUUID();
  const shareLink = await prisma.shareToken.create({
    data: {
      id: crypto.randomUUID(),
      token: token,
      projectId: project.id,
      isActive: true,
      createdBy: project.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  });
  
  console.log('\n✅ Link criado com sucesso!');
  console.log(`   ID: ${shareLink.id}`);
  console.log(`   Token: ${shareLink.token}`);
  console.log(`   URL: http://localhost:3000/shared/${shareLink.token}\n`);
  
  // Testar busca
  const found = await prisma.shareToken.findUnique({
    where: { token: shareLink.token }
  });
  
  if (found) {
    console.log('✅ Link encontrado no banco de dados!');
    console.log(`   Token corresponde: ${found.token === shareLink.token ? 'SIM' : 'NÃO'}\n`);
  } else {
    console.log('❌ Link NÃO foi encontrado no banco!\n');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
