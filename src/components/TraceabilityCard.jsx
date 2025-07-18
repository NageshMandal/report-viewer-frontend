export default function TraceabilityCard({ source }) {
    return (
      <div className="mt-2 pl-4 border-l text-sm">
        <p><strong>{source.origin}</strong>: {source.excerpt}</p>
        <p>Relevance: {Math.round(source.relevanceScore * 100)}%</p>
      </div>
    );
  }
  