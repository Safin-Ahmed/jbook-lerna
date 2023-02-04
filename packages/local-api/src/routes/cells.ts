import express from "express";
import fs from "fs/promises";
import path from "path";

interface Cell {
  id: string;
  content: string;
  type: "text" | "code";
}

export const createCellsRouter = (filename: string, dir: string) => {
  const router = express.Router();
  router.use(express.json());
  const fullPath = path.join(dir, filename);
  console.log("Full Path: ", fullPath);

  router.get("/cells", async (req, res) => {
    try {
      // Read the file
      const result = await fs.readFile(fullPath, { encoding: "utf-8" });
      res.send(JSON.parse(result));
    } catch (e: any) {
      if (e.code === "ENOENT") {
        // Create a file and add default cells
        await fs.writeFile(fullPath, "[]", { encoding: "utf-8" });
        res.send([]);
      } else {
        throw e;
      }
    }
  });

  router.post("/cells", async (req, res) => {
    // Take the list of cells from the request object
    // serialize them
    const { cells }: { cells: Cell[] } = req.body;
    console.log(cells);
    // Write the cells into the file
    await fs.writeFile(fullPath, JSON.stringify(cells), "utf-8");

    res.send({ status: "ok" });
  });

  return router;
};
