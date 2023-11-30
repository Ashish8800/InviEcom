function list(query = {}) {
  return [
    {
      $match: {
        status: {
          $ne: "deleted",
        },
        ...query,
      },
    },
    {
      $lookup: {
        from: "purchase_orders",
        localField: "purchaseOrderId",
        foreignField: "id",
        as: "po",
      },
    },
    {
      $addFields: {
        po: {
          $first: "$po",
        },
      },
    },
    {
      $lookup: {
        from: "purchase_requests",
        localField: "po.purchaseRequest",
        foreignField: "id",
        as: "pr",
      },
    },
    {
      $addFields: {
        pr: {
          $first: "$pr",
        },
      },
    },
    {
      $lookup: {
        from: "vendors",
        localField: "po.vendor",
        foreignField: "id",
        as: "vendorDetails",
      },
    },
    {
      $addFields: {
        vendorName: {
          $first: "$vendorDetails.vendorDisplayName",
        },
        vendorDetails: {
          $first: "$vendorDetails",
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "pr.prApprover",
        foreignField: "id",
        as: "prApprover",
      },
    },
    {
      $addFields: {
        prApproverName: {
          $first: "$prApprover.name",
        },
        prApproverComment: "$pr.prApproveComment",
        prApproveDate: "$pr.prApproveDate",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "po.poApprover",
        foreignField: "id",
        as: "poApprover",
      },
    },
    {
      $addFields: {
        poApproverName: {
          $first: "$poApprover.name",
        },
        poApproverComment: "$po.poApproveComment",
        poApproveDate: "$po.poApproveDate",
      },
    },
    {
      $lookup: {
        from: "purchase_invoices",
        localField: "po.id",
        foreignField: "purchaseOrderId",
        as: "invoice",
      },
    },
    {
      $addFields: {
        invoice: {
          $first: "$invoice",
        },
        invoiceId: {
          $first: "$invoice.id",
        },
      },
    },
  ];
}

module.exports = list;
