import { getToken } from "./auth.js";

export const query = `
{
  user {
    id
    login
    email
    auditRatio
    attrs
    campus 

    transactions(order_by: {createdAt: asc}) {
      type
      amount
      createdAt
      eventId
      object {
        name
        type
      }
    }

    progresses(order_by: {createdAt: desc}) {
      grade
      path
      createdAt
      updatedAt
      isDone
      isDone
      object {
        name
        type
      }
    }

    events(where: {eventId: {_eq: 75}}) {
      level
    }

    audits(order_by: {createdAt: desc}) {
      closedAt
      group {
        captainLogin
        path
        members {
          userLogin
        }
      }
    }
  }

  event(where: {path: {_eq: "/kisumu/module"}}) {
    description
    startAt
    endAt
  }
}
`

export async function fetchGraphQl() {
  const token = getToken();

  if (!token) {
    console.error(" No JWT token found.");
    return null;
  }

  const response = await fetch("https://learn.zone01kisumu.ke/api/graphql-engine/v1/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const result = await response.json();

  console.log(" Full GraphQL Response:", result);

  if (result.errors) {
    console.error("GraphQL query failed or returned errors: ", result.errors);
    return null;
  }

  return result.data;
}
