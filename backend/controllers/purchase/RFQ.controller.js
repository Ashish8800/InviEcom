const {
  requestSuccess,
  requestFail,
} = require("../../helpers/RequestResponse.helper");

const { RFQModel, VendorModel, RequestModel } = require("../../models");
const { generateId, paramProxy } = require("../../helpers/Common.helper");
const { generateRFQpdf } = require("../../helpers/PDF.helper");
const path = require("path");
const pipeline = require("../../database/pipelines/purchase/RFQ.pipeline");
const { sendMail } = require("../../helpers/Mail.helper");

async function list(req, res) {
  const query = await paramProxy(req.query);
  const list = await RFQModel.aggregate(pipeline({ ...query }));
  if (list && list.length > 0) {
    return requestSuccess(res, list);
  }
  return requestFail(res, "Can't find any RFQ");
}

async function get(req, res) {
  const query = await paramProxy(req.query);

  // Verify request contained a rfq id
  if (!req.params.id) {
    return requestFail(res, "Invalid rfq id");
  }

  // Fetch rfq detail form database
  const list = await RFQModel.aggregate(
    pipeline({ id: req.params.id, ...query })
  );

  // Check we got some result form the database or not
  // if get some result form database the send back to client
  if (list && list.length > 0) {
    return requestSuccess(res, list[0]);
  }

  // fail request if nothing worked
  return requestFail(res, "Can't find rfq");
}
async function create(req, res) {
  // Get data and verify as per need
  let requestBody = req.body;

  // Generate a unique id for RFQ
  const id = `RFQ${generateId(9)}`;

  // Add missing detail in the rfq object
  requestBody.id = id;
  requestBody.status = "generated";
  requestBody.createdBy = req.user.id;
  requestBody.updatedBy = req.user.id;

  // Now try to create a new rfq
  try {
    // Create RFQ
    const rfq = await new RFQModel(requestBody).save();

    // Update PR Request Items Status To "rfq_generated"
    const prRequest = await RequestModel.findOne({ id: rfq.prRequestId });

    const rfqItemIdsList = rfq.items.map((rfqItem) => rfqItem.ipn);

    const updatedPRItemsList = [];

    prRequest.items.forEach((prItem) => {
      if (rfqItemIdsList.indexOf(prItem.ipn) != -1) {
        prItem.status = "rfq_generated";
        prItem.rfq = [...prItem.rfq, rfq.id];
      }
      updatedPRItemsList.push(prItem);
    });

    await RequestModel.updateOne(
      { id: rfq.prRequestId },
      {
        $set: {
          items: updatedPRItemsList,
        },
      }
    );

    const vendor = await VendorModel.findOne({ id: rfq.vendorId });

    const tempDate = new Date(rfq.createdOn);
    const payloadForPDF = {
      date: `${tempDate.getDate()}/${tempDate.getMonth()}/${tempDate.getFullYear()}`,
      ref: rfq.prRequestId,
      rfq: rfq.id,
      tac: rfq?.termAndCondition,
      vendor: {
        name: `${vendor.salutation} ${vendor.firstName} ${vendor.lastName}`,
        orgName: vendor.vendorDisplayName,
        contact: vendor.contactNumber,
        email: vendor.contactEmail,
        address: `${vendor?.billing?.address ?? ""} ${
          vendor?.billing?.city ?? ""
        } ${vendor?.billing?.state ?? ""} ${vendor?.billing?.country ?? ""} ${
          vendor?.billing?.pincode ?? ""
        } `,
      },
      items: [],
    };

    rfq?.items?.forEach((item, index) => {
      payloadForPDF.items.push({
        sr: ++index,
        ipn: item.ipn,
        description: item.shortDescription,
        manufacture: item.manufacturer,
        mpn: item.mpn,
        quantity: item.quantity,
      });
    });

    const pdfName = `RFQ_document_${rfq.id}_${new Date().getTime()}`;
    const pdfRes = await generateRFQpdf(pdfName, payloadForPDF);

    if (pdfRes) {
      await RFQModel.updateOne(
        {
          id: rfq.id,
        },
        {
          $set: {
            pdf: `${pdfName}.pdf`,
            pdfUrl: pdfRes.pdfUrl,
            pdfBase64: pdfRes.base64,
          },
        }
      );
      return requestSuccess(res, {
        id: rfq.id,
        vendor: {
          name: `${vendor.salutation} ${vendor.firstName} ${vendor.lastName}`,
          orgName: vendor.vendorDisplayName,
          contact: vendor.contactNumber,
          email: vendor.contactEmail,
          address: `${vendor?.billing?.address ?? ""} ${
            vendor?.billing?.city ?? ""
          } ${vendor?.billing?.state ?? ""} ${vendor?.billing?.country ?? ""} ${
            vendor?.billing?.pincode ?? ""
          } `,
        },
        pdfUrl: pdfRes.pdfUrl,
        pdf: `${pdfName}.pdf`,
      });
    }

    requestFail(res);
  } catch (error) {
    requestFail(res);
  }
}

async function update(req, res) {
  // Verify request contained a rfq id
  if (!req.params.id) {
    return requestFail(res, "Invalid rfq id");
  }
  
  const FormInputs = req.body;

  // update entry who is updating the field
  FormInputs.updatedBy = req.user.id;

  const result = await RFQModel.updateOne(
    { id: req.params.id },
    { $set: { ...FormInputs } }
  );

  if (result.modifiedCount == 1) {
    requestSuccess(res);
  } else {
    requestFail(res, "Can't update RFQ module");
  }
}

async function updateStatus(req, res) {
  // Verify request contained a RFQ id
  if (!req.params.id) {
    return requestFail(res, "Invalid RFQ id");
  }

  // store all request data into rfq var
  let requestBody = req.body;

  // update entry who is updating the field
  requestBody.updatedBy = req.user.id;
  delete requestBody.id;

  RFQModel.updateOne(
    { id: req.params.id },
    { $set: { ...requestBody } },
    (error, result) => {
      if (!error) {
        return requestSuccess(res);
      } else {
        return requestFail(res, "Can't delete rfq now");
      }
    }
  );
}

async function sendMailToVender(req, res) {
  if (!req.params.id) return requestFail(res, "Invalid RFQ id");

  const requestBody = req.body;

  requestBody.updatedBy = req.user.id;
  delete requestBody.id;

  const mailPayload = {
    priority: "high",
    replyTo: requestBody.replyTo,
    to: requestBody.sendTo,
    cc: requestBody.replyTo,
    message: requestBody.mail,
    subject: requestBody.subject,
    attachments: [
      {
        filename: requestBody.pdfFile,
        path: path.join(process.cwd(), `storage/rfq/${requestBody.pdfFile}`),
      },
    ],
  };

  const emailResponse = await sendMail(mailPayload);
  if (emailResponse) {
    const rfqUpdateResponse = await RFQModel.updateOne(
      { id: req.params.id },
      { $set: { status: "send_to_vendor" } }
    );
    print(emailResponse);
    if (rfqUpdateResponse) return requestSuccess(res);
    return requestFail(res, "Mail send but can't update RFQ status.");
  } else {
    return requestFail(
      res,
      "Something went wrong. Can't send mail to vendor now."
    );
  }
}

module.exports = {
  list,
  get,
  create,
  update,
  updateStatus,
  sendMailToVender,
};
