import { Link } from 'react-router-dom';

export default function Logo({ size = 'md', showTagline = false, className = '' }) {
  const sizes = {
    sm: { img: 'h-9 w-9', tagline: 'text-[10px]' },
    md: { img: 'h-11 w-11', tagline: 'text-[11px]' },
    lg: { img: 'h-14 w-14', tagline: 'text-xs' },
    xl: { img: 'h-28 w-28', tagline: 'text-sm' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src="/logo.png"
        alt="Simu1"
        className={`${s.img} object-contain shrink-0`}
      />
      {showTagline && (
        <p className={`${s.tagline} text-slate-500 font-body tracking-wide hidden sm:block leading-tight`}>
          Smartphones &amp; Accessories
        </p>
      )}
    </div>
  );
}

export function LogoLink({ to = '/', size = 'md', showTagline = false, className = '' }) {
  return (
    <Link to={to} className={`inline-flex shrink-0 ${className}`}>
      <Logo size={size} showTagline={showTagline} />
    </Link>
  );
}
