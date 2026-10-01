export default function Dialog({ isOpen, title, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <section className="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title" onClick={event => event.stopPropagation()}>
        <div className="dialog-header"><h2 id="dialog-title">{title}</h2><button className="close-button" onClick={onClose} aria-label="Zamknij">×</button></div>
        {children}
      </section>
    </div>
  );
}
