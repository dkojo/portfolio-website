import profile from '../data/profile.json'

// The DKM TECH CONSULTANCY logo on its own navy, so its gold reads as intended on light and dark pages
export default function LogoTile({ className = 'size-11 rounded-[10px]', small = false, alt = '' }) {
  const { company } = profile
  return (
    <span className={`block shrink-0 overflow-hidden bg-brand-logo-bg ${className}`}>
      <img
        src={small ? company.logoSmall : company.logo}
        alt={alt}
        width={small ? 264 : 529}
        height={small ? 168 : 337}
        loading="lazy"
        className="size-full object-cover object-[50%_55%]"
      />
    </span>
  )
}
