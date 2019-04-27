const convert = require("xml-js");
/*
- File Upload method which validate both XML and CSV format,
- and transforms key attributes based on uploaded file.
- @params file
*/
const FileUpload = file => {
  return new Promise(resolve => {
    let records = [];
    let finalRecords;
    if (file.name.indexOf(".xml") !== -1) {
      // XML File Validations
      const data = file.data.toString();
      records = JSON.parse(convert.xml2json(data, { compact: true, spaces: 4 })).records.record;
      const renameKeyAttribute = records.map(key => ({
        Reference: key._attributes.reference,
        Start_Balance: key.startBalance._text,
        Mutation: key.mutation._text,
        End_Balance: key.endBalance._text,
        Description: key.description._text
      }));
      finalRecords = uniqueValidation(renameKeyAttribute);
    } else if (file.name.indexOf(".csv")) {
      // CSV File Validations
      const rows = file.data
        .toString("utf8")
        .trim()
        .split("\n");
      const headers = [];
      for (let i = 0; i < rows.length; i++) {
        if (i === 0) {
          const headerNames = rows[i].split(",");
          for (const headerName of headerNames) {
            headers.push({
              headerName: headerName,
              headerProperty: headerName.replace(" ", "_")
            });
          }
        } else {
          const row = rows[i].split(",");
          const record = {};
          for (let j = 0; j < headers.length; j++) {
            for (let k = 0; k < row.length; k++) {
              if (j === k) {
                record[headers[j].headerProperty] = row[k];
              }
            }
          }
          records.push(record);
        }
      }
      finalRecords = uniqueValidation(records);
    }
    return resolve(finalRecords);
  });
};
/*
- uniqueValudaton method will validate all transaction reference no should be unique,
- and end balance should be validated based on start balance & mutation values.
- @params records
*/
const uniqueValidation = records => {
  const errorRecords = [];
  for (const record of records) {
    let isUnique = true;
    let isEndBalanceCorrect = true;
    // Transaction Reference Number Unique Validation
    if (
      record.Reference &&
      records.filter(value => value.Reference === record.Reference).length > 1
    ) {
      isUnique = false;
    }
    // End Balance Validation
    if (
      (
        parseFloat(record.Start_Balance) + parseFloat(record.Mutation)
      ).toFixed(2) !== parseFloat(record.End_Balance).toFixed(2)
    ) {
      isEndBalanceCorrect = false;
    }
    if (!isUnique || !isEndBalanceCorrect) {
      const error =
        !isUnique && !isEndBalanceCorrect
          ? "Duplicate Reference No, Incorrect End Balance"
          : !isUnique && isEndBalanceCorrect
            ? "Duplicate Reference No"
            : "Incorrect End Balance";
      errorRecords.push({
        Reference: record.Reference,
        Description: record.Description,
        error
      });
    }
  }
  if (errorRecords == 0) return res.render('index', { messages: 'Invalid file. Please import vaild file.', values: [] });
  return errorRecords;
}

module.exports = {
  FileUpload
};
