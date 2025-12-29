import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

export function getGraphData() {
  const nodes: any[] = [{ id: 'root', label: 'Ideal', type: 'root', val: 20, color: '#FF6B6B' }];
  const links: any[] = [];

  // content 폴더가 없으면 빈 데이터 반환 (에러 방지)
  if (!fs.existsSync(contentDirectory)) {
    return { nodes, links };
  }

  const categories = fs.readdirSync(contentDirectory);

  categories.forEach((category) => {
    if (category.startsWith('.')) return;
    const categoryPath = path.join(contentDirectory, category);
    if (!fs.statSync(categoryPath).isDirectory()) return;

    // 카테고리 노드 추가
    nodes.push({
      id: category,
      label: category,
      type: 'category',
      val: 10,
      color: '#4ECDC4'
    });
    links.push({ source: 'root', target: category });

    // 파일 읽기
    const fileNames = fs.readdirSync(categoryPath);
    fileNames.forEach((fileName) => {
      if (!fileName.endsWith('.md')) return;
      
      const id = fileName.replace(/\.md$/, '');
      const fullPath = path.join(categoryPath, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      // 게시물 노드 추가
      nodes.push({
        id: id,
        label: data.title || id,
        type: 'post',
        val: 5,
        color: data.color || '#FFD93D',
        category: category
      });
      links.push({ source: category, target: id });

      // 추가 연결
      if (data.links && Array.isArray(data.links)) {
        data.links.forEach((targetId: string) => {
          links.push({ source: id, target: targetId });
        });
      }
    });
  });

  return { nodes, links };
}