// src/lib/graph-data.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// ... (인터페이스 정의는 기존과 동일) ...
export interface PostSummary {
  id: string;
  title: string;
  slug: string;
  date?: string;
  path: string; 
}

export interface GraphNode {
  id: string;
  name: string;
  group: string;
  level: number;
  val: number;
  type: 'root' | 'category';
  posts: PostSummary[];
  color?: string;
  description?: string;
  contents? : string;
  order?: number;
  fx?: number;
  fy?: number;
}

export interface GraphLink {
  source: string;
  target: string;
  group: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

const POSTS_DIR = path.join(process.cwd(), 'posts');

export async function getGraphData(): Promise<GraphData> {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];

  // 1. Root 노드를 먼저 생성해서 배열에 넣습니다.
  const rootNode: GraphNode = { 
    id: 'root', 
    name: 'Ideal', 
    group: 'root',
    val: 40, 
    type: 'root',
    level: 0,
    description: 'Ideal Blog',
    posts: [] // 빈 장바구니 준비
  };
  nodes.push(rootNode);

  // 2. 통합된 순회 함수 (parentNode를 인자로 받습니다)
  function traverse(currentPath: string, parentNode: GraphNode, level: number, currentPathSegments: string[] = []) {
    if (!fs.existsSync(currentPath)) return;
    
    const items = fs.readdirSync(currentPath);

    items.forEach((item) => {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);

      // [CASE 1] 파일인 경우 -> 부모 노드의 posts에 추가 (Root 포함 모든 레벨 공통)
      if (!stat.isDirectory() && /\.mdx?$/.test(item) && !item.startsWith('_index.')) {
        const fileContent = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContent);
        const slug = item.replace(/\.mdx?$/, '');
        
        // 경로 생성 로직: Root 바로 아래면 /posts/slug, 아니면 /posts/category/slug
        const linkPath = `/posts/${[...currentPathSegments, slug].join('/')}`;

        parentNode.posts.push({
          id: slug,
          title: data.title || slug,
          slug: slug,
          date: data.date,
          path: linkPath
        });
      }
      
      // [CASE 2] 디렉토리인 경우 -> 새 노드 생성 후 재귀
      else if (stat.isDirectory()) {
        if (item.startsWith('.') || item.startsWith('_')){
          return;
        } 

        const indexFile = ['_index.mdx', '_index.md'].find(ext => fs.existsSync(path.join(fullPath, ext)));
        const indexPath = indexFile ? path.join(fullPath, indexFile) : null;
        
        let popupDescription = "";

        // 새 노드 데이터 초기화
        let newNode: GraphNode = {
          id: item, // 폴더명을 ID로 사용
          name: item,
          group: parentNode.group === 'root' ? item.toLowerCase() : parentNode.group, // Root 자식이면 새 그룹 시작, 아니면 부모 그룹 상속
          val: level === 1 ? 25 : 15,
          type: 'category',
          level: level,
          posts: [], // 자식 노드도 자기만의 장바구니를 가짐
          order: 99
        };

        // _index.md(mdx) 메타데이터 파싱
        if (indexPath) {
          const fileContent = fs.readFileSync(indexPath, 'utf8');
          const { data, content } = matter(fileContent);
          
          if (data.title) newNode.name = data.title || item;
          if (data.color) newNode.color = data.color;
          if (data.description) newNode.description = data.description;
          if (data.order) newNode.order = data.order;

          newNode.contents = content;
          popupDescription = data.description || content.slice(0,150);
        }
        
        newNode = {
          ...newNode,
          description: popupDescription
        }

        // 노드 추가 & 링크 연결
        nodes.push(newNode);
        links.push({ 
          source: parentNode.id, 
          target: newNode.id, 
          group: newNode.group 
        });
        
        // [재귀 호출] 이제 이 newNode가 다음 파일들의 parentNode가 됩니다.
        const nextPathSegments = [...currentPathSegments, newNode.id];
        traverse(fullPath, newNode, level + 1, nextPathSegments);
      }
    });
  }

  // 3. Root 노드를 기준으로 순회 시작
  // 별도의 Root 파일 스캔 로직 없이, traverse 한 번으로 끝냅니다.
  traverse(POSTS_DIR, rootNode, 1, []);

  return { nodes, links };
}