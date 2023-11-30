const {
  requestSuccess,
  requestFail,
} = require("../../helpers/RequestResponse.helper");
const { StockModel, WarehouseModel } = require("../../models");
const { generateId, getAdmin } = require("../../helpers/Common.helper");

async function list(req, res) {
  print({ status: { $ne: "deleted" }, ...req.query });
  const list = await StockModel.find(
    { status: { $ne: "deleted" }, ...req.query },
    ["-_id", "-__v"]
  );
  if (list && list.length > 0) {
    return requestSuccess(res, list);
  }
  return requestFail(res, "Can't find any stock");
}

async function get(req, res) {
  // Verify request containe a stock id
  if (!req.params.id) {
    return requestFail(res, "Invalid stock id");
  }

  // Fetch stock detail form database
  const list = await StockModel.findOne(
    { status: { $ne: "deleted" }, id: req.params.id },
    ["-_id", "-__v"]
  );

  // Check we got some result form the database or not
  // if get some result form database the send back to client
  if (list) {
    return requestSuccess(res, list);
  }

  // fail request if nothing worked
  return requestFail(res, "Can't find stock");
}

async function create(req, res) {
  // get current user
  let ADMIN = await getAdmin();

  // Get data and verify as per need
  let stock = req.body;
  let warehouse = null;

  // if (!stock.name) {
  //   return requestFail(res, "stock name is required");
  // }

  // if (await StockModel.findOne({ name: stock.name })) {
  //   return requestFail(res, "Duplicate stock name");
  // }

  try {
    warehouse = await WarehouseModel.findOne({ id: stock.warehouseId });
  } catch (error) {
    console.log(error);
  }

  try {
    const existStock = await StockModel.findOne({
      ipn: stock.ipn,
      warehouseId: stock.warehouseId,
    });
    console.log(existStock, "existStock");

    // stock.stock = existStock ? existStock.stock + stock.stock : 0;

    if (existStock) {
      existStock.stock = parseInt(existStock.stock) + parseInt(stock.stock);
      console.log(existStock, stock);
      await existStock.save();
      return requestSuccess(res, "Stock added to existing item");
    }

    // generate a unique id for stock
    const id = `STO${generateId(5)}`;
    print(id);
    // add missing detail in the stock object
    stock.id = id;
    stock.warehouse = warehouse.name;
    stock.status = "active";
    stock.createdBy = ADMIN.id;
    stock.updatedBy = ADMIN.id;

    // Now try to create a new stock
    try {
      await new StockModel(stock).save();
      return requestSuccess(res);
    } catch (error) {
      print(error);
    }

    return requestFail(res, "Something went wrong, Can't create stock now.");
  } catch (error) {
    console.log(error);
    return requestFail(res, "Error while fetching existing stock data.");
  }
}

async function update(req, res) {
  // Verify request containe a stock id
  if (!req.params.id) {
    return requestFail(res, "Invalid stock id");
  }

  // store all request data into stock var
  let stock = req.body,
    ADMIN = await getAdmin();

  // update entry who is updateing the field
  stock.updatedBy = ADMIN.id;

  if (stock.id && req.params.id != stock.id)
    return requestFail(res, "Something went wrong, Can't update stock");

  delete stock.id;

  // find stock as per name
  let dbstock = await StockModel.findOne({
    name: stock.name,
  });

  // if (dbstock) {
  //   if (dbstock.id != req.params.id)
  //     return requestFail(res, "stock already in use");
  // }

  StockModel.updateOne(
    { id: req.params.id },
    { $set: { ...stock } },

    (error, result) => {
      if (!error) {
        return requestSuccess(res);
      } else {
        return requestFail(res, "Can't delete stock now");
      }
    }
  );
}

async function remove(req, res) {
  // Verify request containe a stock id
  if (!req.params.id) {
    return requestFail(res, "Invalid stock id");
  }

  let ADMIN = await getAdmin();

  try {
    await StockModel.updateOne(
      { id: req.params.id },
      { $set: { status: "deleted", updatedBy: ADMIN.id } }
    );
    return requestSuccess(res, "stock deleted successfully");
  } catch (error) {
    return requestFail(res, "Can't delete stock now");
  }
}

module.exports = {
  list,
  get,
  create,
  update,
  delete: remove,
};
