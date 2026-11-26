import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function stripComments(jsonStr) {
  return jsonStr.replace(/\\"|\\"(?:\\\\"|[^"])*\\"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (match, group) =>
    group ? '' : match
  );
}

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(stripComments(raw));
}

function normalizeBasePath(value) {
  if (!value) return null;
  const withLeading = value.startsWith('/') ? value : `/${value}`;
  return withLeading.endsWith('/') ? withLeading : `${withLeading}/`;
}

async function getBasePath() {
  const arg = process.argv.find((a) => a.startsWith('--base-href='));
  if (arg) {
    const val = arg.split('=')[1];
    return val ? normalizeBasePath(val) : null;
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question('Base-href: ', (answer) => {
      rl.close();
      const trimmed = answer.trim();
      resolve(trimmed ? normalizeBasePath(trimmed) : null);
    });
  });
}

async function getProjectName() {
  const posArg = process.argv[2];
  if (posArg && !posArg.startsWith('--')) {
    return posArg.trim();
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question('Project name: ', (answer) => {
      rl.close();
      const trimmed = answer.trim();
      resolve(trimmed ? trimmed : null);
    });
  });
}

function validateProject(name) {
  const angular = readJson(path.join(rootDir, 'angular.json'));
  if (!angular.projects?.[name]) {
    console.error(`Project "${name}" not found in angular.json`);
    console.error('Available projects:', Object.keys(angular.projects).join(', '));
    process.exit(1);
  }
}

function generateDockerfile(projectName, outDir, basePath) {
  const content = `FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
ARG BASE_HREF=${basePath}
ARG PROJECT_NAME=${projectName}
RUN pnpm build:libs && pnpm exec ng build $PROJECT_NAME --configuration=production --base-href="\${BASE_HREF}"

FROM nginx:1.27-alpine AS runtime
ARG PROJECT_NAME=${projectName}
COPY --from=builder /app/projects/$PROJECT_NAME/docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/$PROJECT_NAME/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
`;
  fs.writeFileSync(path.join(outDir, 'Dockerfile'), content, 'utf8');
}

function generateNginxConf(outDir) {
  // Traefik's StripPrefix removes the base path
  const content = `server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }
    location / {
        try_files $uri \$uri/ /index.html;
    }
    location = /index.html {
        internal;
        try_files /index.html =404;
    }
    server_tokens off;
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
}
`;
  fs.writeFileSync(path.join(outDir, 'nginx.conf'), content, 'utf8');
}

function generateDockerIgnore() {
  const dockerIgnorePath = path.join(rootDir, '.dockerignore');
  if (fs.existsSync(dockerIgnorePath)) return;

  const content = `node_modules
dist
.angular
.vscode
.idea
coverage
__screenshots__
.DS_Store
Thumbs.db
.git
.gitignore
`;
  fs.writeFileSync(dockerIgnorePath, content, 'utf8');
}

async function run() {
  const inputName = await getProjectName();
  const basePath = await getBasePath();

  if (!inputName) {
    console.error('Project name is required.');
    process.exit(1);
  }

  const projectName = inputName.toLowerCase().replace(/\s+/g, '-');
  validateProject(projectName);

  const outDir = path.join(rootDir, 'projects', projectName, 'docker');

  fs.mkdirSync(outDir, { recursive: true });

  generateDockerfile(projectName, outDir, basePath);
  generateNginxConf(outDir);
  generateDockerIgnore();

  console.log(`\nGenerated: projects/${projectName}/docker/`);
}

run();
