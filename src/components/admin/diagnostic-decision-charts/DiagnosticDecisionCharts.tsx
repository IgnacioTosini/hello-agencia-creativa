import type { DiagnosticAnalytics, DiagnosticStep } from "@/types/diagnostic";
import "./_diagnostic-decision-charts.scss";

type DiagnosticDecisionChartsProps = {
  steps: DiagnosticStep[];
  analytics: DiagnosticAnalytics;
  isLoading: boolean;
  error: string | null;
};

type DecisionItem = {
  label: string;
  value: string;
  count: number;
  percentage: number;
  color: string;
};

const chartColors = [
  "#6445df",
  "#00bbae",
  "#a891ff",
  "#ff9f68",
  "#2b493c",
  "#7e8ca4",
  "#e1306c",
];

const getChartBackground = (items: DecisionItem[]) => {
  if (items.every((item) => item.count === 0)) {
    return "conic-gradient(#e5e8f1 0deg 360deg)";
  }

  let accumulatedPercentage = 0;
  const segments = items
    .filter((item) => item.count > 0)
    .map((item) => {
      const start = accumulatedPercentage;
      accumulatedPercentage += item.percentage;

      return `${item.color} ${start}% ${accumulatedPercentage}%`;
    });

  return `conic-gradient(${segments.join(", ")})`;
};

export function DiagnosticDecisionCharts({
  steps,
  analytics,
  isLoading,
  error,
}: DiagnosticDecisionChartsProps) {
  return (
    <section className="diagnosticDecisionCharts">
      <header>
        <div>
          <p>Comportamiento del diagnóstico</p>
          <h2>Decisiones por pregunta</h2>
          <span>
            La distribución se calcula con las respuestas reales enviadas por
            los usuarios.
          </span>
        </div>
        <strong>
          {analytics.totalSubmissions}
          <small> diagnósticos completados</small>
        </strong>
      </header>

      {isLoading && (
        <p className="diagnosticDecisionChartsMessage">
          Calculando respuestas…
        </p>
      )}

      {!isLoading && error && (
        <p className="diagnosticDecisionChartsMessage">{error}</p>
      )}

      {!isLoading && !error && (
        <div className="diagnosticDecisionChartsGrid">
          {steps.map((step) => {
            const answerCounts = new Map(
              (analytics.answersByStep[step.key] ?? []).map((item) => [
                item.value,
                item.count,
              ]),
            );

            const knownValues = new Set(
              step.answers.map((answer) => answer.value),
            );
            const unknownCount = [...answerCounts.entries()].reduce(
              (total, [value, count]) =>
                knownValues.has(value) ? total : total + count,
              0,
            );
            const totalAnswers = [...answerCounts.values()].reduce(
              (total, count) => total + count,
              0,
            );
            const answerOptions = [
              ...step.answers.map((answer) => ({
                label: answer.label,
                value: answer.value,
                count: answerCounts.get(answer.value) ?? 0,
              })),
              ...(unknownCount > 0
                ? [
                    {
                      label: "Opciones anteriores o eliminadas",
                      value: "unknown",
                      count: unknownCount,
                    },
                  ]
                : []),
            ];
            const decisionItems = answerOptions.map((answer, index) => ({
              ...answer,
              percentage:
                totalAnswers === 0
                  ? 0
                  : Number(((answer.count / totalAnswers) * 100).toFixed(1)),
              color: chartColors[index % chartColors.length],
            }));

            return (
              <article key={step.id}>
                <div className="diagnosticDecisionChartHeading">
                  <span>{step.key}</span>
                  <h3>{step.question}</h3>
                  <p>
                    {totalAnswers}{" "}
                    {totalAnswers === 1 ? "respuesta" : "respuestas"}
                  </p>
                </div>

                <div className="diagnosticDecisionChartBody">
                  <div
                    className="diagnosticDecisionPie"
                    role="img"
                    aria-label={`Distribución de respuestas para ${step.question}`}
                    style={{ background: getChartBackground(decisionItems) }}
                  >
                    <span>
                      <strong>{totalAnswers}</strong>
                      total
                    </span>
                  </div>

                  <ul>
                    {decisionItems.map((item) => (
                      <li key={item.value}>
                        <i style={{ backgroundColor: item.color }} />
                        <span>{item.label}</span>
                        <strong>
                          {item.count} · {item.percentage}%
                        </strong>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}

          {steps.length === 0 && (
            <p className="diagnosticDecisionChartsMessage">
              Creá una pregunta para comenzar a medir las decisiones.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
