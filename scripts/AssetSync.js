const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

const SOURCE_DIR = path.join(__dirname, '../posts');
const TARGET_DIR = path.join(__dirname, '../public/posts');
const TRASH_DIR = path.join(TARGET_DIR, "trashcan");

const IGNORE_EXTS = ['.md', '.mdx']; // 복사 안 할 파일
const IGNORE_NAMES = ['.DS_Store', 'Thumbs.db', '_assets']; // _assets 폴더 자체는 복사하되, 그래프 로직과는 별개임

// 파일 하나를 복사하는 함수
function copyFile(srcPath) {
  const relativePath = path.relative(SOURCE_DIR, srcPath);
  const destPath = path.join(TARGET_DIR, relativePath);
  const destDir = path.dirname(destPath);
  const ext = path.extname(srcPath).toLowerCase();

  // 무시할 확장자나 파일이면 스킵
  if (IGNORE_EXTS.includes(ext) || IGNORE_NAMES.includes(path.basename(srcPath))) return;

  // 타겟 폴더가 없으면 생성
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // 파일 복사
  fs.copyFileSync(srcPath, destPath);
  console.log(`[Asset Sync] Copied: ${relativePath}`);
}

function moveToTrash(srcPath){
  const relativePath = path.relative(SOURCE_DIR, srcPath);
  const destPath = path.join(TARGET_DIR, relativePath);

  if (fs.existsSync(destPath)){
    if (!fs.existsSync(TRASH_DIR)){
      fs.mkdirSync(TRASH_DIR, {recursive: true});
    }

    const ext = path.extname(destPath);
    const basename = path.basename(destPath, ext);
    const timestamp = new Date().getTime();
    const trashFilename = `${basename}_${timestamp}${ext}`;
    const trashPath = path.join(TRASH_DIR, trashFilename);
    try {
        fs.renameSync(destPath, trashPath);
        console.log(`[Asset Sync] Moved to Trashcan: ${trashFilename}`);
        
        // (선택사항) 파일이 있던 폴더가 비었으면 폴더도 삭제할지 여부는 생략 (안전성 위해)
    } catch (err) {
        console.error(`[Asset Sync] Failed to move to trash: ${err}`);
    }
  }
}

// 1. 초기 전체 동기화 (기존 로직)
function syncAll() {
  console.log('Performing initial asset sync...');
  // chokidar가 초기 스캔도 해주지만, build 명령어를 위해 수동 스캔 로직을 유지하거나
  // 혹은 단순히 chokidar를 이용해 스캔 후 종료할 수도 있습니다.
  // 여기서는 간단히 Watcher에게 맡기거나, 기존의 재귀 복사 로직을 쓸 수 있지만
  // Watcher가 'add' 이벤트를 처음에도 발생시키므로 Watcher 하나로 통합하는게 깔끔합니다.
}

// 메인 실행 로직
const isWatch = process.argv.includes('--watch');

if (isWatch) {
  console.log('Watching for asset changes...');
  
  // Watch 모드: 파일 추가/수정 시 실시간 반영
  chokidar.watch(SOURCE_DIR, {
    ignored: /(^|[\/\\])\../, // 숨김 파일 무시
    persistent: true,
    ignoreInitial: false, // 처음에 실행될 때도 파일들을 'add'로 인식해서 복사함 (초기 동기화 겸용)
  
    awaitWriteFinish: {
      stabilityThreshold: 500, // 0.5초 동안 파일 크기 변화가 없으면 이벤트 발생
      pollInterval: 100        // 0.1초마다 확인
    }
  
  }).on('all', (event, filePath) => {
    if (event === 'add' || event === 'change') {
      copyFile(filePath);
    }
    if (event === 'unlink') {
      moveToTrash(filePath);
    }
  });

} else {
  // Build 모드: 한 번만 실행하고 종료 (배포용)
  // chokidar를 쓰지 않고 빠르게 스캔만 하고 끝냄
  // (이전의 copyRecursive 함수 로직을 그대로 두거나, 단순화할 수 있습니다.)
  // 여기서는 코드 간결성을 위해 재귀 복사 로직을 살려둡니다.
  console.log('One-time sync for build...');
  
  function copyRecursive(src, dest) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (IGNORE_NAMES.includes(entry.name)) continue;

      if (entry.isDirectory()) {
        copyRecursive(srcPath, destPath);
      } else {
        const ext = path.extname(entry.name).toLowerCase();
        if (!IGNORE_EXTS.includes(ext)) {
          if (!fs.existsSync(destPath) || fs.statSync(srcPath).mtimeMs > fs.statSync(destPath).mtimeMs) {
            fs.copyFileSync(srcPath, destPath);
          }
        }
      }
    }
  }
  copyRecursive(SOURCE_DIR, TARGET_DIR);
  console.log('Asset sync complete!');
}