//Function to invoke the GraphQL API with the provided query and variables
export async function invokeApi(query, variables) {
    const apiURL = "https://learn.reboot01.com/api/graphql-engine/v1/graphql";

    const token = localStorage.getItem("jwtToken");

    if (!token) {
      throw new Error("JWT token is missing from localStorage.");
    }

    if (!query) {
        throw new Error("No query provided.");
    }
    try {
        const response = await fetch(apiURL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: query,
                variables
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch data from API: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data;   
    } catch (error) { 
        throw new Error(`Failed to invoke API: ${error.message}`); 
    }
}