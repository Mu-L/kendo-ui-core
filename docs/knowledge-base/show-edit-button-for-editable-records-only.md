---
title: Show Edit Buttons for Editable Records Only
page_title: Buttons for Editable Records - Kendo UI for jQuery Data Grid
description: "Learn how to show edit buttons only for the editable records of the Kendo UI Grid for jQuery."
previous_url: /controls/data-management/grid/how-to/Editing/show-edit-button-for-editable-records-only
slug: howto_show_editfor_editable_records_only_grid
tags: show, edit, buttons, editable, records, only
component: grid
type: how-to
res_type: kb
---

## Environment

<table>
 <tr>
  <td>Product</td>
  <td>Progress® Kendo UI® Grid for jQuery</td> 
 </tr>
 <tr>
  <td>Operating System</td>
  <td>All</td>
 </tr>
 <tr>
  <td>Browser</td>
  <td>All</td>
 </tr>
 <tr>
  <td>Browser Version</td>
  <td>All</td>
 </tr>
</table>

## Description

How can I show edit buttons only for the editable records of the Kendo UI Grid for jQuery?

## Solution

The following example demonstrates how to show the **Edit** buttons in the Grid only for records which meet certain criteria.

> For Kendo UI releases 2017 R1 or later use the built-in [`columns.command.visible`](/api/javascript/ui/grid/configuration/columns.command#columns.command.visible) function of the Grid instead.

```dojo
    <div id="example" class="k-content">
      <div id="grid"></div>

      <script>
        $(document).ready(function () {
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
                    UnitsInStock: { type: "number", validation: { min: 0, required: true } }
                   }
                  }
                 }
                });

          $("#grid").kendoGrid({
            dataSource: dataSource,
             pageable: true,
             dataBound: function (){
               var grid = this;
               var trs = this.tbody.find('tr').each(function(){
                 var item = grid.dataItem($(this));
                 if( item.UnitPrice % 5 == 0) {
                   $(this).find('.k-grid-edit-command,.k-grid-remove-command').hide();
                 }

               });               
             },
             height: 430,
             toolbar: ["create"],
             columns: [
               "ProductName",
               { field: "UnitPrice", title: "Unit Price", format: "{0:c}", width: "100px" },
               { field: "UnitsInStock", title:"Units In Stock", width: "100px" },
               { field: "Discontinued", width: "100px" },
               { command: ["edit", "destroy"], title: "", width: "172px" }],
             editable: "inline"
            });
        });
      </script>
    </div>
```

## See Also

* [JavaScript API Reference of the Data Grid](/api/javascript/ui/grid)
