import { useEffect, useState } from "react";
import { api } from "../api";
import type { User, Batch, ApiResponse } from "../types";

import Sidebar, { type Page } from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import StatsCards from "../components/dashboard/StatsCards";
import CreateBatchForm from "../components/batches/CreateBatchForm";
import BatchList from "../components/batches/BatchList";
import type { CandidateInput } from "../components/batches/CandidateUpload";

interface DashboardPageProps {
  user: User;
  onLogout: () => void;
}

export default function DashboardPage({
  user,
  onLogout,
}: DashboardPageProps) {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [error, setError] = useState("");
  const [activePage, setActivePage] = useState<Page>("dashboard");

  // Load batches
  const loadBatches = async () => {
    try {
      setError("");

      const result = await api<ApiResponse<Batch[]>>("/batches");

      setBatches(result.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load batches"
      );
    }
  };

  useEffect(() => {
    loadBatches();
  }, []);

  // Create batch
  const createBatch = async (name: string) => {
    try {
      setError("");

      await api("/batches", {
        method: "POST",
        body: JSON.stringify({ name }),
      });

      await loadBatches();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Batch creation failed";

      setError(message);
      throw err;
    }
  };

  // Import CSV candidates
  const importCandidates = async (
    batchId: string,
    candidates: CandidateInput[]
  ) => {
    try {
      setError("");

      const result = await api<
        ApiResponse<{ importedCount: number }>
      >(`/batches/${batchId}/candidates`, {
        method: "POST",
        body: JSON.stringify({ candidates }),
      });

      alert(
        `Successfully imported ${result.data.importedCount} candidates!`
      );

      await loadBatches();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Candidate import failed";

      setError(message);
      throw err;
    }
  };

  // Submit batch
  const submitBatch = async (batchId: string) => {
    try {
      setError("");

      await api(`/batches/${batchId}/submit`, {
        method: "POST",
      });

      await loadBatches();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Submission failed"
      );
    }
  };

  // Approve batch
  const approveBatch = async (batchId: string) => {
    try {
      setError("");

      await api(`/approvals/${batchId}/approve`, {
        method: "POST",
        body: JSON.stringify({ remarks: "Approved" }),
      });

      await loadBatches();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Approval failed"
      );
    }
  };

  // Issue certificates
  const issueCertificates = async (batchId: string) => {
    try {
      const result = await api<
        ApiResponse<{ certificatesIssued: number }>
      >(`/certificates/batch/${batchId}/issue`, {
        method: "POST",
      });

      alert(
        `Successfully issued ${result.data.certificatesIssued} certificates`
      );

      await loadBatches();
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Issuance failed"
      );
    }
  };

  // Cancel batch and all associated certificates
  const cancelBatch = async (batchId: string) => {
    const reason = prompt("Enter the reason for cancelling this batch:");

    if (!reason || !reason.trim()) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure? This will cancel the batch and all associated certificates."
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api(`/certificates/batch/${batchId}/cancel`, {
        method: "POST",
        body: JSON.stringify({
          reason: reason.trim(),
        }),
      });

      alert("Batch cancelled successfully.");

      await loadBatches();
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Batch cancellation failed"
      );
    }
  };

  // Dashboard statistics
  const approved = batches.filter(
    (batch) => batch.status === "APPROVED"
  ).length;

  const pending = batches.filter(
    (batch) =>
      batch.status !== "APPROVED" &&
      batch.status !== "REJECTED" &&
      batch.status !== "CANCELLED"
  ).length;

  const totalCandidates = batches.reduce(
    (total, batch) => total + (batch.candidateCount || 0),
    0
  );

  // Page titles
  const pageTitles: Record<Page, string> = {
    dashboard: "Dashboard",
    batches: "Batch Management",
    approvals: "Approvals",
    certificates: "Certificates",
    verification: "Verification",
  };

  return (
    <div className="layout">
      <Sidebar
        user={user}
        activePage={activePage}
        onNavigate={setActivePage}
      />

      <main className="content">
        <Header onLogout={onLogout} />

        <div className="page-heading">
          <h1>{pageTitles[activePage]}</h1>

          <p>
            {activePage === "dashboard"
              ? "Manage certificate issuance workflow"
              : activePage === "batches"
              ? "Create, track and manage training batches"
              : activePage === "approvals"
              ? "Review and process pending batch approvals"
              : activePage === "certificates"
              ? "Manage certificate issuance"
              : "Verify certificates publicly"}
          </p>
        </div>

        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        {/* DASHBOARD */}
        {activePage === "dashboard" && (
          <>
            <StatsCards
              totalBatches={batches.length}
              pending={pending}
              approved={approved}
              candidates={totalCandidates}
            />

            {user.role === "TRAINING_CENTRE" && (
              <CreateBatchForm onCreate={createBatch} />
            )}

            <BatchList
              batches={batches}
              user={user}
              onRefresh={loadBatches}
              onSubmit={submitBatch}
              onApprove={approveBatch}
              onIssue={issueCertificates}
              onCancelBatch={cancelBatch}
              onImportCandidates={importCandidates}
            />
          </>
        )}

        {/* BATCH MANAGEMENT */}
        {activePage === "batches" && (
          <>
            {user.role === "TRAINING_CENTRE" && (
              <CreateBatchForm onCreate={createBatch} />
            )}

            <BatchList
              batches={batches}
              user={user}
              onRefresh={loadBatches}
              onSubmit={submitBatch}
              onApprove={approveBatch}
              onIssue={issueCertificates}
              onCancelBatch={cancelBatch}
              onImportCandidates={importCandidates}
            />
          </>
        )}

        {/* APPROVALS */}
        {activePage === "approvals" && (
          <BatchList
            batches={batches.filter(
              (batch) =>
                batch.status !== "DRAFT" &&
                batch.status !== "APPROVED" &&
                batch.status !== "REJECTED" &&
                batch.status !== "CANCELLED"
            )}
            user={user}
            onRefresh={loadBatches}
            onSubmit={submitBatch}
            onApprove={approveBatch}
            onIssue={issueCertificates}
            onCancelBatch={cancelBatch}
            onImportCandidates={importCandidates}
          />
        )}

        {/* CERTIFICATES */}
        {activePage === "certificates" && (
          <BatchList
            batches={batches.filter(
              (batch) => batch.status === "APPROVED"
            )}
            user={user}
            onRefresh={loadBatches}
            onSubmit={submitBatch}
            onApprove={approveBatch}
            onIssue={issueCertificates}
            onCancelBatch={cancelBatch}
            onImportCandidates={importCandidates}
          />
        )}

        {/* VERIFICATION */}
        {activePage === "verification" && (
          <div className="card">
            <h2>Certificate Verification</h2>

            <p>
              Public certificate verification will be available here.
            </p>

            <p>
              Enter a certificate number or verification code to
              verify authenticity.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}