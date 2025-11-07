const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('\n🔍 Verificando links de compartilhamento...\n');
  
  // Verificar projetos
  const projects = await prisma.project.findMany({
    include: {
      _count: {
        select: { videos: true }
      }
    }
  });
  
  console.log('📁 Projetos encontrados:', projects.length);
  projects.forEach(p => {
    console.log(`  - ${p.name} (${p._count.videos} vídeos)`);
  });
  
  // Verificar links de compartilhamento
  const shareLinks = await prisma.shareToken.findMany({
    include: {
      project: {
        select: {
          name: true
        }
      }
    }
  });
  
  console.log('\n🔗 Links de compartilhamento encontrados:', shareLinks.length);
  shareLinks.forEach(link => {
    const isExpired = link.expiresAt && new Date(link.expiresAt) < new Date();
    const status = link.isActive && !isExpired ? '✅ Ativo' : '❌ Inválido';
    console.log(`  ${status} - Projeto: ${link.project.name}`);
    console.log(`     Token: ${link.token}`);
    console.log(`     URL: http://localhost:3000/shared/${link.token}`);
    console.log(`     Expira: ${link.expiresAt || 'Nunca'}`);
    console.log('');
  });
  
  // Se não houver links e houver projetos, criar um
  if (shareLinks.length === 0 && projects.length > 0) {
    console.log('💡 Criando link de teste para o primeiro projeto...\n');
    
    const testLink = await prisma.shareToken.create({
      data: {
        token: `share_${Date.now()}_test`,
        projectId: projects[0].id,
        isActive: true,
        createdBy: projects[0].userId,
      }
    });
    
    console.log('✅ Link criado com sucesso!');
    console.log(`   URL: http://localhost:3000/shared/${testLink.token}\n`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
