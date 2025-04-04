---
title: Calendar
page_title: Configuration, methods and events of Kendo UI Calendar
description: Find out how to successfully configure calendar UI component, how to use methods to get the max value of the calendar and navigate easily.
res_type: api
component: calendar
---

# kendo.ui.Calendar

Represents the Kendo UI Calendar widget. Inherits from [Widget](/api/javascript/ui/widget).

## Configuration

### allowReverse `Boolean` *(default: false)*

Enables the user to select an end date that is before the start date. This option is available only when the [`selectable`](/api/javascript/ui/calendar/configuration/selectable) configuration is set to **range**.

#### Example - enable reverse selection

    <div id="calendar"></div>
    <script>
        $("#calendar").kendoCalendar({
            selectable: "range",
            allowReverse: true,
            showOtherMonthDays: false
        });
    </script>

### centuryCellsFormat `String`*(default: "long")*

 Specifies the format of the century cells.

* `"long"` - The cells will display a decade range **2000-2009**, **2010-2019**.
* `"short"` - The cells will display just the starting year of the decade **2000**, **2010**.

#### Example - render the short version of the century cells

    <div id="calendar"></div>
    <script>
        $("#calendar").kendoCalendar({
            centuryCellsFormat: "short",
            start: "century"
        });
    </script>

### componentType `String`*(default: "classic")*

 Specifies the component type of the widget.

* `"classic"` - Uses the standard rendering of the widget.
* `"modern"` - Uses new rendering with a fresh and modern look and feel.

#### Example - specify modern component type

    <div id="calendar"></div>
    <script>
        $("#calendar").kendoCalendar({
            componentType: "modern"
        });
    </script>

### culture `String`*(default: "en-US")*

 Specifies the culture info used by the widget.

#### Example - specify German culture internationalization

    <!--
        TODO: Add the kendo.culture.de-DE.min.js file as it is required!

        Here is a sample script tag:
        <script src="https://kendo.cdn.telerik.com/{kendo version}/js/cultures/kendo.culture.de-DE.min.js"></script>

        For more information check this help topic:
        https://docs.telerik.com/kendo-ui/framework/globalization/overview
    -->

    <div id="calendar"></div>
    <script>
        $("#calendar").kendoCalendar({
            culture: "de-DE"
        });
    </script>

### dates `Array`

 Specifies a list of dates, which will be passed to the month template.

#### Example - specify a list of dates

    <div id="calendar"></div>
    <script>
        $("#calendar").kendoCalendar({
            value: new Date(2000, 10, 1),
            dates: [
                new Date(2000, 10, 10, 10, 0, 0),
                new Date(2000, 10, 10, 30, 0)
            ] //can manipulate month template depending on this array.
        });
    </script>

### depth `String`

Specifies the navigation depth. The following
settings are available for the **depth** value:

* `"month"` - Shows the days of the month.
* `"year"` - Shows the months of the year.
* `"decade"` - Shows the years of the decade.
* `"century"` - Shows the decades from the century.

> Note the option will not be applied if **start** option is *lower* than **depth**. Always set both and **start** and **depth** options.

#### Example - set navigation depth of the calendar

    <div id="calendar"></div>
    <script>
        $("#calendar").kendoCalendar({
            depth: "year"
        });
    </script>

### disableDates `Array|Function` *(default: null)*

An array or function that will be used to determine which dates to be disabled in the calendar.

#### Example - specify an array of days to be disabled

    <div id="calendar"></div>
    <script>
    $("#calendar").kendoCalendar({
		value: new Date(),
		disableDates: ["we", "th"],
    });
    </script>

#### Example - specify an array of dates to be disabled

    <div id="calendar"></div>
    <script>
    $("#calendar").kendoCalendar({
		value: new Date(2015,9,3),
        disableDates: [new Date(2015,9,12), new Date(2015,9,22)]
    });
    </script>

you can also pass a function that will be dynamically resolved for each date of the calendar. Note that when the function returns true, the date will be disabled.

#### Example - use a function to disabled dates

    <div id="calendar"></div>
    <script>
    $("#calendar").kendoCalendar({
		value: new Date(),
		disableDates: function (date) {
			var disabled = [13,14,20,21];
			if (date && disabled.indexOf(date.getDate()) > -1 ) {
				return true;
			} else {
				return false;
			}
		}
	});
    </script>

note that a check for an empty `date` is needed, as the widget can work with a null value as well.

