type ProcessStepProps = { number: string; title: string; description: string };

export const ProcessStep = ({
  number,
  title,
  description,
}: ProcessStepProps) => (
  <article className="processStep">
    <p className="processStepNumber">{number}</p>
    <h3>{title}</h3>
    <p className="processStepDescription">{description}</p>
  </article>
);
