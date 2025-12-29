import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

export function getGraphData() {
  // 1. 루트 노드 정의
  const nodes = [{ id: 'root', label: 'Ideal', type: 'root', val: 20, color: '#FF6B6B' }];
  const links = [];

  // 2. content 폴더 내의 대분류(디렉토리) 읽기
  const categories = fs.readdirSync(contentDirectory);

  categories.forEach((category) => {
    // .DS_Store 등 숨김 파일 제외
    if (category.startsWith('.')) return;

    const categoryPath = path.join(contentDirectory, category);
    
    // 폴더가 아니면 스킵
    if (!fs.statSync(categoryPath).isDirectory()) return;

    // 대분류 노드 추가
    nodes.push({
      id: category,
      label: category,
      type: 'category',
      val: 10,
      color: '#4ECDC4' // 청록색
    });

    // 루트 -> 대분류 연결
    links.push({ source: 'root', target: category });

    // 3. 해당 카테고리 안의 게시물(.md) 읽기
    const fileNames = fs.readdirSync(categoryPath);

    fileNames.forEach((fileName) => {
      if (!fileName.endsWith('.md')) return;

      const id = fileName.replace(/\.md$/, ''); // 파일명이 곧 ID
      const fullPath = path.join(categoryPath, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // matter로 메타데이터(data)와 본문(content) 분리
      const { data, content } = matter(fileContents);

      // 게시물 노드 추가
      nodes.push({
        id: id,
        label: data.title || id, // Frontmatter에 title이 없으면 파일명 사용
        type: 'post',
        val: 5,
        color: data.color || '#FFD93D', // 사용자 지정 색상 가능
        content: content, // 본문 내용
        category: category
      });

      // 대분류 -> 게시물 연결
      links.push({ source: category, target: id });

      // 4. (고급) 게시물 간의 연결 (Frontmatter에 'links' 리스트가 있다면)
      if (data.links && Array.isArray(data.links)) {
        data.links.forEach((targetId) => {
          links.push({ source: id, target: targetId });
        });
      }
    });
  });

  return { nodes, links };
}