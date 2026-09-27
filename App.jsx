import { useEffect, useMemo, useState } from 'react'
import './App.css'

const phases = [
  {
    name: 'Feasibility',
    status: 'Current',
    description: 'Regulatory pathway, market case, and product viability review.',
    docs: ['Opportunity assessment', 'Intended use statement', 'Initial risk screen'],
  },
  {
    name: 'Concept',
    status: 'Planned',
    description: 'Define concept, user needs, and early design inputs.',
    docs: ['User needs', 'Concept review', 'Preliminary hazard analysis'],
  },
  {
    name: 'Planning',
    status: 'Planned',
    description: 'Set project governance, design controls, and quality responsibilities.',
    docs: ['Development plan', 'Quality plan', 'Traceability strategy'],
  },
  {
    name: 'Design',
    status: 'Queued',
    description: 'Translate requirements into architecture and design outputs.',
    docs: ['Design inputs', 'Design outputs', 'Design reviews'],
  },
  {
    name: 'Development',
    status: 'Queued',
    description: 'Build the product and maintain design history evidence.',
    docs: ['Prototype records', 'Supplier controls', 'Change log'],
  },
  {
    name: 'Verification',
    status: 'Queued',
    description: 'Verify outputs match requirements and risk controls.',
    docs: ['Verification protocols', 'Test results', 'Risk control reports'],
  },
  {
    name: 'Validation',
    status: 'Queued',
    description: 'Demonstrate fitness for intended use under real conditions.',
    docs: ['Validation plan', 'Clinical evaluation', 'Usability testing'],
  },
  {
    name: 'Design Transfer',
    status: 'Queued',
    description: 'Scale to manufacturing and controlled release operations.',
    docs: ['Transfer plan', 'Process validation', 'Release approval'],
  },
  {
    name: 'Commercialisation',
    status: 'Queued',
    description: 'Launch with surveillance, complaint, and regulatory readiness.',
    docs: ['Launch checklist', 'Complaint handling', 'PMCF / PMPF plan'],
  },
  {
    name: 'Maintenance / Post-market',
    status: 'Queued',
    description: 'Maintain performance, vigilance, and continuous compliance.',
    docs: ['CAPA', 'Vigilance log', 'Post-market monitoring'],
  },
]

const deliverables = [
  {
    title: 'QMS SOPs (ISO 13485)',
    items: [
      'Document and record control',
      'Design and development planning',
      'Design input and output review',
      'Risk management',
      'Supplier and purchasing controls',
      'Verification and validation',
      'CAPA and corrective action',
      'Complaint handling and vigilance',
      'Training and competence',
      'Management review / internal audit',
    ],
  },
  {
    title: 'Templates & Forms',
    items: [
      'Requirements specification',
      'Design review form',
      'Traceability matrix',
      'FMEA / hazard log',
      'Verification report',
      'Validation protocol',
      'Clinical evaluation plan',
      'Training matrix',
      'Change control record',
      'Deviation / NCR log',
    ],
  },
  {
    title: 'Risk & Clinical Package',
    items: [
      'Risk management plan',
      'Hazard analysis',
      'Risk-benefit analysis',
      'Residual risk review',
      'Clinical evaluation report',
      'Usability engineering file',
      'Biocompatibility assessment',
      'Post-market surveillance plan',
    ],
  },
  {
    title: 'Technical Documentation',
    items: [
      'Device description',
      'Intended purpose / intended use',
      'Performance evidence',
      'Manufacturing information',
      'Labeling and IFU',
      'Software or firmware lifecycle records',
      'TMF / regulatory evidence file',
      'Design history file (DHF)',
    ],
  },
]

const builtInSopSuite = [
  'SOP-01: Project initiation and design control planning',
  'SOP-02: Intended use and user needs capture',
  'SOP-03: Requirements specification and traceability',
  'SOP-04: Design review and design history record control',
  'SOP-05: Risk management and hazard analysis',
  'SOP-06: Verification and validation planning',
  'SOP-07: Supplier qualification and purchasing controls',
  'SOP-08: Change control and deviation management',
  'SOP-09: CAPA and corrective action process',
  'SOP-10: Complaint handling and vigilance reporting',
  'SOP-11: Usability engineering and clinical evaluation support',
  'SOP-12: Document control and training records',
  'SOP-13: Internal audit and management review',
  'SOP-14: Regulatory submission dossier preparation',
  'SOP-15: Approval, post-market surveillance and PMCF/PMPF governance',
]

const sopLibrary = [
  {
    title: 'Quality & QMS',
    items: ['Document control', 'Design and development planning', 'Training and competence', 'Audit and management review', 'CAPA and deviation management'],
  },
  {
    title: 'Regulatory',
    items: ['Intended use review', 'Classification and market mapping', 'Technical documentation control', 'Submission dossier readiness', 'Post-market lifecycle obligations'],
  },
  {
    title: 'Clinical & usability',
    items: ['Clinical evaluation planning', 'Usability engineering', 'Biocompatibility review', 'Human factors evaluation', 'Clinical data review and reporting'],
  },
  {
    title: 'Development & security',
    items: ['Requirements traceability', 'Software lifecycle governance', 'Secure SDLC and threat review', 'Vulnerability management', 'Release approval and monitoring'],
  },
]

const submissionJourney = [
  'Feasibility and intended-use confirmation',
  'Requirements, design inputs and risk review',
  'Verification, validation and usability evidence',
  'Technical file, clinical evaluation and QMS records',
  'Submission dossier, regulator review and response handling',
  'Approval, market launch and post-market surveillance',
  'CAPA, complaint handling, vigilance and continuous improvement',
]

const approvalGates = [
  {
    title: 'Gate 1 — Feasibility',
    summary: 'Intended use, product definition and regulatory path confirmed',
  },
  {
    title: 'Gate 2 — Design control',
    summary: 'Requirements, traceability and risk controls documented and approved',
  },
  {
    title: 'Gate 3 — Verification & validation',
    summary: 'Evidence demonstrates conformance to intended use and user needs',
  },
  {
    title: 'Gate 4 — Regulatory submission',
    summary: 'Dossier ready for authority review and response management',
  },
  {
    title: 'Gate 5 — Post-market',
    summary: 'Vigilance, CAPA and lifecycle monitoring active after approval',
  },
]

const defaultGateState = {
  'Gate 1 — Feasibility': true,
  'Gate 2 — Design control': true,
  'Gate 3 — Verification & validation': false,
  'Gate 4 — Regulatory submission': false,
  'Gate 5 — Post-market': false,
}

const standardsByType = {
  'Software as a Medical Device (SaMD)': [
    'IEC 62304',
    'IEC 82304-1',
    'ISO 14971',
    'ISO 13485',
    'IEC 62366-1',
    'IEC 81001-5-1',
  ],
  'Hardware medical device': [
    'IEC 60601-1',
    'IEC 62304',
    'ISO 14971',
    'ISO 13485',
    'IEC 62366-1',
  ],
  'In vitro diagnostic device': [
    'IVDR 2017/746',
    'ISO 14971',
    'ISO 13485',
    'ISO 15197',
    'IEC 62366-1',
  ],
  'Combination product': [
    'MDR 2017/745',
    'ISO 14971',
    'ISO 13485',
    'IEC 62304',
    'IEC 62366-1',
  ],
}

const saMDControlSections = [
  'Software lifecycle processes and development planning (IEC 62304)',
  'Software requirements specification and traceability',
  'Software architecture and design control',
  'Software verification and validation evidence',
  'Software configuration management and change control',
  'Risk management and hazard analysis (ISO 14971)',
  'Usability engineering and human factors (IEC 62366-1)',
  'Cybersecurity and software security risk management (IEC 81001-5-1)',
  'Software maintenance, versioning, and release governance',
  'Clinical evaluation, performance evidence, and intended-use alignment',
  'Post-market monitoring, incident handling, and vulnerability management',
  'AI or ML governance, monitoring, and retraining triggers if applicable',
]

const organisationMap = [
  {
    title: 'Executive leadership',
    roles: ['Chief Executive Officer', 'Chief Quality Officer', 'Head of Regulatory Affairs', 'Head of Engineering', 'Head of Clinical & Safety'],
  },
  {
    title: 'Product & portfolio',
    roles: ['Product Strategy Lead', 'Programme Manager', 'Business Development Lead', 'Clinical Commercialisation Lead'],
  },
  {
    title: 'Core development functions',
    roles: ['R&D / Technical', 'Process Engineering', 'Quality & Risk', 'Clinical Affairs', 'Regulatory Affairs'],
  },
  {
    title: 'Governance & assurance',
    roles: ['AI Governance Board', 'Cybersecurity Lead', 'Risk Review Committee', 'Management Review Board', 'Supplier Quality Review'],
  },
  {
    title: 'Operations & post-market',
    roles: ['Operations Lead', 'Vigilance & Complaint handling', 'CAPA & corrective action', 'Post-market surveillance', 'Service & maintenance'],
  },
]

const governanceLinks = [
  { id: 'quality', label: 'Quality Assurance' },
  { id: 'risk', label: 'Risk Management' },
  { id: 'regulatory', label: 'Regulatory Submissions' },
  { id: 'ai-governance', label: 'AI Governance' },
  { id: 'security', label: 'Security' },
  { id: 'rnd', label: 'Software Development' },
  { id: 'process', label: 'Supplier Management' },
]

const departmentMenus = [
  {
    id: 'clinical',
    label: 'Clinical affairs',
    summary: 'Clinical evidence, literature review, evaluation plans and usability data.',
    items: [
      'Clinical evaluation plan',
      'Literature review and evidence gap analysis',
      'Clinical data management',
      'Study protocols and investigator readiness',
      'Usability engineering and human factors',
      'Biocompatibility and safety data sources',
    ],
  },
  {
    id: 'regulatory',
    label: 'Regulatory Affairs',
    summary: 'Regulatory strategy, territory mapping, software and hardware compliance paths.',
    items: [
      'Regulatory strategy',
      'Territory requirements by market',
      'Software device pathway',
      'Hardware device pathway',
      'Biological / toxicology controls',
      'Labelling, packaging and IFU',
      'Sterilisation and materials',
    ],
  },
  {
    id: 'quality',
    label: 'Quality Assurance',
    summary: 'Design controls, process quality and document governance.',
    items: [
      'Design control plan',
      'CAPA and deviations',
      'Supplier qualification',
      'Training and competence',
      'Internal audit readiness',
      'Document control and versioning',
    ],
  },
  {
    id: 'risk',
    label: 'Risk Management',
    summary: 'Risk evaluation, hazard analysis and residual risk acceptance.',
    items: [
      'Risk management file',
      'Hazard log',
      'Risk-benefit review',
      'Residual risk acceptance',
      'Issue and change impact review',
      'Safety signal monitoring',
    ],
  },
  {
    id: 'security',
    label: 'Security',
    summary: 'Cybersecurity, threat modelling and vulnerability management.',
    items: [
      'Threat model and security requirements',
      'Secure SDLC and software controls',
      'Vulnerability management',
      'Monitoring and incident response',
      'Privacy impact and data handling',
      'Post-market security monitoring',
    ],
  },
  {
    id: 'rnd',
    label: 'R&D / Technical',
    summary: 'Product architecture, design implementation, technical validation and engineering evidence.',
    items: [
      'Technical requirements and architecture',
      'Prototype development and design implementation',
      'Configuration and software control',
      'Verification and engineering test evidence',
      'Technical risk and issue management',
      'Release readiness and design transfer support',
    ],
  },
  {
    id: 'process',
    label: 'Process Engineering',
    summary: 'Manufacturing readiness, process validation, transfer controls and operational scalability.',
    items: [
      'Process design and capability assessment',
      'Manufacturing readiness and validation',
      'Transfer to production and operations',
      'Process control and monitoring',
      'Supplier and equipment qualification',
      'Release and production support',
    ],
  },
]

const onboardingSteps = [
  {
    title: 'Start with intended use',
    detail: 'Define the product purpose, patient population, clinical need and risk context before any design activity starts.',
    action: 'Assessment wizard',
  },
  {
    title: 'Set the project plan',
    detail: 'Align the device profile, risk class, territories and project governance with the product development phases.',
    action: 'Project planning',
  },
  {
    title: 'Complete department workstreams',
    detail: 'Use Clinical, Regulatory Affairs, Quality & Risk, and Security & Privacy to capture the required evidence and controls.',
    action: 'Department workflow',
  },
  {
    title: 'Prepare for approval and launch',
    detail: 'Close gaps, complete validation, capture submissions and post-market controls before release.',
    action: 'Submission readiness',
  },
]

