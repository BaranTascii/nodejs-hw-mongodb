import swaggerUi from "swagger-ui-express";
import swaggerDoc from "../../docs/swagger.json" assert { type: "json" };

export const swaggerRouter = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
};
