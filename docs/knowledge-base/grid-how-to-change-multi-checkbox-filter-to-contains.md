---
title: Set Multi-Checkbox Filtering to Use contains instead of equalTo
description: Learn how to change the multi-checkbox filtering of the Kendo UI Grid to use contains instead of equalTo.
type: how-to
page_title: Set a Different dataSource for the Multi-Checkbox and contains Filter - Kendo UI for jQuery Data Grid
slug: grid-how-to-change-multi-checkbox-filter-to-contains
tags: grid, filter, multi-checkbox, contains
ticketid: 1132412
res_type: kb
component: grid
---

## Environment

<table>
 <tr>
  <td>Product</td>
  <td>Progress® Kendo UI® Grid for jQuery</td> 
 </tr>
</table>

## Description

A Grid column contains comma-delimited values (`AAA,BBB,CCC`) and uses checkboxes to perform filtering.

How can I set a checkbox for each unique value and filter the data by using `contains` instead of `equalTo`? For example:

```
AAA
BBB
CCC
```

## Solution

The built-in multi-checkbox filtering uses the data from the Grid and the values will match the entire field value.

To customize the filter:

1. Define a custom dataSource for the filter in the column with the unique values.

1. Within the `filter` event of the Grid, modify the filter expression and change them to `contains`.


```dojo
<div id="grid"></div>

<script>
$("#grid").kendoGrid({
  filter: function(e){
    if(e.field == "someField" && e.filter){
    	e.filter.filters.forEach(function(f){
        f.operator = "contains";
      })
    }
  },
  filterMenuOpen: function(e){
    if(e.sender.dataSource.filter()){
      e.sender.dataSource.filter().filters.forEach(function(f){
        if(f.field == "someField"){
          var checkbox = e.container.find("input[value='"+f.value+"']");
          if(!checkbox[0].checked){
          	e.container.find("input[value='"+f.value+"']").click()  
          }          
        }
      })
   }
  },
  columns: [ {
    field: "someField",
    filterable: {
        multi:true,
      dataSource: [ { someField: "AAA" }, { someField: "BBB" }, { someField: "CCC" } ]
    }
  } ],
  filterable: true,
    dataSource: [ { someField: "AAA, BBB" }, { someField: "CCC" } ]
  });

</script>
```

## Additional Scenarios

