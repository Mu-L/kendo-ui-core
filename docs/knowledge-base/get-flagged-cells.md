---
title: Get Flagged Spreadsheet Cells Containing Invalid Values
page_title: Get Flagged Spreadsheet Cells Containing Invalid Values
description: "Learn how to get all flagged cells in a Kendo UI for jQuery Spreadsheet which contain invalid values."
slug: howto_get_flagged_cells_containing_invalid_values_spreadsheet_widget
previous_url: /controls/data-management/spreadsheet/how-to/get-flagged-cells
tags: kendo, jquery, spreadsheet, get, flagged, cells, containing, invalid, values
component: spreadsheet
type: how-to
res_type: kb
---

## Environment

<table>
 <tr>
  <td>Product</td>
  <td>Progress® Kendo UI® Spreadsheet for jQuery</td>
 </tr>
 <tr>
  <td>Operating System</td>
  <td>Windows 10 64bit</td>
 </tr>
 <tr>
  <td>Visual Studio Version</td>
  <td>Visual Studio 2017</td>
 </tr>
 <tr>
  <td>Preferred Language</td>
  <td>JavaScript</td>
 </tr>
</table>

## Description

How can I get all the cells in a Kendo UI for jQuery Spreadsheet that contain invalid values?

## Solution

The following example demonstrates how to get all flagged cells in the Spreadsheet which contain invalid values.

