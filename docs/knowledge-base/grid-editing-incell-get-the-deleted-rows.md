---
title: Retrieve deleted rows on click
description: Learn how to get the pending deleted items in incell editable Grid.
type: how-to
page_title: Get the deleted rows - Kendo UI for jQuery Data Grid
slug: grid-editing-incell-get-the-deleted-rows
tags: grid, editable, get, obtain, deleted, destroyed, rows, items, pending, changes, incell, editing
ticketid: 1343481
res_type: kb
---

## Environment

<table>
 <tr>
  <td>Product</td>
  <td>Progress® Kendo UI® Grid for jQuery</td>
 </tr>
 <tr>
  <td>Product Version</td>
  <td>2018.3.911</td>
 </tr>
</table>

## Description

Is there any way to can retrieve deleted Rows on Click of custom button using incell editing?

## Solution

It is possible to get hold of the destroyed items in the data source with the help of the `destroyed()` internal method. It returns a collection of the destroyed items before they are synced. However, please be cautious of its usage and test it when moving to new versions. Since it is not a publically revealed property, it may be subject to change.

```       
    function getDestroyed(){
        var grid = $("#grid").data("kendoGrid");
        var destroyed = grid.dataSource.destroyed();
        kendo.alert(kendo.stringify(destroyed));
    }
```

```dojo
    <div id="example">
        <button class="k-button k-primary" onclick="getDestroyed()">Get Detroyed</button>
        <div id="grid"></div>
        <script>
            function getDestroyed(){
              var grid = $("#grid").data("kendoGrid");
              var destroyed = grid.dataSource.destroyed();
              kendo.alert(kendo.stringify(destroyed));
            }
            
            var crudServiceBaseUrl = "https://demos.telerik.com/service/v2/core",
                dataSource = new kendo.data.DataSource({
                     transport: {
                         read:  {
                             url: crudServiceBaseUrl + "/Products"
                         },
                         update: {
                             url: crudServiceBaseUrl + "/Products/Update",
                             type: "POST",
                             contentType: "application/json"
                         },
                         destroy: {
                             url: crudServiceBaseUrl + "/Products/Destroy",
                             type: "POST",
                             contentType: "application/json"
                         },
                         create: {
                             url: crudServiceBaseUrl + "/Products/Create",
                             type: "POST",
                             contentType: "application/json"
                         },
                         parameterMap: function(options, operation) {
                             if (operation !== "read" && options.models) {
                                 return kendo.stringify(options.models);
                             }
                         }
                     },
                     batch: true,
                     pageSize: 20,
                     schema: {
                         model: {
                             id: "ProductID",
                             fields: {
                                ProductID: { editable: false, nullable: true },
                                ProductName: { validation: { required: true } },
                                UnitPrice: { type: "number", validation: { required: true, min: 1} },
                                Discontinued: { type: "boolean" },
                                UnitsInStock: { type: "number", validation: { min: 0, required: true } 
                            }
                        }
                    }
                }
            });

            $("#grid").kendoGrid({
                dataSource: dataSource,
                navigatable: true,
                pageable: true,
                height: 550,
                toolbar: ["create", "save", "cancel"],
                columns: [
                    "ProductName",
                    { field: "UnitPrice", title: "Unit Price", format: "{0:c}", width: 120 },
                    { field: "UnitsInStock", title: "Units In Stock", width: 120 },
                    { field: "Discontinued", width: 120},
                    { command: "destroy", title: "&nbsp;", width: 150 }],
                editable: true
            });
        </script>
    </div>
```

## See Also

* [Grid Editing Overview](https://www.telerik.com/kendo-jquery-ui/documentation/controls/grid/editing/editing)