const departmentDetails = {
  clinical: {
    outputs: ['Clinical evaluation plan', 'Literature review and evidence gap analysis', 'Clinical data management plan', 'Usability engineering report', 'Biocompatibility review summary'],
    templates: ['Clinical evaluation plan template', 'Literature review summary', 'Clinical study data collection log', 'Usability test plan', 'Biocompatibility risk worksheet', 'Safety signal review form'],
    controls: ['PICO / intended-use alignment', 'Evidence traceability and source control', 'Human factors and use error review', 'Clinical safety monitoring plan'],
    operatingFramework: ['Define clinical need and population', 'Review evidence and identify gaps', 'Build the clinical evaluation strategy', 'Execute, record and assess clinical data', 'Link findings to risk and intended use'],
    approvalFlow: [
      { step: 'Clinical need confirmation', approver: 'Clinical Lead + Quality', decision: 'Approve patient population, intended use and clinical objective.' },
      { step: 'Evaluation plan approval', approver: 'Clinical Lead + Regulatory', decision: 'Approve the study plan, evidence strategy and risk-based review approach.' },
      { step: 'Usability / human factors sign-off', approver: 'Clinical + UX + Quality', decision: 'Approve assessment of use errors and user training needs.' },
      { step: 'Clinical data release', approver: 'Clinical Lead + Medical Safety Review', decision: 'Approve evidence for inclusion in technical documentation and risk updates.' },
    ],
    playbook: [
      { name: 'Clinical need and population definition', owner: 'Clinical Lead', cadence: 'At initiation', outcome: 'Target population and patient problem statement approved for the project.' },
      { name: 'Evidence review and gap analysis', owner: 'Clinical Affairs + Regulatory', cadence: 'Monthly throughout development', outcome: 'Literature summary, gap analysis, and evidence allocation documented.' },
      { name: 'Clinical evaluation planning', owner: 'Clinical Lead', cadence: 'Phase gate review', outcome: 'CEP, data collection plan, and risk-based evaluation strategy approved.' },
      { name: 'Usability and human factors review', owner: 'Clinical + UX + Quality', cadence: 'Design and validation phases', outcome: 'Use errors, training needs, and usability risks assessed and closed.' },
      { name: 'Clinical data review and reporting', owner: 'Clinical Lead', cadence: 'Per study / release milestone', outcome: 'Clinical data status, findings, and safety signals linked to risk and intended use.' },
    ],
  },
  regulatory: {
    outputs: ['Regulatory strategy document', 'Territory matrix', 'Submission readiness checklist', 'Label and IFU review pack', 'Country-specific regulatory action log'],
    templates: ['Regulatory strategy template', 'Country requirement tracker', 'Label and packaging review form', 'Software device compliance checklist', 'Sterilisation and materials review', 'Change impact assessment form'],
    controls: ['Classification and intended-use review', 'Market-specific evidence mapping', 'Design review and technical file tracking', 'Submission and post-market obligations'],
    operatingFramework: ['Confirm the product classification and regulatory path', 'Map country and market requirements', 'Align intended use and technical evidence', 'Prepare submission and post-market obligations', 'Maintain surveillance and change impact review'],
    approvalFlow: [
      { step: 'Regulatory path approval', approver: 'Regulatory Affairs + Quality', decision: 'Approve product classification, intended use and route-to-market strategy.' },
      { step: 'Territory readiness review', approver: 'Regulatory Affairs + Country Leads', decision: 'Approve market-specific requirements and submission milestones.' },
      { step: 'Submission dossier sign-off', approver: 'Regulatory Affairs + Management', decision: 'Approve dossier completeness prior to regulator submission.' },
      { step: 'Post-market change approval', approver: 'Regulatory Affairs + Quality', decision: 'Approve updates, reporting obligations and change impact review for the product.' },
    ],
    playbook: [
      { name: 'Product classification and route mapping', owner: 'Regulatory Affairs', cadence: 'Feasibility and planning', outcome: 'Device class, pathway, and country requirements defined and agreed.' },
      { name: 'Country and territory requirement tracking', owner: 'Regulatory Affairs', cadence: 'Ongoing', outcome: 'Market-specific requirements and key submission triggers mapped across territories.' },
      { name: 'Technical file and evidence review', owner: 'Regulatory + Quality', cadence: 'Design and validation gates', outcome: 'Technical documentation readiness confirmed against intended use and standards.' },
      { name: 'Submission preparation and dossier assembly', owner: 'Regulatory Affairs', cadence: 'Before launch', outcome: 'Submission package assembled with review-ready traceability and evidence references.' },
      { name: 'Post-market regulatory surveillance', owner: 'Regulatory Affairs', cadence: 'After approval', outcome: 'Changes, vigilance, notification triggers, and annual compliance checks are managed.' },
    ],
  },
  quality: {
    outputs: ['Design control plan', 'Requirements traceability matrix', 'Risk management file', 'Supplier qualification record', 'CAPA and deviation tracker'],
    templates: ['Design review form', 'Traceability matrix', 'Hazard log', 'Change control record', 'Management review agenda', 'Supplier approval checklist'],
    controls: ['Document control and versioning', 'Verification and validation approval', 'Supplier and process controls', 'Internal audit and CAPA closure'],
    operatingFramework: ['Define design inputs and project governance', 'Maintain traceability and review cadence', 'Execute risk and design control activities', 'Close deviations and CAPAs', 'Review process effectiveness and readiness'],
    approvalFlow: [
      { step: 'Design input approval', approver: 'Quality + Functional Leads', decision: 'Approve requirements baseline, traceability and acceptance criteria.' },
      { step: 'Design review gate', approver: 'Quality + Engineering + Regulatory', decision: 'Approve outputs against inputs and risk controls before release.' },
      { step: 'Change control review', approver: 'Quality + Product Owner', decision: 'Approve change impact assessment, validation needs and training implications.' },
      { step: 'CAPA closure approval', approver: 'Quality Management', decision: 'Approve root cause analysis, corrective action effectiveness and closure outcome.' },
    ],
    playbook: [
      { name: 'Design control planning', owner: 'Quality Lead', cadence: 'Project start', outcome: 'Design and development plan approved with owners, review gates, and traceability expectations.' },
      { name: 'Requirements and traceability control', owner: 'Quality + Engineering', cadence: 'Throughout development', outcome: 'Requirement baseline and linkage to design outputs, risks, and verification evidence controlled.' },
      { name: 'Risk management and issue review', owner: 'Quality + Risk Manager', cadence: 'At each phase and change', outcome: 'Hazard log maintained, risks evaluated, and residual risk accepted before release.' },
      { name: 'Supplier and vendor management', owner: 'Procurement + Quality', cadence: 'Quarterly and at onboarding', outcome: 'Supplier controls, qualification evidence, and change impact review maintained.' },
      { name: 'CAPA, audit and management review', owner: 'Quality Management', cadence: 'Monthly / scheduled review', outcome: 'Findings, corrective actions, process effectiveness, and audit outcomes tracked to closure.' },
    ],
  },
  security: {
    outputs: ['Threat model', 'Security requirements specification', 'Risk treatment plan', 'Vulnerability management log', 'Incident response procedure'],
    templates: ['Threat modelling worksheet', 'Security requirements checklist', 'Secure SDLC review form', 'SBOM and vulnerability tracker', 'Patch validation summary', 'Security incident review template'],
    controls: ['Secure design and privacy review', 'Dependency and vulnerability monitoring', 'Access control and logging', 'Post-market security surveillance'],
    operatingFramework: ['Identify threats and security requirements', 'Assess design and software controls', 'Track vulnerabilities and exposures', 'Validate and monitor security performance', 'Respond to incidents and maintain post-market safety'],
    approvalFlow: [
      { step: 'Threat model approval', approver: 'Security Lead + Engineering', decision: 'Approve security requirements, threats and mitigation design.' },
      { step: 'Release security gate', approver: 'Security + Quality', decision: 'Approve vulnerability review and patch/baseline status prior to release.' },
      { step: 'Incident response readiness', approver: 'Security Lead + Compliance', decision: 'Approve monitoring, reporting and escalation procedures for live operations.' },
      { step: 'Post-market monitoring review', approver: 'Security Lead + Management', decision: 'Approve ongoing monitoring, vulnerability closure and security risk updates.' },
    ],
    playbook: [
      { name: 'Threat and security requirements analysis', owner: 'Security Lead', cadence: 'Concept and design', outcome: 'Threat model, security requirements, and risk treatment decisions documented early.' },
      { name: 'Secure SDLC and dependency review', owner: 'Engineering + Security', cadence: 'With each release', outcome: 'Design controls, code review, SBOM, and dependency checks verified before transition to validation.' },
      { name: 'Vulnerability monitoring and patch readiness', owner: 'Security Team', cadence: 'Continuous', outcome: 'Known vulnerabilities assessed, prioritised, and triaged with documented remediation plans.' },
      { name: 'Incident readiness and privacy controls', owner: 'Security + Compliance', cadence: 'Quarterly drills and before launch', outcome: 'Monitoring, logging, privacy controls and response readiness validated for operations.' },
      { name: 'Post-market security surveillance', owner: 'Security Lead', cadence: 'Ongoing after release', outcome: 'Security incidents, patches, monitoring alerts, and change impact actions are tracked to closure.' },
    ],
  },
  rnd: {
    outputs: ['Technical requirements specification', 'Architecture and design records', 'Prototype and engineering evidence', 'Verification and issue log', 'Design transfer support pack'],
    templates: ['Technical requirements template', 'Architecture review checklist', 'Prototype test record', 'Engineering deviation log', 'Design review pack', 'Release readiness checklist'],
    controls: ['Design implementation traceability', 'Technical risk review', 'Configuration and change control', 'Verification evidence approval', 'Supplier and integration control'],
    operatingFramework: ['Define technical requirements and architecture', 'Translate requirements into design and prototype builds', 'Manage design controls and technical risk', 'Verify performance against intended use', 'Prepare design transfer and release sign-off'],
    approvalFlow: [
      { step: 'Architecture approval', approver: 'R&D Lead + Quality', decision: 'Approve technical design, interfaces, and design constraints.' },
      { step: 'Prototype review', approver: 'R&D Lead + Regulatory', decision: 'Approve prototype readiness against intended use and requirements.' },
      { step: 'Verification sign-off', approver: 'R&D Lead + Quality', decision: 'Approve technical evidence that requirements are met before validation.' },
      { step: 'Transfer readiness', approver: 'R&D Lead + Process Engineering', decision: 'Approve handover of design into production or deployment operations.' },
    ],
    playbook: [
      { name: 'Technical requirements and architecture definition', owner: 'R&D Lead', cadence: 'Concept to design', outcome: 'Requirements, architecture, and technical constraints are anchored to intended use and risk.' },
      { name: 'Prototype development and design implementation', owner: 'Engineering Team', cadence: 'Throughout development', outcome: 'Prototype builds, issues, and technical decisions are documented with traceable evidence.' },
      { name: 'Engineering verification and issue management', owner: 'R&D + Quality', cadence: 'Per build / phase gate', outcome: 'Verification results and deviations are tracked to closure with objective evidence.' },
      { name: 'Release and transfer readiness', owner: 'R&D + Process Engineering', cadence: 'Pre-transfer', outcome: 'Design evidence, technical documentation and operational handover are approved for release.' },
    ],
  },
  process: {
    outputs: ['Process map', 'Process validation plan', 'Production readiness review', 'Control plan', 'Operational handover package'],
    templates: ['Process validation protocol', 'Production readiness checklist', 'Equipment and facility qualification form', 'Process capability review sheet', 'Transfer plan template', 'Release approval record'],
    controls: ['Manufacturing process design and capability review', 'Process validation and monitoring', 'Supplier and equipment qualification', 'Change and deviation management', 'Operational release and post-release monitoring'],
    operatingFramework: ['Define process requirements and operating assumptions', 'Assess process capability and equipment readiness', 'Validate the process before commercial use', 'Transfer to controlled operations', 'Monitor ongoing process performance and change impact'],
    approvalFlow: [
      { step: 'Process concept approval', approver: 'Process Engineering + Quality', decision: 'Approve the manufacturing or deployment process design and key controls.' },
      { step: 'Process validation review', approver: 'Process Engineering + R&D + Quality', decision: 'Approve validation evidence and process capability baseline.' },
      { step: 'Transfer sign-off', approver: 'Process Engineering + Operations', decision: 'Approve production or deployment transition and operational readiness.' },
      { step: 'Release closure', approver: 'Process Engineering + Quality + Regulatory', decision: 'Approve the operational release and post-market process monitoring plan.' },
    ],
    playbook: [
      { name: 'Process design and capability planning', owner: 'Process Engineering', cadence: 'Design transfer stage', outcome: 'Manufacturing or deployment process is defined, assessed and ready for validation.' },
      { name: 'Process validation execution', owner: 'Process Engineering + Quality', cadence: 'Pre-production and launch', outcome: 'Process performance and capability evidence is accepted before release.' },
      { name: 'Equipment and supplier readiness', owner: 'Operations + Quality', cadence: 'Quarterly and at change', outcome: 'Qualified equipment, supplier controls and process conditions remain validated.' },
      { name: 'Operational handover and release', owner: 'Process Engineering + Operations', cadence: 'Before launch', outcome: 'All process, release and monitoring controls are approved for controlled production or deployment.' },
    ],
  },
}

const operatingFrameworkSteps = [
  'Define product and intended use',
  'Assess product profile, risks and regulatory route',
  'Set up QMS, governance and development controls',
  'Complete clinical, regulatory and technical evidence',
  'Verify, validate and manage security and usability',
  'Prepare submission, approval and launch readiness',
  'Monitor post-market performance and continuous improvement',
]

const operatingPillars = [
  {
    title: 'Quality system governance',
    detail: 'Design and development planning, document control, traceability, CAPA, management review, and controlled change approval set the foundation for every phase.',
  },
  {
    title: 'Change management governance',
    detail: 'Formal change control, configuration management, impact assessment, and release approval ensure design and process changes are reviewed before implementation.',
  },
  {
    title: 'Regulatory and market strategy',
    detail: 'Intended use, device classification, market mapping, territory-specific requirements, and submission readiness are governed through a single evidence trail.',
  },
  {
    title: 'Management review and audits',
    detail: 'Internal audits, quality reviews, management review meetings, corrective action tracking, and inspection readiness are active governance mechanisms across the product lifecycle.',
  },
  {
    title: 'Clinical and safety evidence',
    detail: 'Clinical evaluation, usability engineering, risk management, biocompatibility, and post-market performance are treated as continuous product evidence.',
  },
  {
    title: 'Security, AI and lifecycle monitoring',
    detail: 'Threat models, secure development, model monitoring, vulnerability management and post-market surveillance are embedded from concept through maintenance.',
  },
]

const externalAuditSchedule = [
  {
    stage: 'Stage 1',
    title: 'ISO 13485 QMS desktop audit',
    focus: 'Review of SOPs, quality procedures, training records, document control, design controls, CAPA, change control, and management review structure.',
    output: 'Gap report, corrective action list, and closure timeline before on-site review.',
    regulatoryLink: 'Supports QMS readiness for certification and strengthens the submission evidence base ahead of a formal application.',
  },
  {
    stage: 'Stage 2',
    title: 'Certification technical review',
    focus: 'Assessment of design history file, risk management, technical documentation, clinical evidence, verification and validation, supplier controls, and post-market processes.',
    output: 'Audit findings, CAPA actions, and final certification recommendation or conditions for approval.',
    regulatoryLink: 'Aligns quality system certification with regulator-ready technical files and helps confirm readiness for submission or authority review.',
  },
  {
    stage: 'Pre-submission review',
    title: 'Regulatory submission readiness gate',
    focus: 'Cross-check of intended use, technical file completeness, clinical evaluation summary, IFU, labeling, and country-specific requirements.',
    output: 'Submission checklist, gap closure plan, and executive sign-off package.',
    regulatoryLink: 'Ensures the audit trail, quality evidence, and submission dossier are ready before MDR, IVDR, or country-specific filing.',
  },
  {
    stage: 'Post-market / surveillance',
    title: 'Annual surveillance and recertification',
    focus: 'Complaint handling, vigilance reporting, CAPA effectiveness, supplier review outcomes, and management review metrics.',
    output: 'Annual surveillance report, corrective action tracking, and continued compliance review.',
    regulatoryLink: 'Maintains certificate validity and confirms that post-market obligations continue to support regulatory compliance and market approval.',
  },
]

