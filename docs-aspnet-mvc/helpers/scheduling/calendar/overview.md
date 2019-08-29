---
title: Overview
page_title: Calendar | Telerik UI for ASP.NET MVC HTML Helpers
description: "Get started with the server-side wrapper for the Kendo UI Calendar widget for ASP.NET MVC."
slug: overview_calendarhelper_aspnetmvc
position: 1
---

# Calendar HtmlHelper Overview

The Calendar HtmlHelper extension is a server-side wrapper for the [Kendo UI Calendar](https://demos.telerik.com/kendo-ui/calendar/index) widget.

## Configuration

Below are listed the steps for you to follow when configuring the Kendo UI Calendar.

1. Make sure you followed all the steps from the [introductory article on Telerik UI for ASP.NET MVC]({% slug overview_aspnetmvc %}).
1. Create a new action method which renders the view.

        public ActionResult Index()
        {
            return View();
        }

1. Add a Calendar.

    ```ASPX
        <%: Html.Kendo().Calendar()
            .Name("calendar") // The name of the Calendar is mandatory. It specifies the "id" attribute of the widget.
            .Min(new DateTime(2010, 1, 1, 10, 0, 0)) // Set the min time of the Calendar.
            .Max(new DateTime(2010, 1, 1, 20, 0, 0)) // Set the min date of the Calendar.
            .Value(DateTime.Now) // Set the value of the Calendar.
        %>
    ```
    ```Razor
        @(Html.Kendo().Calendar()
            .Name("calendar") // The name of the Calendar is mandatory. It specifies the "id" attribute of the widget.
            .Min(new DateTime(2010, 1, 1, 10, 0, 0)) // Set the min time of the Calendar.
            .Max(new DateTime(2010, 1, 1, 20, 0, 0)) // Set the min date of the Calendar.
            .Value(DateTime.Now) // Set the value of the Calendar.
        )
    ```

## Event Handling

You can subscribe to all Calendar [events](http://docs.telerik.com/kendo-ui/api/javascript/ui/calendar#events).

### By Handler Name

The following example demonstrates how to subscribe to events by a handler name.

```ASPX
    <%: Html.Kendo().Calendar()
        .Name("calendar")
        .Events(e => e
            .Change("calendar_change")
            .Navigate("calendar_navigate")
        )
    %>
    <script>
        function calendar_navigate() {
            // Handle the navigate event.
        }

        function calendar_change() {
            // Handle the change event.
        }
    </script>
```
```Razor
    @(Html.Kendo().Calendar()
        .Name("calendar")
        .Events(e => e
            .Change("calendar_change")
            .Navigate("calendar_navigate")
        )
    )
    <script>
        function calendar_navigate() {
            // Handle the navigate event.
        }

        function calendar_change() {
            // Handle the change event.
        }
    </script>
```

### By Template Delegate

The following example demonstrates how to subscribe to events by a template delegate.

```Razor
    @(Html.Kendo().Calendar()
        .Name("calendar")
        .Events(e => e
            .Change(@<text>
            function() {
                // Handle the change event inline.
            }
            </text>)
            .Navigate(@<text>
            function() {
                // Handle the navigate event inline.
            }
            </text>)
        )
    )
```

## Reference

### Existing Instances

To reference an existing Kendo UI Calendar instance, use the [`jQuery.data()`](http://api.jquery.com/jQuery.data/) configuration option. Once a reference is established, use the [Calendar API](http://docs.telerik.com/kendo-ui/api/javascript/ui/calendar#methods) to control its behavior.

    // Place the following after the Calendar for ASP.NET MVC declaration.
    <script>
        $(function() {
            // The Name() of the Calendar is used to get its client-side instance.
            var calendar = $("#calendar").data("kendoCalendar");
        });
    </script>

## See Also

* [Telerik UI for ASP.NET MVC API Reference: CalendarBuilder](http://docs.telerik.com/aspnet-mvc/api/Kendo.Mvc.UI.Fluent/CalendarBuilder)
* [Overview of Telerik UI for ASP.NET MVC]({% slug overview_aspnetmvc %})
* [Fundamentals of Telerik UI for ASP.NET MVC]({% slug fundamentals_aspnetmvc %})
* [Scaffolding in Telerik UI for ASP.NET MVC]({% slug scaffolding_aspnetmvc %})
* [Overview of the Kendo UI Calendar Widget](http://docs.telerik.com/kendo-ui/controls/scheduling/calendar/overview)
* [Telerik UI for ASP.NET MVC API Reference Folder](http://docs.telerik.com/aspnet-mvc/api/Kendo.Mvc/AggregateFunction)
* [Telerik UI for ASP.NET MVC HtmlHelpers Folder]({% slug overview_autocompletehelper_aspnetmvc %})
* [Tutorials on Telerik UI for ASP.NET MVC]({% slug overview_timeefficiencyapp_aspnetmvc6 %})
* [Telerik UI for ASP.NET MVC Troubleshooting]({% slug troubleshooting_aspnetmvc %})