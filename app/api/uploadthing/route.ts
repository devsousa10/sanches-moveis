import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Isso cria a rota oficial que o Next.js precisa
export const { GET, POST } = createRouteHandler({
    router: ourFileRouter,
});