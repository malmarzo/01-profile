import { useNavigate } from "react-router-dom";
import { appContext } from "../Lib/contextLib";
import { useState, useEffect } from "react";
import { invokeApi } from "../Lib/invokeApi";
import { userDetails, xpQuery, auditQuery, levelQuery, auditsDoneQuery, auditsResultQuery, skillsQuery } from "../Lib/queries";
import RadarChart from "./Radar";
import AuditBarChart from "./BarChart";
import PieChart from "./PieChart";
import "../styles/Home.css"

function Home() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [userName, setUserName] = useState("");
  const [module20XP, setModule20XP] = useState(0);
  const [auditRatio, setAuditRatio] = useState(0);
  const [auditReceived, setAuditReceived] = useState(0);
  const [auditDone, setAuditDone] = useState(0);
  const [level, setLevel] = useState(0);
  const [id, setID] = useState(0);
  const [auditList, setAuditList] = useState({});
  const [skills, setSkills] = useState([]);
  const [passedAudits, setPassedAudits] = useState(0);
  const [failedAudits, setFailedAudits] = useState(0);

  // Fetches and sets basic user identification data
  async function getDetailes() {
    const data = await invokeApi(userDetails);
    const firstName = data.data.user[0]?.attrs?.firstName || "User";
    const lastName = data.data.user[0]?.attrs?.lastName || "";
    const phoneNum = data.data.user[0]?.attrs?.Phone || "Unknown";
    const email = data.data.user[0]?.attrs?.email || "Unknown";
    const login = data.data.user[0]?.login || "Unknown";
    const userID = data.data.user[0]?.id  || 0;
    setName(firstName);
    setLastName(lastName);
    setEmail(email);
    setPhone(phoneNum);
    setUserName(login);
    setID(userID);
  }

 // Retrieves and calculates the total user xp for bahrain module
  async function getXp() {
    const data = await invokeApi(xpQuery);
    const filteredData = data.data.transaction.filter(
      (t) =>
        t.path.includes("/bahrain/bh-module") &&
        !t.path.includes("piscine-js/") &&
        !t.path.includes("quest") &&
        !t.path.includes("checkpoint-01")
    );
    let totalXP = 0;
    totalXP = Math.round(
      filteredData.map((t) => t.amount).reduce((a, b) => a + b, 0) / 1000
    );
    setModule20XP(totalXP);
  }

  // Retrieves and sets the audit details
  async function getAuditDet () {
    const data = await invokeApi(auditQuery);
    setAuditRatio(data.data.user[0].auditRatio.toFixed(1));
    setAuditReceived((data.data.user[0].totalDown / 1000000).toFixed(2));
    setAuditDone((data.data.user[0].totalUp / 1000000).toFixed(2));
  }

  // Retrieves and sets the user level
  async function getLevel() {
    const data = await invokeApi(levelQuery, { id })
    setLevel(data.data.event_user[0]?.level)
  }

  // Retrieves and sets the audits done by the user
  async function getAuditsDone() {
    let passed = 0;
    let failed = 0;
    const auditDoneData = await invokeApi(auditsDoneQuery)
    const auditIds = []
    const auditsDoneFiltered = {}
    auditDoneData.data.transaction.map((item, index) => {
      auditsDoneFiltered[item.attrs.auditId] = {
        path: item.path.replaceAll(
          "/bahrain/bh-module/",
          ""
        )
      };

      auditIds[index] = item.attrs.auditId;
    })

    const auditResults = await invokeApi(auditsResultQuery, { auditIds })
    

    auditResults.data.audit.forEach(item => {
      if (auditsDoneFiltered[item.id]) {
        auditsDoneFiltered[item.id].result = item.closureType;
        if (item.closureType === "succeeded") {
          passed++;
        } else if(item.closureType === "failed"){
          failed++;
        }
      }
    });

    setAuditList(auditsDoneFiltered); 
    setPassedAudits(passed);
    setFailedAudits(failed);
  }

  // Retrieves and sets the user skills
  async function getSkills() {
    const data = await invokeApi(skillsQuery);
    setSkills(data.data.user[0].transactions);
  }
 
  // Fetches the data on component mount
  useEffect(() => {
    getDetailes();
    getXp(); 
    getAuditDet();
    getAuditsDone();
    getSkills();
    if (id) {
      getLevel();
    }
  }, [id]); 

  // Handles the signout
  async function handleSignout() {
    appContext.setState({ isAuthenticated: false });
    localStorage.removeItem("jwtToken");
    navigate("/01-Profile/login");
  }
  
  // Data for the adusited projects pie chart
  const pieData = [
    { value: passedAudits, color: "#33FF57" },
    { value: failedAudits, color: "#F44336" },
  ];


  
  return (
    <div className="home-container">
      <header>
        <h1>01 Profile</h1>
        <div>
        <button onClick={handleSignout}>Signout</button>
        </div>
      </header>

      <h1 className="user-name">
        <span style={{ fontWeight: "normal" }}>Hello</span> {name} {lastName} (
        {userName})
      </h1>
      <div className="user-contact">
        <h6>Email: {email}</h6>
        <h6>Phone: {phone}</h6>
      </div>

      <div className="user-summary">
        <div>
          <h1>Level</h1> <h2>{level}</h2>
        </div>
        <div>
          <h1>Total XP</h1> <h2>{module20XP} KB</h2>
        </div>
        <div>
          <h1>Audit Ratio</h1> <h2>{auditRatio}</h2>
        </div>
      </div>

      <div className="audit-summary">
        <AuditBarChart auditsDone={auditDone} auditsReceived={auditReceived} />
      </div>

      <h3 style={{ textAlign: "left", marginBottom: "0" }}>Audited Projects</h3>
      <div className="audit-list-summ">
        <div className="audit-list">
          {auditList &&
            Object.keys(auditList)
              .filter(
                (key) =>
                  auditList[key].path !== "" &&
                  auditList[key].result !== undefined
              )
              .map((key) => (
                <div className="audit-item" key={key}>
                  <p>
                    <span style={{ fontWeight: "bold" }}>
                      {auditList[key].path}
                    </span>{" "}
                    -{" "}
                    <span
                      style={{
                        color:
                          auditList[key].result.toLowerCase() === "succeeded"
                            ? "green"
                            : "#F44336",
                      }}
                    >
                      {auditList[key].result.toUpperCase()}

                      {auditList[key].result.toLowerCase() === "succeeded" && (
                        <span>✅</span>
                      )}

                      {auditList[key].result.toLowerCase() === "failed" && (
                        <span style={{ fontSize: "15px" }}>❌</span>
                      )}
                    </span>
                  </p>
                </div>
              ))}
        </div>
        <div className="pieDiv">
          <PieChart data={pieData} size={250} />
        </div>
      </div>
      
      <h3 style={{ textAlign: "center", marginBottom: "0", marginTop:"1rem" }}>Skills</h3>
      <RadarChart skills={skills} />
    </div>
  );

}

export default Home;
