import { Link } from 'react-router'

// The purple "start a conversation" block that closes most pages
export default function CtaBand({ title, text, action = 'Start a conversation' }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-7 rounded-[28px] bg-accent p-8 text-accent-ink sm:p-14">
      <div className="flex max-w-[640px] flex-col gap-2.5">
        <h2 className="m-0 text-[clamp(1.8rem,3.4vw,2.4rem)] leading-[1.1] font-extrabold tracking-[-0.025em]">{title}</h2>
        {text && <p className="m-0 text-[17.5px] opacity-90">{text}</p>}
      </div>
      <Link to="/contact" className="btn btn-lg bg-bg text-accent hover:brightness-105">{action}</Link>
    </div>
  )
}
