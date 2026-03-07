export interface Role {
  id: string;
  label: string;
  icon: string;
  description: string;
  enabled: boolean;
}

export const ROLES: Role[] = [
  {
    id: "software_engineer",
    label: "Software Engineer",
    icon: "💻",
    description: "Frontend, backend, full-stack development",
    enabled: true,
  },
  {
    id: "it_support",
    label: "IT Support",
    icon: "🖥️",
    description: "Technical support, helpdesk, system administration",
    enabled: true,
  },
  {
    id: "product_manager",
    label: "Product Manager",
    icon: "📋",
    description: "Product strategy, roadmap, stakeholder management",
    enabled: true,
  },
  {
    id: "data_analyst",
    label: "Data Analyst",
    icon: "📊",
    description: "Data analysis, SQL, visualization, reporting",
    enabled: true,
  },
  {
    id: "devops_engineer",
    label: "DevOps Engineer",
    icon: "⚙️",
    description: "CI/CD, cloud infrastructure, Kubernetes, Docker",
    enabled: true,
  },
  {
    id: "ux_designer",
    label: "UX Designer",
    icon: "🎨",
    description: "User research, wireframing, prototyping, Figma",
    enabled: true,
  },
];

export const LEVELS = [
  { id: "junior", label: "Junior", description: "0–2 years experience" },
  { id: "mid", label: "Mid-level", description: "2–5 years experience" },
  { id: "senior", label: "Senior", description: "5+ years experience" },
];

export function getRoleById(id: string): Role | undefined {
  return ROLES.find((r) => r.id === id);
}

export function getRoleLabel(id: string): string {
  return getRoleById(id)?.label ?? id;
}

export function getLevelLabel(id: string): string {
  return LEVELS.find((l) => l.id === id)?.label ?? id;
}
