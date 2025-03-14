---
title: Remote Binding
page_title: Remote Data Binding
description: "Get started with the Telerik UI Diagram for {{ site.framework }} featuring a built-in DataSource which allows you to bind the Diagram to remote data."
slug: htmlhelpers_diagram_aspnetcore_binding
position: 1
---

# Remote Binding

The Telerik UI Diagram for {{ site.framework }} provides a templating engine and a built-in DataSource which allow you to quickly set up and implement the data-binding functionality.

## Getting Started

To bind the Diagram to remote data, specify the `DataSource` option. You can either create the data source outside the Diagram, or pass it in it. If multiple Diagrams are bound to the same data set, you have to create the data source as an object to which you can refer in the different helpers. If the Diagram is the only item that is bound to the data, create it inline.

```HtmlHelper
    @(Html.Kendo().Diagram()
            .Name("diagram")
            .DataSource(dataSource => dataSource
                // the default type of the DataSource is Custom
                .Read(read => read
                    .Action("_OrgChart", "Diagram")
                )
                .Model(m => m.Children("Items"))
            )
            .ShapeDefaults(sd => sd
                .Visual("visualTemplate")
            )
            // Other configuration.
    )
```
{% if site.core %}
```TagHelper
    <kendo-diagram name="diagram" on-data-bound="onDataBound">
        <hierarchical-datasource server-operation="false">
            <transport>
                <read url="@Url.Action("_OrgChart", "Diagram")" />
            </transport>
            <schema>
                <hierarchical-model children="Items"></hierarchical-model>
            </schema>
        </hierarchical-datasource>
        <shape-defaults visual="visualTemplate"></shape-defaults>
    </kendo-diagram>
```
```Controller
        public ActionResult _OrgChart()
        {
            return Json(DiagramDataRepository.OrgChart());
            // The returned data from the remote endpoint has to be in JSON format.
        }
```
{% else %}

```Controller
        public ActionResult _OrgChart()
        {
            return Json(DiagramDataRepository.OrgChart(), JsonRequestBehavior.AllowGet);
            // The returned data from the remote endpoint has to be in JSON format.
        }
```
{% endif %}

## Customizing the Appearance

To create a network of visuals and customize the appearance of the Diagram, set its `Visual` configuration.

```HtmlHelper
    @(Html.Kendo().Diagram()
              .Name("diagram")
              .DataSource(dataSource => dataSource
                  .Read(read => read
                      .Action("_OrgChart", "Diagram")
                  )
                  .Model(m => m.Children("Items"))
              )
              .Editable(false)
              .Layout(l => l.Type(DiagramLayoutType.Layered))
              .ShapeDefaults(sd => sd
                  .Visual("visualTemplate")
              )
              .ConnectionDefaults(cd => cd
                  .Stroke(s => s
                      .Color("#979797")
                      .Width(2)
                  )
              )
              .Events(events => events.DataBound("onDataBound"))
    )
```
{% if site.core %}
```TagHelper
    <kendo-diagram name="diagram" on-data-bound="onDataBound">
        <hierarchical-datasource server-operation="false">
            <transport>
                <read url="@Url.Action("_OrgChart", "Diagram")" />
            </transport>
            <schema>
                <hierarchical-model children="Items"></hierarchical-model>
            </schema>
        </hierarchical-datasource>
        <editable enabled="false" />
        <layout type="DiagramLayoutType.Layered"></layout>
        <shape-defaults visual="visualTemplate"></shape-defaults>
        <connection-defaults>
            <stroke color="#979797" width="2" />
        </connection-defaults>
    </kendo-diagram>
```
{% endif %}
```JavaScript
        <script>
            function visualTemplate(options) {
                var dataviz = kendo.dataviz;
                var g = new dataviz.diagram.Group();
                var dataItem = options.dataItem;
                g.append(new dataviz.diagram.Rectangle({
                    width: 210,
                    height: 75,
                    stroke: {
                        width: 0
                    },
                    fill: {
                        gradient: {
                            type: "linear",
                            stops: [{
                                color: dataItem.ColorScheme,
                                offset: 0,
                                opacity: 0.5
                            }, {
                                color: dataItem.ColorScheme,
                                offset: 1,
                                opacity: 1
                            }]
                        }
                    }
                }));
                g.append(new dataviz.diagram.TextBlock({
                    text: dataItem.FirstName + " " + dataItem.LastName,
                    x: 85,
                    y: 20,
                    color: "#fff"
                }));
                g.append(new dataviz.diagram.TextBlock({
                    text: dataItem.Title,
                    x: 85,
                    y: 40,
                    color: "#fff"
                }));
                g.append(new dataviz.diagram.Image({
                    source: "@Url.Content("~/shared/dataviz/diagram/people/")" + dataItem.Image,
                    x: 3,
                    y: 3,
                    width: 68,
                    height: 68
                }));
                return g;
            }
            function onDataBound() {
                this.bringIntoView(this.shapes);
            }
        </script>
```

## See Also

* [Basic Usage of the Diagram HtmlHelper for {{ site.framework }} (Demo)](https://demos.telerik.com/{{ site.platform }}/diagram)
* [Server-Side API](/api/diagram)
{% if site.core %}
* [Diagram in Razor Pages]({% slug razorpages_diagramhelper_aspnetcore %})
{% endif %}
