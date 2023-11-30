const {
  requestFail,
  requestSuccess,
} = require("../../../helpers/RequestResponse.helper");
const { ItemModel } = require("../../../models");

module.exports = async (req, res) => {
  let list = [];
  try {
    list = await ItemModel.aggregate(pipeline(req.query));
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
        from: "categories",
        localField: "category.id",
        foreignField: "id",
        as: "category",
      },
    },
    {
      $lookup: {
        from: "subcategories",
        localField: "subcategory.id",
        foreignField: "id",
        as: "subcategory",
      },
    },
  ];

  let pipelineMatch = {
    forSale: true,
    status: {
      $ne: "deleted",
    },
  };

  //   checking filters
  if (filter && filter == "newest") {
    basePipeline = [
      ...basePipeline,
      {
        $sort: {
          createdOn: -1,
        },
      },
    ];
  }

  if (filter && filter == "trending") {
  }

  if (category && category != "") {
    pipelineMatch["category.id"] = category;
  }

  if (subcategory && subcategory != "") {
    pipelineMatch["subcategory.id"] = subcategory;
  }

  return [
    {
      $match: pipelineMatch,
    },
    ...basePipeline,
  ];
}
