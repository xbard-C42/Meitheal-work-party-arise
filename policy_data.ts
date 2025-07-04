
export interface PolicyDocument {
  _id: string;
  title: string;
  source: string;
  type: string;
  category: string;
  datePublished: string;
  aiAnalysis: {
    summary: string;
  };
  keyTopics: string[];
  userInteractions?: { views: number };
  fullText?: string;
}

const irishWaterPolicyFullText = `
==Start of OCR for page 1==
ChatGPT
Irish National Framework
• Water Framework Directive (Transposition) Regulations (Irish Statute) Legislation
implementing EU WFD (2000/60/EC) in Ireland (e.g. European Communities (Water Policy)
Regulations 2003). Establishes River Basin Management Plans and status classifications
Tags: legislation, WFD, river basin planning, water quality.
1
2.
• River Basin Management Plan 2018-2021 (Dept. of Housing, Local Government & Heritage,
2018) - Strategy: sets actions to achieve 'good' ecological status for all waters by 2027 2. Key
measures include €1.7 billion for wastewater upgrades, leakage reduction, creation of Blue Dot
high-quality water areas, and community funding (e.g. a new Community Water Development
Fund) 3 Tags: RBMP, water quality, WFD, community engagement.
4
6
• Water Action Plan 2024: A River Basin Management Plan for Ireland (Dept. of Housing, Local
Government & Heritage, 2024) - Strategy/plan (3rd RBMP cycle) outlining a roadmap of targeted
measures to restore Ireland's water bodies and meet WFD objectives by 2027 5
Emphasizes catchment-based measures, remediation of polluted rivers, habitat restoration and
enforcement. Tags: RBMP, water quality, biodiversity, catchment management, EU WFD.
• Water Environment (Abstractions and Associated Impoundments) Act 2022 (Oireachtas,
2022) - Legislation controlling water abstraction and impoundments. Introduces licensing and
registration for large abstractions, protects hydrological regime and "river continuity" (prevents
fragmentation) 7 8 Tags: legislation, abstraction licensing, hydromorphology, water flow.
• Water Pollution Acts (1977–1990) – Key Irish laws limiting discharges to waters (e.g. Agriculture
(Protection of Waters) Act 1978) and empowering inspections/enforcement. Fundamental to
water protection, though many provisions have been updated. Tags: legislation, pollution
control.
• Water Services (Amendment) Act 2022 – Legislation reorganizing Irish Water (Uisce Éireann) as
independent authority. Enables reinvestment in water infrastructure. Tags: legislation, utility
reform.
10
• Local Authority Waters Programme (LAWPRO) Strategy 2025-2028 (LAWPRO, Jun 2025)
Organizational strategy aligning LAWPRO's goals with the new Water Action Plan 9
Focuses on targeted actions to reverse water quality declines and greater community
involvement. Tags: local authorities, strategy, water quality, catchment science, community
engagement.
• LAWPRO Organisational Strategy 2025-2028 (LAWPRO, 2025) – Published organisational plan
for the Local Authority Waters Programme 11 10, setting core objectives (e.g. water quality
monitoring, community grants, education). Tags: strategy, catchment management, WFD
implementation.
• LAWPRO Annual Reports (2021-2023) Reports on LAWPRO's work (roles in RBMP
implementation, catchment projects, grant schemes, Blue Dot protection). E.g. Annual Report
1
==End of OCR for page 1==
==Start of OCR for page 2==
2023 highlights growth in staff and farming partnership projects 12. Tags: reports,
implementation, water quality.
• EPA - Catchment Assessment Reports - EPA-provided data and maps for each river catchment
(via Catchments.ie). These include water body status, risks and pressures. (EPA's WISE Freshwater
portal also provides data.) Tags: datasets, catchment assessments, water status.
• EPA "State of Ireland's Environment" Reports (2018, 2023) Overviews of environmental
quality (water chapters detail river biodiversity declines, pressures). Tags: reports, environment
assessment.
• EPA Water Quality Reports – Triennial summaries of national monitoring (e.g. Water Quality in
Ireland 2022). Document trends in river and groundwater quality. Tags: reports, monitoring,
trends.
• Catchments.ie (EPA/LAWPRO portal) – Interactive site with river/waterbody maps, status, and
resources 13. Includes Catchment Assessments, citizen science data, and WFD info. Tags: data
portal, GIS, public information.
Government grant scheme (via LAWPRO)
• Community Water Development Fund (CWDF)
funding citizen projects on water heritage and community water actions. Annual grants lists and
evaluations are published 14. Tags: funding, community, heritage.
• Catchment Support Fund - LAWPRO grants for NGO catchment projects. Guidance and award
lists available 15 16 Tags: funding, NGOs.
• Blue Dot Programme Initiative to designate rivers/lakes of "excellent" quality. Guides and
booklets (e.g. Connemara Blue Dots) released 17 Tags: conservation, flagship sites.
• Farming for Water EIP (European Innovation Partnership) - Agri-environment project
encouraging farmers to improve water quality (e.g. pesticide reduction). Publications and
metrics (e.g. "Farming for Water" site). Tags: agriculture, incentives, partnerships.
• Dáil Éireann Debates on Water and Nature – Oireachtas proceedings (e.g. Mar 2024) where
ministers outlined targets for river floodplains and barrier removal under the EU Nature
Restoration Law 18. Tags: parliamentary debates, policy, nature restoration.
• Oireachtas Reports and Bills Parliamentary publications on water (e.g. Joint Oireachtas
Committee reports on water quality, proposals for new water laws, Dáil Questions on water
issues). Tags: legislation proposals, oversight.
European Union Framework
• Water Framework Directive (2000/60/EC) – Fundamental EU law for water protection, requiring
Member States to achieve "good" ecological status in all water bodies. Established River Basin
Management Plans as implementation tool 1. Tags: EU Directive, water status, management
plans.
2
==End of OCR for page 2==
==Start of OCR for page 3==
• Nature Restoration Regulation (EU 2023/1012) – New EU regulation (in force 2024) imposing
binding restoration targets. Part of the EU Biodiversity Strategy, it calls for "removing barriers
to achieve at least 25,000 km of free-flowing rivers by 2030" 19. Member States must
prepare national restoration plans. Tags: regulation, biodiversity, river connectivity, floodplain
restoration, NRL.
• EU Biodiversity Strategy for 2030
Policy strategy setting binding targets for habitat and
species recovery. Among its goals is to restore ≥25,000 km of rivers to free-flowing state by 2030
(via barrier removal, floodplain wetland restoration) 20
Tags: strategy, free-flowing rivers,
Natura 2000, targets.
21
• EU Habitats (92/43/EEC) & Birds (2009/147/EC) Directives - Require protection of Natura 2000
sites, including water-dependent habitats and species (freshwater mussels, salmon, etc.). Tags:
conservation, Natura sites, freshwater species.
• Water Framework Daughter Directives (2006/118/EC on groundwater, 2008/105/EC on
priority substances) – Set standards for pollutants in water to support WFD objectives. Tags: EU
law, pollutants, groundwater.
• EU Floods Directive (2007/60/EC) – Requires flood risk management plans at river basin level,
encouraging "nature-based" mitigation (wetlands, floodplain reconnection). Tags: flood
management, nature-based solutions.
• EU Green Infrastructure Strategy (2013) – Advocates ecosystem-based approaches (e.g. river
corridors) to enhance resilience. Tags: green infrastructure, nature-based solutions.
• European Commission Reports and Guidance: The EC's Environment Directorate-General
publishes guidance on river restoration and barrier removal (e.g. “Guidance on Barrier Removal
for River Restoration" – supporting Member States to meet the 25,000 km target). EC portals on
WFD and NRL summarize objectives
1
19. Tags: guidance, best practice.
• European Environment Agency (EEA) Publications: EEA's "Europe's state of water 2024"
report (Oct 2024) highlights that only ~37% of EU surface waters achieve good ecological status
and stresses nature-based solutions (e.g. "achieving free-flowing rivers and restored wetlands is
essential" for healthy ecosystems) 22 23. Tags: assessment report, climate resilience, pollution,
status trends.
• EU Court of Justice (CJEU) Judgments: Key rulings clarify WFD implementation. For example,
Peter Sweetman v ABP (C-301/22, 2024) – CJEU found Ireland had failed to assign an ecological
status to all water bodies as required by the WFD 24, underscoring strict compliance needs.
(Other cases: Commission v Ireland, Commission v UK on WFD breaches.) Tags: case law,
enforcement, ecological status.
• EU Funding Programmes: LIFE and Horizon projects on river restoration (e.g. LIFE
UrbanGreening, LIFE PRINCES). Common Agricultural Policy funds (EAFRD/Agriculture) include
rural development measures that can support wetlands and buffer zones. Tags: EU grants,
projects, cross-compliance.
3
==End of OCR for page 3==
==Start of OCR for page 4==
• European Parliament Documents: Adopted texts on WFD implementation and Nature
Restoration (e.g. 2024 Resolution endorsing NRL). Parliamentary questions and committee
reports on water issues. Tags: EU Parliament, resolutions.
Irish Political Parties (Policy Documents)
• Green Party - Local Election Manifesto 2024 (Green Party, 2024) – Promises to "clean up our
rivers, lakes and the sea" and to "restore biodiversity" in each locality 25. Commits to reversing
habitat loss, improving urban waterways, and enhancing water quality through local measures
25 26 Tags: party policy, biodiversity, water quality, habitat restoration.
• Labour Party - "Climate Action and a Just Transition" Manifesto 2024 (Labour Party, 2024) –
Emphasises "CLEAN WATER" (Section 2): to "reverse the decline in Ireland's rivers, lakes and
coastal waters" via enhanced inspections, investment in infrastructure, and enforcement 27
Also highlights the need for stronger EPA powers against pollution 28 Tags: party policy,
enforcement, water pollution, infrastructure.
• Fine Gael - General Election Manifesto 2024 (Fine Gael, 2024) - Includes commitments for
water quality: establishing a Cabinet Committee on Water Quality (coordinated by the Taoiseach)
and bolstering EPA-farmer collaboration 29 Promises to modernize inland fisheries legislation
and protect aquatic habitats (e.g. "ensure our inland waters remain healthy ... pristine habitats
for native fish species") 30. Tags: party policy, water governance, fisheries, water testing.
• Fianna Fáil - General Election Manifesto 2024 (Fianna Fáil, 2024) – Pledges major investments
in Irish Water (e.g. €3 billion for water infrastructure and €1 billion for Uisce Éireann projects) to
upgrade treatment and connections 31 32. Also supports implementing the EU Nature
Restoration Law with measures like “rewetting targets on state-owned lands" under Natura 2000
schemes 33 Tags: party policy, infrastructure investment, Nature Restoration, wetlands.
• Sinn Féin - "Powering Ireland 2030" Manifesto 2024 (Sinn Féin, 2024) – Declares water services
must remain a public good: "drinking water and wastewater services should be provided on the
basis of need not as a market commodity" 34. (No major new restoration pledge beyond
opposing privatization.) Tags: party policy, water services, public ownership.
• Social Democrats Environment Plan 2023/Manifesto 2024 Plans include creating a
dedicated National Nature Restoration Plan and ring-fencing funds for nature restoration (e.g. in
an "Infrastructure Climate and Nature Fund") 35. Calls to bring biodiversity and climate
adaptation under one department and double protected areas. Tags: party policy, nature
restoration plan, funding, biodiversity.
Other Key Resources
• EPA Environmental Enforcement Reports - e.g. annual or summary reports on prosecutions
and penalties for water pollution offences. Tags: enforcement, legal actions.
• EEA Country Profiles (Ireland) – EEA published reports on Ireland's environment (e.g. "State of
the Environment'). Contains chapters on water quality and ecosystem status. Tags: country report,
benchmarking.
4
==End of OCR for page 4==
==Start of OCR for page 5==
• Oireachtas Library Briefings Research papers on water issues (e.g. briefing on WFD
implementation, on Irish Water). Tags: analysis, government library.
• Academic & NGO Reports – E.g. NGO "Rivers Trust" critiques, academic theses on catchment
restoration, Law Centre policy briefs. Tags: analysis, civil society.
• Databases/Datasets:
• EPA WISE Water Data - European info system with Irish river status.
• EPA Water Quality in Ireland dataset (via data.gov.ie).
• LAWPRO/EPA WFD Areas for Action GIS dataset (2018) – outlines waterbodies targeted for
action 36. Tags: dataset, GIS, RBMP.
• Irish Hydrometric/Flow datasets (by OPW/EPA).
• Corine/Copernicus water and land cover data (EU).
• Irish Water: supply/wastewater connection data (statistics).
• Local Authority Plans/Guidance: Some counties have Catchment Management Plans (e.g. in
partnership with LAWPRO) or bylaws for riparian buffers. Tags: local gov, catchment
management.
• Press Releases & News: Government press releases on funding or policy (e.g. Water Heritage
grants, River Basin plan launches) often list relevant stats and measures (see gov.ie and LAWPRO
news). Tags: announcements, public info.
5 9
1
19:
All items listed
Sources: Official publications and web portals of Irish departments and agencies 2
EU institutional websites 20 23; party manifestos 27 25; and expert analyses 24 18
are publicly available documents (press releases, legislation, strategies, reports, data) relevant to river
restoration, water quality, and rewilding in Ireland and the EU, 2000-2025.
1
Water Framework Directive - European Commission
https://environment.ec.europa.eu/topics/water/water-framework-directive_en
2
3
4
13 River Basin Management Plan 2018 - 2021
https://www.gov.ie/en/department-of-housing-local-government-and-heritage/publications/river-basin-management-
plan-2018-2021/
5 6 Minister Noonan launches overarching national plan to improve water quality and restore
freshwater habitats
https://www.gov.ie/en/department-of-housing-local-government-and-heritage/press-releases/minister-noonan-launches-
overarching-national-plan-to-improve-water-quality-and-restore-freshwater-habitats/
7
8 Water Environment (Abstractions and Associated Impoundments) Act 2022, Section 2
https://www.irishstatutebook.ie/eli/2022/act/48/section/2/enacted/en/html
9
10 Press Release: The Local Authority Waters Programme Publishes its Statement of Strategy
2025-2028 - Local Authority Waters Programme
https://lawaters.ie/press-release-the-local-authority-waters-programme-publishes-its-statement-of-strategy-2025-2028/
11 12 14 15 16 17 Publications - Local Authority Waters Programme
https://lawaters.ie/publications/
5
==End of OCR for page 5==
==Start of OCR for page 6==
18 Nature Restoration Law: Statements – Dáil Éireann (33rd Dáil) – Thursday, 7 Mar 2024 – Houses of
the Oireachtas
https://www.oireachtas.ie/en/debates/debate/dail/2024-03-07/30/
19 The EU #NatureRestoration Law
https://environment.ec.europa.eu/topics/nature-and-biodiversity/nature-restoration-regulation_en
20 Biodiversity strategy for 2030 - Publications Office of the EU
https://op.europa.eu/en/publication-detail/-/publication/0146a7ba-2f20-11ed-975d-01aa75ed71a1
21 Microsoft Word - Barrier removal_MASTERCOPY
https://environment.ec.europa.eu/system/files/2021-12/Barrier%20removal%20for%20river%20restoration.pdf
22 23 Europe's state of water 2024: the need for improved water resilience | European Environment
Agency's home page
https://www.eea.europa.eu/en/analysis/publications/europes-state-of-water-2024
24 Directive 2000/60/EC - EU Clarifies Application of EU Water
https://setantasolicitors.ie/watered-down-eu-clarifies-application-of-eu-water-framework-directive/
25 26 Manifesto v2.indd
https://www.greenparty.ie/sites/default/files/2024-05/Manifesto%20v7%20%282%29.pdf
27 28 labour.ie
https://labour.ie/wp-content/uploads/2021/10/Labour-Climate-Action-and-a-Just-Transition-Manifesto-2024.pdf
29 30 finegael.ie
https://www.finegael.ie/app/uploads/2024/11/Fine-Gael-General-Election-2024-Manifesto.pdf
31
32 33 Fianna Fáil Manifesto 2024 | PDF | Cost Of Living | Taxes
https://www.scribd.com/document/791303170/Fianna-Fail-Manifesto-2024
34 vote.sinnfein.ie
https://vote.sinnfein.ie/wp-content/uploads/2024/11/SinnFeinManifesto2024.pdf
35 socialdemocrats.ie
https://www.socialdemocrats.ie/wp-content/uploads/2023/10/ClimateNatureOnline.pdf
36 WFD Areas For Action - Dataset - data.gov.ie
https://data.gov.ie/dataset/wfd-areas-for-action
6
==End of OCR for page 6==
`;

