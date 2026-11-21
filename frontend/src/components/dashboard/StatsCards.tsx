interface StatsCardsProps {
  totalBatches: number;
  pending: number;
  approved: number;
  candidates: number;
}

export default function StatsCards({
  totalBatches,
  pending,
  approved,
  candidates,
}: StatsCardsProps) {
  return (
    <div className="stats-grid">
      <div className="stat">
        <div className="stat-label">Total Batches</div>
        <div className="stat-number">{totalBatches}</div>
      </div>

      <div className="stat">
        <div className="stat-label">Pending Workflow</div>
        <div className="stat-number">{pending}</div>
      </div>

      <div className="stat">
        <div className="stat-label">Approved Batches</div>
        <div className="stat-number">{approved}</div>
      </div>

      <div className="stat">
        <div className="stat-label">Candidates</div>
        <div className="stat-number">{candidates}</div>
      </div>
    </div>
  );
}