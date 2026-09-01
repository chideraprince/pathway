import type { Career, Pathway, PathwayStage, PathwayStep } from "@/types";
import { careers } from "./careers";
import { resourcesForSkill, resourceById } from "./resources";
import { skillById } from "./skills";

let stepCounter = 0;
const nextStepId = (careerId: string) => `${careerId}-step-${++stepCounter}`;

const resourceIdsFor = (skillIds: string[], max = 2): string[] => {
  const ids = new Set<string>();
  skillIds.forEach((sid) => {
    resourcesForSkill(sid).forEach((r) => ids.add(r.id));
  });
  return Array.from(ids).slice(0, max);
};

const skillNames = (ids: string[]) =>
  ids.map((id) => skillById(id)?.name).filter(Boolean).join(", ");

function mkStep(
  careerId: string,
  order: number,
  title: string,
  description: string,
  action: PathwayStep["action"],
  skillIds: string[],
  durationWeeks: number,
  extraResourceIds: string[] = []
): PathwayStep {
  return {
    id: nextStepId(careerId),
    title,
    description,
    action,
    skillIds,
    resourceIds: Array.from(new Set([...resourceIdsFor(skillIds), ...extraResourceIds])),
    durationWeeks,
    order,
  };
}

function buildStandardPathway(career: Career): Pathway {
  const core = career.skills.filter((s) => s.group === "core").map((s) => s.skillId);
  const technical = career.skills.filter((s) => s.group === "technical").map((s) => s.skillId);
  const tools = career.skills.filter((s) => s.group === "tools").map((s) => s.skillId);
  const soft = career.skills.filter((s) => s.group === "soft").map((s) => s.skillId);
  const advanced = career.skills.filter((s) => s.group === "advanced").map((s) => s.skillId);

  let order = 0;

  const foundationSteps: PathwayStep[] = core.map((sid) =>
    mkStep(
      career.id,
      ++order,
      `Learn ${skillById(sid)?.name}`,
      `Build a solid grounding in ${skillById(sid)?.name.toLowerCase()} — the base that later, more applied stages build on.`,
      "Learn",
      [sid],
      2
    )
  );

  const coreSkillSteps: PathwayStep[] = [...technical, ...tools].map((sid, i) =>
    mkStep(
      career.id,
      ++order,
      `Develop ${skillById(sid)?.name}`,
      `Go hands-on with ${skillById(sid)?.name.toLowerCase()}, the applied skill that shows up in almost every ${career.title.toLowerCase()} job description.`,
      i % 3 === 2 ? "Practice" : "Learn",
      [sid],
      3
    )
  );

  const practiceSkillIds = [...technical.slice(0, 2), ...soft.slice(0, 1)].filter(Boolean);
  const practiceSteps: PathwayStep[] = [
    mkStep(
      career.id,
      ++order,
      "Apply your skills in guided exercises",
      `Work through structured exercises that combine ${skillNames(practiceSkillIds) || "your new skills"} in realistic scenarios, not just isolated tutorials.`,
      "Practice",
      practiceSkillIds,
      3
    ),
    mkStep(
      career.id,
      ++order,
      "Take on a mock real-world brief",
      `Simulate a real ${career.title.toLowerCase()} assignment end-to-end, from problem framing to a finished output.`,
      "Practice",
      soft,
      2
    ),
  ];

  const portfolioSteps: PathwayStep[] = [
    mkStep(
      career.id,
      ++order,
      "Build 2-3 portfolio projects",
      `Turn your practice work into 2-3 polished projects that demonstrate ${skillNames(advanced.length ? advanced : technical.slice(0, 2))} to a hiring manager.`,
      "Build",
      advanced.length ? advanced : technical.slice(0, 2),
      4
    ),
    mkStep(
      career.id,
      ++order,
      "Write up your process",
      "Document the thinking behind each project — the problem, your approach, trade-offs and outcome — so reviewers understand your judgement, not just the output.",
      "Build",
      [],
      2,
      ["r-portfolio-building"]
    ),
  ];

  const launchSteps: PathwayStep[] = [
    mkStep(
      career.id,
      ++order,
      "Prepare your CV and LinkedIn",
      "Position your projects and skills clearly for recruiters and hiring managers scanning quickly.",
      "Complete",
      [],
      1,
      ["r-portfolio-building"]
    ),
    mkStep(
      career.id,
      ++order,
      "Apply to entry-level roles",
      `Start applying to junior ${career.title.toLowerCase()} roles and related internships, using your portfolio as the centrepiece of every application.`,
      "Complete",
      [],
      2
    ),
    mkStep(
      career.id,
      ++order,
      "Practice interviews",
      "Run through mock technical and behavioural interviews so the real ones feel familiar.",
      "Complete",
      [],
      2,
      ["r-interview-prep"]
    ),
  ];

  const stages: PathwayStage[] = [
    { id: `${career.id}-stage-1`, title: "Foundations", description: `The core concepts every ${career.title.toLowerCase()} needs before going deeper.`, order: 1, steps: foundationSteps },
    { id: `${career.id}-stage-2`, title: "Core Skills", description: "The applied, job-ready skills that make up most of the day-to-day work.", order: 2, steps: coreSkillSteps },
    { id: `${career.id}-stage-3`, title: "Practice", description: "Turn knowledge into ability by working through realistic exercises and briefs.", order: 3, steps: practiceSteps },
    { id: `${career.id}-stage-4`, title: "Portfolio", description: "Package your best work into a portfolio that proves you can do the job.", order: 4, steps: portfolioSteps },
    { id: `${career.id}-stage-5`, title: "Career Launch", description: "Get application-ready and start putting yourself in front of employers.", order: 5, steps: launchSteps },
  ];

  const totalWeeks = stages.flatMap((s) => s.steps).reduce((sum, st) => sum + st.durationWeeks, 0);

  return {
    id: career.pathwayId,
    careerId: career.id,
    title: `Become a ${career.title}`,
    estimatedDurationMonths: Math.max(3, Math.round(totalWeeks / 4.3)),
    stages,
  };
}

