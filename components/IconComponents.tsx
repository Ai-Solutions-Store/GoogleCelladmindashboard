

import React from 'react';

const iconProps = {
  className: "w-5 h-5",
  strokeWidth: 2,
};

const smallIconProps = {
    className: "w-4 h-4",
    strokeWidth: 2,
};

export const DollarSign = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

export const Rocket = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.3.05-3.11.66-1.76 1.88-3.35 3.48-4.44.64-.45 1.34-.8 2.08-1.07.73-.27 1.49-.4 2.27-.4S18.22 3.65 19 4c1.1.52 2.17 1.22 3.1 2.1.85.79 1.5 1.7 2 2.67.36.7.54 1.47.54 2.23s-.18 1.53-.54 2.23c-.5.97-1.15 1.88-2 2.67-.93.88-2 1.58-3.1 2.1-.8.35-1.6.5-2.4.5s-1.54-.13-2.27-.4c-.74-.27-1.44-.62-2.08-1.07-1.6-1.09-2.82-2.68-3.48-4.44-.65.8-1.1 2.27.05 3.11 1.5 1.77 2 5 2 5s-2.24-1.26-5-2z"></path>
    <path d="M12 12.5a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0-5 0z"></path>
    <path d="m4.5 16.5-3-3"></path>
    <path d="m19.5 7.5 3-3"></path>
  </svg>
);

export const Target = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="6"></circle>
      <circle cx="12" cy="12" r="2"></circle>
    </svg>
);

export const Users = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
);

export const TrendingDown = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
      <polyline points="17 18 23 18 23 12"></polyline>
    </svg>
);

export const Calendar = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
);

export const Aperture = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="14.31" y1="8" x2="20.05" y2="17.94"></line>
        <line x1="9.69" y1="8" x2="21.17" y2="8"></line>
        <line x1="7.38" y1="12" x2="13.12" y2="2.06"></line>
        <line x1="9.69" y1="16" x2="3.95" y2="6.06"></line>
        <line x1="14.31" y1="16" x2="2.83" y2="16"></line>
        <line x1="16.62" y1="12" x2="10.88" y2="21.94"></line>
    </svg>
);

export const LayoutDashboard = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="3" y="3" width="7" height="9"></rect>
        <rect x="14" y="3" width="7" height="5"></rect>
        <rect x="14" y="12" width="7" height="9"></rect>
        <rect x="3" y="16" width="7" height="5"></rect>
    </svg>
);

export const GitHub = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
    </svg>
);

export const Search = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

export const Plus = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

export const Sparkles = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...smallIconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M12 3L9.27 9.27L3 12l6.27 2.73L12 21l2.73-6.27L21 12l-6.27-2.73z" />
    </svg>
);

export const MessageSquare = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
);

export const Send = (props: React.SVGProps<SVGSVGElement>) => (
     <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);

export const Sun = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
);

export const Moon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
);

export const Mic = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        <line x1="12" y1="19" x2="12" y2="23"></line>
    </svg>
);

export const MapPin = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
    </svg>
);

export const Globe = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
);

export const Menu = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
);

export const X = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...iconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

export const ArrowUp = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...smallIconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <line x1="12" y1="19" x2="12" y2="5"></line>
        <polyline points="5 12 12 5 19 12"></polyline>
    </svg>
);

export const ArrowDown = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...smallIconProps} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <polyline points="19 12 12 19 5 12"></polyline>
    </svg>
);