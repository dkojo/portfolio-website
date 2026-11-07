// Tool name → logo in public/logos. Devicon (full colour) and Simple Icons (brand colour) SVGs.
const file = (name) => `/logos/${name}.svg`

const LOGOS = {
  AWS: file('amazonwebservices'),
  EKS: file('amazonwebservices'),
  Kubernetes: file('kubernetes'),
  OpenShift: file('redhatopenshift'),
  AKS: file('azure'),
  Terraform: file('terraform'),
  Ansible: file('ansible'),
  Chef: file('chef'),
  Docker: file('docker'),
  Podman: file('podman'),
  Helm: file('helm'),
  Jenkins: file('jenkins'),
  'GitLab CI/CD': file('gitlab'),
  'GitHub Actions': file('githubactions'),
  ArgoCD: file('argocd'),
  'Argo CD': file('argocd'),
  Git: file('git'),
  GitOps: file('git'),
  SonarQube: file('sonarqube'),
  Snyk: file('snyk'),
  Datadog: file('datadog'),
  Prometheus: file('prometheus'),
  Grafana: file('grafana'),
  ELK: file('elasticsearch'),
  'ELK Stack': file('elasticsearch'),
  Elasticsearch: file('elasticsearch'),
  Logstash: file('logstash'),
  Kibana: file('kibana'),
  OpenSearch: file('opensearch'),
  Redis: file('redis'),
  Python: file('python'),
  Bash: file('bash'),
  Shell: file('bash'),
  // 80px PNG: the SVG Tux is ~190 KB of path detail for an icon shown at 20px
  Linux: '/logos/linux.png',
  RHEL: file('redhat'),
  CentOS: file('centos'),
  Ubuntu: file('ubuntu'),
  NGINX: file('nginx'),
  '.NET Core': file('dotnetcore'),
  Java: file('java'),
  'Node.js': file('nodejs'),
  Jira: file('jira'),
  Confluence: file('confluence'),
}

export function logoFor(name) {
  if (LOGOS[name]) return LOGOS[name]
  if (/^(AWS|Amazon|Cloud(Watch|Formation))\b/.test(name)) return LOGOS.AWS
  if (/^Linux/.test(name)) return LOGOS.Linux
  return null
}
