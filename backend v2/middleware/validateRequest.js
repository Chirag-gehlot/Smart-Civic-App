export default function validateRequest(schemas = {}) {
  return (req, res, next) => {
    const targets = ["body", "params", "query"];

    for (const target of targets) {
      const schema = schemas[target];
      if (!schema) continue;

      const result = schema.safeParse(req[target]);
      if (!result.success) {
        const errors = result.error.issues.map((issue) => ({
          field: issue.path.length > 0 ? issue.path.join(".") : target,
          message: issue.message,
        }));

        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors,
        });
      }

      req[target] = result.data;
    }

    next();
  };
}