```dojo
<style>html { font-size: 14px; font-family: Arial, Helvetica, sans-serif; }</style>
<div id="example">
  <div id="spreadsheet" style="width: 100%;"></div>
  <script>
    function getFlaggedCells(e) {
      var spreadsheet = e.sender;
      var sheet = spreadsheet.activeSheet();
      var range = sheet.range('A3:E8');

      range.forEachCell(function (row, column, cell) {
          if(cell.validation && !cell.validation.value) {
          	console.log("Row: " + row + " Col: " + column);
          }
      });
    }

    $(function() {
      $("#spreadsheet").kendoSpreadsheet({
        change: getFlaggedCells,
        render: getFlaggedCells,
        columns: 26,
        rows: 30,
        sheetsbar: false,
        excel: {
          // Required to enable Excel Export in some browsers
          proxyURL: "https://demos.telerik.com/service/v2/core/export"
        },
        sheets: [
          {
            name: "ContactsForm",
            mergedCells: [
              "A1:E1"
            ],
            rows: [
              {
                height: 70,
                cells: [
                  {
                    index: 0, value: "CONTACTS FORM", fontSize: 32, background: "rgb(96,181,255)", enable: false,
                    textAlign: "center", color: "white"
                  }
                ]
              },
              {
                height: 25,
                cells: [
                  {
                    value: "Full Name", background: "rgb(167,214,255)", textAlign: "center", color: "rgb(0,62,117)", enable: false
                  },
                  {
                    value: "Email", background: "rgb(167,214,255)", textAlign: "center", color: "rgb(0,62,117)", enable: false
                  },
                  {
                    value: "Date of Birth", background: "rgb(167,214,255)", textAlign: "center", color: "rgb(0,62,117)", enable: false
                  },
                  {
                    value: "Phone", background: "rgb(167,214,255)", textAlign: "center", color: "rgb(0,62,117)", enable: false
                  },
                  {
                    value: "Confirmed", background: "rgb(167,214,255)", textAlign: "center", color: "rgb(0,62,117)", enable: false
                  }
                ]
              },
              {
                height: 25,
                cells: [
                  {
                    value: "Maria Anders",
                    validation: {
                      dataType: "custom",
                      from: "AND(LEN(A3)>3, LEN(A3)200)",
                      allowNulls: true,
                      type: "reject",
                      titleTemplate: "Full Name validation error",
                      messageTemplate: "The full name should be longer than 3 letters and shorter than 200."
                    }

                  },
                  {
                    value: "maria.anders@mail.com",
                    validation: {
                      dataType: "custom",
                      from: "AND(NOT(ISERROR(FIND(\"@\", B3))), NOT(ISERROR(FIND(\".\", B3))), ISERROR(FIND(\" \", J1)), LEN(B3)>5)",
                      allowNulls: true,
                      type: "reject",
                      titleTemplate: "Email validation error",
                      messageTemplate: "The value entered is not an valid email address."
                    }
                  },
                  {
                    value: 31232,
                    format: "m/d/yyyy",
                    validation: {
                      dataType: "date",
                      comparerType: "between",
                      from: "DATEVALUE(\"1/1/1900\")",
                      to: "DATEVALUE(\"1/1/1998\")",
                      allowNulls: true,
                      type: "reject",
                      titleTemplate: "Birth Date validaiton error",
                      messageTemplate: "Birth Date should be between 1899 and 1998 year."
                    }
                  },
                  {
                    value: 0921123465,
                    validation: {
                      dataType: "custom",
                      from: "AND(ISNUMBER(D3),LEN(D3)<14)",
                      allowNulls: true,
                      type: "reject",
                      titleTemplate: "Phone validation error",
                      messageTemplate: "The value entered is not an valid phone number. Please enter numeric value with less than 14 digits."
                    }
                  },
                  {
                    value: true,
                    validation: {
                      dataType: "list",
                      from: "ListValues!A1:B1",
                      allowNulls: true,
                      type: "reject",
                      titleTemplate: "Invalid value",
                      messageTemplate: "Valid values are 'true' and 'false'."
                    }
                  }
                ]
              },

              {
                height: 25,
                cells: [
                  {
                    value: "Ana Trujillo",
                    validation: {
                      dataType: "custom",
                      from: "AND(LEN(A4)>3, LEN(A4)200)",
                      allowNulls: true,
                      type: "reject",
                      titleTemplate: "Full Name validation error",
                      messageTemplate: "The full name should be longer than 3 letters and shorter than 200."
                    }

                  },
                  {
                    value: "ana.trujillo@mail.com",
                    validation: {
                      dataType: "custom",
                      from: "AND(NOT(ISERROR(FIND(\"@\", B4))), NOT(ISERROR(FIND(\".\", B4))), ISERROR(FIND(\" \", J1)), LEN(B4)>5)",
                      allowNulls: true,
                      type: "reject",
                      titleTemplate: "Email validation error",
                      messageTemplate: "The value entered is not an valid email address."
                    }
                  },
                  {
                    value: 31222,
                    format: "m/d/yyyy",
                    validation: {
                      dataType: "date",
                      comparerType: "between",
                      from: "DATEVALUE(\"1/1/1900\")",
                      to: "DATEVALUE(\"1/1/1998\")",
                      allowNulls: true,
                      type: "reject",
                      titleTemplate: "Birth Date validaiton error",
                      messageTemplate: "Birth Date should be between 1899 and 1998 year."
                    }
                  },
                  {
                    value: 55554729,
                    validation: {
                      dataType: "custom",
                      from: "AND(ISNUMBER(D4),LEN(D4)<14)",
                      allowNulls: true,
                      type: "reject",
                      titleTemplate: "Phone validation error",
                      messageTemplate: "The value entered is not an valid phone number. Please enter numeric value with less than 14 digits."
                    }
                  },
                  {
                    value: true,
                    validation: {
                      dataType: "list",
                      from: "ListValues!A1:B1",
                      allowNulls: true,
                      type: "reject",
                      titleTemplate: "Invalid value",
                      messageTemplate: "Valid values are 'true' and 'false'."
                    }
                  }
                ]
              },

              {
                height: 25,
                cells: [
                  {
                    value: "Antonio Moreno",
                    validation: {
                      dataType: "custom",
                      from: "AND(LEN(A5)>3, LEN(A5)200)",
                      allowNulls: true,
                      type: "reject",
                      titleTemplate: "Full Name validation error",
                      messageTemplate: "The full name should be longer than 3 letters and shorter than 200."
                    }

                  },
                  {
                    value: "antonio.moreno@mail.com",
                    validation: {
                      dataType: "custom",
                      from: "AND(NOT(ISERROR(FIND(\"@\", B5))), NOT(ISERROR(FIND(\".\", B5))), ISERROR(FIND(\" \", J1)), LEN(B5)>5)",
                      allowNulls: true,
                      type: "reject",
                      titleTemplate: "Email validation error",
                      messageTemplate: "The value entered is not an valid email address."
                    }
                  },
                  {
                    value: 32232,
                    format: "m/d/yyyy",
                    validation: {
                      dataType: "date",
                      comparerType: "between",
                      from: "DATEVALUE(\"1/1/1900\")",
                      to: "DATEVALUE(\"1/1/1998\")",
                      allowNulls: true,
                      type: "reject",
                      titleTemplate: "Birth Date validaiton error",
                      messageTemplate: "Birth Date should be between 1899 and 1998 year."
                    }
                  },
                  {
                    value: "(5) 555-3932",
                    validation: {
                      dataType: "custom",
                      from: "AND(ISNUMBER(D5),LEN(D5)<14)",
                      allowNulls: true,
                      type: "reject",
                      titleTemplate: "Phone validation error",
                      messageTemplate: "The value entered is not an valid phone number. Please enter numeric value with less than 14 digits."
                    }
                  },
                  {
                    value: true,
                    validation: {
                      dataType: "list",
                      from: "ListValues!A1:B1",
                      allowNulls: true,
                      type: "reject",
                      titleTemplate: "Invalid value",
                      messageTemplate: "Valid values are 'true' and 'false'."
                    }
                  }
                ]
              },

              {
                height: 25,
                cells: [
                  {
                    value: "Thomas Hardy",
                    validation: {
                      dataType: "custom",
                      from: "AND(LEN(A6)>3, LEN(A6)200)",
                      allowNulls: true,
                      type: "reject",
                      titleTemplate: "Full Name validation error",
                      messageTemplate: "The full name should be longer than 3 letters and shorter than 200."
                    }

                  },
                  {
                    value: "thomas.hardy@mail.com",
                    validation: {
                      dataType: "custom",
                      from: "AND(NOT(ISERROR(FIND(\"@\", B6))), NOT(ISERROR(FIND(\".\", B6))), ISERROR(FIND(\" \", J1)), LEN(B6)>5)",
                      allowNulls: true,
                      type: "reject",
                      titleTemplate: "Email validation error",
                      messageTemplate: "The value entered is not an valid email address."
                    }
                  },
                  {
                    value: 21232,
                    format: "m/d/yyyy",
                    validation: {
                      dataType: "date",
                      comparerType: "between",
                      from: "DATEVALUE(\"1/1/1900\")",
                      to: "DATEVALUE(\"1/1/1998\")",
                      allowNulls: true,
                      type: "reject",
                      titleTemplate: "Birth Date validaiton error",
                      messageTemplate: "Birth Date should be between 1899 and 1998 year."
                    }
                  },
                  {
                    value: 1715557788,
                    validation: {
                      dataType: "custom",
                      from: "AND(ISNUMBER(D6),LEN(D6)<14)",
                      allowNulls: true,
                      type: "reject",
                      titleTemplate: "Phone validation error",
                      messageTemplate: "The value entered is not an valid phone number. Please enter numeric value with less than 14 digits."
                    }
                  },
                  {
                    value: true,
                    validation: {
                      dataType: "list",
                      from: "ListValues!A1:B1",
                      allowNulls: true,
                      type: "reject",
                      titleTemplate: "Invalid value",
                      messageTemplate: "Valid values are 'true' and 'false'."
                    }
                  }
                ]
              },

              {
                height: 25,
                cells: [
                  {
                    value: "Christina Toms",
                    validation: {
                      dataType: "custom",
                      from: "AND(LEN(A7)>3, LEN(A7)200)",
                      allowNulls: true,
                      type: "reject",
                      titleTemplate: "Full Name validation error",
                      messageTemplate: "The full name should be longer than 3 letters and shorter than 200."
                    }

                  },
                  {
                    value: "christina.toms",
                    validation: {
                      dataType: "custom",
                      from: "AND(NOT(ISERROR(FIND(\"@\", B7))), NOT(ISERROR(FIND(\".\", B7))), ISERROR(FIND(\" \", J1)), LEN(B7)>5)",
                      allowNulls: true,
                      type: "reject",
                      titleTemplate: "Email validation error",
                      messageTemplate: "The value entered is not an valid email address."
                    }
                  },
                  {
                    value: 30102,
                    format: "m/d/yyyy",
                    validation: {
                      dataType: "date",
                      comparerType: "between",
                      from: "DATEVALUE(\"1/1/1900\")",
                      to: "DATEVALUE(\"1/1/1998\")",
                      allowNulls: true,
                      type: "reject",
                      titleTemplate: "Birth Date validaiton error",
                      messageTemplate: "Birth Date should be between 1899 and 1998 year."
                    }
                  },
                  {
                    value: 0921123465,
                    validation: {
                      dataType: "custom",
                      from: "AND(ISNUMBER(D7),LEN(D7)<14)",
                      allowNulls: true,
                      type: "reject",
                      titleTemplate: "Phone validation error",
                      messageTemplate: "The value entered is not an valid phone number. Please enter numeric value with less than 14 digits."
                    }
                  },
                  {
                    value: true,
                    validation: {
                      dataType: "list",
                      from: "ListValues!A1:B1",
                      allowNulls: true,
                      type: "reject",
                      titleTemplate: "Invalid value",
                      messageTemplate: "Valid values are 'true' and 'false'."
                    }
                  }
                ]
              },

              {
                height: 25,
                cells: [
                  {
                    value: "Hanna Moos",
                    validation: {
                      dataType: "custom",
                      from: "AND(LEN(A8)>3, LEN(A8)200)",
                      allowNulls: true,
                      type: "reject",
                      titleTemplate: "Full Name validation error",
                      messageTemplate: "The full name should be longer than 3 letters and shorter than 200."
                    }

                  },
                  {
                    value: "hanna.moos@mail.com",
                    validation: {
                      dataType: "custom",
                      from: "AND(NOT(ISERROR(FIND(\"@\", B8))), NOT(ISERROR(FIND(\".\", B8))), ISERROR(FIND(\" \", J1)), LEN(B8)>5)",
                      allowNulls: true,
                      type: "reject",
                      titleTemplate: "Email validation error",
                      messageTemplate: "The value entered is not an valid email address."
                    }
                  },
                  {
                    value: 0,
                    format: "m/d/yyyy",
                    validation: {
                      dataType: "date",
                      comparerType: "between",
                      from: "DATEVALUE(\"1/1/1900\")",
                      to: "DATEVALUE(\"1/1/1998\")",
                      allowNulls: true,
                      type: "reject",
                      titleTemplate: "Birth Date validaiton error",
                      messageTemplate: "Birth Date should be between 1900 and 1998 year."
                    }
                  },
                  {
                    value: 062108460,
                    validation: {
                      dataType: "custom",
                      from: "AND(ISNUMBER(D8),LEN(D8)<14)",
                      allowNulls: true,
                      type: "reject",
                      titleTemplate: "Phone validation error",
                      messageTemplate: "The value entered is not an valid phone number. Please enter numeric value with less than 14 digits."
                    }
                  },
                  {
                    value: true,
                    validation: {
                      dataType: "list",
                      from: "ListValues!A1:B1",
                      allowNulls: true,
                      type: "reject",
                      titleTemplate: "Invalid value",
                      messageTemplate: "Valid values are 'true' and 'false'."
                    }
                  }
                ]
              },
              {
                height: 25,
                cells: [
                  {
                    value: "",
                    validation: {
                      dataType: "custom",
                      from: "AND(LEN(A9)>3, LEN(A9)200)",
                      allowNulls: true,
                      type: "reject",
                      titleTemplate: "Full Name validation error",
                      messageTemplate: "The full name should be longer than 3 letters and shorter than 200."
                    }

                  },
                  {
                    value: "",
                    validation: {
                      dataType: "custom",
                      from: "AND(NOT(ISERROR(FIND(\"@\", B9))), NOT(ISERROR(FIND(\".\", B9))), ISERROR(FIND(\" \", J1)), LEN(B9)>5)",
                      allowNulls: true,
                      type: "reject",
                      titleTemplate: "Email validation error",
                      messageTemplate: "The value entered is not an valid email address."
                    }
                  },
                  {
                    value: "",
                    format: "m/d/yyyy",
                    validation: {
                      dataType: "date",
                      comparerType: "between",
                      from: "DATEVALUE(\"1/1/1900\")",
                      to: "DATEVALUE(\"1/1/1998\")",
                      allowNulls: true,
                      type: "reject",
                      titleTemplate: "Birth Date validaiton error",
                      messageTemplate: "Birth Date should be between 1899 and 1998 year."
                    }
                  },
                  {
                    value: "",
                    validation: {
                      dataType: "custom",
                      from: "AND(ISNUMBER(D9),LEN(D9)<14)",
                      allowNulls: true,
                      type: "reject",
                      titleTemplate: "Phone validation error",
                      messageTemplate: "The value entered is not an valid phone number. Please enter numeric value with less than 14 digits."
                    }
                  },
                  {
                    value: "",
                    validation: {
                      dataType: "list",
                      comparerType: "greaterThan",
                      from: "ListValues!A1:B1",
                      allowNulls: true,
                      type: "reject",
                      titleTemplate: "Invalid value",
                      messageTemplate: "Valid values are 'true' and 'false'."
                    }
                  }
                ]
              }
            ],
            columns: [
              {
                width: 100
              },
              {
                width: 215
              },
              {
                width: 115
              },
              {
                width: 115
              },
              {
                width: 115
              }
            ]
          },
          {
            name: "ListValues",
            rows: [ //A1:B1
              {
                cells: [
                  {
                    value: true
                  },
                  {
                    value: false
                  }
                ]
              }
            ]
          }
        ]
      }).data('kendoSpreadsheet').unbind('render', getFlaggedCells);
    });
  </script>
</div>
```

## See Also

* [Basic Usage of the Spreadsheet (Demo)](https://demos.telerik.com/kendo-ui/spreadsheet/index)
* [Spreadsheet JavaScript API Reference](/api/javascript/ui/spreadsheet)
