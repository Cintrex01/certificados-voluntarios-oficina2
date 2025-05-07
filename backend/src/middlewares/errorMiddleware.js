export default (err, req, res, next) => {
  console.error(err);
  res
    .status(500)
    .json({ message: "Erro interno do servidor", error: err.message });
};
