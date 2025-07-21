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
     try {
        const response = await fetch("https://learn.zone01kisumu.ke/api/graphql-engine/v1/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ query })
        });

        const json = await response.json();
        if (!response.ok || !json.errors) {
            throw new Error("Failed to fetch data");
        }

        return json.data;
        } catch (err) {
        console.error("GraphQL fetch error:", err);
        throw err;
     }
}