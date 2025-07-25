---
title: Sheet
page_title: Configuration, methods and events of Kendo UI Spreadsheet Sheet Instance object
res_type: api
---

# kendo.spreadsheet.Sheet

Represents a sheet instance in the [Kendo UI Spreadsheet](/api/javascript/ui/spreadsheet) widget. Inherits from [Observable](/api/javascript/observable).

## Fields

### dataSource `kendo.data.DataSource`

The [DataSource](/framework/datasource/overview) instance to which the Sheet is bound to.

#### Example

    <div id="spreadsheet"></div>
    <script>

      var dataSource = new kendo.data.DataSource({
        transport: {
          read:  {
            url: "https://demos.telerik.com/service/v2/core/Products"
          }
        }
      });

      $("#spreadsheet").kendoSpreadsheet();

      var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");
      var sheet = spreadsheet.activeSheet();
      sheet.setDataSource(dataSource);

	/* The result can be observed in the DevTools(F12) console of the browser. */
      console.log(sheet.dataSource);

    </script>

## Methods

### addDrawing

Adds a new drawing to this sheet.

#### Parameters

##### drawing `Object`

This can contain the same properties as you can pass to
[`sheets.drawings`](/api/javascript/ui/spreadsheet#configuration-sheets.drawings)
configuration options.

#### Returns

`Object` an internal Drawing object containing the passed properties.  The
internals of this object are not intended to be public API at this point, but
you can pass this object reference to [`removeDrawing`](#methods-removeDrawing)
if you want to remove this drawing.

### clearFilter

Clears the filters for the passed column index. If an array is passed, `clearFilter` will clear the filter for each column index.

#### Parameters

##### indexes `Number|Array`

The column index(es)

#### Example

    <div id="spreadsheet"></div>
    <script type="text/javascript" charset="utf-8">

        $("#spreadsheet").kendoSpreadsheet();

        var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");

        var sheet = spreadsheet.activeSheet();

        sheet.range("A1:B2").values([
            [1, 2],
            [2, 3]
        ]).filter({
            column: 1,
            filter: new kendo.spreadsheet.ValueFilter({
                values: [2]
            })
        }); // the filter will hide the second row

        sheet.clearFilter(1); // the clear filter will remove the applied filter for the second column.
    </script>

### columnWidth

Gets or sets the width of the column at the given index.

#### Parameters

##### index `Number`

The zero-based index of the column

##### width `Number` *optional*

If passed, the method will set the width of the column at the passed index.

#### Example

    <div id="spreadsheet"></div>
    <script type="text/javascript" charset="utf-8">

        $("#spreadsheet").kendoSpreadsheet();

        var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");

        var sheet = spreadsheet.activeSheet();

        sheet.columnWidth(1, 100);
    </script>

### batch

Suppresses triggering of change events for a sequence of actions. Triggers a single change event at the end of the sequence.

Greatly improves performance when calling multiple methods that change the sheet state, as the widget will be refreshed once.

#### Parameters

##### callback `Function`

The sequence of actions that will be executed without triggering a change event.

##### changeEventArgs `Object`

The change event arguments that will be used for the change event triggered after the callback finishes executing.

#### Example

    <div id="spreadsheet"></div>
    <script type="text/javascript" charset="utf-8">

        $("#spreadsheet").kendoSpreadsheet();

        var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");

        var sheet = spreadsheet.activeSheet();

        sheet.batch(function() {
            for (var i = 0; i < 10; i += 2) {
                sheet.hideColumn(i);
                sheet.hideRow(i);
            }
        }, { layout: true });
    </script>

### deleteColumn

Deletes the contents of the column at the provided index and shifts the remaining contents of the sheet to the left.

#### Parameters

##### index `Number`

The zero-based index of the column

##### Example


    <div id="spreadsheet"></div>
    <script type="text/javascript" charset="utf-8">

        $("#spreadsheet").kendoSpreadsheet();

        var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");

        var sheet = spreadsheet.activeSheet();

        sheet.range("A1:B2").values([ [1, 2], [2, 3] ]);

        sheet.deleteColumn(0);
    </script>

### deleteRow

Deletes the contents of the row at the provided index and shifts the remaining contents of the sheet up.

#### Parameters

##### index `Number`

The zero-based index of the row

##### skipDataSourceDelete `Boolean` *optional*

If passed `true`, the method does not delete item from the DataSource.

#### Example


    <div id="spreadsheet"></div>
    <script type="text/javascript" charset="utf-8">

        $("#spreadsheet").kendoSpreadsheet();

        var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");

        var sheet = spreadsheet.activeSheet();

        sheet.range("A1:B2").values([ [1, 2], [2, 3] ]);

        sheet.deleteRow(0);
    </script>


### fromJSON

Loads the sheet from an object in the format defined in the [sheet configuration](/api/javascript/ui/spreadsheet#configuration.sheets).

> The configuration and cell values will be merged.
>
> **Note:** the Sheet objects are not resizable.  If you use this method you must make sure that the JSON does not contain more rows or columns than defined when the `Spreadsheet` object has been constructed.  To reload a full spreadsheet from JSON, we recommend using Spreadsheet's [fromJSON](/api/javascript/ui/spreadsheet/methods/fromjson) method.

#### Parameters

##### data `Object`

The object to load data from.  This should be **the deserialized object**, not the JSON string.

#### Example - Merge sheet data

    <div id="spreadsheet"></div>
    <pre id="result"></pre>
    <script>
      $("#spreadsheet").kendoSpreadsheet({
        sheets: [{
          name: "Food Order",
          mergedCells: [
            "A1:C1"
          ],
          rows: [{
            height: 70,
            cells: [{
              value: "Order #231", bold: "true", fontSize: 32, textAlign: "center"
            }]
          }, {
            height: 25,
            cells: [{
              value: "Product", bold: "true", textAlign: "center"
            }, {
              value: "Quantity", bold: "true", textAlign: "center"
            }, {
              value: "Price", bold: "true", textAlign: "center"
            }]
          }],
          columns: [{
            width: 200
          }, {
            width: 115
          }, {
            width: 115
          }]
        }]
      });

      // Load sheet data
      var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");
      var sheet = spreadsheet.sheetByIndex(0);
      sheet.fromJSON({
        rows: [{
          index: 2,
          cells: [{
            value: "Calzone"
          }, {
            value: 1
          }, {
            value: 12.29, format: "$#,##0.00"
          }]
        }, {
          index: 3,
          cells: [{
            value: "Margarita"
          }, {
            value: 2
          }, {
            value: 9.11, format: "$#,##0.00"
          }]
        }]
      });
    </script>

### frozenColumns

Gets or sets the amount of frozen columns displayed by the sheet.

#### Parameters

##### count `Number` *optional*

The amount of columns to be frozen. Pass `0` to remove the frozen pane.

#### Returns

`Number` The current frozen columns. By default, returns `0`.

#### Example

    <div id="spreadsheet"></div>
    <script type="text/javascript" charset="utf-8">

        $("#spreadsheet").kendoSpreadsheet();

        var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");

        var sheet = spreadsheet.activeSheet();

        sheet.frozenColumns(5);
    </script>

### frozenRows

Gets or sets the amount of frozen rows displayed by the sheet.

#### Parameters

##### count `Number` *optional*

The amount of columns to be frozen. Pass `0` to remove the frozen pane.

#### Returns

`Number` The current frozen rows. By default, returns `0`.

#### Example

    <div id="spreadsheet"></div>
    <script type="text/javascript" charset="utf-8">

        $("#spreadsheet").kendoSpreadsheet();

        var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");

        var sheet = spreadsheet.activeSheet();

        sheet.frozenRows(5);
    </script>

### hideColumn

Hides the column at the provided index.

#### Parameters

##### index `Number`

The zero-based index of the column

#### Example

    <div id="spreadsheet"></div>
    <script type="text/javascript" charset="utf-8">

        $("#spreadsheet").kendoSpreadsheet();

        var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");

        var sheet = spreadsheet.activeSheet();

        sheet.range("A1:B2").values([ [1, 2], [2, 3] ]);

        sheet.hideColumn(1);
    </script>

### hideRow

Hides the row at the provided index.

#### Parameters

##### index `Number`

The zero-based index of the row

#### Example

    <div id="spreadsheet"></div>
    <script type="text/javascript" charset="utf-8">

        $("#spreadsheet").kendoSpreadsheet();

        var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");

        var sheet = spreadsheet.activeSheet();

        sheet.range("A1:B2").values([ [1, 2], [2, 3] ]);

        sheet.hideRow(1);
    </script>

### insertColumn

Inserts a new, empty column at the provided index. The contents of the spreadsheet (including the ones in the current column index) are shifted to the right.

#### Parameters

##### index `Number`

The zero-based index of the column

#### Example

    <div id="spreadsheet"></div>
    <script type="text/javascript" charset="utf-8">

        $("#spreadsheet").kendoSpreadsheet();

        var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");

        var sheet = spreadsheet.activeSheet();

        sheet.range("A1:B2").values([ [1, 2], [2, 3] ]);

        sheet.insertColumn(1);
    </script>

### insertRow

Inserts a new, empty row at the provided index. The contents of the spreadsheet (including the ones in the current row index) are shifted down.

#### Parameters

##### index `Number`

The zero-based index of the column

##### skipDataSourceInsert `Boolean` *optional*

If passed `true`, the method does not insert item in the DataSource.

#### Example

    <div id="spreadsheet"></div>
    <script type="text/javascript" charset="utf-8">

        $("#spreadsheet").kendoSpreadsheet();

        var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");

        var sheet = spreadsheet.activeSheet();

        sheet.range("A1:B2").values([ [1, 2], [2, 3] ]);

        sheet.insertRow(1);
    </script>

### range

Returns a [Range](/api/javascript/spreadsheet/range) for the given range specification.

#### Parameters

##### ref `String`

##### rowIndex `Number`

##### columnIndex `Number`

##### rowCount `Number` *optional*

##### columnCount `Number` *optional*

If the parameter is a `string`, it should represent an [A1](https://msdn.microsoft.com/en-us/library/bb211395.aspx) or [RC notation](https://excelribbon.tips.net/T008803_Understanding_R1C1_References) reference of the cells.

If the parameters are `Numbers`, the first two would represent the row index (the first parameter) and the column index (the second parameter) of the top-left cell of the `range`. If there are only two parameters, only one cell will be included in the `range`. If the other two `Numbers` are also present, they will represent the number of rows (the third parameter) and number of columns (the forth parameter) that would be included in the `range`, starting from the specified top-left cell. If the third or the forth parameter is set to 0 or 1, only one row / column will be included in the `range`.

#### Returns

`kendo.spreadsheet.Range` a range object, which may be used to manipulate the cell state further.

#### Example - Using string parameter

    <div id="spreadsheet"></div>
    <script type="text/javascript" charset="utf-8">

        $("#spreadsheet").kendoSpreadsheet();

        var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");

        var sheet = spreadsheet.activeSheet();

        // set contents of the A1:B2 range
        sheet.range("A1:B2").values([ [1, 2], [2, 3] ]);
    </script>

#### Example - Using Number parameters

    <div id="spreadsheet"></div>
    <script>
        $("#spreadsheet").kendoSpreadsheet();

        var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");

        var sheet = spreadsheet.activeSheet();

        // select the B3:C6 range
        sheet.range(2,1,4,2).select();
    </script>

### removeDrawing

Removes a drawing previously added with [`addDrawing`](#methods-addDrawing).

#### Parameters

##### drawing `Object`

The drawing object.

### resize

Resize the sheet to accommodate the specified number of rows and columns. If the
new dimensions are smaller than the current ones, any existing data in the rows
or columns that are to be removed will be discarded.

#### Parameters

##### newRows `Number`

The new number of rows.

##### newColumns `Number`

The new number of columns.

#### Example

    <div id="spreadsheet"></div>
    <script type="text/javascript" charset="utf-8">
        $("#spreadsheet").kendoSpreadsheet({ rows: 10, columns: 5 });
        var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");
        var sheet = spreadsheet.activeSheet();

        sheet.resize(1000, 30);
        // the sheet will now contain 1000 rows and 30 columns
    </script>

### rowHeight

Gets or sets the height of the row at the given index.

#### Parameters

##### index `Number`

The zero-based index of the row

##### width `Number` *optional*

If passed, the method will set the height of the row at the passed index.

#### Example


    <div id="spreadsheet"></div>
    <script type="text/javascript" charset="utf-8">

        $("#spreadsheet").kendoSpreadsheet();

        var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");

        var sheet = spreadsheet.activeSheet();

        sheet.rowHeight(1, 100);
    </script>


### selection

Returns a range with the current active selection.

#### Returns

`kendo.spreadsheet.Range` the selection range.

#### Example


    <div id="spreadsheet"></div>
    <script type="text/javascript" charset="utf-8">

        $("#spreadsheet").kendoSpreadsheet();

        var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");

        var sheet = spreadsheet.activeSheet();

        sheet.range("A1:B2").select();

        var selection = sheet.selection(); // A1:B2 range
    </script>


### setDataSource

Binds the sheet to a DataSource instance. For more information on the data-binding Spreadsheet functionality, refer to the [article on binding the Spreadsheet to a data source](/controls/spreadsheet/import-and-export-data/bind-to-data-source).

#### Parameters

##### dataSource `kendo.data.DataSource`

The DataSource instance.

###### Example


    <div id="spreadsheet"></div>
    <script>

      var dataSource = new kendo.data.DataSource({
        transport: {
          read:  {
            url: "https://demos.telerik.com/service/v2/core/Products"
          }
        }
      });

      $("#spreadsheet").kendoSpreadsheet();

      var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");
      var sheet = spreadsheet.activeSheet();
      sheet.setDataSource(dataSource);

    </script>


##### columns `Array` *optional*

Columns configuration.

###### Example


    <div id="spreadsheet"></div>
    <script>

      var dataSource = new kendo.data.DataSource({
        transport: {
          read:  {
            url: "https://demos.telerik.com/service/v2/core/Products"
          }
        }
      });

      $("#spreadsheet").kendoSpreadsheet();

      var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");
      var sheet = spreadsheet.activeSheet();
      sheet.setDataSource(dataSource, [ "ProductName", "UnitPrice" ]);

    </script>


###### Example - reorder columns and change column titles


    <div id="spreadsheet"></div>
    <script>
      var dataSource = new kendo.data.DataSource({
        transport: {
          read:  {
            url: "https://demos.telerik.com/service/v2/core/Products"
          }
        }
      });

      $("#spreadsheet").kendoSpreadsheet();

      var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");
      var sheet = spreadsheet.activeSheet();
      sheet.setDataSource(dataSource, [
          { field: "UnitPrice", title: "Price" },
          { field: "ProductName", title: "Name" }
      ]);

    </script>


### showGridLines

Gets or sets a flag indicating if the grid lines should be visible.

#### Parameters

##### showGridLines `Boolean` *optional*

If passed, the method will toggle the display of the grid lines according to the value.

#### Returns

`Boolean` True if the grid lines are currently visible, false otherwise.

#### Example


    <div id="spreadsheet"></div>
    <script type="text/javascript" charset="utf-8">
        $("#spreadsheet").kendoSpreadsheet();
        var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");
        var sheet = spreadsheet.activeSheet();

        sheet.showGridLines(false);
    </script>


### toJSON
Serializes the sheet in the format defined in the [sheet configuration](/api/javascript/ui/spreadsheet#configuration.sheets).

#### Example - Serialize the sheet as JSON

    <div id="spreadsheet"></div>
    <pre id="result"></pre>
    <script>
        $("#spreadsheet").kendoSpreadsheet({
            sheets: [{
                name: "Food Order",
                mergedCells: [
                    "A1:G1"
                ],
                rows: [{
                    height: 70,
                    cells: [{
                        value: "My Company", fontSize: 32, textAlign: "center"
                    }]
                }]
            }]
        });

        var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");
        var sheet = spreadsheet.sheetByIndex(0);
        var data = sheet.toJSON();
        var json = JSON.stringify(data, null, 2);

        $("#spreadsheet").remove();
        $("#result").text(json);
    </script>

### unhideColumn

Shows the hidden column at the provided index. Does not have any effect if the column is already visible.

#### Parameters

##### index `Number`

The zero-based index of the column

#### Example


    <div id="spreadsheet"></div>
    <script type="text/javascript" charset="utf-8">

        $("#spreadsheet").kendoSpreadsheet();

        var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");

        var sheet = spreadsheet.activeSheet();

        sheet.range("A1:B2").values([ [1, 2], [2, 3] ]);

        sheet.hideColumn(1);
        sheet.unhideColumn(1); // reverts upper call
    </script>


### unhideRow

Shows the hidden row at the provided index. Does not have any effect if the row is already visible.

#### Parameters

##### index `Number`

The zero-based index of the row

#### Example


    <div id="spreadsheet"></div>
    <script type="text/javascript" charset="utf-8">

        $("#spreadsheet").kendoSpreadsheet();

        var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");

        var sheet = spreadsheet.activeSheet();

        sheet.range("A1:B2").values([ [1, 2], [2, 3] ]);

        sheet.hideRow(1);
        sheet.unhideRow(1); // reverts upper call
    </script>


## Events

### change

Fires when the configuration or the data of the sheet change.

#### Event Data

##### e.sender `kendo.spreadsheet.Sheet`

The sheet instance.

#### Example - subscribe to the "change" event during initialization


    <div id="spreadsheet"></div>
    <script>
        $("#spreadsheet").kendoSpreadsheet();

        var spreadsheet = $("#spreadsheet").data("kendoSpreadsheet");

        var sheet = spreadsheet.activeSheet();

        sheet.bind("change", function() {
	/* The result can be observed in the DevTools(F12) console of the browser. */
            console.log("sheet state changed");
        });

        sheet.range("A1:B2").values([ [1, 2], [2, 3] ]);
    </script>

