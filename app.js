const skills = {
  "support-case-triage": {
    title: "Support Case Triage",
    file: "examples/support-case-triage.md",
    hints: [
      ["Hint", "Define strict boundaries: the skill must not send emails or write directly to the CRM database."],
      ["Hint", "Require Customer ID, Bike Model, Issue Classification (Bug or Warranty), and Severity (Low, Med, or High) in the output schema."],
      ["Tip", "Use a few-shot example with raw, noisy text, such as typos and a missing serial number, to test extraction rules."]
    ]
  },
  "doc-generator": {
    title: "Documentation Generator",
    file: "examples/doc-generator.md",
    hints: [
      ["Hint", "Tell the agent to parse route attributes such as [HttpGet] and [Route], plus parameters, into structured tables."],
      ["Hint", "In the workflow, request sample JSON request and response payloads for every HTTP verb."],
      ["Tip", "Add an out-of-scope rule forbidding changes to live controller files or Swagger configuration."]
    ]
  },
  "pr-release-notes": {
    title: "PR Release Notes",
    file: "examples/pr-release-notes.md",
    hints: [
      ["Hint", "Dictate conventional-commit parsing for feat:, fix:, and docs: so the workflow can group changes automatically."],
      ["Hint", "Ask the agent to translate technical commit messages into user-friendly business descriptions."],
      ["Tip", "Add a scope rule that ignores automated bot commits, including Dependabot and CI/CD merges."]
    ]
  },
  "ado-planning": {
    title: "Azure DevOps Planning",
    file: "examples/ado-planning.md",
    hints: [
      ["Hint", "Break requirements down strictly as Epic to Feature to User Story."],
      ["Hint", "Require every User Story to use As a... I want... So that..., with Given/When/Then acceptance criteria."],
      ["Tip", "Show an explicit sample using nested Markdown lists or CSV columns compatible with Azure DevOps imports."]
    ]
  },
  "controller-generator": {
    title: "Controller Generator",
    file: "examples/controller-generator.md",
    hints: [
      ["Hint", "Make [ApiController], [Route], and constructor dependency injection mandatory in the output."],
      ["Hint", "Set clear expectations for 200 OK, 201 Created, 400 BadRequest, and 404 NotFound responses."],
      ["Tip", "Set explicit boundaries preventing service-layer logic or database context changes."]
    ]
  },
  custom: {
    title: "Blank Custom Skill",
    source: `---\nname: custom-skill\ndescription: "TODO: Describe when Copilot should discover this skill."\n---\n\n# Custom Skill\n\n## Purpose\n_TODO: Define the core intent of this skill in 1-2 sentences._\n\n## Scope And Boundaries\n* **In Scope:** _TODO: List allowed actions._\n* **Out of Scope:** _TODO: State explicit boundaries._\n\n## Required Inputs\n* _TODO: List the information the skill needs._\n\n## Workflow\n1. **Analyze:** _TODO: Define the first step._\n2. **Decide:** _TODO: Define the rules or decisions._\n3. **Format Output:** _TODO: Define the final response._\n\n## Output\n* _TODO: Specify the expected structure._\n\n## Examples\n\n### Input\n_TODO: Add a representative request._\n\n### Output\n_TODO: Add the expected result._\n`,
    hints: [
      ["Start", "Name the job this skill performs in one sentence before writing detailed instructions."],
      ["Boundary", "Write down what it cannot change, send, or decide. Clear limits make skills dependable."],
      ["Test", "Add a realistic example with messy or incomplete input before you call the template done."]
    ]
  }
};

function visibleMarkdown(markdown) {
  const normalizedMarkdown = markdown.replace(/^\uFEFF/, "");
  if (!normalizedMarkdown.startsWith("---")) return normalizedMarkdown;

  const closingDelimiter = normalizedMarkdown.indexOf("\n---", 3);
  return closingDelimiter === -1 ? normalizedMarkdown : normalizedMarkdown.slice(closingDelimiter + 4).trimStart();
}

function renderTips(hints) {
  return hints.map(([label, text]) => `
    <article class="tip-item">
      <p class="tip-label">${label}</p>
      <p>${text}</p>
    </article>`).join("");
}

async function loadSkill() {
  const skillKey = new URLSearchParams(window.location.search).get("skill") || "support-case-triage";
  const skill = skills[skillKey];
  const title = document.querySelector("#template-title");
  const content = document.querySelector("#template-content");
  const tips = document.querySelector("#tips-content");

  if (!skill) {
    title.textContent = "Template not found";
    content.innerHTML = "<p>Return to the workshop to choose a template.</p>";
    return;
  }

  document.title = `${skill.title} | AI Agent Skills Workshop`;
  title.textContent = skill.title;
  tips.innerHTML = renderTips(skill.hints);

  try {
    const rawMarkdown = skill.source || await fetch(skill.file).then((response) => {
      if (!response.ok) throw new Error("Template could not be loaded.");
      return response.text();
    });
    content.innerHTML = marked.parse(visibleMarkdown(rawMarkdown), { gfm: true, breaks: false });
    content.querySelectorAll("pre code").forEach((block) => hljs.highlightElement(block));
  } catch (error) {
    content.innerHTML = `<p class="load-error">${error.message} Please refresh and try again.</p>`;
  }
}

loadSkill();