import { useState } from "react";
import Papa from "papaparse";

export interface CandidateInput {
  name: string;
  email?: string;
  phone: string;
  registrationNumber: string;
  courseName: string;
  completionDate: string;
}

interface CandidateUploadProps {
  onImport: (candidates: CandidateInput[]) => Promise<void>;
}

interface ValidationError {
  row: number;
  message: string;
}

export default function CandidateUpload({
  onImport,
}: CandidateUploadProps) {
  const [candidates, setCandidates] = useState<CandidateInput[]>([]);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [fileName, setFileName] = useState("");
  const [importing, setImporting] = useState(false);

  const handleFileUpload = (file: File) => {
    setFileName(file.name);
    setCandidates([]);
    setErrors([]);

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) =>
        header.trim().toLowerCase(),

      complete: (result) => {
        const validCandidates: CandidateInput[] = [];
        const validationErrors: ValidationError[] = [];

        const seenRegistrationNumbers = new Set<string>();

        result.data.forEach((row, index) => {
          const rowNumber = index + 2;

          const name = row.name?.trim();
          const email = row.email?.trim().toLowerCase();
          const phone = row.phone?.trim();
          const registrationNumber =
            row.registrationnumber?.trim();
          const courseName = row.coursename?.trim();
          const completionDate = row.completiondate?.trim();

          let rowHasError = false;

          if (!name) {
            validationErrors.push({
              row: rowNumber,
              message: "Name is required",
            });
            rowHasError = true;
          }

          if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            validationErrors.push({
              row: rowNumber,
              message: `Invalid email: ${email}`,
            });
            rowHasError = true;
          }

          if (!phone || !/^\d{10}$/.test(phone)) {
            validationErrors.push({
              row: rowNumber,
              message: "Phone must contain exactly 10 digits",
            });
            rowHasError = true;
          }

          if (!registrationNumber) {
            validationErrors.push({
              row: rowNumber,
              message: "Registration number is required",
            });
            rowHasError = true;
          }

          if (
            registrationNumber &&
            seenRegistrationNumbers.has(registrationNumber)
          ) {
            validationErrors.push({
              row: rowNumber,
              message: `Duplicate registration number: ${registrationNumber}`,
            });
            rowHasError = true;
          }

          if (registrationNumber) {
            seenRegistrationNumbers.add(registrationNumber);
          }

          if (!courseName) {
            validationErrors.push({
              row: rowNumber,
              message: "Course name is required",
            });
            rowHasError = true;
          }

          if (
            !completionDate ||
            Number.isNaN(Date.parse(completionDate))
          ) {
            validationErrors.push({
              row: rowNumber,
              message: "Invalid completion date",
            });
            rowHasError = true;
          }

          if (!rowHasError) {
            validCandidates.push({
              name: name!,
              email: email || undefined,
              phone,
              registrationNumber,
              courseName,
              completionDate,
            });
          }
        });

        setCandidates(validCandidates);
        setErrors(validationErrors);
      },
    });
  };

  const handleImport = async () => {
    if (errors.length > 0 || candidates.length === 0) {
      return;
    }

    try {
      setImporting(true);

      await onImport(candidates);

      setCandidates([]);
      setErrors([]);
      setFileName("");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="candidate-upload card">
      <div className="section-heading">
        <div>
          <h2>Upload Candidates</h2>
          <p>Import candidates from your existing spreadsheet</p>
        </div>
      </div>

      <div className="upload-area">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (file) {
              handleFileUpload(file);
            }
          }}
        />

        <p>Upload CSV file</p>
      </div>

      {fileName && (
        <div className="file-info">
          📄 {fileName}
        </div>
      )}

      {candidates.length > 0 && errors.length === 0 && (
        <div className="validation-summary success">
          ✓ {candidates.length} candidates validated successfully
        </div>
      )}

      {errors.length > 0 && (
        <div className="validation-summary error">
          <h3>Validation Failed ({errors.length} errors)</h3>

          <p>
            No candidates will be imported until all errors are fixed.
          </p>

          <ul>
            {errors.map((error, index) => (
              <li key={index}>
                Row {error.row}: {error.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {candidates.length > 0 && (
        <div className="candidate-preview">
          <h3>Candidate Preview</h3>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Registration Number</th>
                  <th>Course</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Completion Date</th>
                </tr>
              </thead>

              <tbody>
                {candidates.slice(0, 10).map((candidate, index) => (
                  <tr key={index}>
                    <td>{candidate.name}</td>
                    <td>{candidate.registrationNumber}</td>
                    <td>{candidate.courseName}</td>
                    <td>{candidate.email || "-"}</td>
                    <td>{candidate.phone}</td>
                    <td>{candidate.completionDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {candidates.length > 10 && (
            <p>
              Showing 10 of {candidates.length} candidates
            </p>
          )}
        </div>
      )}

      <button
        className="primary"
        onClick={handleImport}
        disabled={
          importing ||
          candidates.length === 0 ||
          errors.length > 0
        }
      >
        {importing
          ? "Importing..."
          : `Import ${candidates.length} Candidates`}
      </button>
    </div>
  );
}