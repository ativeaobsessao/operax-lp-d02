import { useEffect, useRef, useState } from 'react'
import { copy, supportUrl } from './copy'

function CtaLink({ className = '' }: { className?: string }) {
  return (
    <a className={`cta-button ${className}`} href={supportUrl} target="_blank" rel="noopener noreferrer">
      {copy.cta}
    </a>
  )
}

function HighlightedText({ children }: { children: string }) {
  const parts = children.split(/(250%|MEGA|DÓLAR|LUCRO GARANTIDO|130%|250%)/g)
  return (
    <>
      {parts.map((part, index) =>
        /^(250%|MEGA|DÓLAR|LUCRO GARANTIDO|130%)$/.test(part) ? (
          <span className="accent" key={`${part}-${index}`}>{part}</span>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        ),
      )}
    </>
  )
}

export default function App() {
  const [showSticky, setShowSticky] = useState(false)
  const heroCtaRef = useRef<HTMLAnchorElement>(null)
  const finalCardRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const heroCta = heroCtaRef.current
    const finalCard = finalCardRef.current
    if (!heroCta || !finalCard) return

    const heroObserver = new IntersectionObserver(([entry]) => setShowSticky(!entry.isIntersecting), { threshold: 0.1 })
    const finalObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setShowSticky(false)
    }, { threshold: 0.15 })

    heroObserver.observe(heroCta)
    finalObserver.observe(finalCard)
    return () => {
      heroObserver.disconnect()
      finalObserver.disconnect()
    }
  }, [])

  return (
    <main className="page-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="content-column">
        <header className="brand-header" aria-label={copy.logo}>
          <span>OPERA</span><strong>X</strong>
        </header>

        <section className="hero-section">
          <h1>{copy.h1}</h1>
          <h2><HighlightedText>{copy.h2}</HighlightedText></h2>
          <CtaLink className="hero-cta" />
        </section>

        <figure className="creative-frame">
          <img src="/criativo-operax.webp" alt={copy.imageAlt} width="1254" height="1254" />
        </figure>

        <section className="copy-card opportunity-card">
          <p className="card-lead"><HighlightedText>{copy.analystHeadline}</HighlightedText></p>
          <p className="card-lead"><HighlightedText>{copy.marketHeadline}</HighlightedText></p>
          <p className="body-copy">{copy.marketBody}</p>
          <p className="body-copy urgency"><HighlightedText>{copy.urgency}</HighlightedText></p>
        </section>

        <section className="copy-card guarantee-card">
          <h3>{copy.guaranteeTitle}</h3>
          <p className="body-copy">{copy.guaranteeBody}</p>
        </section>

        <section className="offers-section" aria-label="Ofertas">
          <div className="offer-list">
            {copy.offers.map((offer, index) => {
              return (
                <article className={`offer-card ${index === copy.offers.length - 1 ? 'featured' : ''}`} key={offer}>
                  <p>{offer}</p>
                </article>
              )
            })}
          </div>
          <div className="highlight-bar"><span>↗</span><p>{copy.warning}</p></div>
        </section>

        <section className="final-card" ref={finalCardRef}>
          <CtaLink />
          <a className="support-url" href={supportUrl} target="_blank" rel="noopener noreferrer">{copy.cta}</a>
        </section>
      </div>

      {showSticky && <div className="sticky-cta"><CtaLink /></div>}
    </main>
  )
}
