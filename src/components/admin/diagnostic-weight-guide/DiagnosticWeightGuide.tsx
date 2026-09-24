import "./_diagnostic-weight-guide.scss";

type DiagnosticWeightGuideProps = {
  className?: string;
};

const weightRows = [
  { weight: 1, influence: "Mínima", use: "Solo ayuda a desempatar." },
  { weight: 2, influence: "Baja", use: "Aporta contexto secundario." },
  {
    weight: 3,
    influence: "Media",
    use: "Tiene una influencia equilibrada.",
  },
  {
    weight: 4,
    influence: "Alta",
    use: "Orienta fuertemente el resultado.",
  },
  {
    weight: 5,
    influence: "Decisiva",
    use: "Debe dominar la recomendación.",
  },
];

export const DiagnosticWeightGuide = ({
  className = "",
}: DiagnosticWeightGuideProps) => (
  <section className={`diagnosticWeightGuide ${className}`.trim()}>
    <div className="diagnosticWeightGuideCopy">
      <h2>¿Cómo funcionan los pesos?</h2>
      <p>
        Cada respuesta suma puntos al servicio asociado. Al terminar, se
        recomienda el servicio con mayor puntaje acumulado.
      </p>
    </div>

    <div className="diagnosticWeightTable" role="table">
      <div role="row">
        <strong role="columnheader">Peso</strong>
        <strong role="columnheader">Influencia</strong>
        <strong role="columnheader">Cuándo usarlo</strong>
      </div>

      {weightRows.map((row) => (
        <div role="row" key={row.weight}>
          <b role="cell">{row.weight}</b>
          <span role="cell">{row.influence}</span>
          <span role="cell">{row.use}</span>
        </div>
      ))}
    </div>

    <small>
      Si dos servicios terminan con el mismo puntaje, se prioriza el que tenga
      menor orden en Servicios.
    </small>
  </section>
);