> This functionality was added with the Q1 release of 2016.

### footer `String|Function`

 The [template](/api/javascript/kendo/methods/template) which renders the footer. If false, the footer will not be rendered.

#### Example - specify footer template as a function

    <div id="calendar"></div>
    <script id="footer-template" type="text/x-kendo-template">
        Today - #: kendo.toString(data, "d") #
    </script>
    <script>
        $("#calendar").kendoCalendar({
            footer: kendo.template($("#footer-template").html())
        });
    </script>

#### Example - specify footer template as a string

    <div id="calendar"></div>
    <script>
        $("#calendar").kendoCalendar({
            footer: "Today - #: kendo.toString(data, 'd') #"
        });
    </script>

### format `String`*(default: "M/d/yyyy")*

 Specifies the format, which is used to parse value set with value() method.

#### Example - specify a custom date format

    <div id="calendar"></div>
    <script>
        $("#calendar").kendoCalendar({
            format: "yyyy/MM/dd"
        });
    </script>

### max `Date`*(default: Date(2099, 11, 31))*

 Specifies the maximum date, which the calendar can show.

#### Example - specify the maximum date

    <div id="calendar"></div>
    <script>
        $("#calendar").kendoCalendar({
            max: new Date(2013, 0, 1) // set the max date to Jan 1st, 2013
        });
    </script>

### messages `Object`

Allows localization of the strings that are used in the widget.

#### Example

    <div id="calendar"></div>
    <script>
    $("#calendar").kendoCalendar({
        "weekNumber": true,
        "messages": {
            "weekColumnHeader": "W"
        }
     })
    </script>

### messages.weekColumnHeader `String` *(default: "")*

Allows customization of the week column header text. Set the value to make the widget compliant with web accessibility standards.

#### Example

    <div id="calendar"></div>
    <script>
    $("#calendar").kendoCalendar({
        "weekNumber": true,
        "messages": {
            "weekColumnHeader": "W"
        }
     })
    </script>

### messages.navigateTo `String` *(default: "Navigate to ")*

Allows customization of the "Navigate to " text that would be used for `title` attribute of the Calendar title in the header. The label is also a button allowing navigation to parent view.

#### Example

    <div id="calendar"></div>
    <script>
    $("#calendar").kendoCalendar({
        "weekNumber": true,
        "messages": {
            "navigateTo": "Go to "
        }
     })
    </script>

### messages.parentViews `Object`

Allows customization of names of the views used in the `title` attribute of the Calendar title in the header. The label is also a button allowing navigation to parent view.

### messages.parentViews.month `String` *(default: "year view")*

Allows customization of parent view name used in the `title` attribute of the Calendar title when in Month view.

#### Example

    <div id="calendar"></div>
    <script>
    $("#calendar").kendoCalendar({
        "weekNumber": true,
        "messages": {
            "parentViews": {
                month: "parent year"
            }
        }
     })
    </script>

### messages.parentViews.year `String` *(default: "decade view")*

Allows customization of parent view name used in the `title` attribute of the Calendar title when in Year view.

#### Example

    <div id="calendar"></div>
    <script>
    $("#calendar").kendoCalendar({
        "weekNumber": true,
        "messages": {
            "parentViews": {
                year: "parent decade"
            }
        }
     })
    </script>

### messages.parentViews.decade `String` *(default: "century view")*

Allows customization of parent view name used in the `title` attribute of the Calendar title when in Decade view.

#### Example

    <div id="calendar"></div>
    <script>
    $("#calendar").kendoCalendar({
        "weekNumber": true,
        "messages": {
            "parentViews": {
                decade: "parent century"
            }
        }
     })
    </script>

### messages.today `String` *(default: "Today")*

Allows customization of the text of the Today button present in the widget in its `modern` rendering.

#### Example

    <div id="calendar"></div>
    <script>
    $("#calendar").kendoCalendar({
        componentType: "modern",
        messages: {
            today: "Click me"
        }
     })
    </script>

### min `Date`*(default: Date(1900, 0, 1))*

 Specifies the minimum date, which the calendar can show.

#### Example - specify the minimum date

    <div id="calendar"></div>
    <script>
        // set the min date to Jan 1st, 2011
        $("#calendar").kendoCalendar({
            min: new Date(2011, 0, 1)
        });
    </script>

### month `Object`

 Templates for the cells rendered in "month" view.

