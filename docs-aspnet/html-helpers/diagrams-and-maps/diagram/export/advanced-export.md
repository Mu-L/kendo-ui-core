---
title: Advanced Export
page_title: Advanced Export
description: "Get started with the Telerik UI Diagram for {{ site.framework }} and learn how to set its advanced export functionality."
slug: htmlhelpers_diagram_aspnetcore_export
position: 2
---

# Advanced Export

The Telerik UI Diagram for {{ site.framework }} provides options for exporting its content to PDF and SVG, and as an Image.

```HtmlHelper
    <button class='export-pdf k-button'>Export as PDF</button>
    <button class='export-img k-button'>Export as Image</button>
    <button class='export-svg k-button'>Export as SVG</button>

   @(Html.Kendo().Diagram()
          .Name("diagram")
          .DataSource(dataSource => dataSource
              .Read(read => read
                  .Action("Export_Read", "Diagram")
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
    <button class='export-pdf k-button'>Export as PDF</button>
    <button class='export-img k-button'>Export as Image</button>
    <button class='export-svg k-button'>Export as SVG</button>

    <kendo-diagram name="diagram" on-data-bound="onDataBound">
        <hierarchical-datasource server-operation="false">
            <transport>
                <read url="@Url.Action("Export_Read", "Diagram")" />
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
```JS JavaScript-export
    <script>
        $(".export-pdf").click(function () {
            var diagram = $("#diagram").getKendoDiagram();
            diagram.exportPDF({ paperSize: "auto", margin: { left: "1cm", top: "1cm", right: "1cm", bottom: "1cm" } }).done(function (data) {
                kendo.saveAs({
                    dataURI: data,
                    fileName: "diagram.pdf",
                    proxyURL: "@Url.Action("Export_Save", "Diagram")"
                });
            });
        });    
        $(".export-img").click(function () {
            var diagram = $("#diagram").getKendoDiagram();
            diagram.exportImage().done(function (data) {
                kendo.saveAs({
                    dataURI: data,
                    fileName: "diagram.png",
                    proxyURL: "@Url.Action("Export_Save", "Diagram")"
                });
            });
        });    
        $(".export-svg").click(function () {
            var diagram = $("#diagram").getKendoDiagram();
            diagram.exportSVG().done(function (data) {
                kendo.saveAs({
                    dataURI: data,
                    fileName: "diagram.svg",
                    proxyURL: "@Url.Action("Export_Save", "Diagram")"
                });
            });
        });
    </script>
```
```JS JavaScript-Template
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
                fill: dataItem.ColorScheme
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
                source: "@Url.Content("~/content/dataviz/diagram/people/")" + dataItem.Image,
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

* [Advanced Export of the Diagram HtmlHelper for {{ site.framework }} (Demo)](https://demos.telerik.com/{{ site.platform }}/diagram/export)
* [Server-Side API](/api/diagram)
