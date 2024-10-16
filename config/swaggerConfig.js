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
        name: "User",
        description: "Endpoints related to users",
      },
      {
        name: "Auth",
        description: "Endpoints related to authentication",
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
        User: {
          type: "object",
          properties: {
            profileImage: {
              type: "object",
              properties: {
                url: { type: "string" },
                public_id: { type: "string" },
              },
            },
            username: { type: "string" },
            email: { type: "string" },
            role: { type: "string" },
            phone: { type: "string" },
            birthday: { type: "string" },
            streetAddress: { type: "string" },
            city: { type: "string" },
            province: { type: "string" },
            zipCode: { type: "string" },
          },
        },
        Auth: {
          type: "object",
          properties: {
            email: { type: "string" },
            password: { type: "string" },
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
