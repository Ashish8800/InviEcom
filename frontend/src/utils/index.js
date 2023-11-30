import RestApiClient from "./RestApiClient";
import { fCurrency } from "./formatNumber";

export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};
export function convertDateTimeFormat(dateString) {
  const date = new Date(dateString);

  const formattedDate = date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  // Extract day, month, and year from the formatted date
  const [month, day, year] = formattedDate.split("/");

  // Rearrange the date components to the desired format
  const convertedDate = `${day}/${month}/${year}`;

  return convertedDate;
}

export function formateDate(dateString, configuration) {
  configuration = {
    withTime: true,
    blankOutput: "-",
    ...configuration,
  };
  const date = new Date(dateString);

  let output = "";

  output = date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  if (configuration.withTime) {
    output +=
      " at " +
      date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
  }

  return output.indexOf("Invalid") !== -1 ? configuration.blankOutput : output;
}

export function convertHtmlToText(html) {
  const parser = new DOMParser();
  const parsedHtml = parser.parseFromString(html, "text/html");
  return parsedHtml.body.textContent;
}

export function customSlice(arr, start, end) {
  const length = arr == null ? 0 : arr.length;

  if (!length) {
    return [];
  }

  start = start == null ? 0 : start;
  end = end === undefined ? length : end;

  // Handle negative indices
  if (start < 0) {
    start = Math.max(length + start, 0);
  }

  if (end < 0) {
    end = Math.max(length + end, 0);
  }

  const slicedArray = [];

  for (let i = start; i < end && i < length; i++) {
    slicedArray.push(arr[i]);
  }

  return slicedArray;
}

export function formateCurrency(number) {
  return fCurrency(number).replace("$", "₹ ") === ""
    ? "₹ 0"
    : fCurrency(number).replace("$", "₹ ");
}

export function isLoggedIn() {
  return localStorage.getItem("token") ? true : false;
}

export const Api = new RestApiClient();

export function convertToSlug(str) {
  // Replace spaces and special characters with dashes
  const slug = str
    .replace(/[^\w\s]/gi, "") // Remove special characters
    .trim() // Remove leading/trailing spaces
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .toLowerCase(); // Convert to lowercase

  return slug;
}

export function extractIdFromSlug(slug) {
  const parts = slug.split("-");
  return parts[parts.length - 1];
}

// export function base64ToBlob(base64String) {
//   // Split the base64 string into data and metadata
//   const [data, metadata] = base64String.split(",");

//   // Extract the MIME type from the metadata or automatically detect it
//   let mimeType;
//   if (metadata && metadata.match(/data:([^;]+)/)) {
//     mimeType = metadata.match(/data:([^;]+)/)[1];
//   } else {
//     const base64Prefix = "data:";
//     const dataStartIndex =
//       base64String.indexOf(base64Prefix) + base64Prefix.length;
//     const dataEndIndex = base64String.indexOf(";", dataStartIndex);
//     mimeType = base64String.substring(dataStartIndex, dataEndIndex);
//   }

//   // Decode the base64 data
//   const decodedData = atob(data);

//   // Create an array buffer from the decoded data
//   const buffer = new ArrayBuffer(decodedData.length);
//   const view = new Uint8Array(buffer);
//   for (let i = 0; i < decodedData.length; i++) {
//     view[i] = decodedData.charCodeAt(i);
//   }

//   // Create the Blob object
//   const blob = new Blob([view], { type: mimeType });

//   return blob;
// }

export function base64ToBlob(base64String) {
  console.log("Base64String", base64String);

  // Split the base64 string into data and metadata
  const [metadata] = base64String.split(",");

  // Extract the MIME type from the metadata or automatically detect it
  let mimeType;
  if (metadata && metadata.match(/data:([^;]+)/)) {
    mimeType = metadata.match(/data:([^;]+)/)[1];
  } else {
    const base64Prefix = "data:";
    const dataStartIndex =
      base64String.indexOf(base64Prefix) + base64Prefix.length;
    const dataEndIndex = base64String.indexOf(";", dataStartIndex);
    mimeType = base64String.substring(dataStartIndex, dataEndIndex);
  }

  // Validate and decode the base64 data
  let decodedData;
  try {
    decodedData = atob(base64String);
  } catch (error) {
    console.error("Invalid Base64 string:", error);
    return null;
  }

  // Create an array buffer from the decoded data
  const buffer = new ArrayBuffer(decodedData.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < decodedData.length; i++) {
    view[i] = decodedData.charCodeAt(i);
  }

  // Create the Blob object
  const blob = new Blob([view], { type: mimeType });

  return blob;
}

export function downloadFile(file) {
  let a = document.createElement("a"); //Create <a>
  a.href = file.preview ?? ""; //Image Base64 Goes here
  a.download = file.name ?? ""; //File name Here
  a.click(); //Downloaded file
}

export function mergeObjectsRecursive(target, source) {
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const sourceValue = source[key];
      const targetValue = target[key];

      if (typeof sourceValue === "object" && !Array.isArray(sourceValue)) {
        if (!target.hasOwnProperty(key) || typeof targetValue !== "object") {
          target[key] = {};
        }
        mergeObjectsRecursive(target[key], sourceValue);
      } else if (Array.isArray(sourceValue)) {
        target[key] = (targetValue || []).concat(sourceValue);
      } else {
        target[key] = sourceValue;
      }
    }
  }

  return target;
}

export function downloadFileFromURL(url) {
  // Fetch the file from the URL
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      // Create a temporary URL for the blob
      const blobURL = URL.createObjectURL(blob);

      // Create a hidden anchor element to initiate the download
      const anchor = document.createElement("a");
      anchor.href = blobURL;
      anchor.download = url.substring(url.lastIndexOf("/") + 1); // Extract the filename from the URL
      anchor.style.display = "none";

      // Append the anchor to the document and simulate a click to trigger the download
      document.body.appendChild(anchor);
      anchor.click();

      // Clean up by revoking the temporary URL
      URL.revokeObjectURL(blobURL);
    })
    .catch((error) => console.error("Error downloading the file:", error));
}
