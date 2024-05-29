import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import { RQicon } from "./mysvg";
import {
  Button,
  Divider,
  Form,
  Input,
  Layout,
  Space,
  Table,
  notification,
  Select,
  Result,
  Collapse,
  theme,
  message,
} from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { SearchOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import FullPageLoader from "./FullPageLoader";
import {
  answers,
  columns,
  filterColumns,
  prioritizedColumns,
  userStory,
  testCases,
  testCasesColumns,
  prioritizedColumnswithWSJF,
  prioritizedColumnswith100Dollar,
} from "./columns";

function App() {
  const [loading, setLoading] = useState(false);
  const contentRef = useRef();
  const scrollToBottom = () => {
    let elem = document.getElementById("mainContainer");
    setTimeout(() => {
      elem.scroll(0, elem.scrollHeight);
    }, 300);
  };

  const [name, setName] = useState(
    "The proposed system is designed to streamline research processes by offering a suite of advanced features. It enables users to generate research-specific questions, interact through a React-based user interface, and choose between ChatGPT 3.5 or 4 for language modeling. The system supports API integration, adheres to specific inclusion and exclusion criteria for literature review, and facilitates paper summarization and data extraction. It also allows for both qualitative and quantitative analysis, directly addresses research queries, and aids in the production of key research documentation such as abstracts, introductions, and LaTeX summaries. This comprehensive tool aims to enhance research efficiency and output quality through its multifunctional capabilities."
  );
  const [num_stories, setNoOfRequirments] = useState(10);
  const [researchQuestions, setResearchQuestions] = useState([]);
  const [userStoriesApiResponse, setUserStoriesApiResponse] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [start_year, setstartYear] = useState(2023);
  const [end_year, setEndYear] = useState(2020);
  const [testCasesResp, setTestCasesResp] = useState([]);
  const [AhpApiResponse, setAHPApiResponse] = useState([]);

  const generateSearchString = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch("/api/generate_search_string", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          objective: name,
          research_questions: researchQuestions,
        }),
      });
      const message = await response.json();
      setSearchString(
        message.search_string
          .replace(/^\d+\.\s*/, "") // Remove any leading digits and dots
          .replace(/\bAND\b/g, "OR") // Replace "AND" with "OR"
          .replace(/[()]/g, "") // Remove parentheses
      );
      setLoading(false);
      scrollToBottom();
      notification.success({
        message: "Search String Generated",
      });
    } catch (e) {
      notification.error({
        message: `internal Server Error`,
      });
      setLoading(false);
    }
  };
  const [papersData, setPapersData] = useState();
  const [limitPaper, setLimitPaper] = useState(10);
  const fetchAndSavePapers = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch("/api/search_papers", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search_string: searchString,
          start_year: start_year,
          limit: limitPaper,
        }),
      });
      const message = await response.json();
      if (message) {
        setPapersData(message);
      }
      scrollToBottom();
      setLoading(false);
      notification.success({
        message: "Papers Found",
      });
    } catch (e) {
      console.log("error:", e);
      setLoading(false);
      notification.error({
        message: "Internal Server Error",
      });
    }
  };
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectType, setSelectType] = useState("input");
  const [selectModel, setSelectModel] = useState("gpt-3.5-turbo");
  const [selectMethod, setSelectMethod] = useState("");
  const [topic, setTopic] = useState("Write Login api code ");
  const [topic2, setTopic2] = useState("");
  const [WSJFResponse, setWSJFResponse] = useState([]);
  const [dollarResponse, setDollarFResponse] = useState([]);
  const [result, setResult] = useState("");
  const [result1, setResult1] = useState([]);
  const [result2, setResult2] = useState();
  const [result3, setResult3] = useState();
  const [result4, setResult4] = useState();
  const [result5, setResult5] = useState();
  const [typingIndex, setTypingIndex] = useState(0);
  const [index, setindex] = useState(0);
  const [index1, setindex1] = useState(0);
  const [index2, setindex2] = useState(0);
  const [index3, setindex3] = useState(0);
  const [index4, setindex4] = useState(0);
  const [index5, setindex5] = useState(0);
  const [svgUrl, setSvgUrl] = useState();
  const { Panel } = Collapse;

  const handleModel = (value) => {
    setSelectModel(value);
    console.log(value);
  };

  const handleLanguage = (value) => {
    setSelectMethod(value);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setindex((prevIndex) => {
        if (result && prevIndex < result.length) {
          return prevIndex + 4;
        } else {
          clearInterval(interval);
          return prevIndex;
        }
      });
    }, 1);

    return () => clearInterval(interval);
  }, [result]);

  useEffect(() => {
    const interval = setInterval(() => {
      setindex2((prevIndex) => {
        if (result2 && prevIndex < result2.length) {
          return prevIndex + 4;
        } else {
          clearInterval(interval);
          return prevIndex;
        }
      });
    }, 1);

    return () => clearInterval(interval);
  }, [result2]);

  useEffect(() => {
    const interval = setInterval(() => {
      setindex3((prevIndex) => {
        if (result3 && prevIndex < result3.length) {
          return prevIndex + 4;
        } else {
          clearInterval(interval);
          return prevIndex;
        }
      });
    }, 1);

    return () => clearInterval(interval);
  }, [result3]);

  useEffect(() => {
    const interval = setInterval(() => {
      setindex4((prevIndex) => {
        if (result4 && prevIndex < result4.length) {
          return prevIndex + 4;
        } else {
          clearInterval(interval);
          return prevIndex;
        }
      });
    }, 1);

    return () => clearInterval(interval);
  }, [result4]);

  useEffect(() => {
    const interval = setInterval(() => {
      setindex5((prevIndex) => {
        if (result5 && prevIndex < result5.length) {
          return prevIndex + 4;
        } else {
          clearInterval(interval);
          return prevIndex;
        }
      });
    }, 1);

    return () => clearInterval(interval);
  }, [result5]);

  const handleGenerateCode = async () => {
    setResult("");
    setResult2("");
    const parameters = selectModel + topic;
    console.log(parameters);
    try {
      setLoading(true);
      const response = await fetch("/api/generate-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: topic,
          model: selectModel,
          method: selectMethod,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      if (selectMethod === "UML-diagram") {
        const data = await response.blob();
        const localUrl = URL.createObjectURL(data);
        setSvgUrl(localUrl);
        setLoading(false);
        scrollToBottom();
        notification.success({
          message: "Successfully Generated",
        });
      } else {
        const data = await response.json();
        console.log(data); // Check the entire response data for any unexpected values
        setResult(data.Code);
        setLoading(false);
        scrollToBottom();
        notification.success({
          message: "Successfully Generated",
        });
        setindex(0);
      }
    } catch (error) {
      console.error("Error:", error); // Log any errors to the console
      setLoading(false);
    }
  };

  const handleGenerateCode2 = async (e) => {
    e.preventDefault();
    const parameters = result + topic2;
    console.log(parameters);

    try {
      setLoading(true);
      const response = await fetch("/api/generate-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: topic,
          model: selectModel,
          method: selectMethod,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data); // Check the entire response data for any unexpected values
      setResult2(data.Code);
      // setCodeResult(data.Code)
      setLoading(false);
      scrollToBottom();
      notification.success({
        message: "Successfully Generated",
      });
      setindex2(0);
    } catch (error) {
      console.error("Error:", error); // Log any errors to the console
    }
  };

  const handleGenerateCode3 = async (e) => {
    e.preventDefault();
    const parameters = result + topic2;
    console.log(parameters);

    try {
      setLoading(true);
      const response = await fetch("/api/generate-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: topic,
          model: selectModel,
          method: selectMethod,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data); // Check the entire response data for any unexpected values
      setResult3(data.Code);
      // setCodeResult(data.Code)
      setLoading(false);
      scrollToBottom();
      notification.success({
        message: "Successfully Generated",
      });
      setindex3(0);
    } catch (error) {
      console.error("Error:", error); // Log any errors to the console
    }
  };

  const handleGenerateCode4 = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await fetch("/api/generate-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: topic,
          model: selectModel,
          method: selectMethod,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data); // Check the entire response data for any unexpected values
      setResult4(data.Code);
      // setCodeResult(data.Code)
      setLoading(false);
      scrollToBottom();
      notification.success({
        message: "Successfully Generated",
      });
      setindex4(0);
    } catch (error) {
      console.error("Error:", error); // Log any errors to the console
    }
  };

  const handleGenerateCode5 = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch("/api/generate-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: topic,
          model: selectModel,
          method: selectMethod,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data); // Check the entire response data for any unexpected values
      setResult5(data.Code);
      // setCodeResult(data.Code)
      setLoading(false);
      scrollToBottom();
      notification.success({
        message: "Successfully Generated",
      });
      setindex5(0);
    } catch (error) {
      console.error("Error:", error); // Log any errors to the console
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch("/api/generate-user-stories", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          objective: name,
          num_stories: num_stories,
        }),
      });
      const message = await response.json();
      console.log(message);
      let dataResponse = message.stories_with_epics.map((i, index) => ({
        ...i,
        key: index,
      }));
      console.log("response:", dataResponse);
      setResult1(dataResponse);

      setindex1(0);
      //  setResearchQuestions(questions)
      setLoading(false);
      scrollToBottom();
      notification.success({
        message: "User stories Generated",
      });
    } catch (error) {
      console.error("Error submitting data:", error);
      setLoading(false);
      notification.error({
        message: "Internal Server Error",
      });
    }
  };

  const addKeyToResponse = (responseData) => {
    if (!Array.isArray(responseData)) {
      return []; // Return an empty array if response data is not an array
    }
    return responseData.map((item, index) => ({
      ...item,
      key: index, // Assigning index as the key
    }));
  };

  const handleFileUpload = async (file) => {
    console.log(selectedFile);
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/upload-csv", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const data = await response.json();
      console.log(data);
      const responseDataWithKeys = addKeyToResponse(data.stories_with_epics);
      console.log("Uploaded file data:", responseDataWithKeys); // Log the transformed data
      setResult1(responseDataWithKeys);

      setLoading(false);
      notification.success({
        message: "File uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      setLoading(false);
      notification.error({
        message: "Error uploading file",
      });
    }
  };

  const [papersFilterData, setPapersFilterData] = useState([]);
  const handleCheckboxChange = (key) => {
    const newpapersFilterData = [...papersFilterData];
    if (newpapersFilterData.includes(key)) {
      newpapersFilterData.splice(newpapersFilterData.indexOf(key), 1);
    } else {
      newpapersFilterData.push(key);
    }
    setPapersFilterData(newpapersFilterData);
  };

  const fetchAndPrioritizeAHP = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch("/api/prioritize/ahp", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          method: "AHP",
          stories: result1,
          criteria: ["Business Value", "Technical Feasibility", "User Impact"],
          criteriaComparisons: {
            "Business Value_Technical Feasibility": 1,
            "Business Value_User Impact": 3,
            "Technical Feasibility_User Impact": 2,
          },
          storyComparisons: {
            "Business Value": { "1_2": 2 },
            "Technical Feasibility": { "1_2": 1 },
            "User Impact": { "1_2": 3 },
          },
        }),
      });
      const msgs = await response.json();
      if (msgs) {
        console.log(msgs);
        let res = msgs.prioritized_stories.map((i, index) => ({
          ...i,
          key: index,
        }));
        console.log("response:", res);
        setAHPApiResponse(res);
        console.log("ahp-response :", AhpApiResponse);
      }
      scrollToBottom();
      setLoading(false);
      notification.success({
        message: "Prioritized AHP Successfully",
      });
    } catch (e) {
      console.log("error:", e);
      setLoading(false);
      notification.error({
        message: "internal server error",
      });
    }
  };

  const fetchAndPrioritize100dollar = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch("/api/prioritize/100-dollar-method", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          method: "100-dollar-method",
          stories: result1,
          criteria: ["Business Value", "Technical Feasibility", "User Impact"],
          criteriaWeights: {
            "Business Value": 40, // Adjust these weights as needed
            "Technical Feasibility": 30,
            "User Impact": 30,
          },
        }),
      });
      const message = await response.json();
      if (message) {
        console.log(message);
        let res = message.prioritized_stories.map((i, index) => ({
          ...i,
          key: index + 1,
        }));
        console.log("response:", res);
        setDollarFResponse(res);
      }
      scrollToBottom();
      setLoading(false);
      notification.success({
        message: "Papers Filtered",
      });
    } catch (e) {
      console.log("error:", e);
      setLoading(false);
      notification.error({
        message: "internal server error",
      });
    }
  };

  const fetchAndPrioritizeWSJF = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch("api/estimate_wsjf", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          method: "WSJF",
          stories: result1,
        }),
      });
      const msgs = await response.json();
      if (msgs) {
        console.log(msgs);
        let res = msgs.prioritized_stories.map((i, index) => ({
          ...i,
          key: index,
          BV: i.wsjf_factors ? i.wsjf_factors.BV : null,
          JS: i.wsjf_factors ? i.wsjf_factors.JS : null,
          RR_OE: i.wsjf_factors ? i.wsjf_factors["RR/OE"] : null,
          TC: i.wsjf_factors ? i.wsjf_factors.TC : null,
        }));
        console.log("response:", res);
        setWSJFResponse(res);
        // console.log("wsjf-response :", WSJFResponse);
      }
      scrollToBottom();
      setLoading(false);
      notification.success({
        message: "Prioritized WSJF Successfully",
      });
    } catch (e) {
      console.log("error:", e);
      setLoading(false);
      notification.error({
        message: "internal server error",
      });
    }
  };

  const convertAndDownload = async (e) => {
    e.preventDefault();
    console.log("download Works");
    try {
      // Check if WSJFResponse is empty
      if (WSJFResponse.length === 0) {
        console.log("No data to download");
        return;
      }

      const response = await fetch("/api/convert-and-download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prioritize_stories: WSJFResponse }),
      });

      if (!response.ok) {
        throw new Error("Failed to download CSV");
      }

      // Initiate the download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "user_stories.csv");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading CSV:", error);
      // Handle error, e.g., show error message
    }
  };

  const convertAndDownload100Dollar = async (e) => {
    e.preventDefault();
    console.log("1oo dollar download works");
    try {
      // Check if WSJFResponse is empty
      if (dollarResponse.length === 0 ) {
        console.log("No data to download");
        return;
      }

      const response = await fetch("/api/convert-and-download100dollar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prioritize_stories: dollarResponse }),
      });

      if (!response.ok) {
        throw new Error("Failed to download CSV");
      }

      // Initiate the download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "user_stories.csv");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading CSV:", error);
      // Handle error, e.g., show error message
    }
  };

  const convertAndDownloadAhp = async (e) => {
    e.preventDefault();
    console.log(" AHP download works");
    try {
      // Check if WSJFResponse is empty
      if ( AhpApiResponse.length === 0) {
        console.log("No data to download");
        return;
      }

      const response = await fetch("/api/convert-and-downloadAhp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prioritize_stories: AhpApiResponse }),
      });

      if (!response.ok) {
        throw new Error("Failed to download CSV");
      }

      // Initiate the download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "user_stories.csv");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading CSV:", error);
      // Handle error, e.g., show error message
    }
  };

  const [ansWithQuestions, setAnsWithQuestionsData] = useState();
  const ansWithQuestionsData = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch("/api/answer_question", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questions: researchQuestions,
          papers_info: [...new Set([...papersFilterData, ...papersFilterData])],
        }),
      });
      const message = await response.json();
      console.log("message:", message);
      if (message) {
        setAnsWithQuestionsData(message.answers);
      }
      setLoading(false);
      notification.success({
        message: "Answers Generated",
      });
      scrollToBottom();
    } catch (e) {
      console.log("error:", e);
      setLoading(false);
      notification.error({
        message: "Internal Server Error",
      });
    }
  };
  const [summary, setSummary] = useState();
  const [introSummary, setIntroSummary] = useState();
  const generateSummaryAbstract = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let response = await fetch("api/generate-summary-abstract", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questions: researchQuestions,
          objective: name,
          search_string: searchString,
        }),
      });
      let message = await response.json();
      setSummary(message.summary_abstract);
      setLoading(false);
      notification.success({
        message: "Summary Abstract Generated",
      });
      scrollToBottom();
    } catch (error) {
      setLoading(false);
      console.log("error:", error);
    }
  };
  const introductionSummary = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let response = await fetch("api/generate-introduction-summary", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questions: researchQuestions,
          objective: name,
          search_string: searchString,
          total_papers: papersData,
          filtered_papers: papersFilterData,
          answers: ansWithQuestions,
        }),
      });
      let message = await response.json();
      setIntroSummary(message.introduction_summary);
      setLoading(false);
      notification.success({
        message: "Introduction Summary Generated",
      });
      scrollToBottom();
    } catch (error) {
      setLoading(false);
      console.log("error:", error);
    }
  };
  const [downloadlink, setDownloadLink] = useState();
  const generateAllSummary = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let response = await fetch("api/generate-summary-all", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          abstract_summary: summary,
          intro_summary: introSummary,
          conclusion_summary: summary,
        }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const blob = await response.blob();
      const contentDisposition = response.headers.get("Content-Disposition");
      const filename = contentDisposition
        ? contentDisposition.split("filename=")[1]
        : "paper_summary.tex";
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("error:", error);
    }
  };
  const handleTextareaChange = (event) => {
    const newText = event.target.value;
    const modifiedString = newText.replace(/^Question \d+: /gm, "");
    console.log("modified value", modifiedString.trim());
    // console.log("question value:", event.target.value)
    const newQuestions = modifiedString.split("\n").map((question) => question);

    setResearchQuestions(newQuestions);
  };
  const handleSearchStringChange = (event) => {
    if (event.target.value == "") {
      setSearchString(" ");
    } else {
      setSearchString(event.target.value);
    }
  };

  // Define options based on selectMethod value
  const options =
    selectMethod === "frontend"
      ? [
          { value: "end_to_end", label: "End testCase" },
          { value: "backend", label: "backend" },
        ]
      : selectMethod === "backend"
      ? [
          { value: "unit", label: "Unit Test Case" },
          { value: "frontend", label: "frontend" },
        ]
      : [
          { value: "unit", label: "Unit Test Case" },
          { value: "backend", label: "backend" },
          { value: "end_to_end", label: "end_to_end" },
          { value: "frontend", label: "frontend" },
        ];
  return (
    <Layout>
      <Header style={{ backgroundColor: "#f3fff3" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginLeft: "0px",
          }}
        >
          <div>
            <RQicon width={"60px"} height={"60px"} />
          </div>
          <div style={{ fontSize: "20px", color: "black" }}>
            <strong>GPT-Development Tool</strong>
          </div>
          <div></div>
        </div>
      </Header>
      <Layout>
        <Content>
          {loading && <FullPageLoader />}

          <div
            id="mainContainer"
            style={{
              // paddingTop:"150px",
              lineHeight: "0px",
              display: "flex",
              flexDirection: "column",
              // justifyContent: "center",
              // alignContent: "center",
              alignItems: "center",
              overflowY: "auto",
              height: "85vh",
              paddingBottom: "30px",
            }}
            ref={contentRef}
          >
            <Collapse
              expandIcon={({ isActive }) => (
                <CaretRightOutlined rotate={isActive ? 90 : 0} />
              )}
              accordion={false}
              defaultActiveKey={["1"]}
              style={{
                marginTop: "20px",
                marginBottom: "16px",
                width: "80vw",
              }}
            >
              <Panel
                header="Requirment Engineering section"
                key="1"
                style={{ width: "100%" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "78vw",
                    border: "1px solid #e3e3e3",
                    marginTop: 20,
                    paddingLeft: 15,
                    paddingTop: 6,
                    paddingBottom: 6,
                    borderRadius: "10px",
                    marginBottom: 5,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <h5> Select Type:</h5>
                    <div>
                      <input
                        type="checkbox"
                        checked={selectType === "input"}
                        onChange={() => setSelectType("input")}
                        style={{ marginRight: "10px", marginLeft: "25px" }}
                      />
                      <label htmlFor="input">Input Content</label>
                    </div>
                    <br />
                    <div>
                      <input
                        type="checkbox"
                        checked={selectType === "file"}
                        onChange={() => setSelectType("file")}
                        style={{ marginRight: "10px" }}
                      />
                      <label htmlFor="file">File Upload</label>
                    </div>
                  </div>
                </div>

                {selectType === "input" && (
                  <div>
                    <div>
                      {/* <div style={{textAlign:"center"}}><RQicon width={"100px"} height={"100px"} /></div> */}
                      <h5>
                        Hello, Enter your idea for generating user stories.
                      </h5>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "78vw",
                        border: "1px solid #ccc",
                        padding: 15,
                        marginBottom: 5,
                        borderRadius: "10px",
                      }}
                    >
                      <Form
                        layout="vertical"
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Form.Item
                          label="Objective"
                          style={{ flex: "1 1 70%", marginRight: "5px" }}
                        >
                          {/* <Input
                        placeholder="Ask me anything..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      /> */}
                          <TextArea
                            rows={2}
                            placeholder="maxLength is 6"
                            maxLength={6}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{ color: "black" }}
                          />
                        </Form.Item>

                        <Form.Item
                          label="No. of User Stories"
                          style={{ flex: 1, marginRight: "5px" }}
                        >
                          <Input
                            placeholder="Number of User Stories"
                            min={1}
                            max={15}
                            value={num_stories}
                            onChange={(e) => setNoOfRequirments(e.target.value)}
                            type="number"
                          />
                        </Form.Item>

                        <Form.Item style={{ marginBottom: "-4px" }}>
                          <Button
                            type="primary"
                            icon={<SearchOutlined />}
                            onClick={handleSubmit}
                          >
                            Search
                          </Button>
                        </Form.Item>
                      </Form>
                    </div>
                  </div>
                )}
                {selectType === "file" && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "78vw",
                      border: "1px solid #ccc",
                      padding: 15,
                      marginBottom: 5,
                      borderRadius: "10px",
                    }}
                  >
                    <Form
                      layout="vertical"
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Form.Item
                        label="Upload File"
                        style={{ flex: 1, marginRight: "5px" }}
                      >
                        <Input
                          type="file"
                          onChange={(e) => setSelectedFile(e.target.files[0])}
                        />
                      </Form.Item>
                      <Form.Item style={{ marginBottom: "-4px" }}>
                        <Button
                          type="primary"
                          onClick={() => {
                            handleFileUpload();
                          }}
                        >
                          Upload
                        </Button>
                      </Form.Item>
                    </Form>
                  </div>
                )}
                {result1.length && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "78vw",
                      border: "1px solid #ccc",
                      padding: 10,
                      borderRadius: "10px",
                      marginBottom: 5,
                    }}
                  >
                    <Space
                      direction="vertical"
                      style={{ width: "100%", padding: "10px 0px" }}
                    >
                      <Table
                        scroll={{
                          x: 1200,
                          y: 500,
                        }}
                        style={{ width: "100%" }}
                        dataSource={result1}
                        columns={columns}
                        pagination={false}
                      />
                    </Space>
                  </div>
                )}

                {result1.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      width: "78vw",
                      border: "1px solid #ccc",
                      padding: 10,
                      borderRadius: "10px",
                    }}
                  >
                    {result1.length > 0 && (
                      <>
                        <Divider />
                        <Space
                          direction="vertical"
                          style={{ width: "100%", padding: "10px 0px" }}
                        >
                          <div
                            style={{ display: "flex", justifyContent: "end" }}
                          >
                            <Button
                              type="primary"
                              style={{ marginRight: "10px" }}
                              onClick={fetchAndPrioritizeAHP}
                            >
                              Prioritize AHP
                            </Button>
                            <Button
                              type="primary"
                              style={{ marginRight: "10px" }}
                              onClick={fetchAndPrioritize100dollar}
                            >
                              Prioritize 100 dollar
                            </Button>
                            <Button
                              type="primary"
                              // style={{  }}
                              onClick={fetchAndPrioritizeWSJF}
                            >
                              Prioritize WSJF
                            </Button>
                          </div>
                        </Space>
                      </>
                    )}

                    {dollarResponse.length > 0 && (
                      <Space
                        direction="vertical"
                        style={{ width: "100%", padding: "10px 0px" }}
                      >
                        <Table
                          scroll={{
                            x: 1500,
                            y: 450,
                          }}
                          dataSource={dollarResponse}
                          columns={prioritizedColumnswith100Dollar}
                          pagination={false}
                        />

                        <Button
                          type="primary"
                          style={{ float: "right", marginTop: "10px" }}
                          onClick={convertAndDownload100Dollar}
                        >
                          Donwload CSV{" "}
                        </Button>
                        {(papersFilterData.length > 0 ||
                          papersFilterData.length > 0) && (
                          <Button
                            type="primary"
                            style={{ float: "right", marginTop: "10px" }}
                            onClick={ansWithQuestionsData}
                          >
                            Find Answers of Each Question{" "}
                          </Button>
                        )}
                      </Space>
                    )}

                    {WSJFResponse.length > 0 && (
                      <Space
                        direction="vertical"
                        style={{ width: "100%", padding: "10px 0px" }}
                      >
                        <Table
                          scroll={{
                            x: 1500,
                            y: 450,
                          }}
                          dataSource={WSJFResponse}
                          columns={prioritizedColumnswithWSJF}
                          pagination={false}
                        />

                        <Button
                          type="primary"
                          style={{ float: "right", marginTop: "10px" }}
                          onClick={convertAndDownload}
                        >
                          Donwload CSV{" "}
                        </Button>
                        {(papersFilterData.length > 0 ||
                          papersFilterData.length > 0) && (
                          <Button
                            type="primary"
                            style={{ float: "right", marginTop: "10px" }}
                            onClick={ansWithQuestionsData}
                          >
                            Find Answers of Each Question{" "}
                          </Button>
                        )}
                      </Space>
                    )}

                    {AhpApiResponse.length > 0 && (
                      <Space
                        direction="vertical"
                        style={{ width: "100%", padding: "10px 0px" }}
                      >
                        <Table
                          scroll={{
                            x: 1500,
                            y: 450,
                          }}
                          dataSource={AhpApiResponse}
                          columns={prioritizedColumns}
                          pagination={false}
                        />

                        <Button
                          type="primary"
                          style={{ float: "right", marginTop: "10px" }}
                          onClick={convertAndDownloadAhp}
                        >
                          Donwload CSV{" "}
                        </Button>
                        {(papersFilterData.length > 0 ||
                          papersFilterData.length > 0) && (
                          <Button
                            type="primary"
                            style={{ float: "right", marginTop: "10px" }}
                            onClick={ansWithQuestionsData}
                          >
                            Find Answers of Each Question{" "}
                          </Button>
                        )}
                      </Space>
                    )}
                  </div>
                )}
              </Panel>
            </Collapse>

            {/* <div style={{ display: 'flex', flexDirection: "column", alignItems: 'center', width: "80vw", border: '1px solid #ccc', padding: 10, borderRadius: "10px" }}>
                        <h3>User Story: {userStory}</h3>
                          {(testCasesResp.length >0 || testCasesResp.length >0) && <Space direction="vertical" style={{ width: "100%", padding: "10px 0px" }} >
                                <Table scroll={{
                                    x: 1500,
                                    y: 450,
                                }} dataSource={testCasesResp} columns={testCasesColumns} pagination={false} />

                                <Button type="primary" style={{ float: "right", marginTop: "10px" }} onClick={fetchAndPrioritizeAHP}>Donwload CSV </Button>
                                {(papersFilterData.length > 0 || papersFilterData.length > 0) && <Button type="primary" style={{ float: "right", marginTop: "10px" }} onClick={ansWithQuestionsData}>Find Answers of Each Question </Button>}
                            </Space>}       
                        </div>    */}

            {result1.length > 0 && (
              <Collapse
                expandIcon={({ isActive }) => (
                  <CaretRightOutlined rotate={isActive ? 90 : 0} />
                )}
                accordion={false}
                defaultActiveKey={["1"]}
                style={{
                  marginTop: "20px",
                  marginBottom: "16px",
                  width: "80vw",
                }}
              >
                <Panel
                  header="Design Section"
                  key="1"
                  style={{ width: "100%" }}
                >
                  {result1.length > 0 && (
                    <>
                      <h1>Design Section</h1>

                      <div
                        style={{
                          // display: "flex",
                          alignItems: "center",
                          width: "78vw",
                          border: "1px solid #ccc",
                          padding: 15,
                          marginBottom: 5,
                          borderRadius: "10px",
                          marginTop: "6px",
                        }}
                      >
                        <Form
                          layout="vertical"
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Form.Item
                            label="Objective"
                            style={{ flex: "1 1 60%", marginRight: "5px" }}
                          >
                            <Input
                              placeholder="Ask me anything..."
                              value={topic}
                              onChange={(e) => setTopic(e.target.value)}
                            />
                          </Form.Item>

                          <Form.Item
                            label="Select Model"
                            style={{ flex: 1, marginRight: "5px" }}
                          >
                            <Select
                              placeholder="Select Model"
                              optionFilterProp="children"
                              onChange={handleModel}
                              defaultValue="gpt-3.5-turbo"
                              options={[
                                {
                                  value: "gpt-3.5-turbo",
                                  label: "gpt-3",
                                },
                                {
                                  value: "gpt-4",
                                  label: "gpt-4",
                                },
                                {
                                  value: "codellama",
                                  label: "llama-3",
                                },
                              ]}
                            />
                          </Form.Item>

                          <Form.Item
                            label="Method"
                            style={{ flex: 1, marginRight: "5px" }}
                          >
                            <Select
                              placeholder="Select Model"
                              optionFilterProp="children"
                              onChange={handleLanguage}
                              // onSearch={onSearch}
                              // filterOption={filterOption}
                              options={[
                                {
                                  value: "frontend",
                                  label: "frontend",
                                },
                                {
                                  value: "backend",
                                  label: "backend",
                                },
                                {
                                  value: "UML-diagram",
                                  label: "UML-diagram",
                                },
                              ]}
                            />
                          </Form.Item>

                          <Form.Item style={{ marginBottom: "-4px" }}>
                            <Button
                              type="primary"
                              icon={<SearchOutlined />}
                              onClick={() => {
                                handleGenerateCode();
                              }}
                              disabled={selectMethod === ""}
                            >
                              Search
                            </Button>
                          </Form.Item>
                        </Form>
                      </div>
                    </>
                  )}
                  <div className="">
                    {result && (
                      <div
                        style={{
                          //    display: "flex",
                          alignItems: "center",
                          width: "78vw",
                          border: "1px solid #ccc",
                          padding: 10,
                          borderRadius: "10px",
                          marginBottom: 5,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: 10,
                            borderRadius: "10px",
                            marginBottom: 5,
                          }}
                        >
                          <textarea
                            style={{
                              width: "100%",
                              height: "270px",
                              padding: "8px",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                            }}
                            placeholder="Agent 2 text here..."
                            readOnly
                            value={result.substring(0, index)}
                          ></textarea>
                        </div>
                      </div>
                    )}

                    {svgUrl && (
                      <div
                        style={{
                          //    display: "flex",
                          alignItems: "center",
                          width: "78vw",
                          border: "1px solid #ccc",
                          padding: 10,
                          borderRadius: "10px",
                          marginBottom: 5,
                          overflow: "scroll",
                        }}
                      >
                        <img src={svgUrl} alt="Dynamic SVG" />
                      </div>
                    )}
                  </div>
                </Panel>
              </Collapse>
            )}

            {result ||
              (svgUrl && (
                <Collapse
                  expandIcon={({ isActive }) => (
                    <CaretRightOutlined rotate={isActive ? 90 : 0} />
                  )}
                  accordion={false}
                  defaultActiveKey={["2"]}
                  style={{
                    width: "80vw",
                    marginBottom: "16px",
                  }}
                >
                  <Panel header="Backend Section" key="2">
                    {result ||
                      (svgUrl && (
                        <>
                          <h1>Backed Section</h1>
                          <div
                            style={{
                              // display: "flex",
                              alignItems: "center",
                              width: "78vw",
                              border: "1px solid #ccc",
                              padding: 15,
                              marginBottom: 5,
                              borderRadius: "10px",
                              marginTop: "6px",
                            }}
                          >
                            <Form
                              layout="vertical"
                              style={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <Form.Item
                                label="Objective"
                                style={{ flex: "1 1 60%", marginRight: "5px" }}
                              >
                                <Input
                                  placeholder="Ask me anything..."
                                  value={topic}
                                  onChange={(e) => setTopic(e.target.value)}
                                />
                              </Form.Item>

                              <Form.Item
                                label="Select Model"
                                style={{ flex: 1, marginRight: "5px" }}
                              >
                                <Select
                                  placeholder="Select Model"
                                  optionFilterProp="children"
                                  onChange={handleModel}
                                  defaultValue="gpt-3.5-turbo"
                                  options={[
                                    {
                                      value: "gpt-3.5-turbo",
                                      label: "gpt-3",
                                    },
                                    {
                                      value: "gpt-4",
                                      label: "gpt-4",
                                    },
                                    {
                                      value: "codellama",
                                      label: "llama-3",
                                    },
                                  ]}
                                />
                              </Form.Item>

                              <Form.Item
                                label="Method"
                                style={{ flex: 1, marginRight: "5px" }}
                              >
                                <Select
                                  placeholder="Select Model"
                                  optionFilterProp="children"
                                  onChange={handleLanguage}
                                  // onSearch={onSearch}
                                  // filterOption={filterOption}
                                  options={[
                                    {
                                      value: "frontend",
                                      label: "frontend",
                                    },
                                    {
                                      value: "backend",
                                      label: "backend",
                                    },
                                  ]}
                                />
                              </Form.Item>

                              <Form.Item style={{ marginBottom: "-4px" }}>
                                <Button
                                  type="primary"
                                  icon={<SearchOutlined />}
                                  onClick={handleGenerateCode2}
                                >
                                  Search
                                </Button>
                              </Form.Item>
                            </Form>
                          </div>
                        </>
                      ))}
                    <div>
                      {result2 && (
                        <div
                          style={{
                            //    display: "flex",
                            alignItems: "center",
                            width: "78vw",
                            border: "1px solid #ccc",
                            padding: 10,
                            borderRadius: "10px",
                            marginBottom: 5,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              padding: 10,
                              borderRadius: "10px",
                              marginBottom: 5,
                            }}
                          >
                            <textarea
                              style={{
                                width: "100%",
                                height: "270px",
                                padding: "8px",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                              }}
                              placeholder="Agent 2 text here..."
                              readOnly
                              value={result2.substring(0, index2)}
                            ></textarea>
                          </div>
                        </div>
                      )}
                    </div>
                  </Panel>
                </Collapse>
              ))}

            {result2 && (
              <Collapse
                expandIcon={({ isActive }) => (
                  <CaretRightOutlined rotate={isActive ? 90 : 0} />
                )}
                accordion={false}
                defaultActiveKey={["3"]}
                style={{
                  width: "80vw",
                  marginBottom: "16px",
                }}
              >
                <Panel header="Frontend Section" key="3">
                  {result2 && (
                    <>
                      <h1>Frontend Section</h1>
                      <div
                        style={{
                          // display: "flex",
                          alignItems: "center",
                          width: "78vw",
                          border: "1px solid #ccc",
                          padding: 15,
                          marginBottom: 5,
                          borderRadius: "10px",
                          marginTop: "6px",
                        }}
                      >
                        <Form
                          layout="vertical"
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Form.Item
                            label="Objective"
                            style={{ flex: "1 1 60%", marginRight: "5px" }}
                          >
                            <Input
                              placeholder="Ask me anything..."
                              value={topic}
                              onChange={(e) => setTopic(e.target.value)}
                            />
                          </Form.Item>

                          <Form.Item
                            label="Select Model"
                            style={{ flex: 1, marginRight: "5px" }}
                          >
                            <Select
                              placeholder="Select Model"
                              optionFilterProp="children"
                              onChange={handleModel}
                              defaultValue="gpt-3.5-turbo"
                              options={[
                                {
                                  value: "gpt-3.5-turbo",
                                  label: "gpt-3",
                                },
                                {
                                  value: "gpt-4",
                                  label: "gpt-4",
                                },
                                {
                                  value: "codellama",
                                  label: "llama-3",
                                },
                              ]}
                            />
                          </Form.Item>

                          <Form.Item label="Method">
                            <Select
                              placeholder="Select Model"
                              optionFilterProp="children"
                              onChange={handleLanguage}
                              value={selectMethod}
                            >
                              {options.map((option) => (
                                <Select.Option
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>

                          <Form.Item style={{ marginBottom: "-4px" }}>
                            <Button
                              type="primary"
                              icon={<SearchOutlined />}
                              onClick={handleGenerateCode3}
                            >
                              Search
                            </Button>
                          </Form.Item>
                        </Form>
                      </div>
                    </>
                  )}
                  <div>
                    {result3 && (
                      <div
                        style={{
                          //    display: "flex",
                          alignItems: "center",
                          width: "78vw",
                          border: "1px solid #ccc",
                          padding: 10,
                          borderRadius: "10px",
                          marginBottom: 5,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: 10,
                            borderRadius: "10px",
                            marginBottom: 5,
                          }}
                        >
                          <textarea
                            style={{
                              width: "100%",
                              height: "270px",
                              padding: "8px",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                            }}
                            placeholder="Agent 2 text here..."
                            readOnly
                            value={result3.substring(0, index3)}
                          ></textarea>
                        </div>
                      </div>
                    )}
                  </div>
                </Panel>
              </Collapse>
            )}

            {result3 && (
              <Collapse
                expandIcon={({ isActive }) => (
                  <CaretRightOutlined rotate={isActive ? 90 : 0} />
                )}
                accordion={false}
                defaultActiveKey={["4"]}
                style={{
                  width: "80vw",
                  marginBottom: "16px",
                }}
              >
                <Panel header="End to End Test Case Section" key="4">
                  {result3 && (
                    <>
                      <h1>End to End Test Case Section</h1>

                      <div
                        style={{
                          // display: "flex",
                          alignItems: "center",
                          width: "78vw",
                          border: "1px solid #ccc",
                          padding: 15,
                          marginBottom: 5,
                          borderRadius: "10px",
                          marginTop: "6px",
                        }}
                      >
                        <Form
                          layout="vertical"
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Form.Item
                            label="Objective"
                            style={{ flex: "1 1 60%", marginRight: "5px" }}
                          >
                            <Input
                              placeholder="Ask me anything..."
                              value={topic}
                              onChange={(e) => setTopic(e.target.value)}
                            />
                          </Form.Item>

                          <Form.Item
                            label="Select Model"
                            style={{ flex: 1, marginRight: "5px" }}
                          >
                            <Select
                              placeholder="Select Model"
                              optionFilterProp="children"
                              onChange={handleModel}
                              defaultValue="gpt-3.5-turbo"
                              options={[
                                {
                                  value: "gpt-3.5-turbo",
                                  label: "gpt-3",
                                },
                                {
                                  value: "gpt-4",
                                  label: "gpt-4",
                                },
                                {
                                  value: "codellama",
                                  label: "llama-3",
                                },
                              ]}
                            />
                          </Form.Item>

                          <Form.Item label="Method">
                            <Select
                              placeholder="Select Model"
                              optionFilterProp="children"
                              onChange={handleLanguage}
                              value={selectMethod}
                            >
                              {options.map((option) => (
                                <Select.Option
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>

                          <Form.Item style={{ marginBottom: "-4px" }}>
                            <Button
                              type="primary"
                              icon={<SearchOutlined />}
                              onClick={handleGenerateCode4}
                            >
                              Search
                            </Button>
                          </Form.Item>
                        </Form>
                      </div>
                    </>
                  )}
                  <div>
                    {result4 && (
                      <div
                        style={{
                          //    display: "flex",
                          alignItems: "center",
                          width: "78vw",
                          border: "1px solid #ccc",
                          padding: 10,
                          borderRadius: "10px",
                          marginBottom: 5,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: 10,
                            borderRadius: "10px",
                            marginBottom: 5,
                          }}
                        >
                          <textarea
                            style={{
                              width: "100%",
                              height: "270px",
                              padding: "8px",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                            }}
                            placeholder="Agent 2 text here..."
                            readOnly
                            value={result4.substring(0, index4)}
                          ></textarea>
                        </div>
                      </div>
                    )}
                  </div>
                </Panel>
              </Collapse>
            )}

            {result4 && (
              <Collapse
                expandIcon={({ isActive }) => (
                  <CaretRightOutlined rotate={isActive ? 90 : 0} />
                )}
                accordion={false}
                defaultActiveKey={["5"]}
                style={{
                  width: "80vw",
                  marginBottom: "16px",
                }}
              >
                <Panel header="Unit Test Case Section" key="5">
                  {result4 && (
                    <>
                      <h1>Unit Test Case Section</h1>

                      <div
                        style={{
                          // display: "flex",
                          alignItems: "center",
                          width: "78vw",
                          border: "1px solid #ccc",
                          padding: 15,
                          marginBottom: 5,
                          borderRadius: "10px",
                          marginTop: "6px",
                        }}
                      >
                        <Form
                          layout="vertical"
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Form.Item
                            label="Objective"
                            style={{ flex: "1 1 60%", marginRight: "5px" }}
                          >
                            <Input
                              placeholder="Ask me anything..."
                              value={topic}
                              onChange={(e) => setTopic(e.target.value)}
                            />
                          </Form.Item>

                          <Form.Item
                            label="Select Model"
                            style={{ flex: 1, marginRight: "5px" }}
                          >
                            <Select
                              placeholder="Select Model"
                              optionFilterProp="children"
                              onChange={handleModel}
                              defaultValue="gpt-3.5-turbo"
                              options={[
                                {
                                  value: "gpt-3.5-turbo",
                                  label: "gpt-3",
                                },
                                {
                                  value: "gpt-4",
                                  label: "gpt-4",
                                },
                                {
                                  value: "codellama",
                                  label: "llama-3",
                                },
                              ]}
                            />
                          </Form.Item>

                          <Form.Item label="Method">
                            <Select
                              placeholder="Select Model"
                              optionFilterProp="children"
                              onChange={handleLanguage}
                              value={selectMethod}
                            >
                              {options.map((option) => (
                                <Select.Option
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>

                          <Form.Item style={{ marginBottom: "-4px" }}>
                            <Button
                              type="primary"
                              icon={<SearchOutlined />}
                              onClick={handleGenerateCode5}
                            >
                              Search
                            </Button>
                          </Form.Item>
                        </Form>
                      </div>
                    </>
                  )}
                  <div>
                    {result5 && (
                      <div
                        style={{
                          //    display: "flex",
                          alignItems: "center",
                          width: "78vw",
                          border: "1px solid #ccc",
                          padding: 10,
                          borderRadius: "10px",
                          marginBottom: 5,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: 10,
                            borderRadius: "10px",
                            marginBottom: 5,
                          }}
                        >
                          <textarea
                            style={{
                              width: "100%",
                              height: "270px",
                              padding: "8px",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                            }}
                            placeholder="Agent 2 text here..."
                            readOnly
                            value={result5.substring(0, index5)}
                          ></textarea>
                        </div>
                      </div>
                    )}
                  </div>
                </Panel>
              </Collapse>
            )}
          </div>
        </Content>
      </Layout>
      <Footer className="footerFixed">
        <div style={{ float: "right", lineHeight: 0 }}>
          <p>
            &copy; {new Date().getFullYear()} GPT Prioritization Tool. All
            rights reserved.{" "}
          </p>
        </div>
      </Footer>
    </Layout>
  );
}

export default App;
