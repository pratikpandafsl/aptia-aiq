import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, LogOut, BookOpen, MessageSquare, FileCheck, LockKeyhole } from "lucide-react";
import { ChatButton as Button } from "./chat-button";
import { useDemoAccess } from "./demo-access";
import { BOT_NAME, getBotInitials } from "../lib/chat-config";
import workplace from "../assets/colleague-workplace.jpg";

const slides = [
  { category: "YOUR COLLEAGUE WORKSPACE", title: BOT_NAME, text: "Scheme knowledge. Clear answers. A little more confidence in every working day.", action: "Open pension assistant" },
  { category: "SCHEME KNOWLEDGE", title: "Pension resources", text: "Explore scheme documents and review the sources behind your member queries.", action: "Explore with AIQ" },
  { category: "MEMBER SUPPORT", title: "Every detail matters", text: "From retirement ages to member benefits, bring your pension questions together in one place.", action: "Start a conversation" },
];
const updates = [
  { scheme: "Weir", title: "Normal pension age", text: "Review scheme-specific retirement ages and the documents used to support member queries.", tag: "Scheme knowledge" },
  { scheme: "JLR", title: "Spouse benefits", text: "Bring together the information needed to review spouse and dependant benefit questions.", tag: "Member support" },
  { scheme: "Colleague resources", title: "Human review checklist", text: "Check member details, effective dates and source references before sharing an answer.", tag: "Good practice" },
];

function PortalBrand() {
  return <div className="portal-brand"><span className="portal-monogram">{getBotInitials()}</span><div><strong>{BOT_NAME}</strong><small>APTIA COLLEAGUE ASSIST</small></div></div>;
}

export function DemoLogin() {
  const { signIn } = useDemoAccess();
  const navigate = useNavigate();
  return <main className="portal login-page"><header className="portal-header"><PortalBrand/><span className="demo-label">Colleague workspace</span></header><div className="login-content"><ShieldCheck className="login-shield" size={46} strokeWidth={1.5}/><p className="portal-eyebrow">APTIA COLLEAGUE ACCESS</p><h1>Welcome back.</h1><p className="login-description">Sign in to your colleague workspace.</p><Button className="portal-primary login-button" onClick={() => { signIn(); void navigate({ to: "/" }); }}><ShieldCheck size={19}/>ZScaler Login<ArrowRight size={18}/></Button><p className="login-demo"><LockKeyhole size={13}/>Demo sign-in · No credentials required</p></div><footer className="login-footer">{BOT_NAME}<span>For Aptia colleagues</span></footer></main>;
}

export function ColleagueHome() {
  const { signOut } = useDemoAccess();
  const navigate = useNavigate();
  const [emblaRef, embla] = useEmblaCarousel({ loop: true });
  const [selected, setSelected] = useState(0);
  const onSelect = useCallback(() => { if (embla) setSelected(embla.selectedScrollSnap()); }, [embla]);
  useEffect(() => { if (!embla) return; onSelect(); embla.on("select", onSelect); return () => { embla.off("select", onSelect); }; }, [embla, onSelect]);
  return <div className="portal"><header className="portal-header"><PortalBrand/><nav aria-label="Main navigation"><Link to="/" aria-current="page">Home</Link><Link to="/aiq">AIQ assistant</Link></nav><Button className="portal-signout" aria-label="Sign out" title="Sign out" onClick={() => { signOut(); void navigate({ to: "/login" }); }}><LogOut size={18}/></Button></header><main><section className="portal-carousel" aria-label="Colleague highlights" aria-roledescription="carousel"><div className="portal-viewport" ref={emblaRef}><div className="portal-slides">{slides.map((slide, index) => <article className="portal-slide" key={slide.title} aria-label={`${index + 1} of ${slides.length}`} aria-hidden={index !== selected}><img src={workplace} alt="Colleagues reviewing pension documents in a bright office"/><div className="portal-slide-copy"><p className="portal-eyebrow">{slide.category}</p><h1>{slide.title}</h1><p>{slide.text}</p><Link to="/aiq" className="portal-primary" tabIndex={index === selected ? 0 : -1}>{slide.action}<ArrowRight size={17}/></Link></div></article>)}</div></div><div className="carousel-controls"><div className="carousel-dots">{slides.map((slide, index) => <Button key={slide.title} aria-label={`Go to slide ${index + 1}`} aria-pressed={selected === index} className={selected === index ? "carousel-dot active" : "carousel-dot"} onClick={() => embla?.scrollTo(index)}/>)}</div><span>{String(selected + 1).padStart(2, "0")} / 03</span><Button className="carousel-arrow" aria-label="Previous slide" title="Previous slide" onClick={() => embla?.scrollPrev()}><ChevronLeft size={19}/></Button><Button className="carousel-arrow" aria-label="Next slide" title="Next slide" onClick={() => embla?.scrollNext()}><ChevronRight size={19}/></Button></div></section><section className="portal-resources"><div className="section-heading"><div><p className="portal-eyebrow">AT A GLANCE</p><h2>Your pension workspace</h2></div><span className="demo-label">Sample updates</span></div><div className="resource-links">{[{ icon: MessageSquare, title: "Ask AIQ", text: "Your pension colleague assistant" }, { icon: BookOpen, title: "Scheme knowledge", text: "Documents and source references" }, { icon: FileCheck, title: "Review an answer", text: "Evidence and validation" }].map(({ icon: Icon, title, text }) => <Link key={title} to="/aiq" className="resource-link"><Icon size={23} strokeWidth={1.6}/><div><strong>{title}</strong><p>{text}</p></div><ArrowRight size={17}/></Link>)}</div><div className="section-heading updates-heading"><h2>Latest knowledge & updates</h2></div><div className="update-grid">{updates.map((update) => <article className="update-card" key={update.title}><span className="portal-eyebrow">{update.scheme}</span><h3>{update.title}</h3><p>{update.text}</p><div><span>{update.tag}</span><Link to="/aiq" aria-label={`Ask AIQ about ${update.title}`}><ArrowRight size={19}/></Link></div></article>)}</div></section></main><footer className="portal-footer"><span>{BOT_NAME} · Colleague workspace</span><span>For human review</span></footer></div>;
}