const auditMilestones = [
  {
    title: 'QMS gap closure',
    due: 'Week 2',
    owner: 'Quality Lead',
    status: 'In progress',
    detail: 'Close documentation gaps raised in SOP review and ensure management review evidence is retained.',
  },
  {
    title: 'Document and traceability pack',
    due: 'Week 4',
    owner: 'Regulatory + Quality',
    status: 'Planned',
    detail: 'Confirm technical file traceability, change control records, and design review evidence for the stage 2 assessment.',
  },
  {
    title: 'Audit readiness meeting',
    due: 'Week 6',
    owner: 'Quality, Regulatory, Executive',
    status: 'Planned',
    detail: 'Review any audit findings, determine witness evidence needs, and prepare management briefing for the external auditor.',
  },
  {
    title: 'Certificate and submission sign-off',
    due: 'Week 8',
    owner: 'Executive leadership',
    status: 'Pending',
    detail: 'Final sign-off linking certificate readiness with submission pack approval and regulator follow-up actions.',
  },
]

const lifecycleCalendar = [
  {
    month: 'Jan',
    phase: 'Feasibility',
    start: 0,
    span: 1,
    target: 'Intended use, risk screen and regulatory route confirmed',
    auditLink: 'Initial quality strategy and project charter signed off',
  },
  {
    month: 'Feb',
    phase: 'Concept',
    start: 1,
    span: 1,
    target: 'User needs, concept review and preliminary design inputs',
    auditLink: 'Early QMS readiness check and SOP gap review',
  },
  {
    month: 'Mar',
    phase: 'Planning',
    start: 2,
    span: 1,
    target: 'Quality plan, roles and design control framework approved',
    auditLink: 'Stage 1 readiness review for quality system structure',
  },
  {
    month: 'Apr',
    phase: 'Design',
    start: 3,
    span: 1,
    target: 'Requirements, architecture and design outputs approved',
    auditLink: 'Traceability and design review evidence assembled',
  },
  {
    month: 'May',
    phase: 'Development',
    start: 4,
    span: 1,
    target: 'Prototype builds, issue log and supplier controls completed',
    auditLink: 'Design history file and change control audit trail reviewed',
  },
  {
    month: 'Jun',
    phase: 'Verification',
    start: 5,
    span: 1,
    target: 'Verification evidence completed against requirements',
    auditLink: 'QMS records assessed for audit evidence readiness',
  },
  {
    month: 'Jul',
    phase: 'Validation',
    start: 6,
    span: 1,
    target: 'Clinical, usability and performance evidence complete',
    auditLink: 'Stage 2 technical file review preparation',
  },
  {
    month: 'Aug',
    phase: 'Design Transfer',
    start: 7,
    span: 1,
    target: 'Process validation and transfer package approved',
    auditLink: 'Audit preparation and process controls review',
  },
  {
    month: 'Sep',
    phase: 'Commercialisation',
    start: 8,
    span: 1,
    target: 'Submission dossier, IFU and launch readiness package approved',
    auditLink: 'Regulatory submission gate and audit sign-off',
  },
  {
    month: 'Oct',
    phase: 'Post-market',
    start: 9,
    span: 2,
    target: 'Complaint handling, vigilance and PMCF/PMPF monitoring established',
    auditLink: 'Annual surveillance audit and recertification tracker',
  },
]

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const wizardSteps = [
  {
    id: 'intended-use',
    title: 'Intended use',
    description: 'Define the clinical problem, patient group and intended purpose before any design decisions are made.',
  },
  {
    id: 'device-profile',
    title: 'Device profile',
    description: 'Confirm the technology, class and regulated scope for the product.',
  },
  {
    id: 'quality-risk',
    title: 'Risk and QMS',
    description: 'Map the quality system requirements, risks and evidence needs to ISO 13485 and the relevant regulatory framework.',
  },
  {
    id: 'market-readiness',
    title: 'Market readiness',
    description: 'Check the territory strategy, clinical evidence needs and post-market controls required for launch.',
  },
]

const defaultForm = {
  deviceName: 'Clinical Decision Support System',
  deviceType: 'Software as a Medical Device (SaMD)',
  riskClass: 'Class IIa',
  intendedPurpose: 'The device is intended to analyse patient data and support clinical decision-making for [clinical indication] in [target population] by [user group].',
  targetPopulation: 'Clinicians and specialist care teams',
  userType: 'Healthcare professionals',
  careSetting: 'Hospital and specialist outpatient clinic',
  primaryFunction: 'identify patient risk patterns and support diagnosis and treatment planning',
  contraindications: 'Not for use in patients outside the specified target population or when alternative validated diagnostic methods are required.',
  warnings: 'The system is intended as a decision support tool and does not replace medical judgement or local clinical protocols.',
  limitations: 'The system requires valid input data and may be affected by incomplete, inaccurate, or missing information.',
  territories: 'EU, UK, US',
  clinicalData: 'Clinical evaluation plan, literature review, and validation evidence required',
  usability: 'Usability engineering file and human factors evaluation required',
  biocompatibility: 'Not applicable for software-only device',
}

const phaseDetails = {
  Feasibility: {
    objective: 'Confirm the product concept, regulatory path and intended use before design control begins.',
    outputs: ['Product brief', 'Intended use statement', 'Initial risk screen', 'Regulatory mapping'],
    checklist: ['Confirm intended purpose', 'Assess market and regulatory implications', 'Define user needs', 'Complete initial safety screen'],
    nextGate: 'Concept approval',
    summary: 'This phase establishes the product definition, intended use and route to market. It is where feasibility, regulatory path and quality strategy are set before the project enters design controls.',
    standards: ['ISO 13485', 'MDR 2017/745', 'IVDR 2017/746', 'ISO 14971', 'IEC 81001-5-1', 'AI governance: risk and intended-use definition'],
    evidence: ['Intended use statement', 'User need and problem statement', 'Initial regulatory path assessment', 'Preliminary risk screen', 'AI governance scope and risk framing', 'Cybersecurity risk context and threat analysis'],
  },
  Concept: {
    objective: 'Translate user needs and market expectations into a clear concept and early design inputs.',
    outputs: ['User needs log', 'Concept review record', 'Design input summary', 'Preliminary hazard analysis'],
    checklist: ['Capture user needs', 'Review usability and clinical value', 'Define architecture concept', 'Approve concept review'],
    nextGate: 'Planning approval',
    summary: 'The concept phase converts user needs into a design brief and early technical definition. It aligns the product idea with risk, usability and regulatory expectations before planning and design execution.',
    standards: ['ISO 13485', 'ISO 14971', 'IEC 62366-1', 'IEC 62304', 'IEC 81001-5-1', 'AI governance: model purpose, data lineage and oversight'],
    evidence: ['Concept review record', 'User needs specification', 'Initial design inputs', 'Preliminary hazard analysis', 'AI model use-case definition and data source inventory', 'Cybersecurity requirements and threat surface analysis'],
  },
  Planning: {
    objective: 'Establish project governance, QMS processes and design controls required for execution.',
    outputs: ['Project plan', 'QMS procedures', 'Traceability matrix', 'Resource and review plan'],
    checklist: ['Define deliverables and responsibilities', 'Set QMS and review cadence', 'Confirm suppliers and interfaces', 'Approve project plan'],
    nextGate: 'Design release',
    summary: 'Planning ensures the project has defined roles, review points, document control and supplier governance. It creates the framework for traceability, design reviews and controlled execution.',
    standards: ['ISO 13485', 'MDR 2017/745', 'IVDR 2017/746', 'ISO 14971', 'IEC 81001-5-1', 'AI governance: accountable oversight and lifecycle controls'],
    evidence: ['Project plan', 'Design control plan', 'QMS procedure list', 'Review and approval matrix', 'AI governance charter and responsibilities', 'Cybersecurity governance and responsibility matrix'],
  },
  Design: {
    objective: 'Convert requirements into design outputs and controlled documentation.',
    outputs: ['Requirements specification', 'Design outputs', 'Review records', 'Traceability evidence'],
    checklist: ['Open design input baseline', 'Review design controls', 'Approve output documentation', 'Control changes before release'],
    nextGate: 'Development readiness',
    summary: 'Design is the formal translation of user and regulatory requirements into specifications, architecture and controlled outputs. This phase is central to design control and traceability.',
    standards: ['ISO 13485', 'ISO 14971', 'IEC 62304', 'IEC 62366-1', 'IEC 81001-5-1', 'AI governance: design intent, explainability and model constraints'],
    evidence: ['Requirements specification', 'Design input/output records', 'Traceability matrix', 'Design review minutes', 'AI model requirements and constraints specification', 'Security requirements specification and control design'],
  },
  Development: {
    objective: 'Build the product and maintain controlled development evidence as it evolves.',
    outputs: ['Development records', 'Prototype evidence', 'Issue log', 'Supplier controls'],
    checklist: ['Document development status', 'Review design history evidence', 'Capture deviations and actions', 'Approve build readiness'],
    nextGate: 'Verification gate',
    summary: 'Development manages controlled implementation of the design, including prototypes, issues, supplier interfaces and design history records. It links engineering activity to quality system evidence.',
    standards: ['ISO 13485', 'IEC 62304', 'ISO 14971', 'IEC 60601-1', 'IEC 81001-5-1', 'AI governance: model development controls, dataset versioning and validation readiness'],
    evidence: ['Development log', 'Prototype and test records', 'Issue and deviation log', 'Supplier qualification records', 'Training data version history and model development records', 'Security development records, SBOM and dependency tracking'],
  },
  Verification: {
    objective: 'Demonstrate that outputs meet defined requirements and risk controls.',
    outputs: ['Verification protocols', 'Test results', 'Acceptance records', 'Risk control checks'],
    checklist: ['Execute verification plan', 'Review results against requirements', 'Resolve failed tests', 'Approve verification summary'],
    nextGate: 'Validation approval',
    summary: 'Verification proves the design meets its stated requirements through objective testing and review of risk controls. It provides defensible evidence for claims and safety decisions.',
    standards: ['ISO 13485', 'ISO 14971', 'IEC 62304', 'MDR 2017/745', 'IEC 81001-5-1', 'AI governance: performance, robustness and bias testing'],
    evidence: ['Verification protocol', 'Traceable test results', 'Acceptance criteria records', 'Risk control validation evidence', 'AI performance and robustness test results', 'Security verification evidence including penetration testing and patch validation'],
  },
  Validation: {
    objective: 'Demonstrate fitness for intended use under realistic conditions with evidence.',
    outputs: ['Validation plan', 'Clinical evaluation', 'Usability evidence', 'Validation report'],
    checklist: ['Define validation strategy', 'Complete sim or clinical evidence', 'Review usability and performance', 'Approve final validation summary'],
    nextGate: 'Transfer sign-off',
    summary: 'Validation confirms the product is suitable for its intended use under realistic conditions. This is where clinical evaluation, usability and performance evidence come together.',
    standards: ['ISO 13485', 'ISO 14971', 'IEC 62366-1', 'MDR 2017/745', 'IVDR 2017/746', 'IEC 81001-5-1', 'AI governance: clinical validation, fairness, human oversight and transparency'],
    evidence: ['Validation plan', 'Clinical evaluation report', 'Usability engineering file', 'Final validation summary', 'AI validation report covering safety, performance and human factors', 'Cybersecurity validation and resilience evidence'],
  },
  'Design Transfer': {
    objective: 'Transfer the product into operations and controlled production or deployment.',
    outputs: ['Transfer plan', 'Production readiness review', 'Release approval', 'Operational handover'],
    checklist: ['Confirm production process readiness', 'Review handover and support processes', 'Approve transfer package', 'Control final release'],
    nextGate: 'Commercial launch',
    summary: 'Design transfer moves the validated design into controlled production or deployment. The focus is on process readiness, operational support and documented release approval.',
    standards: ['ISO 13485', 'MDR 2017/745', 'IVDR 2017/746', 'ISO 14971', 'IEC 81001-5-1', 'AI governance: operational controls and governance of deployed models'],
    evidence: ['Transfer plan', 'Production process validation', 'Release approval record', 'Training and operational handover evidence', 'AI deployment controls and monitoring handover', 'Security release checklist and vulnerability acceptance record'],
  },
  Commercialisation: {
    objective: 'Prepare the product for launch, regulatory readiness and stakeholder sign-off.',
    outputs: ['Launch checklist', 'Submission dossier', 'Complaint and vigilance planning', 'Market launch approval'],
    checklist: ['Confirm launch readiness', 'Prepare submission package', 'Align PMCF / PMPF planning', 'Approve launch sign-off'],
    nextGate: 'Post-market surveillance',
    summary: 'Commercialisation ensures the product is ready for launch, the technical file is complete and post-market obligations are prepared. This phase is critical for regulatory confidence and market readiness.',
    standards: ['ISO 13485', 'MDR 2017/745', 'IVDR 2017/746', 'MDSAP countries (if applicable)', 'IEC 81001-5-1', 'AI governance: transparency, monitoring and post-launch accountability'],
    evidence: ['Launch readiness checklist', 'Submission dossier', 'Complaint handling plan', 'PMCF/PMPF planning evidence', 'AI transparency and model monitoring plan', 'Vulnerability disclosure and security incident response plan'],
  },
  'Maintenance / Post-market': {
    objective: 'Maintain compliance, product performance and continuous improvement after market release.',
    outputs: ['CAPA log', 'Complaint handling records', 'Vigilance reports', 'Post-market monitoring plan'],
    checklist: ['Monitor product performance', 'Track complaints and CAPAs', 'Review signal trends', 'Close the lifecycle with continuous improvement'],
    nextGate: 'Lifecycle review',
    summary: 'Post-market activities confirm ongoing safety, effectiveness and compliance. Complaints, vigilance, CAPA and surveillance become core operational controls after approval.',
    standards: ['ISO 13485', 'MDR 2017/745', 'IVDR 2017/746', 'ISO 14971', 'MDSAP reporting obligations where relevant', 'IEC 81001-5-1', 'AI governance: ongoing monitoring, drift detection and retraining controls'],
    evidence: ['Complaint records', 'CAPA log', 'Vigilance reports', 'Post-market surveillance summaries', 'AI monitoring reports, drift analysis and retraining decisions', 'Security incident records, patch status and vulnerability tracking'],
  },
}

