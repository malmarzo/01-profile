//To the fetch the user basic information, name, phone, email,...
export const userDetails = `
    query GetAttr {
      user {
      id
      login
      attrs
    }
}
  `;

//To fetch the user's transactions amount and path (Projects XP)
export const xpQuery = `
  query GetXP {
    transaction(where: { type: { _eq: "xp" } }) {
      amount
      path
    }
  }
`;

//To fetch the user's audit related data
export const auditQuery = `
  query GetAudit {
    user {
        auditRatio
        auditsAssigned
        totalDown
        totalUp
    }
}
`;

//User level query
export const levelQuery = `
query GetLevel($id: Int!) {
    event_user (where: { userId: { _eq: $id }, eventId:{_eq:20}}){
        level
    }
}
`;

//To fetch the audited projects
export const auditsDoneQuery = `
query AuditsDone {
    transaction(where: { type: { _eq: "up" }, eventId: { _eq: 20 } }) {
        attrs
        path
    }
}
`;

//To fetch the results of the audited projects
export const auditsResultQuery = `
  query AuditsResult($auditIds: [Int!]) {
    audit (where: { id: { _in: $auditIds } }){
        id
        closureType
    }
}
`;

//To fetch the user's skills and their amount
export const skillsQuery = `
  query GetSkills {
    user {
      transactions(
        order_by: [{ type: desc }, { amount: desc }]
        distinct_on: [type]
        where: {
          type: { _in: ["skill_js", "skill_go", "skill_html", "skill_prog", "skill_front-end", "skill_back-end"] }
        }
      ) {
        type
        amount
      }
    }
  }

`;