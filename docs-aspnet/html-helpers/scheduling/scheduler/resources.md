---
title: Resources
page_title: Resources
description: "Get started with the Scheduler component for {{ site.framework }} and learn how to configure its resources."
previous_url: /helpers/scheduling/scheduler/mvc-scheduler-resources
slug: htmlhelpers_scheduler_resources_aspnetcore
position: 4
---

# Resources

The Scheduler allows you to assign events to a set of predefined resources.

You can assign multiple instances of the same resource type to a single Scheduler event and also assign resources through the Scheduler event edit form. For a runnable example, refer to the [demo on setting the Scheduler resources](https://demos.telerik.com/{{ site.platform }}/scheduler/resources).

## Single Instance Resources

A single instance resource is a resource of which only one instance can be assigned to a Scheduler event&mdash;for example, a Scheduler which displays a list of meetings (Scheduler events) which are held in two rooms (resources). Since a meeting can be held in one room, it can be considered a single resource. If a resource instance has its `color` field set, the Scheduler will use this value as a background for all events that are assigned to that instance.

```HtmlHelper
    @(Html.Kendo().Scheduler<Kendo.Mvc.Examples.Models.Scheduler.MeetingViewModel>()
        .Name("scheduler")
        .Date(new DateTime(2013, 6, 13))
        .StartTime(new DateTime(2013, 6, 13, 7, 00, 00))
        .Height(600)
        .Views(views =>
        {
            views.DayView();
            views.WeekView(weekView => weekView.Selected(true));
        })
        .Timezone("Etc/UTC")
        .Resources(resource =>
        {
            resource.Add(m => m.RoomID) // The field of the Scheduler event which contains the resource identifier.
                .Title("Room") // The label displayed in the Scheduler edit form for this resource.
                .DataTextField("Text")
                .DataValueField("Value")
                .DataColorField("Color")
                .BindTo(new[] {
                        new { Text = "Meeting Room 101", Value = 1, Color = "#6eb3fa" },
                        new { Text = "Meeting Room 201", Value = 2, Color = "#f58a8a" }
                });
        })
        .DataSource(d => d
                .Model(m =>
                {
                    m.Id(f => f.MeetingID);
                    m.Field(f => f.Title).DefaultValue("No title");
                    m.RecurrenceId(f => f.RecurrenceID);
                })
            .Read("Meetings_Read", "Scheduler")
            .Create("Meetings_Create", "Scheduler")
            .Destroy("Meetings_Destroy", "Scheduler")
            .Update("Meetings_Update", "Scheduler")
        )
    )
```
{% if site.core %}
```TagHelper
        @{
            var roomsData = new[]
            {
                new { Text = "Meeting Room 101", Value = 1, Color = "#6eb3fa" },
                new { Text = "Meeting Room 201", Value = 2, Color = "#f58a8a" }
            };

            string defaultTitle = "No Title";
        }
        <kendo-scheduler name="scheduler" 
            date="new DateTime(2021, 6, 13)" 
            start-time="new DateTime(2021, 6, 13, 7, 00, 00)"
            timezone="Etc/UTC"
            height="600">
			<views>
                <view type="day"></view>
                <view type="week" selected="true"></view>
            </views>
			<resources>
                <resource field="RoomID" title="Room" datatextfield="Text" datavaluefield="Value" datacolorfield="Color" bind-to="@roomsData"></resource>
            </resources>
            <scheduler-datasource type="@DataSourceTagHelperType.Ajax">
                <transport>
                    <read url="@Url.Action("Meetings_Read", "Scheduler")" />
                    <create url="@Url.Action("Meetings_Create", "Scheduler")" />
                    <destroy url="@Url.Action("Meetings_Destroy", "Scheduler")" />
                    <update url="@Url.Action("Meetings_Update", "Scheduler")" />
                </transport>
                <schema data="Data" total="Total" errors="Errors">
                    <scheduler-model id="MeetingID">
                        <fields>
                            <field name="MeetingID" type="number"></field>
                            <field name="title" from="Title" type="string" default-value="@defaultTitle"></field>
                            <field name="start" from="Start" type="date"></field>
                            <field name="end" from="End" type="date"></field>
                            <field name="description" from="Description" type="string"></field>
                            <field name="recurrenceId" from="RecurrenceID" type="number" default-value=null></field>
                            <field name="recurrenceRule" from="RecurrenceRule" type="string" ></field>
                            <field name="recurrenceException" from="RecurrenceException" type="string"></field>
                            <field name="startTimezone" from="StartTimezone" type="string"></field>
                            <field name="endTimezone" from="EndTimezone" type="string"></field>
							<field name="RoomID" type="number" default-value="1"></field>
                            <field name="isAllDay" from="IsAllDay" type="boolean"></field>
                        </fields>
                    </scheduler-model>
                </schema>
            </scheduler-datasource>
        </kendo-scheduler>
```
{% endif %}

## Multiple Instance Resources

A multiple instance resource is a resource of which more than one instance can be assigned to a Scheduler event&mdash;for example, a Scheduler which displays a list of meetings and the meeting attendees. Since more than one attendee can participate in a meeting, it can be considered a multiple instance resource. The Scheduler uses the `color` of the first resource instance as a background for its events.

```HtmlHelper
    @(Html.Kendo().Scheduler<Kendo.Mvc.Examples.Models.Scheduler.MeetingViewModel>()
        .Name("scheduler")
        .Date(new DateTime(2013, 6, 13))
        .StartTime(new DateTime(2013, 6, 13, 7, 00, 00))
        .Height(600)
        .Views(views =>
        {
            views.DayView();
            views.WeekView(weekView => weekView.Selected(true));
            views.MonthView();
            views.AgendaView();
            views.TimelineView();
        })
        .Timezone("Etc/UTC")
        .Resources(resource =>
        {
            resource.Add(m => m.Attendees) // The field of the Scheduler event, which contains the resource identifier.
                .Title("Attendees") // The label displayed in the Scheduler edit form for this resource.
                .Multiple(true) // Indicate that this is a multiple instance resource.
                .DataTextField("Text")
                .DataValueField("Value")
                .DataColorField("Color")
                .BindTo(new[] {
                        new { Text = "Alex", Value = 1, Color = "#f8a398" },
                        new { Text = "Bob", Value = 2, Color = "#51a0ed" },
                        new { Text = "Charlie", Value = 3, Color = "#56ca85" }
                });
        })
        .DataSource(d => d
                .Model(m =>
                {
                    m.Id(f => f.MeetingID);
                    m.Field(f => f.Title).DefaultValue("No title");
                    m.RecurrenceId(f => f.RecurrenceID);
                })
            .Read("Meetings_Read", "Scheduler")
            .Create("Meetings_Create", "Scheduler")
            .Destroy("Meetings_Destroy", "Scheduler")
            .Update("Meetings_Update", "Scheduler")
        )
    )
```
{% if site.core %}
```TagHelper
        @{
            var attendeesData = new[]
            {
                new { Text = "Alex", Value = 1, Color = "#f8a398" },
                new { Text = "Bob", Value = 2, Color = "#51a0ed" },
                new { Text = "Charlie", Value = 3, Color = "#56ca85" }
            };

            string defaultTitle = "No Title";
        }
        <kendo-scheduler name="scheduler" 
            date="new DateTime(2021, 6, 13)" 
            start-time="new DateTime(2021, 6, 13, 7, 00, 00)"
            timezone="Etc/UTC"
            height="600">
			<views>
                <view type="day"></view>
                <view type="week" selected="true"></view>
                <view type="month"></view>
                <view type="agenda"></view>
                <view type="timeline"></view>
            </views>
			<resources>
                <resource field="Attendees" title="Attendees" multiple="true" datatextfield="Text" datavaluefield="Value" datacolorfield="Color" bind-to="@attendeesData"></resource>
            </resources>
            <scheduler-datasource type="@DataSourceTagHelperType.Ajax">
                <transport>
                    <read url="@Url.Action("Meetings_Read", "Scheduler")" />
                    <create url="@Url.Action("Meetings_Create", "Scheduler")" />
                    <destroy url="@Url.Action("Meetings_Destroy", "Scheduler")" />
                    <update url="@Url.Action("Meetings_Update", "Scheduler")" />
                </transport>
                <schema data="Data" total="Total" errors="Errors">
                    <scheduler-model id="MeetingID">
                        <fields>
                            <field name="MeetingID" type="number"></field>
                            <field name="title" from="Title" type="string" default-value="@defaultTitle"></field>
                            <field name="start" from="Start" type="date"></field>
                            <field name="end" from="End" type="date"></field>
                            <field name="description" from="Description" type="string"></field>
                            <field name="recurrenceId" from="RecurrenceID" type="number" default-value=null></field>
                            <field name="recurrenceRule" from="RecurrenceRule" type="string" ></field>
                            <field name="recurrenceException" from="RecurrenceException" type="string"></field>
                            <field name="startTimezone" from="StartTimezone" type="string"></field>
                            <field name="endTimezone" from="EndTimezone" type="string"></field>
                            <field name="isAllDay" from="IsAllDay" type="boolean"></field>
                        </fields>
                    </scheduler-model>
                </schema>
            </scheduler-datasource>
        </kendo-scheduler>
```
{% endif %}

## Multiple Resource Types

The Scheduler supports multiple resource types. For example, you can combine single and multiple instance resources at the same time.

```HtmlHelper
    @(Html.Kendo().Scheduler<Kendo.Mvc.Examples.Models.Scheduler.MeetingViewModel>()
        .Name("scheduler")
        .Date(new DateTime(2013, 6, 13))
        .StartTime(new DateTime(2013, 6, 13, 7, 00, 00))
        .Height(600)
        .Views(views =>
        {
            views.DayView();
            views.WeekView(weekView => weekView.Selected(true));
            views.MonthView();
            views.AgendaView();
            views.TimelineView();
        })
        .Timezone("Etc/UTC")
        .Resources(resource =>
        {
            // First resource type definition
            resource.Add(m => m.RoomID) // The field of the Scheduler event, which contains the resource identifier.
                .Title("Room") // The label displayed in the Scheduler edit form for this resource.
                .DataTextField("Text")
                .DataValueField("Value")
                .DataColorField("Color")
                .BindTo(new[] {
                        new { Text = "Meeting Room 101", Value = 1, Color = "#6eb3fa" },
                        new { Text = "Meeting Room 201", Value = 2, Color = "#f58a8a" }
                });
            // Second resource type definition
            resource.Add(m => m.Attendees) // The field of the Scheduler event which contains the resource identifier.
                .Title("Attendees") // The label displayed in the Scheduler edit form for this resource.
                .Multiple(true) // Indicate that this is a multiple instance resource.
                .DataTextField("Text")
                .DataValueField("Value")
                .DataColorField("Color")
                .BindTo(new[] {
                        new { Text = "Alex", Value = 1, Color = "#f8a398" },
                        new { Text = "Bob", Value = 2, Color = "#51a0ed" },
                        new { Text = "Charlie", Value = 3, Color = "#56ca85" }
                });
        })
        .DataSource(d => d
                .Model(m =>
                {
                    m.Id(f => f.MeetingID);
                    m.Field(f => f.Title).DefaultValue("No title");
                    m.RecurrenceId(f => f.RecurrenceID);
                })
            .Read("Meetings_Read", "Scheduler")
            .Create("Meetings_Create", "Scheduler")
            .Destroy("Meetings_Destroy", "Scheduler")
            .Update("Meetings_Update", "Scheduler")
        )
    )
```
{% if site.core %}
```TagHelper
        @{
            var roomsData = new[]
            {
                new { Text = "Meeting Room 101", Value = 1, Color = "#6eb3fa" },
                new { Text = "Meeting Room 201", Value = 2, Color = "#f58a8a" }
            };

            var attendeesData = new[]
            {
                new { Text = "Alex", Value = 1, Color = "#f8a398" },
                new { Text = "Bob", Value = 2, Color = "#51a0ed" },
                new { Text = "Charlie", Value = 3, Color = "#56ca85" }
            };

            string defaultTitle = "No Title";
        }
        <kendo-scheduler name="scheduler" 
            date="new DateTime(2021, 6, 13)" 
            start-time="new DateTime(2021, 6, 13, 7, 00, 00)"
            timezone="Etc/UTC"
            height="600">
			<views>
                <view type="day"></view>
                <view type="week" selected="true"></view>
                <view type="month"></view>
                <view type="agenda"></view>
                <view type="timeline"></view>
            </views>
			<resources>
                <resource field="RoomID" title="Room" datatextfield="Text" datavaluefield="Value" datacolorfield="Color" bind-to="@roomsData"></resource>
                <resource field="Attendees" title="Attendees" multiple="true" datatextfield="Text" datavaluefield="Value" datacolorfield="Color" bind-to="@attendeesData"></resource>
            </resources>
            <scheduler-datasource type="@DataSourceTagHelperType.Ajax">
                <transport>
                    <read url="@Url.Action("Meetings_Read", "Scheduler")" />
                    <create url="@Url.Action("Meetings_Create", "Scheduler")" />
                    <destroy url="@Url.Action("Meetings_Destroy", "Scheduler")" />
                    <update url="@Url.Action("Meetings_Update", "Scheduler")" />
                </transport>
                <schema data="Data" total="Total" errors="Errors">
                    <scheduler-model id="MeetingID">
                        <fields>
                            <field name="MeetingID" type="number"></field>
                            <field name="title" from="Title" type="string" default-value="@defaultTitle"></field>
                            <field name="start" from="Start" type="date"></field>
                            <field name="end" from="End" type="date"></field>
                            <field name="description" from="Description" type="string"></field>
                            <field name="recurrenceId" from="RecurrenceID" type="number" default-value=null></field>
                            <field name="recurrenceRule" from="RecurrenceRule" type="string" ></field>
                            <field name="recurrenceException" from="RecurrenceException" type="string"></field>
                            <field name="startTimezone" from="StartTimezone" type="string"></field>
                            <field name="endTimezone" from="EndTimezone" type="string"></field>
                            <field name="isAllDay" from="IsAllDay" type="boolean"></field>
                        </fields>
                    </scheduler-model>
                </schema>
            </scheduler-datasource>
        </kendo-scheduler>
```
{% endif %}

## See Also

* [Grouping the Scheduler Resources]({% slug scheduler_resources_grouping_overview %})
* [Server-Side API](/api/scheduler)