// Hand-authored flagship pathway (mirrors the brief's worked example closely).
function buildProductDesignerPathway(): Pathway {
  const careerId = "product-designer";
  let order = 0;
  const stages: PathwayStage[] = [
    {
      id: `${careerId}-stage-1`,
      title: "Foundations",
      description: "The visual and UX principles every product designer builds on.",
      order: 1,
      steps: [
        mkStep(careerId, ++order, "Design Principles", "Learn the fundamentals of clear, purposeful visual design.", "Learn", ["design-principles"], 2),
        mkStep(careerId, ++order, "Visual Hierarchy", "Understand how layout and emphasis guide a user's attention.", "Learn", ["visual-hierarchy"], 1),
        mkStep(careerId, ++order, "Typography", "Choose and pair type that supports readability and tone.", "Learn", ["typography"], 1),
        mkStep(careerId, ++order, "Colour", "Use colour systematically for contrast, meaning and accessibility.", "Learn", ["color-theory"], 1),
        mkStep(careerId, ++order, "UX Fundamentals", "Build a working understanding of usability and user-centred design.", "Learn", ["ux-fundamentals"], 2),
      ],
    },
    {
      id: `${careerId}-stage-2`,
      title: "Product Design",
      description: "The applied craft of researching, structuring and designing digital products.",
      order: 2,
      steps: [
        mkStep(careerId, ++order, "User Research", "Plan and run interviews, surveys and usability tests.", "Learn", ["user-research"], 3),
        mkStep(careerId, ++order, "Wireframing", "Sketch low-fidelity structure for screens and flows.", "Practice", ["wireframing"], 2),
        mkStep(careerId, ++order, "Prototyping", "Build interactive mockups to validate ideas before build.", "Practice", ["prototyping", "figma"], 3),
        mkStep(careerId, ++order, "Interaction Design", "Design how users engage with interface elements and transitions.", "Learn", ["interaction-design"], 3),
        mkStep(careerId, ++order, "Design Systems", "Build reusable component libraries and style guidelines.", "Learn", ["design-systems"], 3),
      ],
    },
    {
      id: `${careerId}-stage-3`,
      title: "Practice",
      description: "Turn knowledge into ability through structured exercises and real-feeling projects.",
      order: 3,
      steps: [
        mkStep(careerId, ++order, "Redesign Exercises", "Redesign an existing product screen or flow and justify every decision.", "Practice", ["wireframing", "interaction-design"], 2),
        mkStep(careerId, ++order, "Case Studies", "Write structured case studies documenting problem, process and outcome.", "Practice", ["design-critique"], 2),
        mkStep(careerId, ++order, "Real-World Project", "Design a full feature end-to-end, from research through to a polished prototype.", "Practice", ["user-research", "prototyping"], 3),
      ],
    },
    {
      id: `${careerId}-stage-4`,
      title: "Portfolio",
      description: "Package your strongest work into a portfolio that proves product thinking, not just visuals.",
      order: 4,
      steps: [
        mkStep(careerId, ++order, "Build 2-3 Strong Projects", "Select and polish your best work into 2-3 complete case studies.", "Build", ["branding", "design-systems"], 4),
        mkStep(careerId, ++order, "Write Case Studies", "Explain your process, trade-offs and impact for each project.", "Build", [], 2, ["r-portfolio-building"]),
        mkStep(careerId, ++order, "Prepare Portfolio", "Assemble a portfolio site that's easy for recruiters to scan.", "Build", [], 2, ["r-portfolio-building"]),
      ],
    },
    {
      id: `${careerId}-stage-5`,
      title: "Career Launch",
      description: "Get application-ready and start reaching out to employers.",
      order: 5,
      steps: [
        mkStep(careerId, ++order, "CV", "Position your design experience and projects clearly for recruiters.", "Complete", [], 1, ["r-portfolio-building"]),
        mkStep(careerId, ++order, "LinkedIn", "Optimise your profile and start building a design-community presence.", "Complete", [], 1),
        mkStep(careerId, ++order, "Applications", "Apply to junior product designer roles and design internships.", "Complete", [], 2),
        mkStep(careerId, ++order, "Interview Preparation", "Practice portfolio walkthroughs and whiteboard design challenges.", "Complete", [], 2, ["r-interview-prep"]),
      ],
    },
  ];

  const totalWeeks = stages.flatMap((s) => s.steps).reduce((sum, st) => sum + st.durationWeeks, 0);

  return {
    id: "pw-product-designer",
    careerId,
    title: "Become a Product Designer",
    estimatedDurationMonths: Math.round(totalWeeks / 4.3),
    stages,
  };
}

export const pathways: Pathway[] = careers.map((career) =>
  career.id === "product-designer" ? buildProductDesignerPathway() : buildStandardPathway(career)
);

export const pathwayById = (id: string): Pathway | undefined => pathways.find((p) => p.id === id);
export const pathwayByCareerId = (careerId: string): Pathway | undefined =>
  pathways.find((p) => p.careerId === careerId);

export const pathwayStepById = (pathway: Pathway, stepId: string): PathwayStep | undefined =>
  pathway.stages.flatMap((s) => s.steps).find((st) => st.id === stepId);

export const pathwayTotalSteps = (pathway: Pathway): number =>
  pathway.stages.reduce((sum, s) => sum + s.steps.length, 0);

export { resourceById };
