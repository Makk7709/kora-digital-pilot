import React from 'react';
import { Button } from '@/components/ui/button';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Gold vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--primary) / 0.4), transparent)' }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-12 py-8 border-b border-border/40">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-3xl tracking-tight text-primary">Korev</span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            AI · Interne
          </span>
        </div>
        <Button
          variant="outline"
          className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground rounded-none px-6 tracking-wider text-xs uppercase"
          onClick={() => (window.location.href = '/app')}
        >
          Entrer
        </Button>
      </header>

      {/* Editorial main */}
      <main className="relative z-10 px-12 py-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-2">
            <p className="text-[10px] uppercase tracking-[0.4em] text-primary/80 md:writing-mode-vertical">
              N°01 — MMXXVI
            </p>
          </div>

          <div className="col-span-12 md:col-span-8">
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground mb-8">
              Édition Interne · Korev
            </p>
            <h1 className="font-display text-6xl md:text-8xl leading-[0.95] text-foreground mb-10">
              L'intelligence
              <br />
              <em className="text-primary not-italic font-normal">éditoriale</em>
              <br />
              d'une marque.
            </h1>
            <div className="w-24 h-px bg-primary mb-10" />
            <p className="font-display italic text-2xl md:text-3xl text-muted-foreground max-w-2xl leading-snug">
              Créer, orchestrer, analyser. Une plateforme confidentielle pour la
              direction éditoriale des marques que Korev accompagne.
            </p>

            <div className="mt-14 flex items-center gap-8">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none px-10 py-6 tracking-[0.2em] text-xs uppercase font-semibold"
                onClick={() => (window.location.href = '/app')}
              >
                Ouvrir l'atelier
              </Button>
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                — Accès réservé
              </span>
            </div>
          </div>

          <div className="col-span-12 md:col-span-2 flex md:justify-end">
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Volume</p>
              <p className="font-display text-4xl text-primary">I</p>
            </div>
          </div>
        </div>

        {/* Chapters */}
        <section className="mt-32 border-t border-border/40 pt-16">
          <p className="text-xs uppercase tracking-[0.4em] text-primary/80 mb-12">Sommaire</p>
          <div className="grid md:grid-cols-4 gap-10">
            <Chapter n="I" title="Rédaction" text="Génération augmentée par l'IA, calibrée à la voix de la marque." />
            <Chapter n="II" title="Orchestration" text="Planning éditorial multi-canal et rythmes de publication." />
            <Chapter n="III" title="Veille" text="Signaux faibles, e-réputation et intelligence concurrentielle." />
            <Chapter n="IV" title="Analyse" text="Métriques P.R.I.S.M et lecture stratégique des performances." />
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-border/40 px-12 py-8 mt-20">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-muted-foreground">
          <span>© MMXXVI · Korev · Confidentiel</span>
          <span className="text-primary">Kora en ligne</span>
        </div>
      </footer>
    </div>
  );
};

const Chapter = ({ n, title, text }: { n: string; title: string; text: string }) => (
  <div className="group">
    <p className="font-display text-primary text-3xl mb-3">{n}</p>
    <h3 className="font-display text-2xl text-foreground mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
  </div>
);

export default Landing;
