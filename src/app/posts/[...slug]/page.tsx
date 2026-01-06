import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Navbar from "@/components/blog-format/NaviBar";
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { MDX_COMPONENTS } from '@/components/post-format/format-list';
import Link from 'next/link';

// [수정 1] Next.js 15에서는 params가 Promise입니다.
interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

/**
 * 1. 로컬 파일 시스템에서 MD 파일을 찾아 내용을 읽어오는 함수
 */
function getPostContent(slugSegments: string[]) {
  // 방어 코드: slugSegments가 없으면 null 반환
  if (!slugSegments || slugSegments.length === 0) return null;

  const postsDirectory = path.join(process.cwd(), 'posts');
  
  // URL 슬러그 배열을 파일 경로로 변환
  const relativePath = path.join(...slugSegments);
  
  // 1) 해당 경로.md 파일이 있는지 확인
  let fullPath = path.join(postsDirectory, `${relativePath}.md`);
  let fileFormat = 'md'

  if (!fs.existsSync(fullPath)) {
      fullPath = path.join(postsDirectory, `${relativePath}.mdx`);
      let fileFormat = 'mdx'
  }
  
  // 2) 만약 없으면, 혹시 폴더 안의 _index.md 인지 확인
  if (!fs.existsSync(fullPath)) {
      fullPath = path.join(postsDirectory, relativePath, '_index.md');
      let fileFormat = 'md'
      
      if (!fs.existsSync(fullPath)) {
         fullPath = path.join(postsDirectory, relativePath, '_index.mdx');
         let fileFormat = "mdx"
      }
  }

  // 파일이 진짜 없으면 null 반환
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { content, data } = matter(fileContents);

  return { 
    content, 
    frontmatter: data,
    format: fileFormat as 'md' | 'mdx'
  };
}

/**
 * 2. 게시글 상세 페이지 컴포넌트
 */
export default async function PostPage({ params }: PageProps) {
  // [수정 2] 반드시 await를 해야 slug를 꺼낼 수 있습니다.
  const { slug } = await params; 
  
  const post = getPostContent(slug);

  // 파일이 없으면 404 페이지로 이동
  if (!post) {
    return notFound();
  }

  return (
    <article className="min-h-screen bg-white dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 transition-colors">
      <div className="max-w-3xl mx-auto px-6 py-24 animate-in fade-in slide-in-from-bottom-4 duration-500">      
        <Navbar />
        {/* 상단 네비게이션 */}
        <div className="mb-10">
            <Link 
              href="/" 
              className="inline-flex items-center text-sm text-zinc-500 hover:text-blue-500 transition-colors gap-1 group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span> 
              Back to Blog
            </Link>
        </div>

        {/* 헤더 */}
        <header className="mb-12 border-b border-zinc-200 dark:border-zinc-800 pb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-black dark:text-white leading-tight">
            {post.frontmatter.title}
          </h1>
          {post.frontmatter.date && (
            <time className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">
              {post.frontmatter.date}
            </time>
          )}
          {/* 태그가 있다면 표시 */}
          {post.frontmatter.tags && (
            <div className="flex gap-2 mt-4">
              {post.frontmatter.tags.map((tag: string) => (
                <span key={tag} className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md text-zinc-600 dark:text-zinc-400">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* 본문 */}
        <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-blue-500 hover:prose-a:text-blue-400">
          <MDXRemote 
            source={post.content} 
            components={MDX_COMPONENTS}
            options={{
              mdxOptions: {
              format: post.format,
              }
            }}
          />
        </div>
        
      </div>
    </article>
  );
}

export async function generateStaticParams() {
    const postsDirectory = path.join(process.cwd(), 'posts');
    
    function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
      if (!fs.existsSync(dirPath)) return []; // 폴더가 없으면 빈 배열 반환

      const files = fs.readdirSync(dirPath);
      files.forEach((file) => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
          arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else {
            if (/\.mdx?$/.test(file) && !file.startsWith('_')) {
                arrayOfFiles.push(fullPath);
            }
        }
      });
      return arrayOfFiles;
    }

    const files = getAllFiles(postsDirectory);

    return files.map((file) => {
        const relativePath = path.relative(postsDirectory, file);
        const slug = relativePath.replace(/\.mdx?$/, '').split(path.sep);
        return { slug };
    });
}