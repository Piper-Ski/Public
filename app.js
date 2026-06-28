function collectSourceData() {
  const wbsDictionaryFileInput = document.getElementById("wbsDictionaryFile");
  let wbsDictionaryFile = null;

  if (wbsDictionaryFileInput.files.length > 0) {
    wbsDictionaryFile = wbsDictionaryFileInput.files[0].name;
  }

  return {
    projectTitle: document.getElementById("projectTitle").value.trim(),
    projectSponsor: document.getElementById("projectSponsor").value.trim(),
    projectManager: document.getElementById("projectManager").value.trim(),
    startDate: document.getElementById("startDate").value,
    endDate: document.getElementById("endDate").value,
    finalScopeStatementSummary: document
      .getElementById("finalScopeStatementSummary")
      .value.trim(),
    finalMajorDeliverablesSummary: document
      .getElementById("finalMajorDeliverablesSummary")
      .value.trim(),
    finalScopeExclusionsSummary: document
      .getElementById("finalScopeExclusionsSummary")
      .value.trim(),
    finalKeyAssumptionsSummary: document
      .getElementById("finalKeyAssumptionsSummary")
      .value.trim(),
    finalKeyConstraintsSummary: document
      .getElementById("finalKeyConstraintsSummary")
      .value.trim(),
    finalAcceptanceCompletionSummary: document
      .getElementById("finalAcceptanceCompletionSummary")
      .value.trim(),
    wbsReference: document.getElementById("wbsReference").value.trim(),
    wbsDictionaryReference: document
      .getElementById("wbsDictionaryReference")
      .value.trim(),
    wbsDictionaryFile: wbsDictionaryFile,
    approvedBy: document.getElementById("approvedBy").value.trim(),
    releasedBy: document.getElementById("releasedBy").value.trim(),
    approvalDate: document.getElementById("approvalDate").value,
    estimatedHourRange: document
      .getElementById("estimatedHourRange")
      .value.trim(),
    estimatedCostRange: document
      .getElementById("estimatedCostRange")
      .value.trim()
  };
}

function generateBaseline(source) {
  return {
    projectTitle: source.projectTitle,
    projectSponsor: source.projectSponsor,
    projectManager: source.projectManager,
    startDate: source.startDate,
    endDate: source.endDate,
    estimatedHourRange: source.estimatedHourRange,
    estimatedCostRange: source.estimatedCostRange,
    approvedBy: source.approvedBy,
    releasedBy: source.releasedBy,
    approvalDate: source.approvalDate,
    projectScopeStatement: source.finalScopeStatementSummary,
    highLevelDeliverables: source.finalMajorDeliverablesSummary,
    highLevelScopeOut: source.finalScopeExclusionsSummary,
    highLevelAssumptions: source.finalKeyAssumptionsSummary,
    highLevelConstraints: source.finalKeyConstraintsSummary,
    acceptanceCompletionBasis: source.finalAcceptanceCompletionSummary,
    wbsReference: source.wbsReference,
    wbsDictionaryReference: source.wbsDictionaryReference,
    wbsDictionaryFile: source.wbsDictionaryFile
  };
}

function renderBaseline(baseline) {
  const container = document.getElementById("baselineView");

  if (!baseline.projectTitle) {
    container.innerHTML =
      '<p class="hint">Project Title is required. Please fill the form and click “Generate Baseline”.</p>';
    return;
  }

  const html = `
    <h3>Project Header</h3>
    <p><strong>Project Title:</strong> ${baseline.projectTitle}</p>
    <p><strong>Project Sponsor:</strong> ${baseline.projectSponsor || "—"}</p>
    <p><strong>Project Manager:</strong> ${baseline.projectManager || "—"}</p>
    <p><strong>Start Date:</strong> ${baseline.startDate || "—"}</p>
    <p><strong>End Date:</strong> ${baseline.endDate || "—"}</p>
    <p><strong>Estimated Hour Range:</strong> ${baseline.estimatedHourRange || "—"} <em>(manual governance)</em></p>
    <p><strong>Estimated Cost Range:</strong> ${baseline.estimatedCostRange || "—"} <em>(manual governance)</em></p>
    <p><strong>Approved By:</strong> ${baseline.approvedBy || "—"} <em>(manual governance)</em></p>
    <p><strong>Released By:</strong> ${baseline.releasedBy || "—"} <em>(manual governance)</em></p>
    <p><strong>Approval Date:</strong> ${baseline.approvalDate || "—"} <em>(manual governance)</em></p>

    <h3>Project Scope Statement <small>(auto-populated summary)</small></h3>
    <p>${baseline.projectScopeStatement || "—"}</p>

    <h3>High Level Project Deliverables <small>(auto-populated summary)</small></h3>
    <p>${baseline.highLevelDeliverables || "—"}</p>

    <h3>High Level Scope</h3>
    <p><strong>Out of Scope (Exclusions):</strong> ${baseline.highLevelScopeOut || "—"} <small>(auto-populated summary)</small></p>

    <h3>High Level Project Assumptions <small>(auto-populated filtered summary)</small></h3>
    <p>${baseline.highLevelAssumptions || "—"}</p>

    <h3>High Level Project Constraints <small>(auto-populated filtered summary)</small></h3>
    <p>${baseline.highLevelConstraints || "—"}</p>

    <h3>Acceptance / Completion Basis <small>(auto-populated summary)</small></h3>
    <p>${baseline.acceptanceCompletionBasis || "—"}</p>

    <h3>References</h3>
    <p><strong>WBS Reference:</strong> ${baseline.wbsReference || "—"} <em>(referenced artifact)</em></p>
    <p><strong>WBS Dictionary Reference:</strong> ${baseline.wbsDictionaryReference || "—"} <em>(referenced artifact)</em></p>
    <p><strong>WBS Dictionary File:</strong> ${baseline.wbsDictionaryFile || "No file uploaded"} <em>(referenced artifact)</em></p>
  `;

  container.innerHTML = html;
}

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

document.getElementById("generateBtn").addEventListener("click", () => {
  const source = collectSourceData();
  const baseline = generateBaseline(source);
  renderBaseline(baseline);
  window.currentBaseline = baseline;
});

document.getElementById("downloadJsonBtn").addEventListener("click", () => {
  if (!window.currentBaseline) {
    alert("Generate the baseline first.");
    return;
  }
  const json = JSON.stringify(window.currentBaseline, null, 2);
  downloadFile("project-scope-baseline.json", json, "application/json");
});

document.getElementById("downloadHtmlBtn").addEventListener("click", () => {
  if (!window.currentBaseline) {
    alert("Generate the baseline first.");
    return;
  }
  const container = document.getElementById("baselineView");
  const htmlDoc = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Project Scope Baseline</title>
</head>
<body>
  ${container.innerHTML}
</body>
</html>`;
  downloadFile("project-scope-baseline.html", htmlDoc, "text/html");
});
