export type NavIconName = "home" | "lesson" | "practice" | "review" | "conversation" | "settings" | "data" | "diagnostic" | "skills" | "vocabulary" | "rules" | "more";

export function NavIcon({ name }: { name: NavIconName }) {
  const paths = {
    home: <><path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.5V21h13V9.5"/><path d="M9 21v-6h6v6"/></>,
    lesson: <><path d="M5 4.5h10a4 4 0 0 1 4 4V20H9a4 4 0 0 1-4-4Z"/><path d="M9 4.5a4 4 0 0 0-4 4"/><path d="M9 8h6M9 12h6"/></>,
    practice: <><path d="M4 8h16v9H4Z"/><path d="M7 11h2M11 11h2M15 11h2M8 14h8"/></>,
    review: <><path d="M20 7v5h-5"/><path d="M19 12a7.5 7.5 0 1 1-2-5"/></>,
    diagnostic: <><path d="M3 12h4l2-6 4 12 2-6h6"/></>,
    vocabulary: <><path d="M4 6h7M4 11h5"/><path d="M13 18l3.5-9 3.5 9M14.3 15h4.4"/><path d="M5 17l3-3 3 3"/></>,
    rules: <><path d="M5 4.5h11a3 3 0 0 1 3 3V20H8a3 3 0 0 1-3-3Z"/><path d="M5 17a3 3 0 0 1 3-3h11"/><path d="M9 8h6"/></>,
    skills: <><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-8"/><path d="M22 20V7"/><path d="M2 20h20"/></>,
    more: <><circle cx="6" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18" cy="12" r="1.6"/></>,
    conversation: <><path d="M4 5h16v11H9l-5 4Z"/><path d="M8 9h8M8 12h5"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1a8 8 0 0 0-1.8-1L14.4 3h-4.8l-.3 3.1a8 8 0 0 0-1.8 1l-2.4-1-2 3.4L5.2 11a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.4-1a8 8 0 0 0 1.8 1l.3 3.1h4.8l.3-3.1a8 8 0 0 0 1.8-1l2.4 1 2-3.4-2.1-1.5a7 7 0 0 0 .1-1Z"/></>,
    data: <><rect x="3" y="4" width="7" height="12" rx="1.5"/><rect x="14" y="8" width="7" height="12" rx="1.5"/><path d="M10 7h4l-1.5-1.5M14 17h-4l1.5 1.5"/></>
  } as const;
  return <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
