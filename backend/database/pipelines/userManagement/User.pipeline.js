function list(query = {}) {
  return [
    {
      $match: {
        ...query,
      },
    },
    {
      $lookup: {
        from: "roles",
        localField: "role",
        foreignField: "name",
        as: "role",
      },
    },
    {
      $addFields: {
        permissions: {
          $first: "$role.permission",
        },
        role: {
          $first: "$role.name",
        },
      },
    },
    {
      $unset: ["__v", "_id", "createdBy", "updatedBy"],
    },
  ];
}

module.exports = list;
