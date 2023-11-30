function list(query = {}) {
  return [
    {
      $match: {
        status: { $ne: "deleted" },
        ...query,
      },
    },
    {
      $lookup: {
        from: "clients",
        localField: "clientId",
        foreignField: "id",
        as: "client",
      },
    },
    {
      $addFields: {
        clientName: { $first: "$client.name" },
      },
    },
    {
      $lookup: {
        from: "projects",
        localField: "projectId",
        foreignField: "id",
        as: "project",
      },
    },
    {
      $addFields: {
        projectName: { $first: "$project.name" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "id",
        as: "createdByUser",
      },
    },
    {
      $addFields: {
        createdByName: { $first: "$createdByUser.name" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "updatedBy",
        foreignField: "id",
        as: "updatedByUser",
      },
    },
    {
      $addFields: {
        updatedByName: { $first: "$updatedByUser.name" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "prApprover",
        foreignField: "id",
        as: "prApproverUser",
      },
    },
    {
      $addFields: {
        prApproverName: { $first: "$prApproverUser.name" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "indentor",
        foreignField: "id",
        as: "indentor",
      },
    },
    {
      $addFields: {
        indentorId: { $first: "$indentor.id" },
        indentor: { $first: "$indentor.name" },
      },
    },
    {
      $unset: [
        "__v",
        "_id",
        "createdByUser",
        "updatedByUser",
        "client",
        "project",
        "prApproverUser",
      ],
    },
  ];
}

module.exports = list;
