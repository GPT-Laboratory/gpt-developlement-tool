import React from "react";

export const columns = [
  {
    title: "No",
    dataIndex: "index",
    key: "index",
    width: 80,
    render: (text, record, index) => index + 1, // Renders the row number
  },
  {
    title: "Epic",
    dataIndex: "epic",
    key: "epic",
    width: 500,
  },
  {
    title: "User Stories",
    dataIndex: "user_story",
    key: "user_story",
    width: 700,
  },
];

export const prioritizedColumns = [
  {
    title: "No",
    dataIndex: "index",
    key: "index",
    width: 80,
    render: (text, record, index) => index + 1, // Renders the row number
  },
  {
    title: "Old No",
    dataIndex: "ID",
    key: "ID",
    width: 80,
  },
  {
    title: "Epic",
    dataIndex: "epic",
    key: "epic",
    width: 500,
  },
  {
    title: "User Stories",
    dataIndex: "user_story",
    key: "user_story",
    width: 700,
  },
];

export const prioritizedColumnswithWSJF = [
  {
    title: "No",
    dataIndex: "index",
    key: "index",
    width: 80,
    render: (text, record, index) => index + 1, // Renders the row number
  },
  {
    title: "Old No",
    dataIndex: "ID",
    key: "ID",
    width: 80,
  },
  {
    title: "Epic",
    dataIndex: "epic",
    key: "epic",
    width: 500,
  },
  {
    title: "User Stories",
    dataIndex: "user_story",
    key: "user_story",
    width: 700,
  },
  {
    title: "WSJF Factors",
    dataIndex: "wsjf_factors",
    key: "wsjf_factors",
    width: 300,
    render: (text, record) => (
      <div>
        <strong>BV:</strong> {record.BV}, <strong>JS:</strong> {record.JS}, <strong>RR/OE:</strong> {record.RR_OE}, <strong>TC:</strong> {record.TC}
      </div>
    ),
  },
  {
    title: "WSJF Score",
    dataIndex: "wsjf_score",
    key: "wsjf_score",
    width: 200
  },
  
];

export const prioritizedColumnswith100Dollar = [
  {
    title: "No",
    dataIndex: "index",
    key: "index",
    width: 80,
    render: (text, record, index) => index + 1, // Renders the row number
  },
  {
    title: "Old No",
    dataIndex: "key",
    key: "key",
    width: 80,
  },
  {
    title: "Epic",
    dataIndex: "epic",
    key: "epic",
    width: 500,
  },
  {
    title: "User Stories",
    dataIndex: "user_story",
    key: "user_story",
    width: 700,
  }
];

export const paperColumns = (papersFilterData, handleCheckboxChange) => [
  {
    width: 65,
    title: "Filter",
    dataIndex: "checkbox",
    render: (_, record) => (
      <input
        type="checkbox"
        checked={papersFilterData.includes(record)}
        onChange={() => handleCheckboxChange(record)}
      />
    ),
  },
  {
    title: "No",
    dataIndex: "index",
    key: "index",
    width: 80,
    render: (text, record, index) => index + 1, // Renders the row number
  },
  { title: "Title", dataIndex: "title", key: "title", width: 200 },
  { title: "Author", dataIndex: "creator", key: "creator", width: 100 },

  { title: "Publication URL", dataIndex: "link", key: "link", width: 400 },
  {
    title: "Journal Name",
    dataIndex: "publicationName",
    key: "publicationName",
    width: 200,
  },
  { title: "DOI", dataIndex: "doi", key: "doi", width: 200 },
  {
    title: "Paper Type",
    dataIndex: "aggregationType",
    key: "aggregationType",
    width: 150,
  },
  {
    title: "Affiliation Country",
    dataIndex: "affiliation-country",
    key: "affiliation-country",
    width: 100,
  },
  {
    title: "Affiliation Name",
    dataIndex: "affilname",
    key: "affilname",
    width: 200,
  },
  { title: "Volume", dataIndex: "volume", key: "volume", width: 90 },
  { title: "Publication Year", dataIndex: "year", key: "year", width: 90 },
  {
    title: "Open Access",
    dataIndex: "openaccess",
    key: "openaccess",
    render: (text) => (text ? "Yes" : "No"),
    width: 150,
  }, // Assuming openaccess is a boolean
];

// export const paperColumns= (papersFilterData, handleCheckboxChange) => [
//     {
//         width:65,
//         title: 'Filter',
//         dataIndex: 'checkbox',
//         render: (_, record) => (
//           <input
//             type="checkbox"
//             checked={papersFilterData.includes(record)}
//             onChange={() => handleCheckboxChange(record)}
//           />
//         ),
//     },
//     {
//         title: 'No',
//         dataIndex: 'index',
//         key: 'index',
//         width: 80,
//         render: (text, record, index) => index + 1, // Renders the row number
//       },
//     { title: 'Title', dataIndex: 'title', key: 'title', width: 200 },
//     { title: 'Author', dataIndex: 'creator', key: 'creator', width: 100 },

