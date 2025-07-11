---
title: Use Custom Button Templates instead of Default Commands for Inline Edit and Delete Functionalities
description: Learn how to use custom button templates instead of the default commands to edit and delete records in a Kendo UI Grid in inline edit mode.
type: how-to
page_title: Use Custom Button Templates instead of Default Commands for Inline Edit and Delete Functionalities - Kendo UI for jQuery Data Grid
slug: inline-edit-with-custom-button-template
tags: inline, edit, delete, custom, button, template, commands, grid
ticketid: 1133582
res_type: kb
component: grid
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
</table>


## Description

How can I trigger the default **Edit** and **Delete** functionalities in a Grid with enabled inline edit mode by using my own custom buttons instead of the default command buttons?

## Solution

Use the [`addRow`](/api/javascript/ui/grid/methods/addrow) and [`removeRow`](/api/javascript/ui/grid/methods/removerow) methods of the Grid.

1. Use the `columns.template` property to add a custom button to the column.

    ````dojo
    { template: "<button class='k-button k-button-md k-rounded-md k-button-solid k-button-solid-base customEdit'><span class='k-button-text'>My Edit</span></button>", title:"Custom Edit"}
    ````

1. Apply the [`editRow`](/api/javascript/ui/grid/methods/editrow) method by passing the row for which the button was clicked as an argument.

    ```dojo
    <div id="grid"></div>

        <script>
          $("#grid").on("click", ".customEdit", function(){
            var row = $(this).closest("tr");
            $("#grid").data("kendoGrid").editRow(row);
          });

          $("#grid").on("click", ".customDelete", function(){
            var row = $(this).closest("tr");
            $("#grid").data("kendoGrid").removeRow(row);
          });

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
              height: 550,
              toolbar: ["create"],
              editable: "inline",
              columns: [
                "ProductName",
                { field: "UnitPrice", title: "Unit Price", format: "{0:c}"},
                { field: "UnitsInStock", title:"Units In Stock"},
                { template: "<button class='k-button k-button-md k-rounded-md k-button-solid k-button-solid-base customEdit'><span class='k-button-text'>My Edit</span></button>", title:"Custom Edit"},
                { template: "<button class='k-button k-button-md k-rounded-md k-button-solid k-button-solid-base customDelete'><span class='k-button-text'>My Delete</span></button>", title:"Custom Delete"},
                { field: "Discontinued", width: "120px" },
                { command: ["edit", "destroy"], title: "&nbsp;", width: "250px" }]
            });
          });
        </script>
    ```

## See Also

* [API Reference of the `editRow` Method](https://docs.telerik.com/kendo-ui/api/javascript/ui/grid/methods/editrow).
* [API Reference of the `removeRow` Method](https://docs.telerik.com/kendo-ui/api/javascript/ui/grid/methods/removerow).
* [API Reference of the `columns.template` Property](https://docs.telerik.com/kendo-ui/api/javascript/ui/grid/configuration/columns.template).
* [Working with Templates in Kendo UI](https://docs.telerik.com/kendo-ui/framework/templates/overview)
