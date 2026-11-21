import { useState } from "react";
import type { Batch, User } from "../../types";
import CandidateUpload, {
  type CandidateInput,
} from "./CandidateUpload";

interface BatchListProps {
  batches: Batch[];
  user: User;
  onRefresh: () => void;
  onSubmit: (batchId: string) => void;
  onApprove: (batchId: string) => void;
  onIssue: (batchId: string) => void;
  onCancelBatch: (batchId: string) => void;
  onImportCandidates: (
    batchId: string,
    candidates: CandidateInput[]
  ) => Promise<void>;
}

export default function BatchList({
  batches,
  user,
  onRefresh,
  onSubmit,
  onApprove,
  onIssue,
  onCancelBatch,
  onImportCandidates,
}: BatchListProps) {
  const [uploadBatchId, setUploadBatchId] =
    useState<string | null>(null);

  const isDistrictApproved = (status: string) =>
    ["QUALITY_REVIEW", "STATE_APPROVAL", "APPROVED"].includes(
      status
    );

  const isQualityApproved = (status: string) =>
    ["STATE_APPROVAL", "APPROVED"].includes(status);

  const isStateApproved = (status: string) =>
    status === "APPROVED";

  return (
    <section className="card">
      <div className="section-heading">
        <div>
          <h2>Batch Workflow</h2>
          <p>Track and manage batches</p>
        </div>

        <button className="secondary" onClick={onRefresh}>
          ↻ Refresh
        </button>
      </div>

      {batches.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">▤</div>
          <h3>No batches found</h3>
          <p>Create your first batch to get started.</p>
        </div>
      ) : (
        <div className="batch-list">
          {batches.map((batch) => {
            const isUploadOpen =
              uploadBatchId === batch.id;

            const status = batch.status;

            const districtApproved =
              isDistrictApproved(status);

            const qualityApproved =
              isQualityApproved(status);

            const stateApproved =
              isStateApproved(status);

            return (
              <div className="batch-card" key={batch.id}>
                <div className="batch-row">
                  <div className="batch-details">
                    <h3>{batch.name}</h3>

                    <p>{batch.batchNumber}</p>

                    <span>
                      {batch.candidateCount || 0} candidates
                    </span>
                  </div>

                  <div className="batch-controls">
                    <span
                      className={`badge ${status.toLowerCase()}`}
                    >
                      {status.replace(/_/g, " ")}
                    </span>

                    {/* TRAINING CENTRE */}
                    {user.role === "TRAINING_CENTRE" &&
                      status === "DRAFT" && (
                        <>
                          <button
                            className="secondary"
                            onClick={() =>
                              setUploadBatchId(
                                isUploadOpen
                                  ? null
                                  : batch.id
                              )
                            }
                          >
                            {isUploadOpen
                              ? "Close Upload"
                              : "📄 Upload Candidates"}
                          </button>

                          <button
                            disabled={
                              (batch.candidateCount || 0) === 0
                            }
                            onClick={() => onSubmit(batch.id)}
                          >
                            Submit
                          </button>
                        </>
                      )}

                    {/* DISTRICT OFFICER */}
                    {user.role === "DISTRICT_OFFICER" && (
                      <>
                        {status === "DISTRICT_APPROVAL" && (
                          <button
                            onClick={() => onApprove(batch.id)}
                          >
                            Approve
                          </button>
                        )}

                        {districtApproved && (
                          <span className="approval-status">
                            ✓ District Approved
                          </span>
                        )}
                      </>
                    )}

                    {/* QUALITY OFFICER */}
                    {user.role === "QUALITY_OFFICER" && (
                      <>
                        {status === "QUALITY_REVIEW" && (
                          <button
                            onClick={() => onApprove(batch.id)}
                          >
                            Approve
                          </button>
                        )}

                        {qualityApproved && (
                          <span className="approval-status">
                            ✓ Quality Approved
                          </span>
                        )}
                      </>
                    )}

                    {/* STATE OFFICER */}
                    {user.role === "STATE_OFFICER" && (
                      <>
                        {status === "STATE_APPROVAL" && (
                          <button
                            onClick={() => onApprove(batch.id)}
                          >
                            Approve
                          </button>
                        )}

                        {stateApproved && (
                          <span className="approval-status">
                            ✓ State Approved
                          </span>
                        )}

                        {status === "APPROVED" && (
                          <>
                            <button
                              onClick={() => onIssue(batch.id)}
                            >
                              Issue Certificates
                            </button>

                            <button
                              className="danger"
                              onClick={() =>
                                onCancelBatch(batch.id)
                              }
                            >
                              Cancel Batch
                            </button>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* CSV UPLOAD */}
                {isUploadOpen &&
                  user.role === "TRAINING_CENTRE" &&
                  status === "DRAFT" && (
                    <div className="batch-upload-section">
                      <CandidateUpload
                        onImport={async (candidates) => {
                          await onImportCandidates(
                            batch.id,
                            candidates
                          );

                          setUploadBatchId(null);
                        }}
                      />
                    </div>
                  )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}