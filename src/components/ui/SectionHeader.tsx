import "./_section-header.scss";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  titleId?: string;
  action?: { label: string; href: string };
};

export const SectionHeader = ({
  eyebrow,
  title,
  titleId,
  action,
}: SectionHeaderProps) => (
  <div className="sectionHeader">
    <div>
      <p className="sectionEyebrow">{eyebrow}</p>
      <h2 id={titleId}>{title}</h2>
    </div>
    {action && (
      <a className="sectionHeaderAction" href={action.href}>
        {action.label}
        <span aria-hidden="true">→</span>
      </a>
    )}
  </div>
);
