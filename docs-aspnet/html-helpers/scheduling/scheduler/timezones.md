---
title: Timezones
page_title: Timezones
description: "Get started with the Scheduler component for {{ site.framework }} and learn how to configure its timezone."
slug: htmlhelpers_scheduler_timezones_aspnetcore
position: 5
---

# Timezones

A [timezone](http://www.timeanddate.com/time/time-zones.html) refers to any of the 24 regions loosely divided by longitude and which keep the same time standard.

## Getting Started

To set a timezone to the Scheduler, set the `timezone` option. `timezone` indicates the desired timezone to be applied when the Scheduler displays the appointment dates. By default, the `timezone` option is not set and, as a result, the event dates will be created based on the current client timezone offset. This means that users from different timezones will see different start and end times. On the other hand, setting the Scheduler timezone will display the same start and end times regardless of the timezone of the user.

> * When you use remote binding, the Scheduler expects to receive UTC dates. Respectively, it will send them back to the server in UTC. The service in use is responsible for keeping the dates in UTC, without offsetting them against its local time.
> * When you bind the Scheduler to a remote service, keep the `timezone` option always set to, for example, `"Etc/UTC"`.
> * When the `timezone` option of the Scheduler is not set, the current system timezone offset is used.
> * The recommended `Date` format for sending and receiving Scheduler event dates is [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) with a **Z** zone designator (UTC date). The same format is used by the [`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) method, which converts JavaScript `Date` objects to JSON strings.
> The kendo.timezones.min.js file must be included in order to use timezones other than "Etc/UTC".

The following example demonstrates how to set `"Etc/UTC"` timezone to the Scheduler.

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
    @addTagHelper *, Kendo.Mvc

    @{
        string defaultTitle = "No Title";
    }

    <kendo-scheduler name="scheduler"
        date="new DateTime(2013, 6, 13)"
        start-time="new DateTime(2013, 6, 13, 7, 0, 0, 0)"
        height="600"
        timezone="Etc/UTC">
        <views>
            <view type="day"></view>
            <view type="week" selected="true"></view>
        </views>
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

## Reading Events from Data Source

If the `timezone` option is defined, the Scheduler will remove the local timezone offset, converting dates to UTC. Then, it will apply the defined timezone value, for exampe, **America/New_York**.

## Sending Events to Remote Service

If the `timezone` option is defined, the Scheduler will remove the applied timezone offset, for example, **America/New_York**, converting dates to UTC. Then, it will apply the local time.

The `SchedulerEvent` instances are serialized by using [`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify). In the process, the dates are converted to UTC and then formatted according to the [ISO8601 format](https://en.wikipedia.org/wiki/ISO_8601).

## Setting the No Timezone Option

If you do not define a timezone option, your system timezone settings will apply by default.

## Live Sample

You can find a full working sample with Timezone defined and different cultures set dynamically here:

[Localization and Globalization](https://demos.telerik.com/aspnet-mvc/scheduler/globalization)

## See Also

* [Server-Side API](/api/scheduler)
* [Knowledge Base: Change Timezone in Scheduler Dynamically]({% slug scheduler-change-timezone %})
