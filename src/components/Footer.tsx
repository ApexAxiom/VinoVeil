type FooterProps = {
  onOpenModal: (content: "Contact" | "Privacy Policy" | "Terms") => void;
};

export const Footer = ({ onOpenModal }: FooterProps) => {
  return (
    <footer className="border-t border-gold/10 bg-black/60">
      <div className="section-container flex flex-col gap-6 text-center text-sm text-parchment/70 md:flex-row md:items-center md:justify-between md:text-left">
        <div>
          <p className="font-serif text-2xl text-gold">VinoVeil</p>
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-parchment/50">Outdoor Cellar Essentials</p>
          <p className="mt-2">© {new Date().getFullYear()} VinoVeil. All rights reserved.</p>
          <p className="text-parchment/60">An ApexAxiom Company.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 text-parchment/80">
          {(["Contact", "Privacy Policy", "Terms"] as const).map((label) => (
            <button key={label} className="transition hover:text-gold" onClick={() => onOpenModal(label)}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
};