const aiGovernanceChecklist = [
  { item: 'Define intended use and clinical risk context', complete: true },
  { item: 'Document model purpose, users, and intended population', complete: true },
  { item: 'Map dataset sources, provenance, and quality controls', complete: false },
  { item: 'Assess bias, robustness, drift, and explainability', complete: false },
  { item: 'Establish human oversight and escalation procedures', complete: false },
  { item: 'Define post-market model monitoring and retraining triggers', complete: false },
]

const aiRiskMatrix = [
  { level: 'Low', description: 'Assists with low-risk workflow suggestions and no autonomous treatment decisions.', trigger: 'Low model impact and low user dependency' },
  { level: 'Moderate', description: 'Contributes to triage or decision support but requires clinical review.', trigger: 'Influences diagnosis or prioritisation with human oversight' },
  { level: 'High', description: 'Strong impact on patient safety, treatment selection, or escalation logic.', trigger: 'Directly informs clinical action without sufficient human control' },
]

const datasetQualityChecks = [
  { name: 'Data provenance', status: 'Tracked', detail: 'Source, handling, and cleaning history documented.' },
  { name: 'Representativeness', status: 'Review', detail: 'Population and site coverage reviewed for bias risk.' },
  { name: 'Label quality', status: 'Ready', detail: 'Reference labels validated by qualified clinical reviewers.' },
  { name: 'Data drift', status: 'Monitor', detail: 'New data sets reviewed weekly for performance shifts.' },
]

const modelMonitoringTriggers = [
  'Performance drops below required sensitivity or specificity threshold',
  ' Distribution shift in target population or input data patterns',
  'Clinician override rate exceeds agreed tolerance band',
  'New safety signal or adverse event linked to model output',
  'Retraining required after significant model or dataset changes',
]

const starterPhaseChecklist = Object.fromEntries(
  phases.map((phase) => [
    phase.name,
    (phaseDetails[phase.name]?.checklist || []).map((item, index) => ({
      item,
      complete: index === 0,
    })),
  ])
)

const starterActionTracker = [
  {
    id: 1,
    title: 'Confirm intended use statement and scope',
    owner: 'Regulatory Affairs',
    dueDate: '2026-10-07',
    priority: 'High',
    status: 'In Progress',
    department: 'Regulatory',
  },
  {
    id: 2,
    title: 'Complete risk management plan and hazard analysis',
    owner: 'Quality & Risk',
    dueDate: '2026-10-12',
    priority: 'High',
    status: 'Not Started',
    department: 'Quality',
  },
  {
    id: 3,
    title: 'Verify SaMD software lifecycle documentation',
    owner: 'R&D / Technical',
    dueDate: '2026-10-18',
    priority: 'High',
    status: 'In Progress',
    department: 'R&D',
  },
  {
    id: 4,
    title: 'Approve usability engineering test plan',
    owner: 'Clinical',
    dueDate: '2026-10-20',
    priority: 'Medium',
    status: 'Pending Approval',
    department: 'Clinical',
  },
  {
    id: 5,
    title: 'Review cybersecurity threat model and controls',
    owner: 'Security & Privacy',
    dueDate: '2026-10-16',
    priority: 'High',
    status: 'Completed',
    department: 'Security',
  },
]

