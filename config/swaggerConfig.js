const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Real Estate API",
      version: "1.0.0",
      description: "API documentation for the Real Estate application",
    },
    servers: [
      {
        url: "http://localhost:5000", // Replace with your server URL
      },
    ],
    tags: [
      {
        name: "Property",
        description: "Endpoints related to properties",
      },
      {
        name: "Agent",
        description: "Endpoints related to agents",
      },
    ],
    components: {
      schemas: {
        Property: {
          type: "object",
          required: [
            "type",
            "city",
            "title",
            "titleDescription",
            "price",
            "agent",
            "map",
            "description",
            "photos",
            "videos",
          ],
          properties: {
            type: {
              type: "string",
              enum: ["house", "land"],
              description: "The type of the property",
            },
            city: {
              type: "string",
              description: "The city where the property is located",
            },
            title: {
              type: "string",
              description: "The title of the property",
            },
            titleDescription: {
              type: "string",
              description: "A description of the title",
            },
            price: {
              type: "number",
              description: "The price of the property",
            },
            agent: {
              type: "string",
              description: "The agent responsible for the property",
            },
            map: {
              type: "string",
              description: "A URL to the map location of the property",
            },
            description: {
              type: "string",
              description: "A detailed description of the property",
            },
            photos: {
              type: "array",
              items: {
                type: "string",
                format: "binary", // Allows uploading files
                description: "Upload photo files (binary data)",
              },
            },
            videos: {
              type: "array",
              items: {
                type: "string",
                format: "binary", // Allows uploading video files
                description: "Upload video files (binary data)",
              },
            },
            squareFeet: {
              type: "number",
              description: "The square footage of the house",
            },
            bedrooms: {
              type: "number",
              description: "The number of bedrooms in the house",
            },
            bathrooms: {
              type: "number",
              description: "The number of bathrooms in the house",
            },
            parking: {
              type: "string",
              description: "The parking availability for the house",
            },
            sizeType: {
              type: "string",
              description: "The size type of the land",
            },
            size: {
              type: "number",
              description: "The size of the land",
            },
            priceType: {
              type: "string",
              description: "The price type of the land",
            },
            pricePerUnit: {
              type: "number",
              description: "The price per unit of the land",
            },
          },
        },
        Agent: {
          type: "object",
          required: [
            "authorImage",
            "agentName",
            "agentEmail",
            "agentPhone",
            "agentJoinDate",
            "agentAddress",
            "agentProvince",
            "agentCity",
            "agentZipCode",
          ],
          properties: {
            authorImage: {
              type: "object",
              properties: {
                public_id: {
                  type: "string",
                  description: "Public ID of the image",
                },
                url: { type: "string", description: "URL of the image" },
              },
              required: ["public_id", "url"],
            },
            agentName: {
              type: "string",
              description: "The name of the agent",
            },
            agentEmail: {
              type: "string",
              description: "The email of the agent",
            },
            agentPhone: {
              type: "string",
              description: "The phone number of the agent",
            },
            agentJoinDate: {
              type: "string",
              description: "The join date of the agent",
            },
            agentAddress: {
              type: "string",
              description: "The address of the agent",
            },
            agentProvince: {
              type: "string",
              description: "The province of the agent",
            },
            agentCity: {
              type: "string",
              description: "The city of the agent",
            },
            agentZipCode: {
              type: "number",
              description: "The zip code of the agent",
            },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
