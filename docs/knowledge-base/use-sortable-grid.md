---
title: Reorder Rows in Grids by Using the Sortable
page_title: Reorder Rows in Grids by Using the Sortable
description: "Learn how to use the Kendo UI Sortable widget with a Kendo UI Grid either in editable or non-editable modes."
previous_url: /controls/interactivity/sortable/how-to/reorder-grid-rows, /controls/interactivity/sortable/how-to/batch-editable-grid, /web/sortable/how-to/angularjs-reorder-grid-rows, /controls/interactivity/sortable/how-to/use-sortable-grid
slug: howto_usesortablewithgrid_inincellediting_sortable
tags: telerik, kendo, jquery, sortable, reorder, rows, in, grids
component: sortable
type: how-to
res_type: kb
---

## Environment

<table>
 <tr>
  <td>Product</td>
  <td>Progress® Kendo UI® Sortable for jQuery</td>
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

How can I use the Kendo UI Sortable widget with a Kendo UI Grid either in an editable or in a non-editable mode?

## Solution

The following examples demonstrate how to achieve the desired scenarios.

## Non-Editable Grid Mode

The following example demonstrates how to reorder the rows of a Kendo UI Grid in a non-editable mode by using the Kendo UI Sortable.

```dojo
    <div id="grid" style="width: 800px; margin: 0 auto;"></div>
    <script src="https://demos.telerik.com/kendo-ui/content/shared/js/products.js"></script>
    <script>
      var grid = $("#grid").kendoGrid({
        dataSource: {
          data: products,
          schema: {
            model: {
              fields: {
                ProductName: { type: "string" },
                UnitPrice: { type: "number" },
                UnitsInStock: { type: "number" },
                Discontinued: { type: "boolean" }
              }
            }
          },
          pageSize: 16
        },
        scrollable: false,
        columns: [
          "ProductName",
          { field: "UnitPrice", title: "Unit Price", format: "{0:c}", width: "130px" },
          { field: "UnitsInStock", title: "Units In Stock", width: "130px" },
          { field: "Discontinued", width: "130px" }
        ]
      }).data("kendoGrid");

      grid.table.kendoSortable({
        filter: ">tbody >tr",
        hint: function(element) { // Customize the hint.
          var table = $('<table style="width: 600px;" class="k-grid k-widget"></table>'),
              hint;

          table.append(element.clone()); // Append the dragged element.
          table.css("opacity", 0.7);

          return table; // Return the hint element.
        },
        cursor: "move",
        placeholder: function(element) {
          return $('<tr colspan="4" class="placeholder"></tr>');
        },
        change: function(e) {
          var skip = grid.dataSource.skip(),
              oldIndex = e.oldIndex + skip,
              newIndex = e.newIndex + skip,
              data = grid.dataSource.data(),
              dataItem = grid.dataSource.getByUid(e.item.data("uid"));

          grid.dataSource.remove(dataItem);
          grid.dataSource.insert(newIndex, dataItem);
        }
      });
    </script>
    <style>
      .k-grid tbody tr {
        cursor: move;
      }

      .placeholder {
        outline-style: dashed;
        outline-width: 1px;
        outline-color: red;
      }
    </style>
```

## Editable Grid Mode

The following example demonstrates how to reorder the rows of a Kendo UI Grid in an in-cell editable mode by using the Sortable.

The main milestones of the approach are the following:

* The standard HTML inputs that are used as editors need to have a `data-value-update="input"` attribute. If this attribute is not attached to the HTML element, the Grid will not update its data.

    ```
     var textEditor = function (container, options) {
       $('<input data-value-update="input" data-bind="value:' + options.field + '"/>')
         .appendTo(container);
     };
    ```

* If you use a Kendo UI widget as an editor, manually trigger its `change` event in the `edit` event of the Grid.

    ```
     // The Kendo UI widget that is used as an editor.
     var numericEditor = function (container, options) {
       $('<input data-role="numerictextbox" data-bind="value:' + options.field + '"/>')
         .appendTo(container);
     };
     
     // The Grid edit event handler.
     edit: function(e) {
       var input = e.container.find("[data-role=numerictextbox]");
       var widget = input.data("kendoNumericTextBox");
       var model = e.model;

       input.on("keyup", function(e) {
         if(e.key === kendo.culture().numberFormat["."]) {
           // For the Kendo UI NumericTextBox only.
           return;
         }
         widget.value(input.val());
         widget.trigger("change");
       });
     },
    ```

