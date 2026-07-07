import './CollapsibleFilterPanel.css';

function CollapsibleFilterPanel({
  leftContent,
  rightContent,
  isExpanded,
  children,
}) {
  return (
    <section
      className="collapsible-filter-panel"
      onClick={(event) => event.stopPropagation()}
    >
      <header className="collapsible-filter-header">
        <div className="collapsible-filter-left">{leftContent}</div>
        <div className="collapsible-filter-right">{rightContent}</div>
      </header>

      {isExpanded && (
        <div className="collapsible-filter-body">
          {children}
        </div>
      )}
    </section>
  );
}

export default CollapsibleFilterPanel;