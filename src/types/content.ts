export type NavItem = {
  label: string;
  href: string;
};

export type StatItem = {
  value: number;
  suffix: string;
  label: string;
  description: string;
};

export type ServiceItem = {
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  tags: string[];
};

export type RouteNode = {
  city: string;
  country: string;
  lat: number;
  lon: number;
  description: string;
};