> * For simplicity, the demo uses local data with a dummy **Order** field. This may not be the case in a real-world scenario.
> * The `change` event handler of the Sortable updates the **Order** field, which is a sample implementation. The `change` event handler has to be modified to fit your real-world scenario.

```dojo
<script src="https://demos.telerik.com/kendo-ui/content/shared/js/products.js"></script>

 <div id="example">
   <div id="grid"></div>

   <script>

     $(document).ready(function() {

       var textEditor = function (container, options) {
         $('<input data-value-update="input" data-bind="value:' + options.field + '"/>')
           .appendTo(container);
       };

       var numericEditor = function (container, options) {
         $('<input data-role="numerictextbox" data-bind="value:' + options.field + '"/>')
           .appendTo(container);
       };

       // Initialize the Order product field.
       for(var j=0; j < products.length; j++){
         products[j].Order = j;
       }

       var grid = $("#grid").kendoGrid({
         dataSource: {
           data: products,
           schema: {
             model: {
               id: "ProductID",
               fields: {
                 ProductName: { type: "string" },
                 UnitPrice: { type: "number" },
                 UnitsInStock: { type: "number" },
                 Discontinued: { type: "boolean" }
               }
             }
           },
           sort: { field: "Order", dir: "asc" }
         },
         scrollable: false,
         pageable: false,
         editable: true,
         edit: function(e) {
           var input = e.container.find("[data-role=numerictextbox]");
           var widget = input.data("kendoNumericTextBox");
           var model = e.model;

           if(widget) {
                widget.bind("spin", function(e) {
                  e.sender.trigger("change");
                });
              }

           input.on("keyup", function(e) {
             if(e.key === kendo.culture().numberFormat["."]) {
                // For the Kendo UI NumericTextBox only.
               return;
             }
             widget.value(input.val());
             widget.trigger("change");
           });
         },
         toolbar: ["cancel"],
         columns: [
           { field: "Order" },
           { field: "ProductName", editor: textEditor},
           { field: "UnitPrice", title: "Unit Price", format: "{0:c}", width: "130px",
            editor: numericEditor},
           { field: "UnitsInStock", title: "Units In Stock", width: "130px",editor: numericEditor },
           { field: "Discontinued", width: "130px" }
         ]
       }).data("kendoGrid");

       grid.table.kendoSortable({
         hint: hintElement,
         cursor: "move",
         placeholder: function(element) {
           return element.clone().addClass("k-hover").css("opacity", 0.65);
         },
         container: "#grid tbody",
         filter: ">tbody >tr",
         change: function(e) {
           var grid = $("#grid").data("kendoGrid"),
               oldIndex = e.oldIndex , // The old position.
               newIndex = e.newIndex , // The new position.
               view = grid.dataSource.view(),
               dataItem = grid.dataSource.getByUid(e.item.data("uid")); // Retrieve the moved dataItem.

           dataItem.Order = newIndex; // Update the order
           dataItem.dirty = true;

           // Shift the order of the records.
           if (oldIndex < newIndex) {
             for (var i = oldIndex + 1; i <= newIndex; i++) {
               view[i].Order--;
               view[i].dirty = true;
             }
           } else {
             for (var i = oldIndex - 1; i >= newIndex; i--) {
               view[i].Order++;
               view[i].dirty = true;
             }
           }

           grid.dataSource.sync();
         }
       });
     });

     function hintElement(element) { // Customize the hint.

       var grid = $("#grid").data("kendoGrid"),
           table = grid.table.clone(), // Clone the Grid table.
           wrapperWidth = grid.wrapper.width(), // Get the Grid width.
           wrapper = $("<div class='k-grid k-widget'></div>").width(wrapperWidth),
           hint;

       table.find("thead").remove(); // Remove the Grid header from the hint.
       table.find("tbody").empty(); // Remove the existing rows from the hint.
       table.wrap(wrapper); // Wrap the table
       table.append(element.clone().removeAttr("uid")); // Append the dragged element.

       hint = table.parent(); // Get the wrapper.

       return hint; // Return the hint element.
     }
   </script>

   <style>
     .k-grid tbody tr {
       cursor: move;
     }
   </style>
 </div>
```

## See Also

* [Basic Usage of the Sortable (Demo)](https://demos.telerik.com/kendo-ui/sortable/index)
* [JavaScript API Reference of the Sortable](/api/javascript/ui/sortable)
* [Reorder rows in grid with locked columns]({% slug grid-drag-drop-with-locked-columns %})