export const policyDocuments: PolicyDocument[] = [
  // New entries from the provided PDF on Irish Water Policy
  {
    _id: "irish-water-policy-overview-2024",
    title: "Irish Water Policy Framework Overview (2000-2025)",
    source: "C42 AI Aggregator",
    type: "Review Document",
    category: "Water Policy Framework",
    datePublished: "2024-07-01",
    aiAnalysis: {
      summary: "A comprehensive overview of the key legislative, strategic, and policy documents shaping water management and restoration in Ireland and the EU from 2000 to 2025. This document aggregates information on national laws, EU directives, government strategies, and environmental reports."
    },
    keyTopics: ["water policy", "ireland", "eu", "wfd", "legislation", "strategy", "review"],
    userInteractions: { views: 42 },
    fullText: irishWaterPolicyFullText
  },
  {
    _id: "wfd-transposition-regs-2003",
    title: "Water Framework Directive (Transposition) Regulations",
    source: "Irish Statute",
    type: "Legislation",
    category: "Water Policy Framework",
    datePublished: "2003-01-01",
    aiAnalysis: {
      summary: "Legislation implementing the EU Water Framework Directive (2000/60/EC) in Ireland. It establishes the requirement for River Basin Management Plans and status classifications for water bodies."
    },
    keyTopics: ["legislation", "wfd", "river basin planning", "water quality"],
    userInteractions: { views: 78 }
  },
  {
    _id: "rbmp-2018-2021",
    title: "River Basin Management Plan 2018-2021",
    source: "Dept. of Housing, Local Government & Heritage",
    type: "Strategy",
    category: "Water Policy Framework",
    datePublished: "2018-01-01",
    aiAnalysis: {
      summary: "A strategic plan setting out actions to achieve 'good' ecological status for all Irish waters by 2027. It includes significant investment in wastewater treatment, leakage reduction, and community funding initiatives."
    },
    keyTopics: ["rbmp", "water quality", "wfd", "community engagement", "infrastructure"],
    userInteractions: { views: 65 }
  },
  {
    _id: "water-action-plan-2024",
    title: "Water Action Plan 2024: A River Basin Management Plan for Ireland",
    source: "Dept. of Housing, Local Government & Heritage",
    type: "Strategy",
    category: "Water Policy Framework",
    datePublished: "2024-01-01",
    aiAnalysis: {
      summary: "The third River Basin Management Plan cycle, providing a roadmap of targeted, catchment-based measures to restore Ireland's water bodies and meet WFD objectives by 2027. Emphasizes remediation, habitat restoration, and enforcement."
    },
    keyTopics: ["rbmp", "water quality", "biodiversity", "catchment management", "eu wfd"],
    userInteractions: { views: 92 }
  },
  {
    _id: "water-environment-act-2022",
    title: "Water Environment (Abstractions and Associated Impoundments) Act 2022",
    source: "Oireachtas",
    type: "Act",
    category: "Water Policy Framework",
    datePublished: "2022-01-01",
    aiAnalysis: {
      summary: "Legislation that controls water abstraction and impoundments. It introduces a licensing and registration system for large abstractions to protect the hydrological regime and ensure river continuity."
    },
    keyTopics: ["legislation", "abstraction licensing", "hydromorphology", "water flow"],
    userInteractions: { views: 55 }
  },
  {
    _id: "lawpro-strategy-2025-2028",
    title: "Local Authority Waters Programme (LAWPRO) Strategy 2025-2028",
    source: "LAWPRO",
    type: "Strategy",
    category: "Water Policy Framework",
    datePublished: "2025-06-01",
    aiAnalysis: {
      summary: "An organizational strategy aligning LAWPRO's goals with the new Water Action Plan. It focuses on targeted actions to reverse water quality declines and foster greater community involvement."
    },
    keyTopics: ["local authorities", "strategy", "water quality", "catchment science", "community engagement"],
    userInteractions: { views: 43 }
  },
  {
    _id: "epa-state-of-environment-2023",
    title: "EPA \"State of Ireland's Environment\" Reports",
    source: "Environmental Protection Agency (EPA)",
    type: "Report",
    category: "Water Policy Framework",
    datePublished: "2023-01-01",
    aiAnalysis: {
      summary: "Comprehensive overviews of environmental quality in Ireland. The water-related chapters provide critical details on river biodiversity declines and environmental pressures."
    },
    keyTopics: ["reports", "environment assessment", "biodiversity", "pollution"],
    userInteractions: { views: 81 }
  },
  {
    _id: "catchments-portal",
    title: "Catchments.ie (EPA/LAWPRO portal)",
    source: "EPA/LAWPRO",
    type: "Data Portal",
    category: "Water Policy Framework",
    datePublished: "2024-01-01",
    aiAnalysis: {
      summary: "An interactive website featuring maps, status reports, and resources for every river and waterbody in Ireland. Includes Catchment Assessments, citizen science data, and WFD information."
    },
    keyTopics: ["data portal", "gis", "public information", "catchment assessments", "water status"],
    userInteractions: { views: 110 }
  },
  {
    _id: "eu-nature-restoration-reg-2023",
    title: "Nature Restoration Regulation (EU 2023/1012)",
    source: "European Union",
    type: "Regulation",
    category: "Water Policy Framework",
    datePublished: "2023-01-01",
    aiAnalysis: {
      summary: "A new EU regulation imposing binding restoration targets. As part of the EU Biodiversity Strategy, it calls for removing barriers to achieve at least 25,000 km of free-flowing rivers by 2030."
    },
    keyTopics: ["regulation", "biodiversity", "river connectivity", "floodplain restoration", "nrl"],
    userInteractions: { views: 88 }
  },
  {
    _id: "eu-biodiversity-strategy-2030",
    title: "EU Biodiversity Strategy for 2030",
    source: "European Union",
    type: "Strategy",
    category: "Water Policy Framework",
    datePublished: "2020-01-01",
    aiAnalysis: {
      summary: "A policy strategy setting binding targets for habitat and species recovery. A key goal is the restoration of at least 25,000 km of rivers to a free-flowing state by 2030 through barrier removal and wetland restoration."
    },
    keyTopics: ["strategy", "free-flowing rivers", "natura 2000", "targets", "biodiversity"],
    userInteractions: { views: 76 }
  },
  {
    _id: "green-party-manifesto-2024",
    title: "Green Party - Local Election Manifesto 2024",
    source: "Green Party",
    type: "Manifesto",
    category: "Water Policy Framework",
    datePublished: "2024-05-01",
    aiAnalysis: {
      summary: "Promises to 'clean up our rivers, lakes and the sea' and to 'restore biodiversity' in each locality. Commits to reversing habitat loss, improving urban waterways, and enhancing water quality through local measures."
    },
    keyTopics: ["party policy", "biodiversity", "water quality", "habitat restoration"],
    userInteractions: { views: 60 }
  },
  // Existing documents
  {
    _id: "manifesto-fg-2024",
    title: "Securing Your Future (2024)",
    source: "Fine Gael",
    type: "Manifesto",
    category: "Irish Political Party Manifestos",
    datePublished: "2024-01-01",
    aiAnalysis: {
      summary: "General Election manifesto from Fine Gael focusing on key pillars of their platform for the upcoming term."
    },
    keyTopics: ["economy", "housing", "social policy"],
    userInteractions: { views: 188 }
  },
  {
    _id: "manifesto-sf-2024",
    title: "The Choice for Change - GE24 Manifesto (2024)",
    source: "Sinn Féin",
    type: "Manifesto",
    category: "Irish Political Party Manifestos",
    datePublished: "2024-01-01",
    aiAnalysis: {
      summary: "Sinn Féin's General Election manifesto outlining their vision for change in Ireland."
    },
    keyTopics: ["housing", "health", "Irish unity"],
    userInteractions: { views: 254 }
  },
  {
    _id: "manifesto-gp-2020",
    title: "Towards 2030: A Decade of Change (2020)",
    source: "Green Party",
    type: "Manifesto",
    category: "Irish Political Party Manifestos",
    datePublished: "2020-01-01",
    aiAnalysis: {
      summary: "The Green Party's General Election manifesto from 2020, focusing on long-term environmental and social goals."
    },
    keyTopics: ["climate", "environment", "energy"],
    userInteractions: { views: 150 }
  },

  // Irish Party Policy Documents & White Papers
  {
    _id: "policy-sf-childcare-2024",
    title: "€10 a Day Childcare For All (2024)",
    source: "Sinn Féin",
    type: "Policy Paper",
    category: "Irish Party Policy Documents & White Papers",
    datePublished: "2024-01-01",
    aiAnalysis: {
      summary: "A policy paper from Sinn Féin detailing their proposal for affordable childcare services across Ireland."
    },
    keyTopics: ["childcare", "families", "economy"],
    userInteractions: { views: 215 }
  },
  {
    _id: "policy-sf-housing-2024",
    title: "A Home Of Your Own (2024)",
    source: "Sinn Féin",
    type: "Housing Plan",
    category: "Irish Party Policy Documents & White Papers",
    datePublished: "2024-01-01",
    aiAnalysis: {
      summary: "Sinn Féin's detailed plan to address the housing crisis, focusing on construction and affordability."
    },
    keyTopics: ["housing", "construction", "affordability"],
    userInteractions: { views: 230 }
  },

  // Irish Press Releases & Statements
  {
    _id: "press-fg-camogie-2025",
    title: "Camogie players must be unilaterally supported on May 22nd – Ní Chuilinn",
    source: "Fine Gael",
    type: "Press Release",
    category: "Irish Press Releases & Statements",
    datePublished: "2025-05-08",
    aiAnalysis: {
      summary: "A press release from a Fine Gael Senator regarding support for Camogie players, highlighting issues of sports and equality."
    },
    keyTopics: ["sports", "equality"],
    userInteractions: { views: 95 }
  },
  {
    _id: "press-sf-aib-2022",
    title: "AIB decision to remove cash services from 70 branches short-sighted - Pearse Doherty TD",
    source: "Sinn Féin",
    type: "Statement",
    category: "Irish Press Releases & Statements",
    datePublished: "2022-07-19",
    aiAnalysis: {
      summary: "A statement from Sinn Féin's Pearse Doherty TD criticizing AIB's decision to reduce cash services."
    },
    keyTopics: ["finance", "banking"],
    userInteractions: { views: 112 }
  },
  {
    _id: "press-lab-lgbtq-2023",
    title: "Labour LGBTQ+ statement in advance of Dublin Pride",
    source: "Labour Party",
    type: "Press Release",
    category: "Irish Press Releases & Statements",
    datePublished: "2023-06-01",
    aiAnalysis: {
      summary: "The Labour Party's statement on LGBTQ+ rights issued in conjunction with Dublin Pride celebrations."
    },
    keyTopics: ["equality", "LGBTQ+ rights"],
    userInteractions: { views: 101 }
  },
  {
    _id: "press-sd-triplelock-2025",
    title: "The people of Ireland, not the government, should decide future of the Triple Lock",
    source: "Social Democrats",
    type: "Press Release",
    category: "Irish Press Releases & Statements",
    datePublished: "2025-03-25",
    aiAnalysis: {
      summary: "A press release from the Social Democrats arguing for public decision-making on the future of Ireland's military neutrality policy (the 'Triple Lock')."
    },
    keyTopics: ["pensions", "defence", "neutrality"],
    userInteractions: { views: 88 }
  },
  {
    _id: "press-pbp-trump-2024",
    title: "Trump's Re-Election Represents Growing Division and Disaffection",
    source: "People Before Profit",
    type: "Press Release",
    category: "Irish Press Releases & Statements",
    datePublished: "2024-11-07",
    aiAnalysis: {
      summary: "A statement from People Before Profit on the implications of a potential Trump re-election for international politics."
    },
    keyTopics: ["international", "US politics"],
    userInteractions: { views: 76 }
  },
  {
    _id: "press-aontu-escooter-2025",
    title: "Navan Councillor tells of narrow escape with e-scooter being driven recklessly",
    source: "Aontú",
    type: "News",
    category: "Irish Press Releases & Statements",
    datePublished: "2025-05-07",
    aiAnalysis: {
      summary: "A news item from Aontú highlighting a local issue concerning e-scooter usage and public safety."
    },
    keyTopics: ["transport", "public safety"],
    userInteractions: { views: 65 }
  },

  // Oireachtas Debates (Dáil & Seanad)
  {
    _id: "oireachtas-hansard",
    title: "Official Reports (Hansard)",
    source: "Houses of the Oireachtas",
    type: "Official Report",
    category: "Oireachtas Debates (Dáil & Seanad)",
    datePublished: "2024-01-01",
    aiAnalysis: {
      summary: "The official, verbatim transcript of every Dáil and Seanad sitting, containing all spoken contributions, questions, and answers. A primary source for parliamentary activity."
    },
    keyTopics: ["debates", "Dáil", "Seanad", "transcript", "hansard"],
    userInteractions: { views: 350 }
  },

  // Oireachtas Voting Records (Divisions)
  {
    _id: "oireachtas-divisions",
    title: "Dáil and Seanad Divisions",
    source: "Oireachtas",
    type: "Voting Record",
    category: "Oireachtas Voting Records (Divisions)",
    datePublished: "2024-01-01",
    aiAnalysis: {
      summary: "Recorded vote results (names of YES/NO) for every division in the Dáil and Seanad. Publicly available via Oireachtas APIs and the site's 'Find a Vote' tool."
    },
    keyTopics: ["voting records", "divisions", "Oireachtas API", "parliamentary votes"],
    userInteractions: { views: 280 }
  },
  {
    _id: "ep-rollcall-votes",
    title: "European Parliament roll-call votes",
    source: "EU Parliament",
    type: "Voting Record",
    category: "Oireachtas Voting Records (Divisions)",
    datePublished: "2024-01-01",
    aiAnalysis: {
      summary: "European Parliament vote results, including roll-call votes with downloadable PDFs. VoteWatch.eu previously compiled this data."
    },
    keyTopics: ["roll-call votes", "European Parliament", "MEP votes"],
    userInteractions: { views: 265 }
  },

  // Sponsored Bills, Motions & Amendments (Oireachtas)
  {
    _id: "oireachtas-bills",
    title: "Oireachtas Bills & Acts Database",
    source: "Oireachtas",
    type: "Bill",
    category: "Sponsored Bills, Motions & Amendments (Oireachtas)",
    datePublished: "2024-01-01",
    aiAnalysis: {
      summary: "A comprehensive database listing every bill by number, title, sponsor, and type, showing its history and amendments."
    },
    keyTopics: ["bills", "acts", "legislation", "sponsorship"],
    userInteractions: { views: 310 }
  },
  {
    _id: "oireachtas-motions",
    title: "Oireachtas Motions & Amendments",
    source: "Oireachtas",
    type: "Motion/Amendment",
    category: "Sponsored Bills, Motions & Amendments (Oireachtas)",
    datePublished: "2024-01-01",
    aiAnalysis: {
      summary: "Government and opposition motions as recorded in the Official Report. Committee or Government amendments appear in the legislative history on Oireachtas.ie."
    },
    keyTopics: ["motions", "amendments", "Official Report", "legislative process"],
    userInteractions: { views: 240 }
  },

  // European Parliament Debates (Plenary)
  {
    _id: "ep-verbatim-reports",
    title: "European Parliament Verbatim Reports",
    source: "European Parliament",
    type: "Verbatim Report",
    category: "European Parliament Debates (Plenary)",
    datePublished: "2024-01-01",
    aiAnalysis: {
      summary: "Full transcripts of EP plenary sessions, available by date in all official EU languages as HTML or XML."
    },
    keyTopics: ["EP debates", "plenary", "transcripts", "EU Parliament"],
    userInteractions: { views: 290 }
  },

  // European Parliament Voting Records
  {
    _id: "ep-plenary-votes",
    title: "European Parliament Roll-Call Votes",
    source: "europarl.europa.eu",
    type: "Voting Record",
    category: "European Parliament Voting Records",
    datePublished: "2024-01-01",
    aiAnalysis: {
      summary: "Official results of plenary votes, filterable by country or party group. Provides each MEP's vote (for, against, abstain) and aggregated statistics."
    },
    keyTopics: ["roll-call votes", "MEP votes", "voting statistics", "EU Parliament"],
    userInteractions: { views: 275 }
  },

  // European Political Group Position Papers
  {
    _id: "ep-group-papers",
    title: "European Political Group Position Papers",
    source: "EP Party Groups",
    type: "Position Paper",
    category: "European Political Group Position Papers",
    datePublished: "2024-01-01",
    aiAnalysis: {
      summary: "Major EP party groups (e.g., EPP, S&D, Renew Europe) publish position papers and press releases on their websites, outlining policy priorities and statements."
    },
    keyTopics: ["EPP", "S&D", "Renew Europe", "Greens/EFA", "The Left", "position papers"],
    userInteractions: { views: 220 }
  },
  
  // Historical Archives & Additional Resources
  {
    _id: "archive-manifestos",
    title: "Manifesto Archives",
    source: "Irish Election Manifesto Archive",
    type: "Archive",
    category: "Historical Archives & Additional Resources",
    datePublished: "2023-01-01",
    aiAnalysis: {
      summary: "Archive listing manifestos from many Irish parties going back decades, including historical parties like the Workers Party."
    },
    keyTopics: ["manifesto", "archive", "elections", "historical"],
    userInteractions: { views: 195 }
  },
  {
    _id: "archive-oireachtas-data",
    title: "Oireachtas Open Data",
    source: "data.oireachtas.ie",
    type: "Data Portal",
    category: "Historical Archives & Additional Resources",
    datePublished: "2023-01-01",
    aiAnalysis: {
      summary: "An open-data portal offering transcripts and division results, formerly available via XML feeds. A key resource for historical parliamentary data."
    },
    keyTopics: ["open data", "Oireachtas", "transcripts", "divisions", "API"],
    userInteractions: { views: 205 }
  },
  {
    _id: "archive-ep-archives",
    title: "European Parliament Archives",
    source: "EP historical archives",
    type: "Archive",
    category: "Historical Archives & Additional Resources",
    datePublished: "2023-01-01",
    aiAnalysis: {
      summary: "Includes plenary debates since 1958 and legislative documents since 1979, accessible via older EP websites or the OData API."
    },
    keyTopics: ["archive", "European Parliament", "historical", "debates"],
    userInteractions: { views: 185 }
  },
  {
    _id: "archive-kildarestreet",
    title: "KildareStreet.com (Archived)",
    source: "KildareStreet.com",
    type: "Archive",
    category: "Historical Archives & Additional Resources",
    datePublished: "2022-01-01",
    aiAnalysis: {
      summary: "An archived but historically significant project that mirrored and indexed Oireachtas data, providing a user-friendly, searchable interface."
    },
    keyTopics: ["archive", "Oireachtas data", "civil society project", "searchable debates"],
    userInteractions: { views: 235 }
  }
];