function App() {
  const [form, setForm] = useState(defaultForm)
  const [activeStep, setActiveStep] = useState(0)
  const [gateState, setGateState] = useState(defaultGateState)
  const [currentPage, setCurrentPage] = useState('overview')
  const [selectedPhase, setSelectedPhase] = useState('Feasibility')
  const [openMenu, setOpenMenu] = useState(null)
  const [phaseChecklist, setPhaseChecklist] = useState(starterPhaseChecklist)
  const [aiChecklist, setAiChecklist] = useState(aiGovernanceChecklist)
  const [projectActions, setProjectActions] = useState(starterActionTracker)
  const [newAction, setNewAction] = useState({
    title: '',
    owner: '',
    dueDate: '',
    priority: 'Medium',
    status: 'Not Started',
    department: 'Quality',
  })
  const [expandedInfo, setExpandedInfo] = useState(null)
  const [theme, setTheme] = useState('light')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [functionsOpen, setFunctionsOpen] = useState(true)
  const [governanceOpen, setGovernanceOpen] = useState(true)
  const [phasesOpen, setPhasesOpen] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    document.body.dataset.theme = theme
  }, [theme])

  const resetProject = () => {
    setForm(defaultForm)
    setActiveStep(0)
    setGateState(defaultGateState)
    setCurrentPage('overview')
    setSelectedPhase('Feasibility')
    setOpenMenu(null)
    setFunctionsOpen(true)
    setGovernanceOpen(true)
    setPhasesOpen(true)
    setPhaseChecklist(starterPhaseChecklist)
    setAiChecklist(aiGovernanceChecklist)
    setProjectActions(starterActionTracker)
    setNewAction({
      title: '',
      owner: '',
      dueDate: '',
      priority: 'Medium',
      status: 'Not Started',
      department: 'Quality',
    })
  }

  const handleLaunchOnboarding = () => {
    setCurrentPage('overview')
    setOpenMenu(null)
    setActiveStep(0)
    document.getElementById('assessment')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const intendedUseStatement = useMemo(() => {
    return `The ${form.deviceName} is a ${form.deviceType.toLowerCase()} intended to ${form.primaryFunction} for ${form.targetPopulation} in ${form.careSetting}. It is intended to be used by ${form.userType} to support ${form.intendedPurpose}. The device shall be used in accordance with the instructions for use, including all contraindications, warnings, and limitations. ${form.warnings} ${form.limitations}`
  }, [form])

  const recommendedStandards = useMemo(() => {
    return standardsByType[form.deviceType] || standardsByType['Software as a Medical Device (SaMD)']
  }, [form.deviceType])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const navigateToDepartment = (menuId) => {
    setCurrentPage(menuId)
    setOpenMenu(null)
  }

  const readinessChecks = useMemo(() => {
    return [
      {
        label: 'Intended use defined',
        complete: Boolean(form.intendedPurpose && form.primaryFunction),
      },
      {
        label: 'Risk class selected',
        complete: Boolean(form.riskClass),
      },
      {
        label: 'Clinical evidence mapped',
        complete: Boolean(form.clinicalData),
      },
      {
        label: 'Usability review captured',
        complete: Boolean(form.usability),
      },
      {
        label: 'Market territories set',
        complete: Boolean(form.territories),
      },
      {
        label: 'QMS controls planned',
        complete: Boolean(form.deviceName && form.deviceType),
      },
    ]
  }, [form])

  const readinessScore = useMemo(() => {
    const completed = readinessChecks.filter((item) => item.complete).length
    return Math.round((completed / readinessChecks.length) * 100)
  }, [readinessChecks])

  const currentStep = wizardSteps[activeStep]
  const activePhase = phases.find((phase) => phase.name === selectedPhase) || phases[0]
  const phaseMeta = phaseDetails[selectedPhase] || phaseDetails.Feasibility

  const goNext = () => setActiveStep((current) => Math.min(current + 1, wizardSteps.length - 1))
  const goPrev = () => setActiveStep((current) => Math.max(current - 1, 0))

  const toggleGateState = (title) => {
    setGateState((current) => ({
      ...current,
      [title]: !current[title],
    }))
  }

  const togglePhaseTask = (phaseName, item) => {
    setPhaseChecklist((current) => ({
      ...current,
      [phaseName]: (current[phaseName] || []).map((entry) =>
        entry.item === item ? { ...entry, complete: !entry.complete } : entry
      ),
    }))
  }

  const phaseProgress = (phaseName) => {
    const tasks = phaseChecklist[phaseName] || []
    if (!tasks.length) return 0
    const completed = tasks.filter((entry) => entry.complete).length
    return Math.round((completed / tasks.length) * 100)
  }

  const aiProgress = useMemo(() => {
    if (!aiChecklist.length) return 0
    const completed = aiChecklist.filter((item) => item.complete).length
    return Math.round((completed / aiChecklist.length) * 100)
  }, [aiChecklist])

  const phaseCompletionAverage = useMemo(() => {
    const values = phases.map((phase) => phaseProgress(phase.name))
    const total = values.reduce((sum, value) => sum + value, 0)
    return values.length ? Math.round(total / values.length) : 0
  }, [phaseChecklist])

  const gateCompletion = useMemo(() => {
    const values = Object.values(gateState)
    if (!values.length) return 0
    const completed = values.filter(Boolean).length
    return Math.round((completed / values.length) * 100)
  }, [gateState])

  const projectHealth = useMemo(() => {
    return Math.round((readinessScore + aiProgress + phaseCompletionAverage + gateCompletion) / 4)
  }, [readinessScore, aiProgress, phaseCompletionAverage, gateCompletion])

  const toggleAiTask = (item) => {
    setAiChecklist((current) =>
      current.map((entry) =>
        entry.item === item ? { ...entry, complete: !entry.complete } : entry
      )
    )
  }

  const updateAction = (id, field, value) => {
    setProjectActions((current) =>
      current.map((task) => (task.id === id ? { ...task, [field]: value } : task))
    )
  }

  const addAction = () => {
    if (!newAction.title.trim()) return

    setProjectActions((current) => [
      {
        id: Date.now(),
        title: newAction.title.trim(),
        owner: newAction.owner.trim() || 'Unassigned',
        dueDate: newAction.dueDate || 'TBD',
        priority: newAction.priority,
        status: newAction.status,
        department: newAction.department,
      },
      ...current,
    ])

    setNewAction({
      title: '',
      owner: '',
      dueDate: '',
      priority: 'Medium',
      status: 'Not Started',
      department: 'Quality',
    })
  }

  const trackerMetrics = useMemo(() => {
    const total = projectActions.length
    const completed = projectActions.filter((item) => item.status === 'Completed').length
    const overdue = projectActions.filter((item) => {
      if (!item.dueDate || item.dueDate === 'TBD') return false
      return new Date(item.dueDate) < new Date() && item.status !== 'Completed'
    }).length
    const highPriority = projectActions.filter((item) => item.priority === 'High').length

    return {
      total,
      completed,
      overdue,
      highPriority,
      completionRate: total ? Math.round((completed / total) * 100) : 0,
    }
  }, [projectActions])

  const exportTrackerToCsv = () => {
    const rows = [
      ['Title', 'Owner', 'Due Date', 'Department', 'Priority', 'Status'],
      ...projectActions.map((task) => [
        task.title,
        task.owner,
        task.dueDate === 'TBD' ? 'TBD' : task.dueDate,
        task.department,
        task.priority,
        task.status,
      ]),
    ]

    const csvContent = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'project-action-tracker.csv'
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  const exportTrackerToPdf = () => {
    const printWindow = window.open('', '_blank', 'width=900,height=700')

    if (!printWindow) {
      return
    }

    const rows = projectActions
      .map(
        (task) => `
          <tr>
            <td>${task.title}</td>
            <td>${task.owner}</td>
            <td>${task.dueDate === 'TBD' ? 'TBD' : task.dueDate}</td>
            <td>${task.department}</td>
            <td>${task.priority}</td>
            <td>${task.status}</td>
          </tr>
        `
      )
      .join('')

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>Project Action Tracker</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #10233b; }
            h1 { margin-bottom: 16px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #dfe9f8; padding: 10px 12px; text-align: left; font-size: 12px; }
            th { background: #edf4ff; }
            .meta { color: #415b7d; margin-bottom: 12px; }
          </style>
        </head>
        <body>
          <h1>Project Action Tracker</h1>
          <div class="meta">Exported on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</div>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Owner</th>
                <th>Due Date</th>
                <th>Department</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  const territoryRequirements = {
    EU: ['MDR 2017/745 or IVDR 2017/746', 'ISO 13485', 'Technical documentation and clinical evidence', 'Design control and risk management'],
    UK: ['UKCA route', 'ISO 13485', 'Post-market vigilance and labeling', 'Technical file and declaration of conformity'],
    US: ['FDA device registration / listing', 'QMSR / 21 CFR Part 820 alignment', 'Design control evidence', 'MDSAP expectation for relevant QMS evidence'],
    Canada: ['Health Canada licensing pathway', 'ISO 13485 alignment', 'QMS and design history evidence', 'Device classification and labeling'],
    Brazil: ['ANVISA registration and vigilance', 'ISO 13485 and risk management evidence', 'Labeling and local technical file requirements', 'Post-market surveillance readiness'],
    Japan: ['PMDA submission requirements', 'QMS and product quality evidence', 'Clinical or performance evaluation as needed', 'Compliance with local registration requirements'],
    Australia: ['TGA sponsor and registration requirements', 'ISO 13485 evidence', 'Risk and benefit documentation', 'Quality and post-market obligations'],
  }

  const territoryList = useMemo(() => {
    return form.territories
      .split(',')
      .map((territory) => territory.trim())
      .filter(Boolean)
  }, [form.territories])

  const mdsapCountries = useMemo(() => {
    const countries = ['US', 'Canada', 'Brazil', 'Japan', 'Australia']
    return countries.filter((country) => territoryList.some((territory) => territory.toLowerCase().includes(country.toLowerCase())))
  }, [territoryList])

  const regulatoryContext = useMemo(() => {
    const base = [
      'ISO 13485',
      form.deviceType === 'In vitro diagnostic device' ? 'IVDR 2017/746' : 'MDR 2017/745',
      'ISO 14971',
      'IEC 81001-5-1',
      'AI governance: intended use, risk governance, model oversight and post-market monitoring',
    ]

    if (form.deviceType === 'Software as a Medical Device (SaMD)') {
      base.push('IEC 62304', 'IEC 82304-1', 'IEC 62366-1', 'IEC 81001-5-1')
    }

    if (form.deviceType === 'Hardware medical device') {
      base.push('IEC 60601-1', 'IEC 62366-1')
    }

    if (form.deviceType === 'In vitro diagnostic device') {
      base.push('ISO 15197')
    }

    if (mdsapCountries.length) {
      base.push(`MDSAP countries: ${mdsapCountries.join(', ')}`)
    } else {
      base.push('MDSAP countries: not applicable to the current territory selection')
    }

    return [...new Set(base)]
  }, [form.deviceType, mdsapCountries])

  const regulatoryMap = useMemo(() => {
    if (!territoryList.length) {
      return [{ territory: 'No territories selected', requirements: ['Add planned markets to map regulatory expectations.'] }]
    }

    return territoryList.map((territory) => ({
      territory,
      requirements: territoryRequirements[territory] || ['Country-specific regulatory review required'],
    }))
  }, [territoryList])

  const exportPhaseSummary = () => {
    const summary = [
      `Phase: ${selectedPhase}`,
      `Objective: ${phaseMeta.objective}`,
      '',
      'Required outputs:',
      ...phaseMeta.outputs.map((item) => `- ${item}`),
      '',
      'Evidence required:',
      ...phaseMeta.evidence.map((item) => `- ${item}`),
      '',
      'Regulatory context:',
      ...regulatoryContext.map((item) => `- ${item}`),
      '',
      'Territory map:',
      ...regulatoryMap.flatMap(({ territory, requirements }) => [
        `- ${territory}:`,
        ...requirements.map((req) => `  - ${req}`),
      ]),
    ].join('\n')

    const blob = new Blob([summary], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${selectedPhase.toLowerCase().replace(/\s+/g, '-')}-summary.txt`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const topbarTitle = {
    overview: 'Programme overview',
    'org-map': 'Organisation map',
    'audit-certification': 'Audit & certification',
    'ai-governance': 'Governance',
    phase: selectedPhase,
    clinical: 'Clinical affairs',
    regulatory: 'Regulatory affairs',
    quality: 'Quality assurance',
    risk: 'Risk management',
    security: 'Security',
    rnd: 'R&D / technical',
    process: 'Process engineering',
  }[currentPage] || 'Programme overview'

  const renderedPage = (() => {
    if (currentPage === 'clinical') {
      return (
        <section className="deliverables-block phase-detail-page">
          <div className="section-heading compact phase-detail-header">
            <p className="section-tag">Department</p>
            <h2>Clinical affairs</h2>
            <p>Clinical evidence generation, literature review, evaluation planning, and patient safety alignment.</p>
          </div>

          <div className="department-grid">
            <div className="summary-block">
              <p className="standards-label">Core activities</p>
              <ul className="summary-list">
                <li>Clinical evaluation plan and strategy</li>
                <li>Literature review and evidence gap analysis</li>
                <li>Study protocol and investigator readiness</li>
                <li>Clinical data management and adjudication</li>
                <li>Usability engineering and human factors assessment</li>
                <li>Biocompatibility and safety data review</li>
              </ul>
            </div>

            <div className="summary-block">
              <p className="standards-label">Key standards</p>
              <div className="standards-list">
                <span className="standard-pill">MDR 2017/745</span>
                <span className="standard-pill">IVDR 2017/746</span>
                <span className="standard-pill">ISO 14155</span>
                <span className="standard-pill">IEC 62366-1</span>
                <span className="standard-pill">ISO 14971</span>
              </div>
            </div>
          </div>

          <div className="department-detail-grid">
            <div className="summary-block">
              <p className="standards-label">Typical outputs</p>
              <ul className="summary-list">
                {departmentDetails.clinical.outputs.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="summary-block">
              <p className="standards-label">Recommended templates</p>
              <ul className="summary-list">
                {departmentDetails.clinical.templates.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="summary-block full-span">
              <p className="standards-label">Key controls</p>
              <ul className="summary-list">
                {departmentDetails.clinical.controls.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="summary-block full-span">
              <p className="standards-label">Operating framework</p>
              <ul className="summary-list">
                {departmentDetails.clinical.operatingFramework.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="summary-block full-span">
              <p className="standards-label">Department operating playbook</p>
              <div className="playbook-grid">
                {departmentDetails.clinical.playbook.map((entry) => (
                  <div key={entry.name} className="playbook-card">
                    <strong>{entry.name}</strong>
                    <p><span>Owner:</span> {entry.owner}</p>
                    <p><span>Cadence:</span> {entry.cadence}</p>
                    <p><span>Outcome:</span> {entry.outcome}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="summary-block full-span">
              <p className="standards-label">Approval flow</p>
              <div className="approval-flow-list">
                {departmentDetails.clinical.approvalFlow.map((item) => (
                  <div key={item.step} className="approval-flow-item">
                    <strong>{item.step}</strong>
                    <p><span>Approver:</span> {item.approver}</p>
                    <p><span>Decision:</span> {item.decision}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )
    }

    if (currentPage === 'regulatory') {
      return (
        <section className="deliverables-block phase-detail-page">
          <div className="section-heading compact phase-detail-header">
            <p className="section-tag">Department</p>
            <h2>Regulatory Affairs</h2>
            <p>Regulatory strategy, country requirements, software and hardware pathway readiness, and submission preparation.</p>
          </div>

          <div className="department-grid">
            <div className="summary-block">
              <p className="standards-label">Regulatory areas</p>
              <ul className="summary-list">
                <li>Regulatory strategy and product classification</li>
                <li>Territory-by-territory requirements</li>
                <li>SaMD and hardware pathway review</li>
                <li>Biological / toxicology and materials controls</li>
                <li>Labelling, packaging, IFU and UDI planning</li>
                <li>Sterilisation and manufacturing compliance</li>
              </ul>
            </div>

            <div className="summary-block">
              <p className="standards-label">Relevant framework</p>
              <div className="standards-list">
                <span className="standard-pill">MDR 2017/745</span>
                <span className="standard-pill">IVDR 2017/746</span>
                <span className="standard-pill">ISO 13485</span>
                <span className="standard-pill">IEC 62304</span>
                <span className="standard-pill">IEC 82304-1</span>
                <span className="standard-pill">IEC 60601-1</span>
              </div>
            </div>
          </div>

          <div className="department-detail-grid">
            <div className="summary-block">
              <p className="standards-label">Typical outputs</p>
              <ul className="summary-list">
                {departmentDetails.regulatory.outputs.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="summary-block">
              <p className="standards-label">Recommended templates</p>
              <ul className="summary-list">
                {departmentDetails.regulatory.templates.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="summary-block full-span">
              <p className="standards-label">Key controls</p>
              <ul className="summary-list">
                {departmentDetails.regulatory.controls.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="summary-block full-span">
              <p className="standards-label">Operating framework</p>
              <ul className="summary-list">
                {departmentDetails.regulatory.operatingFramework.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="summary-block full-span">
              <p className="standards-label">Department operating playbook</p>
              <div className="playbook-grid">
                {departmentDetails.regulatory.playbook.map((entry) => (
                  <div key={entry.name} className="playbook-card">
                    <strong>{entry.name}</strong>
                    <p><span>Owner:</span> {entry.owner}</p>
                    <p><span>Cadence:</span> {entry.cadence}</p>
                    <p><span>Outcome:</span> {entry.outcome}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="summary-block full-span">
              <p className="standards-label">Approval flow</p>
              <div className="approval-flow-list">
                {departmentDetails.regulatory.approvalFlow.map((item) => (
                  <div key={item.step} className="approval-flow-item">
                    <strong>{item.step}</strong>
                    <p><span>Approver:</span> {item.approver}</p>
                    <p><span>Decision:</span> {item.decision}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )
    }

    if (currentPage === 'risk') {
      return (
        <section className="deliverables-block phase-detail-page">
          <div className="section-heading compact phase-detail-header">
            <p className="section-tag">Department</p>
            <h2>Risk management</h2>
            <p>Risk evaluation, hazard analysis, residual risk acceptance, and safety decision governance.</p>
          </div>

          <div className="department-grid">
            <div className="summary-block">
              <p className="standards-label">Risk focus</p>
              <ul className="summary-list">
                <li>Risk management plan and hazard analysis</li>
                <li>Risk-benefit analysis and residual risk acceptance</li>
                <li>Issue and change impact assessment</li>
                <li>Safety signal monitoring and escalation</li>
                <li>Design and post-market risk review</li>
              </ul>
            </div>

            <div className="summary-block">
              <p className="standards-label">Relevant standards</p>
              <div className="standards-list">
                <span className="standard-pill">ISO 14971</span>
                <span className="standard-pill">MDR 2017/745</span>
                <span className="standard-pill">IVDR 2017/746</span>
                <span className="standard-pill">IEC 62366-1</span>
              </div>
            </div>
          </div>

          <div className="department-detail-grid">
            <div className="summary-block">
              <p className="standards-label">Typical outputs</p>
              <ul className="summary-list">
                <li>Risk management plan</li>
                <li>Hazard log and risk analysis</li>
                <li>Risk-benefit evaluation</li>
                <li>Residual risk acceptance record</li>
                <li>Change impact and safety review</li>
              </ul>
            </div>

            <div className="summary-block">
              <p className="standards-label">Recommended templates</p>
              <ul className="summary-list">
                <li>Risk management plan template</li>
                <li>Hazard analysis worksheet</li>
                <li>Risk control matrix</li>
                <li>Residual risk review form</li>
                <li>Safety signal log</li>
              </ul>
            </div>

            <div className="summary-block full-span">
              <p className="standards-label">Key controls</p>
              <ul className="summary-list">
                <li>Risk identification and evaluation</li>
                <li>Risk control and verification</li>
                <li>Residual risk review and acceptance</li>
                <li>Change impact review for safety</li>
                <li>Monitoring and post-market vigilance</li>
              </ul>
            </div>
          </div>
        </section>
      )
    }

    if (currentPage === 'quality') {
      return (
        <section className="deliverables-block phase-detail-page">
          <div className="section-heading compact phase-detail-header">
            <p className="section-tag">Department</p>
            <h2>Quality assurance</h2>
            <p>Design controls, procedure governance, supplier control, and quality system discipline.</p>
          </div>

          <div className="department-grid">
            <div className="summary-block">
              <p className="standards-label">Quality focus</p>
              <ul className="summary-list">
                <li>Design and development planning</li>
                <li>Change control and CAPA</li>
                <li>Supplier qualification and purchasing controls</li>
                <li>Training and competence expectation</li>
                <li>Audit and management review readiness</li>
                <li>Document control and quality oversight</li>
              </ul>
            </div>

            <div className="summary-block">
              <p className="standards-label">Relevant standards</p>
              <div className="standards-list">
                <span className="standard-pill">ISO 13485</span>
                <span className="standard-pill">ISO 9001</span>
                <span className="standard-pill">MDR 2017/745</span>
                <span className="standard-pill">IVDR 2017/746</span>
              </div>
            </div>
          </div>

          <div className="department-detail-grid">
            <div className="summary-block">
              <p className="standards-label">Typical outputs</p>
              <ul className="summary-list">
                {departmentDetails.quality.outputs.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="summary-block">
              <p className="standards-label">Recommended templates</p>
              <ul className="summary-list">
                {departmentDetails.quality.templates.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="summary-block full-span">
              <p className="standards-label">Key controls</p>
              <ul className="summary-list">
                {departmentDetails.quality.controls.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="summary-block full-span">
              <p className="standards-label">Operating framework</p>
              <ul className="summary-list">
                {departmentDetails.quality.operatingFramework.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="summary-block full-span">
              <p className="standards-label">Department operating playbook</p>
              <div className="playbook-grid">
                {departmentDetails.quality.playbook.map((entry) => (
                  <div key={entry.name} className="playbook-card">
                    <strong>{entry.name}</strong>
                    <p><span>Owner:</span> {entry.owner}</p>
                    <p><span>Cadence:</span> {entry.cadence}</p>
                    <p><span>Outcome:</span> {entry.outcome}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="summary-block full-span">
              <p className="standards-label">Approval flow</p>
              <div className="approval-flow-list">
                {departmentDetails.quality.approvalFlow.map((item) => (
                  <div key={item.step} className="approval-flow-item">
                    <strong>{item.step}</strong>
                    <p><span>Approver:</span> {item.approver}</p>
                    <p><span>Decision:</span> {item.decision}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )
    }

    if (currentPage === 'security') {
      return (
        <section className="deliverables-block phase-detail-page">
          <div className="section-heading compact phase-detail-header">
            <p className="section-tag">Department</p>
            <h2>Security & Privacy</h2>
            <p>Threat modelling, secure product development, monitoring, privacy compliance and incident readiness.</p>
          </div>

          <div className="department-grid">
            <div className="summary-block">
              <p className="standards-label">Security focus</p>
              <ul className="summary-list">
                <li>Threat model and secure design review</li>
                <li>Secure SDLC and software controls</li>
                <li>Vulnerability management and SBOM tracking</li>
                <li>Monitoring, logging and incident response</li>
                <li>Privacy impact assessment and data handling controls</li>
                <li>Post-market security monitoring and patch governance</li>
              </ul>
            </div>

            <div className="summary-block">
              <p className="standards-label">Relevant standards</p>
              <div className="standards-list">
                <span className="standard-pill">IEC 81001-5-1</span>
                <span className="standard-pill">IEC 62304</span>
                <span className="standard-pill">IEC 82304-1</span>
                <span className="standard-pill">ISO 14971</span>
                <span className="standard-pill">ISO 13485</span>
              </div>
            </div>
          </div>

          <div className="department-detail-grid">
            <div className="summary-block">
              <p className="standards-label">Typical outputs</p>
              <ul className="summary-list">
                {departmentDetails.security.outputs.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="summary-block">
              <p className="standards-label">Recommended templates</p>
              <ul className="summary-list">
                {departmentDetails.security.templates.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="summary-block full-span">
              <p className="standards-label">Key controls</p>
              <ul className="summary-list">
                {departmentDetails.security.controls.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="summary-block full-span">
              <p className="standards-label">Operating framework</p>
              <ul className="summary-list">
                {departmentDetails.security.operatingFramework.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="summary-block full-span">
              <p className="standards-label">Department operating playbook</p>
              <div className="playbook-grid">
                {departmentDetails.security.playbook.map((entry) => (
                  <div key={entry.name} className="playbook-card">
                    <strong>{entry.name}</strong>
                    <p><span>Owner:</span> {entry.owner}</p>
                    <p><span>Cadence:</span> {entry.cadence}</p>
                    <p><span>Outcome:</span> {entry.outcome}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="summary-block full-span">
              <p className="standards-label">Approval flow</p>
              <div className="approval-flow-list">
                {departmentDetails.security.approvalFlow.map((item) => (
                  <div key={item.step} className="approval-flow-item">
                    <strong>{item.step}</strong>
                    <p><span>Approver:</span> {item.approver}</p>
                    <p><span>Decision:</span> {item.decision}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )
    }

    if (currentPage === 'rnd') {
      return (
        <section className="deliverables-block phase-detail-page">
          <div className="section-heading compact phase-detail-header">
            <p className="section-tag">Department</p>
            <h2>R&D / Technical</h2>
            <p>Technical development, engineering evidence, design implementation, and technical verification throughout the lifecycle.</p>
          </div>

          <div className="department-grid">
            <div className="summary-block">
              <p className="standards-label">Technical focus</p>
              <ul className="summary-list">
                <li>Technical requirements and architecture definition</li>
                <li>Prototype development and design implementation</li>
                <li>Verification and technical evidence generation</li>
                <li>Configuration and design change control</li>
                <li>Design transfer support for production or deployment</li>
                <li>Technical risk management and issue resolution</li>
              </ul>
            </div>

            <div className="summary-block">
              <p className="standards-label">Relevant standards</p>
              <div className="standards-list">
                <span className="standard-pill">ISO 13485</span>
                <span className="standard-pill">IEC 62304</span>
                <span className="standard-pill">ISO 14971</span>
                <span className="standard-pill">IEC 62366-1</span>
                <span className="standard-pill">IEC 81001-5-1</span>
              </div>
            </div>
          </div>

          <div className="department-detail-grid">
            <div className="summary-block">
              <p className="standards-label">Typical outputs</p>
              <ul className="summary-list">
                {departmentDetails.rnd.outputs.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="summary-block">
              <p className="standards-label">Recommended templates</p>
              <ul className="summary-list">
                {departmentDetails.rnd.templates.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="summary-block full-span">
              <p className="standards-label">Key controls</p>
              <ul className="summary-list">
                {departmentDetails.rnd.controls.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="summary-block full-span">
              <p className="standards-label">Operating framework</p>
              <ul className="summary-list">
                {departmentDetails.rnd.operatingFramework.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="summary-block full-span">
              <p className="standards-label">Department operating playbook</p>
              <div className="playbook-grid">
                {departmentDetails.rnd.playbook.map((entry) => (
                  <div key={entry.name} className="playbook-card">
                    <strong>{entry.name}</strong>
                    <p><span>Owner:</span> {entry.owner}</p>
                    <p><span>Cadence:</span> {entry.cadence}</p>
                    <p><span>Outcome:</span> {entry.outcome}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="summary-block full-span">
              <p className="standards-label">Approval flow</p>
              <div className="approval-flow-list">
                {departmentDetails.rnd.approvalFlow.map((item) => (
                  <div key={item.step} className="approval-flow-item">
                    <strong>{item.step}</strong>
                    <p><span>Approver:</span> {item.approver}</p>
                    <p><span>Decision:</span> {item.decision}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )
    }

    if (currentPage === 'process') {
      return (
        <section className="deliverables-block phase-detail-page">
          <div className="section-heading compact phase-detail-header">
            <p className="section-tag">Department</p>
            <h2>Process Engineering</h2>
            <p>Manufacturing readiness, process validation, process control, and transfer to controlled operations.</p>
          </div>

          <div className="department-grid">
            <div className="summary-block">
              <p className="standards-label">Process focus</p>
              <ul className="summary-list">
                <li>Process design and capability assessment</li>
                <li>Manufacturing or deployment readiness review</li>
                <li>Process validation and control plan approval</li>
                <li>Supplier and equipment qualification</li>
                <li>Transfer to operations and release governance</li>
                <li>Post-transfer monitoring and process change management</li>
              </ul>
            </div>

            <div className="summary-block">
              <p className="standards-label">Relevant standards</p>
              <div className="standards-list">
                <span className="standard-pill">ISO 13485</span>
                <span className="standard-pill">ISO 14971</span>
                <span className="standard-pill">MDR 2017/745</span>
                <span className="standard-pill">IVDR 2017/746</span>
                <span className="standard-pill">Good manufacturing / operations readiness</span>
              </div>
            </div>
          </div>

          <div className="department-detail-grid">
            <div className="summary-block">
              <p className="standards-label">Typical outputs</p>
              <ul className="summary-list">
                {departmentDetails.process.outputs.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="summary-block">
              <p className="standards-label">Recommended templates</p>
              <ul className="summary-list">
                {departmentDetails.process.templates.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="summary-block full-span">
              <p className="standards-label">Key controls</p>
              <ul className="summary-list">
                {departmentDetails.process.controls.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="summary-block full-span">
              <p className="standards-label">Operating framework</p>
              <ul className="summary-list">
                {departmentDetails.process.operatingFramework.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="summary-block full-span">
              <p className="standards-label">Department operating playbook</p>
              <div className="playbook-grid">
                {departmentDetails.process.playbook.map((entry) => (
                  <div key={entry.name} className="playbook-card">
                    <strong>{entry.name}</strong>
                    <p><span>Owner:</span> {entry.owner}</p>
                    <p><span>Cadence:</span> {entry.cadence}</p>
                    <p><span>Outcome:</span> {entry.outcome}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="summary-block full-span">
              <p className="standards-label">Approval flow</p>
              <div className="approval-flow-list">
                {departmentDetails.process.approvalFlow.map((item) => (
                  <div key={item.step} className="approval-flow-item">
                    <strong>{item.step}</strong>
                    <p><span>Approver:</span> {item.approver}</p>
                    <p><span>Decision:</span> {item.decision}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )
    }

    if (currentPage === 'ai-governance') {
      return (
        <section className="deliverables-block phase-detail-page">
          <div className="section-heading compact phase-detail-header">
            <p className="section-tag">Governance</p>
            <h2>AI Governance</h2>
            <p>Model development, oversight, transparency and post-market monitoring for AI-enabled medical devices and software.</p>
          </div>

          <div className="phase-detail-layout">
            <div className="phase-detail-main">
              <div className="summary-block">
                <p className="standards-label">AI governance objectives</p>
                <p className="generated-text">
                  Ensure the AI-enabled product is clinically appropriate, evidence-based, transparent, monitored and governed across the product lifecycle. This covers model risk, intended use, dataset control, validation, human oversight and ongoing surveillance.
                </p>
              </div>

              <div className="summary-block">
                <p className="standards-label">Required controls</p>
                <ul className="summary-list">
                  <li>Define intended use, target users, and clinical decision impact</li>
                  <li>Assess data provenance, representativeness and quality risks</li>
                  <li>Document model purpose, constraints, and limits of use</li>
                  <li>Evaluate bias, robustness, drift and explainability</li>
                  <li>Set human oversight and escalation pathways</li>
                  <li>Monitor model performance and retrain when thresholds are exceeded</li>
                </ul>
              </div>

              <div className="summary-block">
                <p className="standards-label">Checklist</p>
                <div className="phase-task-list">
                  {aiChecklist.map((entry) => (
                    <button
                      key={entry.item}
                      type="button"
                      className={entry.complete ? 'phase-task complete' : 'phase-task'}
                      onClick={() => toggleAiTask(entry.item)}
                    >
                      <span className="task-check">{entry.complete ? '✓' : '○'}</span>
                      <span>{entry.item}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="summary-block">
                <p className="standards-label">Progress</p>
                <div className="progress-bar-wrap">
                  <div className="progress-bar" style={{ width: `${aiProgress}%` }} />
                </div>
                <p className="generated-text progress-note">{aiProgress}% complete for AI governance maturity.</p>
              </div>
            </div>

            <aside className="phase-detail-side">
              <div className="summary-block">
                <p className="standards-label">Applicable standards</p>
                <div className="phase-info-badges stacked">
                  <span className="standard-pill">ISO 13485</span>
                  <span className="standard-pill">ISO 14971</span>
                  <span className="standard-pill">IEC 62304</span>
                  <span className="standard-pill">IEC 62366-1</span>
                  <span className="standard-pill">IEC 81001-5-1</span>
                  <span className="standard-pill">MDR 2017/745</span>
                  <span className="standard-pill">IVDR 2017/746</span>
                  <span className="standard-pill">AI lifecycle governance</span>
                </div>
              </div>

              <div className="summary-block">
                <p className="standards-label">Regulatory / quality signals</p>
                <ul className="summary-list">
                  <li>Clinical evaluation and safety evidence remain mandatory</li>
                  <li>Risk controls must address bias, false alarms and incorrect recommendations</li>
                  <li>Transparency and human override expectations must be defined</li>
                  <li>Post-market monitoring must include drift and performance surveillance</li>
                </ul>
              </div>

              <div className="summary-block">
                <p className="standards-label">AI risk classification</p>
                <div className="ai-risk-grid">
                  {aiRiskMatrix.map((risk) => (
                    <div key={risk.level} className="risk-card">
                      <div className="risk-card-header">
                        <strong>{risk.level}</strong>
                        <span className={`risk-dot ${risk.level.toLowerCase()}`} />
                      </div>
                      <p>{risk.description}</p>
                      <small>{risk.trigger}</small>
                    </div>
                  ))}
                </div>
              </div>

              <div className="summary-block">
                <p className="standards-label">Dataset quality checks</p>
                <div className="quality-grid">
                  {datasetQualityChecks.map((item) => (
                    <div key={item.name} className="quality-card">
                      <div className="quality-header">
                        <strong>{item.name}</strong>
                        <span className="quality-badge">{item.status}</span>
                      </div>
                      <p>{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="summary-block">
                <p className="standards-label">Monitoring triggers</p>
                <ul className="summary-list">
                  {modelMonitoringTriggers.map((trigger) => (
                    <li key={trigger}>{trigger}</li>
                  ))}
                </ul>
              </div>

              <button type="button" className="primary-button full-width-button" onClick={() => setCurrentPage('overview')}>
                Return to overview
              </button>
            </aside>
          </div>
        </section>
      )
    }

    if (currentPage === 'audit-certification') {
      return (
        <section className="deliverables-block phase-detail-page">
          <div className="section-heading compact phase-detail-header">
            <p className="section-tag">Governance</p>
            <h2>Audit & Certification</h2>
            <p>External audit planning, certification milestones, and submission-linked governance actions for QMS and product approval readiness.</p>
          </div>

          <div className="audit-overview-grid">
            <div className="audit-panel summary-block">
              <p className="standards-label">Purpose</p>
              <p className="generated-text">
                The external audit schedule provides a clear pathway from QMS readiness to certificate award and regulatory submission readiness. This keeps senior leadership, quality, and regulatory teams aligned on the evidence required for certification decisions and market submission milestones.
              </p>
            </div>

            <div className="audit-panel summary-block">
              <p className="standards-label">Key governance outputs</p>
              <ul className="summary-list">
                <li>External audit calendar and owner accountability</li>
                <li>Stage 1 and stage 2 evidence checklist</li>
                <li>Corrective action closure tracking</li>
                <li>Submission and certificate sign-off readiness</li>
                <li>Monitoring of surveillance and recertification</li>
              </ul>
            </div>
          </div>

          <div className="audit-steps-grid">
            {externalAuditSchedule.map((audit) => (
              <div key={audit.title} className="audit-step-card">
                <div className="audit-card-header">
                  <span className="audit-stage">{audit.stage}</span>
                  <strong>{audit.title}</strong>
                </div>
                <p><span>Focus:</span> {audit.focus}</p>
                <p><span>Output:</span> {audit.output}</p>
                <p><span>Regulatory link:</span> {audit.regulatoryLink}</p>
              </div>
            ))}
          </div>

          <div className="audit-timeline-block summary-block">
            <p className="standards-label">Lifecycle Gantt</p>
            <div className="gantt-shell">
              <div className="gantt-months" aria-label="Lifecycle months">
                {monthLabels.map((month) => (
                  <span key={month}>{month}</span>
                ))}
              </div>

              <div className="gantt-grid">
                {lifecycleCalendar.map((entry) => (
                  <div key={`${entry.month}-${entry.phase}`} className="gantt-row">
                    <div className="gantt-label">
                      <strong>{entry.phase}</strong>
                      <small>{entry.month}</small>
                    </div>
                    <div className="gantt-track" aria-label={`${entry.phase} timeline`}>
                      <div
                        className="gantt-bar"
                        style={{
                          gridColumn: `${entry.start + 1} / span ${entry.span}`,
                        }}
                      >
                        <span>{entry.phase}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="gantt-legend">
              <span><i className="legend-dot phase-dot" /> Product phase</span>
              <span><i className="legend-dot audit-dot" /> Audit / certification gate</span>
            </div>

            <div className="calendar-summary-grid">
              {lifecycleCalendar.map((entry) => (
                <div key={`${entry.month}-${entry.phase}-summary`} className="calendar-month-card">
                  <span className="calendar-month">{entry.month}</span>
                  <strong>{entry.phase}</strong>
                  <p><span>Target:</span> {entry.target}</p>
                  <p><span>Audit link:</span> {entry.auditLink}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="audit-timeline-block summary-block">
            <p className="standards-label">Milestone tracker</p>
            <div className="audit-milestone-list">
              {auditMilestones.map((item) => (
                <div key={item.title} className="audit-milestone-item">
                  <div className="audit-milestone-header">
                    <strong>{item.title}</strong>
                    <span className="audit-status">{item.status}</span>
                  </div>
                  <p><span>Due:</span> {item.due}</p>
                  <p><span>Owner:</span> {item.owner}</p>
                  <p>{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="phase-action-row">
            <button type="button" className="primary-button full-width-button" onClick={() => setCurrentPage('overview')}>
              Return to overview
            </button>
          </div>
        </section>
      )
    }

    if (currentPage === 'org-map') {
      return (
        <section className="deliverables-block phase-detail-page">
          <div className="section-heading compact phase-detail-header">
            <p className="section-tag">Operating model</p>
            <h2>Full organisation map</h2>
            <p>An executive view of the functions, governance bodies, and cross-functional teams required to deliver a regulated medical device.</p>
          </div>

          <div className="org-map-container">
            <div className="org-map-tier executive">
              <div className="org-map-card org-map-lead">
                <strong>Executive leadership</strong>
                <ul>
                  <li>CEO</li>
                  <li>Chief Quality Officer</li>
                  <li>Head of Regulatory Affairs</li>
                  <li>Head of Engineering</li>
                  <li>Head of Clinical & Safety</li>
                </ul>
              </div>
            </div>

            <div className="org-map-tier core">
              <div className="org-map-card">
                <strong>Programme & portfolio</strong>
                <ul>
                  <li>Product Strategy</li>
                  <li>Programme Management</li>
                  <li>Commercialisation</li>
                  <li>Clinical / market alignment</li>
                </ul>
              </div>

              <div className="org-map-card">
                <strong>Core development</strong>
                <ul>
                  <li>R&D / Technical</li>
                  <li>Process Engineering</li>
                  <li>Quality & Risk</li>
                  <li>Clinical</li>
                  <li>Regulatory Affairs</li>
                </ul>
              </div>

              <div className="org-map-card">
                <strong>Governance & assurance</strong>
                <ul>
                  <li>AI Governance Board</li>
                  <li>Cybersecurity Lead</li>
                  <li>Risk Review Committee</li>
                  <li>Management Review</li>
                  <li>Supplier Quality Review</li>
                </ul>
              </div>
            </div>

            <div className="org-map-tier support">
              {organisationMap.slice(3).map((group) => (
                <div key={group.title} className="org-map-card">
                  <strong>{group.title}</strong>
                  <ul>
                    {group.roles.map((role) => (
                      <li key={role}>{role}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="org-map-tier delivery">
              <div className="org-map-card">
                <strong>Design control & lifecycle flow</strong>
                <ul>
                  <li>Feasibility</li>
                  <li>Concept</li>
                  <li>Planning</li>
                  <li>Design</li>
                  <li>Development</li>
                  <li>Verification</li>
                  <li>Validation</li>
                  <li>Design transfer</li>
                  <li>Commercialisation</li>
                  <li>Post-market</li>
                </ul>
              </div>

              <div className="org-map-card">
                <strong>Cross-functional control points</strong>
                <ul>
                  <li>Requirements traceability</li>
                  <li>Risk review board</li>
                  <li>Change control approval</li>
                  <li>Launch readiness sign-off</li>
                  <li>Vigilance and CAPA governance</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="phase-action-row">
            <button type="button" className="primary-button full-width-button" onClick={() => setCurrentPage('overview')}>
              Return to overview
            </button>
          </div>
        </section>
      )
    }

    return (
      <>
        <section className="hero-panel">
          <div className="hero-copy">
            <span className="eyebrow">MDR / IVDR / ISO 13485 Platform</span>
            <h1>Guide every stage of medical device product development.</h1>
            <p>
              Walk a new organisation through feasibility, design controls, quality system compliance,
              risk management, technical documentation and post-market evidence with a single operating workflow.
            </p>

            <div className="action-row">
              <button type="button" className="primary-button" onClick={resetProject}>Start new project</button>
              <button type="button" className="secondary-button" onClick={() => setCurrentPage('org-map')}>View organisation map</button>
              <button type="button" className="secondary-button" onClick={() => setCurrentPage('audit-certification')}>View audit schedule</button>
            </div>

            <div className="stats-grid">
              <div>
                <strong>10</strong>
                <span>Lifecycle phases</span>
              </div>
              <div>
                <strong>15+</strong>
                <span>QMS SOPs</span>
              </div>
              <div>
                <strong>100%</strong>
                <span>Design control traceability</span>
              </div>
            </div>
          </div>

          <div className="status-panel">
            <div className="panel-header">
              <span className="dot green" />
              <span>Current readiness</span>
            </div>

            <div className="readiness-box">
              <div>
                <span>Gate</span>
                <strong>{selectedPhase}</strong>
              </div>
              <div className="ring" style={{ background: `conic-gradient(#1f72d5 ${projectHealth}%, #dfeaff 0)` }}>
                <span>{projectHealth}%</span>
              </div>
            </div>

            <ul className="mini-list">
              <li>
                <span>Regulatory mapping</span>
                <strong>{readinessChecks[0].complete ? 'Complete' : 'Pending'}</strong>
              </li>
              <li>
                <span>QMS setup</span>
                <strong>{readinessScore >= 60 ? 'In progress' : 'Pending'}</strong>
              </li>
              <li>
                <span>Document pack</span>
                <strong>{aiProgress >= 50 ? 'Ready' : 'Drafting'}</strong>
              </li>
            </ul>
          </div>
        </section>

        <section className="dashboard-summary-panel">
          <div className="dashboard-stat">
            <span className="dashboard-label">Project health</span>
            <strong>{projectHealth}%</strong>
            <small>Based on readiness, phase completion, AI governance and gate closure.</small>
          </div>
          <div className="dashboard-stat">
            <span className="dashboard-label">Phase completion</span>
            <strong>{phaseCompletionAverage}%</strong>
            <small>{phases.filter((phase) => phaseProgress(phase.name) >= 75).length} of {phases.length} phases on track.</small>
          </div>
          <div className="dashboard-stat">
            <span className="dashboard-label">AI governance</span>
            <strong>{aiProgress}%</strong>
            <small>{aiChecklist.filter((item) => item.complete).length} of {aiChecklist.length} controls active.</small>
          </div>
          <div className="dashboard-stat">
            <span className="dashboard-label">Gate closure</span>
            <strong>{gateCompletion}%</strong>
            <small>{Object.values(gateState).filter(Boolean).length} of {Object.keys(gateState).length} gates complete.</small>
          </div>
        </section>

        <section id="workflow" className="section-block">
          <div className="section-heading">
            <p className="section-tag">Operating framework</p>
            <h2>Follow the work in the order a new organisation typically needs.</h2>
          </div>

          <div className="onboarding-grid">
            {onboardingSteps.map((step, index) => (
              <div key={step.title} className="onboarding-step">
                <span className="step-number large">{index + 1}</span>
                <div>
                  <strong>{step.title}</strong>
                  <p>{step.detail}</p>
                  <small>{step.action}</small>
                </div>
              </div>
            ))}
          </div>

          <div className="framework-flow">
            {operatingFrameworkSteps.map((step, index) => (
              <div key={step} className="framework-step-pill">
                <span>{index + 1}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>

          <div className="phase-intro-card">
            <p>
              Start with the overview dashboard, then move into the correct department workstreams and use the product development phases to stay aligned with your lifecycle and evidence needs.
            </p>
            <div className="phase-intro-actions">
              <button type="button" className="primary-button" onClick={() => setOpenMenu((current) => (current === 'phases' ? null : 'phases'))}>
                Open phase menu
              </button>
            </div>
          </div>
        </section>

        <section className="deliverables-block">
          <div className="section-heading compact">
            <p className="section-tag">Workstreams</p>
            <h2>Each department is designed to guide the required work.</h2>
          </div>

          <div className="department-overview-grid">
            {departmentMenus.map((menu) => (
              <button
                key={menu.id}
                type="button"
                className="department-overview-card"
                onClick={() => navigateToDepartment(menu.id)}
              >
                <strong>{menu.label}</strong>
                <p>{menu.summary}</p>
                <span>Open department</span>
              </button>
            ))}
          </div>
        </section>

        <section className="deliverables-block">
          <div className="section-heading compact">
            <p className="section-tag">Operating model</p>
            <h2>How the organisation executes the medical device lifecycle.</h2>
          </div>

          <div className="operating-pillar-grid">
            {operatingPillars.map((pillar) => (
              <div key={pillar.title} className="operating-pillar-card">
                <strong>{pillar.title}</strong>
                <p>{pillar.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="assessment" className="deliverables-block assessment-box">
          <div className="section-heading compact">
            <p className="section-tag">Assessment wizard</p>
            <h2>Device profile and intended use assessment.</h2>
          </div>

          <div className="wizard-panel">
            <div className="wizard-steps" aria-label="Assessment steps">
              {wizardSteps.map((step, index) => (
                <button
                  key={step.id}
                  type="button"
                  className={index === activeStep ? 'step-item active' : 'step-item'}
                  onClick={() => setActiveStep(index)}
                >
                  <span className="step-number">{index + 1}</span>
                  <span>
                    <strong>{step.title}</strong>
                    <small>{step.description}</small>
                  </span>
                </button>
              ))}
            </div>

            <div className="wizard-form">
              <div className="wizard-header">
                <p className="standards-label">Current step</p>
                <h3>{currentStep.title}</h3>
                <p>{currentStep.description}</p>
              </div>

              <div className="field-grid">
                {(activeStep === 0 || activeStep === 3) && (
                  <>
                    <label className="full-width">
                      Intended purpose / intended use statement
                      <textarea name="intendedPurpose" value={form.intendedPurpose} onChange={handleChange} rows="4" />
                    </label>
                    <label>
                      Target population
                      <input name="targetPopulation" value={form.targetPopulation} onChange={handleChange} />
                    </label>
                    <label>
                      User type
                      <input name="userType" value={form.userType} onChange={handleChange} />
                    </label>
                    <label>
                      Care setting
                      <input name="careSetting" value={form.careSetting} onChange={handleChange} />
                    </label>
                    <label className="full-width">
                      Primary function
                      <input name="primaryFunction" value={form.primaryFunction} onChange={handleChange} />
                    </label>
                    <label className="full-width">
                      Contraindications
                      <textarea name="contraindications" value={form.contraindications} onChange={handleChange} rows="3" />
                    </label>
                    <label className="full-width">
                      Warnings
                      <textarea name="warnings" value={form.warnings} onChange={handleChange} rows="3" />
                    </label>
                    <label className="full-width">
                      Limitations
                      <textarea name="limitations" value={form.limitations} onChange={handleChange} rows="3" />
                    </label>
                  </>
                )}

                {(activeStep === 1 || activeStep === 3) && (
                  <>
                    <label>
                      Device name
                      <input name="deviceName" value={form.deviceName} onChange={handleChange} />
                    </label>
                    <label>
                      Device type
                      <select name="deviceType" value={form.deviceType} onChange={handleChange}>
                        <option>Software as a Medical Device (SaMD)</option>
                        <option>Hardware medical device</option>
                        <option>In vitro diagnostic device</option>
                        <option>Combination product</option>
                      </select>
                    </label>
                    <label>
                      Risk class
                      <select name="riskClass" value={form.riskClass} onChange={handleChange}>
                        <option>Class I</option>
                        <option>Class IIa</option>
                        <option>Class IIb</option>
                        <option>Class III</option>
                        <option>Class A</option>
                        <option>Class B</option>
                        <option>Class C</option>
                        <option>Class D</option>
                      </select>
                    </label>
                    <label>
                      Planned territories
                      <input name="territories" value={form.territories} onChange={handleChange} />
                    </label>
                  </>
                )}

                {(activeStep === 2 || activeStep === 3) && (
                  <>
                    <label className="full-width">
                      Clinical data requirement
                      <textarea name="clinicalData" value={form.clinicalData} onChange={handleChange} rows="3" />
                    </label>
                    <label className="full-width">
                      Usability engineering requirement
                      <textarea name="usability" value={form.usability} onChange={handleChange} rows="3" />
                    </label>
                    <label className="full-width">
                      Biocompatibility / material status
                      <textarea name="biocompatibility" value={form.biocompatibility} onChange={handleChange} rows="3" />
                    </label>
                  </>
                )}
              </div>

              <div className="wizard-actions">
                <button type="button" className="secondary-button" onClick={goPrev} disabled={activeStep === 0}>
                  Previous
                </button>
                <button type="button" className="primary-button" onClick={goNext}>
                  {activeStep === wizardSteps.length - 1 ? 'Review summary' : 'Next step'}
                </button>
              </div>
            </div>

            <aside className="summary-panel">
              <div className="summary-block">
                <p className="standards-label">Generated intended use</p>
                <p className="generated-text">{intendedUseStatement}</p>
              </div>

              <div className="summary-block">
                <p className="standards-label">Regulatory summary</p>
                <ul className="summary-list">
                  <li><strong>Device type:</strong> {form.deviceType}</li>
                  <li><strong>Risk class:</strong> {form.riskClass}</li>
                  <li><strong>Markets:</strong> {form.territories}</li>
                  <li><strong>Clinical data:</strong> {form.clinicalData}</li>
                  <li><strong>Usability:</strong> {form.usability}</li>
                  <li><strong>Biocompatibility:</strong> {form.biocompatibility}</li>
                </ul>
              </div>

              <div className="summary-block">
                <p className="standards-label">Recommended standards</p>
                <div className="standards-list">
                  {recommendedStandards.map((item) => (
                    <span key={item} className="standard-pill">{item}</span>
                  ))}
                </div>
              </div>

              {form.deviceType === 'Software as a Medical Device (SaMD)' && (
                <div className="summary-block">
                  <p className="standards-label">SaMD sections to include</p>
                  <ul className="summary-list">
                    {saMDControlSections.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </section>

        <section className="deliverables-block">
          <div className="section-heading compact">
            <p className="section-tag">Generated outputs</p>
            <h2>Documentation the organisation needs at every stage.</h2>
          </div>

          <div className="deliverable-grid">
            {deliverables.map((group) => (
              <div key={group.title} className="deliverable-card">
                <h3>{group.title}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="summary-block sop-source-box">
            <p className="standards-label">Embedded SOP library</p>
            <p className="generated-text">
              This tool contains a built-in SOP library and staged compliance workflow so teams can progress from concept,
              through design control and verification, into regulatory submission and post-market monitoring without leaving the application.
            </p>
            <div className="sop-library-grid">
              {sopLibrary.map((group) => (
                <div key={group.title} className="sop-library-card">
                  <strong>{group.title}</strong>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="standards-list">
              {builtInSopSuite.map((item) => (
                <span key={item} className="standard-pill">{item}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="deliverables-block">
          <div className="section-heading compact">
            <p className="section-tag">Submission journey</p>
            <h2>Step-by-step progress from development to approval and post-market.</h2>
          </div>

          <div className="journey-grid">
            {submissionJourney.map((step, index) => (
              <div key={step} className="journey-card">
                <span className="journey-index">{index + 1}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="deliverables-block">
          <div className="section-heading compact">
            <p className="section-tag">Submission readiness</p>
            <h2>Regulator-ready dossier health check.</h2>
          </div>

          <div className="readiness-overview">
            <div className="readiness-score-card">
              <div className="score-ring" style={{ background: `conic-gradient(#1f72d5 ${readinessScore}%, #dfeaff 0)` }}>
                <span>{readinessScore}%</span>
              </div>
              <div>
                <p className="score-label">Current status</p>
                <h3>{readinessScore >= 80 ? 'Ready for dossier review' : readinessScore >= 60 ? 'Needs additional evidence' : 'Early development stage'}</h3>
                <p>Greatest remaining work: complete validation evidence and post-market surveillance planning.</p>
              </div>
            </div>

            <div className="readiness-list">
              {readinessChecks.map((check) => (
                <div key={check.label} className={check.complete ? 'check-row complete' : 'check-row'}>
                  <span>{check.complete ? '✓' : '•'}</span>
                  <p>{check.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="gate-grid">
            {approvalGates.map((gate) => {
              const state = gateState[gate.title]
              const status = state ? 'Complete' : 'Pending'

              return (
                <button
                  key={gate.title}
                  type="button"
                  className="gate-card gate-toggle"
                  onClick={() => toggleGateState(gate.title)}
                >
                  <div className="gate-header">
                    <strong>{gate.title}</strong>
                    <span className={state ? 'gate-state complete' : 'gate-state pending'}>{status}</span>
                  </div>
                  <p>{gate.summary}</p>
                  <span className="gate-action">{state ? 'Reopen gate' : 'Mark as complete'}</span>
                </button>
              )
            })}
          </div>
        </section>

        <section className="deliverables-block">
          <div className="section-heading compact">
            <p className="section-tag">Action tracker</p>
            <h2>Live action management for the programme.</h2>
          </div>

          <div className="tracker-summary-grid">
            <div className="tracker-stat">
              <span>Total actions</span>
              <strong>{trackerMetrics.total}</strong>
            </div>
            <div className="tracker-stat">
              <span>Completed</span>
              <strong>{trackerMetrics.completed}</strong>
            </div>
            <div className="tracker-stat">
              <span>Overdue</span>
              <strong>{trackerMetrics.overdue}</strong>
            </div>
            <div className="tracker-stat">
              <span>Completion</span>
              <strong>{trackerMetrics.completionRate}%</strong>
            </div>
          </div>

          <div className="tracker-form">
            <label>
              Action title
              <input value={newAction.title} onChange={(event) => setNewAction((current) => ({ ...current, title: event.target.value }))} placeholder="Add new action" />
            </label>
            <label>
              Owner
              <input value={newAction.owner} onChange={(event) => setNewAction((current) => ({ ...current, owner: event.target.value }))} placeholder="Owner" />
            </label>
            <label>
              Due date
              <input type="date" value={newAction.dueDate} onChange={(event) => setNewAction((current) => ({ ...current, dueDate: event.target.value }))} />
            </label>
            <label>
              Department
              <select value={newAction.department} onChange={(event) => setNewAction((current) => ({ ...current, department: event.target.value }))}>
                <option>Quality</option>
                <option>Regulatory</option>
                <option>Clinical</option>
                <option>Security</option>
                <option>R&D</option>
                <option>Process</option>
              </select>
            </label>
            <label>
              Priority
              <select value={newAction.priority} onChange={(event) => setNewAction((current) => ({ ...current, priority: event.target.value }))}>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </label>
            <label>
              Status
              <select value={newAction.status} onChange={(event) => setNewAction((current) => ({ ...current, status: event.target.value }))}>
                <option>Not Started</option>
                <option>In Progress</option>
                <option>Pending Approval</option>
                <option>Completed</option>
              </select>
            </label>
            <button type="button" className="primary-button add-action-button" onClick={addAction}>Add action</button>
          </div>

          <div className="tracker-export-row">
            <button type="button" className="secondary-button" onClick={exportTrackerToCsv}>Export CSV</button>
            <button type="button" className="secondary-button" onClick={exportTrackerToPdf}>Export PDF</button>
          </div>

          <div className="tracker-table">
            <div className="tracker-table-head">
              <span>Action</span>
              <span>Owner</span>
              <span>Due</span>
              <span>Priority</span>
              <span>Status</span>
            </div>

            {projectActions.map((task) => (
              <div key={task.id} className="tracker-row">
                <div className="tracker-task-cell">
                  <strong>{task.title}</strong>
                  <small>{task.department}</small>
                </div>
                <input value={task.owner} onChange={(event) => updateAction(task.id, 'owner', event.target.value)} />
                <input type="date" value={task.dueDate === 'TBD' ? '' : task.dueDate} onChange={(event) => updateAction(task.id, 'dueDate', event.target.value)} />
                <select value={task.priority} onChange={(event) => updateAction(task.id, 'priority', event.target.value)}>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
                <select value={task.status} onChange={(event) => updateAction(task.id, 'status', event.target.value)}>
                  <option>Not Started</option>
                  <option>In Progress</option>
                  <option>Pending Approval</option>
                  <option>Completed</option>
                </select>
              </div>
            ))}
          </div>
        </section>

        <section id="governance" className="governance-panel">
          <div className="section-heading compact">
            <p className="section-tag">Governance</p>
            <h2>Aligned with design control and compliance discipline.</h2>
          </div>

          <div className="governance-grid">
            <div>
              <strong>Traceability</strong>
              <p>Requirements, specifications, risk controls and verification are linked across the lifecycle.</p>
            </div>
            <div>
              <strong>Quality assurance</strong>
              <p>Review, approval, document control and quality system oversight are built into the workflow.</p>
            </div>
            <div>
              <strong>Change management</strong>
              <p>Design, process and software changes require impact assessment, approval, validation impact review and release control.</p>
            </div>
            <div>
              <strong>Management review</strong>
              <p>Leadership reviews product status, risk trends, performance gaps, CAPA effectiveness and resource readiness.</p>
            </div>
            <div>
              <strong>Regulatory governance</strong>
              <p>Country mappings, submission readiness, inspection preparation, post-market obligations and regulatory reporting are governed formally.</p>
            </div>
            <div>
              <strong>Audits and assurance</strong>
              <p>Internal audits, supplier audits, corrective actions and compliance checks provide ongoing assurance of QMS and product control.</p>
            </div>
          </div>

          <div className="audit-section">
            <div className="section-heading compact audit-heading">
              <p className="section-tag">External audit schedule</p>
              <h3>Audit stages mapped to certification and submission readiness.</h3>
            </div>

            <div className="audit-schedule-grid">
              {externalAuditSchedule.map((audit) => (
                <div key={audit.title} className="audit-card">
                  <div className="audit-card-header">
                    <span className="audit-stage">{audit.stage}</span>
                    <strong>{audit.title}</strong>
                  </div>
                  <p><span>Focus:</span> {audit.focus}</p>
                  <p><span>Output:</span> {audit.output}</p>
                  <p><span>Regulatory link:</span> {audit.regulatoryLink}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </>
    )
  })()

  return (
    <div className="page-shell">
      <header className="global-topbar">
        <div className="topbar-left">
          <span className="header-kicker">Operating system</span>
          <h2>{topbarTitle}</h2>
        </div>

        <div className="topbar-actions">
          <button
            type="button"
            className="theme-toggle"
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            title={theme === 'light' ? 'Dark mode' : 'Light mode'}
            onClick={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
          >
            {theme === 'light' ? '☾' : '☀'}
          </button>
          <button type="button" className="login-button" onClick={() => setIsLoggedIn((current) => !current)}>
            {isLoggedIn ? 'Jane Smith' : 'Log in'}
          </button>
          <button type="button" className="primary-button" onClick={handleLaunchOnboarding}>Launch onboarding</button>
        </div>
      </header>

      <div className="app-shell" data-theme={theme}>
        <aside className={sidebarCollapsed ? 'sidebar sidebar-collapsed' : 'sidebar'}>
          <div className="sidebar-header">
            <button type="button" className="icon-button" aria-label="Toggle navigation" onClick={() => setSidebarCollapsed((current) => !current)}>
              ☰
            </button>
            {!sidebarCollapsed && (
              <div className="brand-wrap">
                <div className="brand-mark">MD</div>
                <div>
                  <p className="brand-name">MediDev Studio</p>
                  <p className="brand-subtitle">Medical device platform</p>
                </div>
              </div>
            )}
          </div>

          <nav className="sidebar-nav" aria-label="Sidebar navigation">
            <div className="sidebar-section">
              <button type="button" className={currentPage === 'overview' ? 'sidebar-link active' : 'sidebar-link'} onClick={() => setCurrentPage('overview')}>
                <span className="nav-icon">▣</span>
                {!sidebarCollapsed && <span>Overview</span>}
              </button>

              <button type="button" className={currentPage === 'org-map' ? 'sidebar-link active' : 'sidebar-link'} onClick={() => setCurrentPage('org-map')}>
                <span className="nav-icon">◎</span>
                {!sidebarCollapsed && <span>Organisation map</span>}
              </button>

              <button type="button" className={currentPage === 'audit-certification' ? 'sidebar-link active' : 'sidebar-link'} onClick={() => setCurrentPage('audit-certification')}>
                <span className="nav-icon">✓</span>
                {!sidebarCollapsed && <span>Audit & certification</span>}
              </button>
            </div>

            <div className="sidebar-group">
              {!sidebarCollapsed && <span className="nav-label">Functions</span>}
              <div className="nav-subgroup">
                <button
                  type="button"
                  className={departmentMenus.some((menu) => currentPage === menu.id) ? 'sidebar-link sidebar-link-sub active governance-toggle' : 'sidebar-link sidebar-link-sub governance-toggle'}
                  onClick={() => setFunctionsOpen((current) => !current)}
                >
                  <span className="nav-icon">◌</span>
                  {!sidebarCollapsed && <span>Functions</span>}
                  {!sidebarCollapsed && <span className="collapse-indicator">{functionsOpen ? '▾' : '▸'}</span>}
                </button>

                {!sidebarCollapsed && functionsOpen && departmentMenus.map((menu) => (
                  <button
                    key={menu.id}
                    type="button"
                    className={currentPage === menu.id ? 'sidebar-link sidebar-link-sub active' : 'sidebar-link sidebar-link-sub'}
                    onClick={() => navigateToDepartment(menu.id)}
                  >
                    <span className="nav-icon">•</span>
                    <span>{menu.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="sidebar-group">
              {!sidebarCollapsed && <span className="nav-label">Governance</span>}
              <div className="nav-subgroup">
                <button
                  type="button"
                  className={['quality', 'risk', 'regulatory', 'ai-governance', 'security', 'rnd', 'process'].includes(currentPage) ? 'sidebar-link sidebar-link-sub active governance-toggle' : 'sidebar-link sidebar-link-sub governance-toggle'}
                  onClick={() => {
                    setGovernanceOpen((current) => !current)
                    if (!governanceOpen) {
                      setCurrentPage('quality')
                    }
                  }}
                >
                  <span className="nav-icon">✦</span>
                  {!sidebarCollapsed && <span>Governance</span>}
                  {!sidebarCollapsed && <span className="collapse-indicator">{governanceOpen ? '▾' : '▸'}</span>}
                </button>

                {!sidebarCollapsed && governanceOpen && (
                  <div className="governance-nested">
                    {governanceLinks.map((link) => (
                      <button
                        key={link.id}
                        type="button"
                        className={currentPage === link.id ? 'sidebar-link sidebar-link-sub active' : 'sidebar-link sidebar-link-sub'}
                        onClick={() => navigateToDepartment(link.id)}
                      >
                        <span className="nav-icon">•</span>
                        <span>{link.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="sidebar-group">
              {!sidebarCollapsed && <span className="nav-label">Product Development</span>}
              <div className="nav-subgroup">
                <button
                  type="button"
                  className={currentPage === 'phase' ? 'sidebar-link sidebar-link-sub active governance-toggle' : 'sidebar-link sidebar-link-sub governance-toggle'}
                  onClick={() => setPhasesOpen((current) => !current)}
                >
                  <span className="nav-icon">✧</span>
                  {!sidebarCollapsed && <span>Product Development</span>}
                  {!sidebarCollapsed && <span className="collapse-indicator">{phasesOpen ? '▾' : '▸'}</span>}
                </button>

                {!sidebarCollapsed && phasesOpen && phases.map((phase, index) => (
                  <button
                    key={phase.name}
                    type="button"
                    className={currentPage === 'phase' && selectedPhase === phase.name ? 'sidebar-link sidebar-link-sub active' : 'sidebar-link sidebar-link-sub'}
                    onClick={() => {
                      setSelectedPhase(phase.name)
                      setCurrentPage('phase')
                    }}
                  >
                    <span className="nav-index">{String(index + 1).padStart(2, '0')}</span>
                    <span>{phase.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </aside>

        <div className="content-area">
          <main className="content">{renderedPage}</main>
        </div>
      </div>
    </div>
  )
}

export default App
