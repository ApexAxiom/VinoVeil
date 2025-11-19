type FooterProps = {
  onOpenModal: (content: "Contact" | "Privacy Policy" | "Terms") => void;
};

export const Footer = ({ onOpenModal }: FooterProps) => {
  return (
    <footer className="border-t border-parchment/10 bg-cocoa/70">
      <div className="section-container flex flex-col items-center gap-4 text-center text-sm text-parchment/70 md:flex-row md:justify-between md:text-left">
        <div>
          <p className="font-serif text-xl text-gold">VinoVeil</p>
          <p>© {new Date().getFullYear()} VinoVeil. All rights reserved.</p>
        </div>
        <div className="flex space-x-6">
          {(["Contact", "Privacy Policy", "Terms"] as const).map((label) => (
            <button key={label} className="text-sm text-parchment/80 hover:text-gold" onClick={() => onOpenModal(label)}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
};
