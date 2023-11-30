const {
  requestFail,
  requestSuccess,
} = require("../../../helpers/RequestResponse.helper");
const { CategoryModel } = require("../../../models");

module.exports = async (req, res) => {
  let list = [];
  try {
    list = await CategoryModel.aggregate(pipeline(req.query));
  } catch (error) {
    return requestFail(res, error.message);
  }
  return requestSuccess(res, list);
};

function pipeline(query) {
  const { category, subcategory, filter } = query;
  let basePipeline = [
    {
      $lookup: {
        from: "subcategories",
        localField: "id",
        foreignField: "categoryId",
        as: "subcategory",
      },
    },
  ];

  let pipelineMatch = {
    status: {
      $ne: "deleted",
    },
  };

  return [
    {
      $match: pipelineMatch,
    },
    ...basePipeline,
  ];
}