### month.content `String`

 The template to be used for rendering the cells in "month" view, which are between the min/max range.
 By default, the widget renders the value of the corresponding day.

#### Example - specify cell template as a string

    <style>
      .exhibition{
        background-color: #9DD0E0;
        color:black;
      }
      .party{
        color: red;
        background-color: #ccc;
      }
    </style>
    <body>

    <div id="calendar"></div>
    <script id="cell-template" type="text/x-kendo-template">
        <div class="#= data.value < 10 ? 'exhibition' : 'party' #">
        #= data.value #
      </div>
    </script>
    <script>
      $("#calendar").kendoCalendar({
        month: {
          content: $("#cell-template").html()
        }
      });
    </script>

### month.weekNumber `String`

 The template to be used for rendering the cells in "week" column. By default, the widget renders the calculated week of the year.
 The properties available in the data object are:

 * currentDate - returns the first date of the current week.
 * weekNumber - calculated week number.

 These properties can be used in the template to make additional calculations.

#### Example - specify week number template as a string

    <style>
      .italic{
        font-style: italic;
      }
    </style>
    <body>

    <div id="calendar"></div>
    <script id="week-template" type="text/x-kendo-template">
       <a class="italic">#= data.weekNumber #</a>
    </script>
    <script>
      $("#calendar").kendoCalendar({
        weekNumber: true,
        month: {
          weekNumber: $("#week-template").html()
        }
      });
    </script>

### month.empty `String`

 The template to be used for rendering the cells in the "month" view, which are not in the min/max range.
 By default, the widget renders an empty string.

#### Example - specify an empty cell template as a string

    <div id="calendar"></div>
    <script>
        $("#calendar").kendoCalendar({
            month: {
               empty: '-'
            }
        });
    </script>

### selectable `String`  *(default: "single")*

