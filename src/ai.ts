import OpenAI from "openai";

export interface SalesForceField {
  name: string;
  type: string;
}

export interface SalesForceObject {
  name: string;
  fields: SalesForceField[];
}

export async function generateFields(query: string) {
  const openai = new OpenAI({
    organization: "org-7ktJw3crEosTgvLkZ5h7ZOXK",
    project: "proj_LMoSM9dXOqlRcLfC4cT0a5g0",
    apiKey: localStorage.getItem("openai-api-key") || "",
    dangerouslyAllowBrowser: true,
  });

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `You are an expert SalesForce system integrator, your role is to assist clients to customize their new SalesForce instance with their custom fields based on their business needs. Listen carefully to their needs and answer with a list of fields to create, using the function create_fields`,
    },
    { role: "user", content: query },
  ];
  const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
    {
      type: "function",
      function: {
        name: "create_objects_and_fields",
        description: "Create Salesforce object and fields",
        parameters: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "The name of the SalesForce object to create",
            },
            fields: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "The name of the field",
                  },
                  type: {
                    type: "string",
                    enum: ["string", "number", "boolean"],
                    description: "Type of the field",
                  },
                },
                required: ["name", "type"],
              },
              description: "The fields to create",
            },
          },
          required: ["name", "fields"],
        },
      },
    },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
    tools,
    tool_choice: "required",
    max_tokens: 4096,
  });

  const toolCalls = response.choices[0].message.tool_calls;

  const args = toolCalls?.map((toolCall) =>
    JSON.parse(toolCall.function.arguments)
  );

  return args as SalesForceObject[];
}