1. I would like to use `contains` instead of `equalTo` filter in multiple columns. When the [Column Menu](https://docs.telerik.com/kendo-ui/controls/grid/columns/column-menu) is enabled after filtering and opening the column filter again, the checkbox is not selected and shows unchecked. How I can check again the selected values in the filter popup?

### Suggested solution

```dojo
  <div id="grid"></div>
    <script>
      $(document).ready(function () {
        $("#grid").kendoGrid({
          dataSource: {
            transport: {
              read: "https://demos.telerik.com/service/v2/core/Orders"
            },
            schema: {
              model: {
                fields: {
                  OrderID: { type: "number" },
                  ShipCountry: { type: "string" },
                  ShipName: { type: "string" },
                  ShipAddress: { type: "string" }
                }
              }
            },
            pageSize: 30
          },
          height: 550,
          sortable: true,
          filterable: true,
          columnMenu: true,
          filter: function(e){
            if(e.field == "OrderID" && e.filter){
              e.filter.filters.forEach(function(f){
                f.operator = "contains";
              })
            }
          },
          columnMenuOpen: function(e){
            if(e.sender.dataSource.filter()){
              e.sender.dataSource.filter().filters.forEach(function(f){

                if(f.field == "OrderID" || f.field == 'ShipCountry') {
                  var checkbox = e.container.find("input[value='"+f.value+"']");
                  if(checkbox[0] && !checkbox[0].checked){
                    e.container.find("input[value='"+f.value+"']").click()  
                  }          
                }else if(f.filters[0].field == "OrderID" || f.filters[0].field == 'ShipCountry'){
                  var current = f.filters;

                  current.forEach(function(filter){
                    var checkbox2 = e.container.find("input[value='"+filter.value+"']");

                    if(checkbox2.length > 0 && !checkbox2[0].checked){
                      e.container.find("input[value='"+filter.value+"']").click()  
                    } 
                  })
                }
              })
            }
          },
          pageable: true,
          columns: [{
            field: "OrderID",
            filterable: {
              multi:true,
              dataSource: [ { OrderID: 255 }, { OrderID: 25 }, { OrderID: 26 } ]
            }
          } ,{
            field: "ShipName",
            title: "Ship Name",
            width: 300
          },{
            field: "ShipCountry",
            title: "Ship Country",
            width: 300,
            filterable: {
              multi:true
            }
          }]
        });
      });
    </script>
```


2. I would like to keep the filter state active and show the applied initial filter on the grid.

### Suggested solution

It is easiest to add the `k-active` class initially and let the grid with the custom filter handler manage the rest of the state changes.A timeout is needed to accomplish this initial load:

```
  grid.one("dataBound", function(e){
    setTimeout(function(){
        grid.thead.find("[data-field='FirstName']").find(".k-grid-filter-menu").addClass ("k-active");
    });            
  });
```

#### Example

```dojo
  <div id="example">
      <style>
        .k-multicheck-wrap {
          overflow-x: hidden;
        }
      </style>
      <div class="demo-section k-content wide">
        <h4>Server Operations</h4>
        <div id="server"></div>
      </div>
      <script>
        function getFilterValuesForField(expression, field) {
          if (expression.filters) {
            expression.filters = $.grep(expression.filters, function (filter) {
              getFilterValuesForField(filter, field);
              if (filter.filters) {
                return filter.filters.length;
              } else {
                return filter.field == field;
              }
            });
          }
        }

        function flatFilterValues(expression) {
          if (expression.logic == "and" && expression.filters.length > 1) {
            return [];
          }
          if (expression.filters) {
            return $.map(expression.filters, function (filter) {
              return flatFilterValues(filter);
            });
          } else if (expression.value !== undefined) {
            return [expression.value];
          } else {
            return [];
          }
        }

        var myFilter = function (e) {
          e.preventDefault();
          e.stopPropagation();

          var expression = { logic: "or" };

          var that = this;
          expression.filters = $.map(this.form.find(":checkbox:checked:not(.k-check-all)"), function (item) {
            return { value: $(item).val(), operator: "contains", field: that.field };
          });

          expression = this._merge(expression);
          if (expression.filters.length) {
            this.dataSource.filter(expression);
          }

          this._closeForm();
        }

        var myGetFilterArray = function () {
          var expression = $.extend(true, {}, { filters: [], logic: "and" }, this.dataSource.filter());
          getFilterValuesForField(expression, this.field);
          var flatValues = flatFilterValues(expression);
          return flatValues;
        }
        $(document).ready(function() {
          var crudServiceBaseUrl = "https://demos.telerik.com/service/v2/";



          var grid = $("#server").kendoGrid({
            filterMenuInit:function(e){
              var filterMultiCheck = this.thead.find("[data-field=" + e.field + "]").data("kendoFilterMultiCheck");
              if (filterMultiCheck) {
                filterMultiCheck.getFilterArray = myGetFilterArray
                filterMultiCheck.form.off('submit').on('submit', $.proxy(myFilter, filterMultiCheck));
              }
            },
            dataSource: {
              type: "odata-v4",
              transport: {
                read: crudServiceBaseUrl + "odata/Employees"
              },
              pageSize: 20,
              serverPaging: true,
              serverSorting: true,
              serverFiltering: true,
              filter: { filters: [{value: "Nancy", operator: "contains", field: "FirstName"}], logic: "or"}
            },
            editable: true,
            filterable: true,
            pageable: true,
            columns: [{
                field: "FirstName",
                title: "First Name",
                filterable: {
                  multi: true ,
                  //when serverPaging of the Grid is enabled, dataSource should be provided for all the Filterable Multi Check widgets
                  dataSource: {
                    transport: {
                      read: {
                        url: crudServiceBaseUrl + "Employees/Unique"
                        data: {
                          field: "FirstName"
                        }
                      }
                    }
                  }
                },
                width: "220px"
              }, {
                field: "LastName",
                filterable: { 
                  dataSource: {
                    transport: {
                      read: {
                        url: crudServiceBaseUrl + "Employees/Unique"
                        data: {
                          field: "LastName"
                        }
                      }
                    }
                  },
                  multi: true 
                },
                title: "Last Name",
                width: "220px"
              },{
                field: "Country",
                filterable: {
                  multi: true,
                  dataSource: {
                    transport: {
                      read: {
                        url: crudServiceBaseUrl + "Employees/Unique"
                        data: {
                          field: "Country"
                        }
                      }
                    }
                  },
                  itemTemplate: function(e) {
                    if (e.field == "all") {
                      //handle the check-all checkbox template
                      return "<div><label><strong><input type='checkbox' />#= all#</strong></label></div>";
                    } else {
                      //handle the other checkboxes
                      return "<span><label><input type='checkbox' name='" + e.field + "' value='#=Country#'/><span>#= Country #</span></label></span>"
                    }
                  }
                },
                width: "220px"
              }, {
                field: "City",
                filterable: {
                  multi: true,
                  dataSource: [{
                    City: "Seattle",
                  },{
                    City: "Tacoma",
                  },{
                    City: "Kirkland",
                  },{
                    City: "Redmond",
                  },{
                    City: "London"
                  }],
                  checkAll: false
                },
                width: "220px"
              }, {
                filterable: {
                  multi: true,
                  dataSource: {
                    transport: {
                      read: {
                        url: crudServiceBaseUrl + "Employees/Unique"
                        data: {
                          field: "Title"
                        }
                      }
                    }
                  }
                },
                field: "Title"
              }
            ]
          }).data("kendoGrid");
          
          grid.one("dataBound", function(e){
            setTimeout(function(){
            	grid.thead.find("[data-field='FirstName']").find(".k-grid-filter-menu").addClass("k-active");
            });          	
          });
        });
      </script>
    </div>
```