//     { title: 'Publication URL', dataIndex: 'link', key: 'link', width: 400 },
//     { title: 'Journal Name', dataIndex: 'publicationName', key: 'publicationName', width: 200 },
//     { title: 'DOI', dataIndex: 'doi', key: 'doi', width: 200 },
//     { title: 'Paper Type', dataIndex: 'aggregationType', key: 'aggregationType', width: 150 },
//     { title: 'Affiliation Country', dataIndex: 'affiliation-country', key: 'affiliation-country', width: 100 },
//     { title: 'Affiliation Name', dataIndex: 'affilname', key: 'affilname', width: 200 },
//     { title: 'Volume', dataIndex: 'volume', key: 'volume', width: 90 },
//     { title: 'Publication Year', dataIndex: 'year', key: 'year', width: 90 },
//     { title: 'Open Access', dataIndex: 'openaccess', key: 'openaccess', render: text => text ? 'Yes' : 'No', width: 150 }, // Assuming openaccess is a boolean
// ];

export const filterColumns = [
  {
    title: "No",
    dataIndex: "index",
    key: "index",
    width: 80,
    render: (text, record, index) => index + 1, // Renders the row number
  },
  { title: "Title", dataIndex: "title", key: "title", width: 200 },
  { title: "Author", dataIndex: "creator", key: "creator", width: 100 },

  { title: "Publication URL", dataIndex: "link", key: "link", width: 400 },
  {
    title: "Journal Name",
    dataIndex: "publicationName",
    key: "publicationName",
    width: 200,
  },
  { title: "DOI", dataIndex: "doi", key: "doi", width: 200 },
  {
    title: "Paper Type",
    dataIndex: "aggregationType",
    key: "aggregationType",
    width: 150,
  },
  {
    title: "Affiliation Country",
    dataIndex: "affiliation-country",
    key: "affiliation-country",
    width: 100,
  },
  {
    title: "Affiliation Name",
    dataIndex: "affilname",
    key: "affilname",
    width: 200,
  },
  { title: "Volume", dataIndex: "volume", key: "volume", width: 90 },
  { title: "Publication Year", dataIndex: "year", key: "year", width: 90 },
  {
    title: "Open Access",
    dataIndex: "openaccess",
    key: "openaccess",
    render: (text) => (text ? "Yes" : "No"),
    width: 150,
  }, // Assuming openaccess is a boolean
];

export const answers = [
  {
    title: "No",
    dataIndex: "index",
    key: "index",
    width: 80,
    render: (text, record, index) => index + 1, // Renders the row number
  },
  {
    title: "Question",
    dataIndex: "question",
    key: "question",
    width: 280,
  },
  {
    title: "Answer",
    dataIndex: "answer",
    key: "answer",
  },
];

export const userStory =
  "As a researcher, I want to generate questions based on my research objectives so that I can guide the SLR-GPT system to focus on relevant topics.";

export const testCases = [
  {
    suite_number: 1,
    scenario: "Research Objective with Clear Keywords",
    input:
      "A researcher specifies clear keywords related to their research objective, such as 'machine learning techniques for image recognition'.",
    expected_output:
      "The SLR-GPT system generates questions focusing on the key aspects of machine learning techniques for image recognition.",
  },
  {
    suite_number: 2,
    scenario: "Research Objective with Broad Topic",
    input:
      "A researcher provides a broad research objective, such as 'recent trends in artificial intelligence'.",
    expected_output:
      "The SLR-GPT system generates a diverse set of questions covering various aspects of recent trends in artificial intelligence.",
  },
  {
    suite_number: 3,
    scenario: "Multiple Research Objectives",
    input:
      "A researcher includes multiple research objectives in the input, like 'impact of big data on healthcare' and 'challenges in implementing AI in businesses'.",
    expected_output:
      "The SLR-GPT system generates questions addressing both research objectives separately and does not mix them in the generated questions.",
  },
  {
    suite_number: 4,
    scenario: "Ambiguous Research Objective",
    input:
      "A researcher provides a vague or ambiguous research objective, such as 'technology advancements'.",
    expected_output:
      "The SLR-GPT system prompts the researcher to provide more specific details or keywords to generate relevant questions.",
  },
  {
    suite_number: 5,
    scenario: "Research Objective with Limitations",
    input:
      "A researcher defines research objectives with constraints, such as 'ethical considerations in AI applications under GDPR regulations'.",
    expected_output:
      "The SLR-GPT system tailors questions to focus on the ethical considerations specifically within AI applications under GDPR regulations.",
  },
];

// Define columns for your table
export const testCasesColumns = [
  {
    title: "Test Case Suite No",
    dataIndex: "suite_number",
    key: "suite_number",
    width: 120,
  },
  {
    title: "Scenario",
    dataIndex: "scenario",
    key: "scenario",
  },
  {
    title: "Input",
    dataIndex: "input",
    key: "input",
  },
  {
    title: "Expected Output",
    dataIndex: "expected_output",
    key: "expected_output",
  },
];