By default user is able to select a single date. The property can also be set to **multiple** or **range**. More information about the different selection modes can be found in the [Selection]({% slug overview_kendoui_calendar_widget %}#selection) article.

#### Example - enable the multiple selection

    <div id="calendar"></div>
    <script>
        $("#calendar").kendoCalendar({
            selectable: "multiple"
        });
    </script>

> Check [Selection](https://demos.telerik.com/kendo-ui/calendar/selection) for a live demo.

### selectDates `Array`  *(default: [])*

Specifies which dates to be selected when the calendar is initialized.

> **Important:** This configuration option requires the [selectable](/api/javascript/ui/calendar/configuration/selectable): "multiple" option to be set.

#### Example - set two dates to be selected upon calendar initialization

    <div id="calendar"></div>
    <script>
        $("#calendar").kendoCalendar({
           selectDates: [new Date(2013, 10, 10), new Date(2015, 10, 10)]
        });
    </script>

> Check [Selection](https://demos.telerik.com/kendo-ui/calendar/selection) for a live demo.

### weekNumber `Boolean` *(default: false)*

If set to `true` a week of the year will be shown on the left side of the calendar.

#### Example - enable the week of the year option

    <div id="calendar"></div>
    <script>
        $("#calendar").kendoCalendar({
            weekNumber: true
        });
    </script>

### start `String`*(default: "month")*

Specifies the start view.
The following settings are available for the **start** value:

* `"month"` - Shows the days of the month.
* `"year"` - Shows the months of the year.
* `"decade"` - Shows the years of the decade.
* `"century"` - Shows the decades from the century.

#### Example - specify the initial view, which calendar renders

    <div id="calendar"></div>
    <script>
        $("#calendar").kendoCalendar({
            start: "year"
        });
    </script>

### value `Date`*(default: null)*

 Specifies the selected date.

#### Example - specify the selected value of the widget

    <div id="calendar"></div>
    <script>
        $("#calendar").kendoCalendar({
            value: new Date(2012, 0, 1)
        });
    </script>

### range `Object`*(default: { start: null, end: null })*

Specifies an initial range selection. This option is available only when the [`selectable`](/api/javascript/ui/calendar/configuration/selectable) configuration is set to `range`. 

#### Example - specify the selected range of the component

    <div id="calendar"></div>
    <script>
        $("#calendar").kendoCalendar({
            selectable: "range",
            range: { start: new Date(2024, 3, 3), end: new Date(2024, 3, 13) }
        });
    </script>

### range.start `Date`
Specifies the start date of the range selection.

### range.end `Date`
Specifies the end date of the range selection.

### showOtherMonthDays `Boolean`*(default: true)*

When this configuration is enabled, the calendar will render days from the previous and next months in the current view.

> The `showOtherMonthDays` configuration is not compatible with the [`range`](/api/javascript/ui/calendar/configuration/selectable) selection. It is advised that this property is set to **false** when `selectable` is set to **range**.

#### Example - Hide dates from the other months

    <div id="calendar"></div>
    <script>
        $("#calendar").kendoCalendar({
            showOtherMonthDays: false
        });
    </script>

## Methods

### current

Gets currently focused date.

#### Returns

`Date` The current focused date shown in the calendar.

#### Example
    <div id="calendar"></div>
    <script>
        $("#calendar").kendoCalendar();

        var calendar = $("#calendar").data("kendoCalendar");

        var current = calendar.current(); //will be today, because value is `null`
    </script>

### destroy
Prepares the **Calendar** for safe removal from DOM. Detaches all event handlers and removes jQuery.data attributes to avoid memory leaks. Calls destroy method of any child Kendo widgets.

> **Important:** This method does not remove the Calendar element from DOM.

#### Example
    <div id="calendar"></div>
    <script>
        $("#calendar").kendoCalendar();

        var calendar = $("#calendar").data("kendoCalendar");

        calendar.destroy();
    </script>

### max

Gets/Sets the max value of the calendar.

#### Parameters

##### value `Date | String`

The max date to set.

#### Returns

`Date` The max value of the calendar.

#### Example - get the max value of the calendar

    <div id="calendar"></div>
    <script>
        $("#calendar").kendoCalendar();

        var calendar = $("#calendar").data("kendoCalendar");

        var max = calendar.max();
    </script>

#### Example - set the max value of the calendar

    <div id="calendar"></div>
    <script>
        $("#calendar").kendoCalendar();

        var calendar = $("#calendar").data("kendoCalendar");

        calendar.max(new Date(2100, 0, 1));
    </script>

### min

Gets/Sets the min value of the calendar.

#### Parameters

##### value `Date|String`

The min date to set.

#### Returns

`Date` The min value of the calendar.

#### Example - get the min value of the calendar

    <div id="calendar"></div>
    <script>
        $("#calendar").kendoCalendar();

        var calendar = $("#calendar").data("kendoCalendar");

        var min = calendar.min();
    </script>

#### Example - set the min value of the calendar

    <div id="calendar"></div>
    <script>
        $("#calendar").kendoCalendar();

        var calendar = $("#calendar").data("kendoCalendar");

        calendar.min(new Date(1900, 0, 1));
    </script>

### navigate

Navigates to view.

#### Parameters

##### value `Date`

Desired date.

##### view `String`

Desired view.

#### Example

    <div id="calendar"></div>
    <script>
        $("#calendar").kendoCalendar();

        var calendar = $("#calendar").data("kendoCalendar");

        calendar.navigate(new Date(2012, 0, 1), "year");
    </script>

### navigateDown

Navigates to the lower view.

#### Parameters

##### value `Date`

Desired date.

#### Example

    <div id="calendar"></div>
    <script>
        $("#calendar").kendoCalendar();

        var calendar = $("#calendar").data("kendoCalendar");

        calendar.navigateDown(new Date(2012, 0, 1));
    </script>

### navigateToFuture

Navigates to the future.

#### Example

    <div id="calendar"></div>
    <script>
        $("#calendar").kendoCalendar();

        var calendar = $("#calendar").data("kendoCalendar");

        calendar.navigateToFuture();
    </script>

### navigateToPast

Navigates to the past.

#### Example

    <div id="calendar"></div>
    <script>
        $("#calendar").kendoCalendar();

        var calendar = $("#calendar").data("kendoCalendar");

        calendar.navigateToPast();
    </script>

### navigateUp

Navigates to the upper view.

#### Example

    <div id="calendar"></div>
    <script>
        $("#calendar").kendoCalendar();

        var calendar = $("#calendar").data("kendoCalendar");

        calendar.navigateUp();
    </script>

### selectDates

Gets/Sets the selected dates for the calendar.

> **Important:** This method requires the [selectable](/api/javascript/ui/calendar/configuration/selectable): "multiple" option to be set.

#### Example - gets the selected dates of the widget

    <div id="calendar"></div>
    <script>
        $("#calendar").kendoCalendar({
            selectDates: [new Date(2013, 10, 10), new Date(2015, 10, 10)],
            selectable: "multiple"
        });

        var calendar = $("#calendar").data("kendoCalendar");

        var value = calendar.selectDates();
    </script>

#### Example - sets the value of the widget

    <div id="calendar"></div>
    <script>
        $("#calendar").kendoCalendar({
            selectDates: [new Date(2013, 10, 10), new Date(2015, 10, 10)],
            selectable: "multiple"
        });

        var calendar = $("#calendar").data("kendoCalendar");

        calendar.selectDates([new Date(2016, 10,10), new Date()]);
    </script>

### selectRange

Gets/Sets the selected range for the calendar.

#### Parameters

##### range `Object`

The range to set. It should have a start and end properties with the respective dates.

#### Returns

`Object` The selected range of the calendar. The object has a start and end properties.

> **Important:** This method requires the [selectable](/api/javascript/ui/calendar/configuration/selectable): "range" option to be set.

#### Example - gets the selected range for the widget

    <div id="calendar"></div>
    <script>
        $("#calendar").kendoCalendar({
            range: {
                start: new Date(2018, 9, 10),
                end: new Date(2018, 10, 10),
                target: "start"
            },
            selectable: "range"
        });

        var calendar = $("#calendar").data("kendoCalendar");

        var range = calendar.selectRange();
    </script>

#### Example - sets the range of the widget

    <div id="calendar"></div>
    <script>
        $("#calendar").kendoCalendar({
            selectable: "range"
        });

        var calendar = $("#calendar").data("kendoCalendar");

        calendar.selectRange({ start: new Date(2018, 9, 10), end: new Date(2018, 10, 10), target: "start" });
    </script>

### value

Gets/Sets the value of the calendar.

#### Parameters

##### value `Date|String`

The date to set.

#### Returns

`Date` The value of the calendar.

#### Example - gets the value of the widget

    <div id="calendar"></div>
    <script>
        $("#calendar").kendoCalendar({
            value: new Date(2013, 10, 10)
        });

        var calendar = $("#calendar").data("kendoCalendar");

        var value = calendar.value();
    </script>

#### Example - sets the value of the widget

    <div id="calendar"></div>
    <script>
        $("#calendar").kendoCalendar({
            value: new Date(2013, 10, 10)
        });

        var calendar = $("#calendar").data("kendoCalendar");

        calendar.value(new Date());
    </script>

### view

Gets an instance of the current view used by the calendar.

#### Returns

`Object` The instance of the current view used by the calendar.

#### Example

    <div id="calendar"></div>
    <script>
        $("#calendar").kendoCalendar();

        var calendar = $("#calendar").data("kendoCalendar");

        var view = calendar.view();
    </script>

## Events

### change

Fires when the selected date is changed.

#### Example - subscribe to the "change" event during initialization

    <div id="calendar"></div>
    <script>
        $("#calendar").kendoCalendar({
            change: function() {
                var value = this.value();
	/* The result can be observed in the DevTools(F12) console of the browser. */
                console.log(value); //value is the selected date in the calendar
            }
        });
    </script>

#### Example - subscribe to the "change" event after initialization

    <div id="calendar"></div>
    <script>
        $("#calendar").kendoCalendar();

        var calendar = $("#calendar").data("kendoCalendar");

        calendar.bind("change", function() {
            var value = this.value();
	/* The result can be observed in the DevTools(F12) console of the browser. */
            console.log(value); //value is the selected date in the calendar
        });
    </script>

### navigate

Fires when calendar navigates.

#### Example - subscribe to the "navigate" event during initialization

    <div id="calendar"></div>
    <script>
        $("#calendar").kendoCalendar({
            navigate: function() {
                var view = this.view();
	/* The result can be observed in the DevTools(F12) console of the browser. */
                console.log(view.name); //name of the current view

                var current = this.current();
	/* The result can be observed in the DevTools(F12) console of the browser. */
                console.log(current); //currently focused date
            }
        });
    </script>

#### Example - subscribe to the "navigate" event after initialization

    <div id="calendar"></div>
    <script>
        $("#calendar").kendoCalendar();

        var calendar = $("#calendar").data("kendoCalendar");

        calendar.bind("navigate", function() {
            var view = this.view();
	/* The result can be observed in the DevTools(F12) console of the browser. */
            console.log(view.name); //name of the current view

            var current = this.current();
	/* The result can be observed in the DevTools(F12) console of the browser. */
            console.log(current); //currently focused date
        });
    </script>
