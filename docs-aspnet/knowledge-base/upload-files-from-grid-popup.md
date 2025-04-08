---
title: Upload Files from Grid Popup Editor
description: Learn how to use the Telerik UI for {{ site.framework }} Upload component to upload files from a Popup editable Grid.
type: how-to
page_title: Upload Files from Grid Popup Editor
slug: upload-files-from-grid-popup
tags: upload, file, grid, popup, editor, template, core, mvc, telerik
previous_url: /helpers/editors/upload/how-to/upload-files-from-grid, /html-helpers/editors/upload/how-to/upload-files-from-grid
res_type: kb
component: upload
---

## Environment

<table>
 <tr>
  <td>Product</td>
  <td>{{ site.product }} Upload</td>
 </tr>
 <tr>
  <td>Progress {{ site.product }} version</td>
  <td>2024.4.1112</td>
 </tr>
</table>

## Description

How can I add and use the Upload component in the [Popup editable Grid]({% slug popupediting_grid_aspnetcore%})?

## Solution

The example below shows how to integrate the Upload component into the custom template of a [Popup editable Grid](https://demos.telerik.com/aspnet-mvc/grid/editing-popup).

1. Define a Popup editable Grid that uses a custom editor template.

    ```HtmlHelper
        @(Html.Kendo().Grid<FileViewModel>()
            .Name("grid")
            .Columns(columns =>
            {
                columns.Bound(p => p.FileId);
                columns.Bound(p => p.FileName);
                columns.Command(command => { command.Edit(); command.Destroy(); }).Width(200);
            })
            .ToolBar(toolbar => toolbar.Create())
            .Editable(editable => editable.Mode(GridEditMode.PopUp).TemplateName("CustomPopupEditor"))
            .Pageable()
            .Scrollable()
            .HtmlAttributes(new { style = "height:550px;" })
            .DataSource(dataSource => dataSource
                .Ajax()
                .PageSize(20)
                .Model(m =>
                {
                    m.Id(f => f.FileId);
                    m.Field(f => f.FileId).Editable(false);
                })
                .Read(read => read.Action("Read", "Grid"))
                .Update(update => update.Action("Update", "Grid"))
                .Create(create => create.Action("Create", "Grid"))
                .Destroy(destroy => destroy.Action("Destroy", "Grid"))
            )
        )

    ```
    {% if site.core %}
    ```TagHelper
        @addTagHelper *, Kendo.Mvc

        <kendo-grid name="grid" height="550">
            <datasource type="DataSourceTagHelperType.Ajax" page-size="20">
                <schema data="Data" total="Total">
                    <model id="OrderID">
                        <fields>
                            <field name="FileId" type="number" editable="false"></field>
                            <field name="FileName" type="string"></field>
                        </fields>
                    </model>
                </schema>
                <transport>
                    <read url="@Url.Action("Read", "Grid")" />
                    <update url="@Url.Action("Update", "Grid")" />
                    <create url="@Url.Action("Create", "Grid")" />
                    <destroy url="@Url.Action("Destroy", "Grid")" />
                </transport>
            </datasource>
            <columns>
                <column field="FileId" />
                <column field="FileName" />
                </column>
                <column>
                    <commands>
                        <column-command text="Edit" name="edit"></column-command>
                        <column-command text="Delete" name="destroy"></column-command>
                    </commands>
                </column>
            </columns>
            <toolbar>
                <toolbar-button name="create"></toolbar-button>
            </toolbar>
            <pageable enabled="true" />
            <scrollable enabled="true" />
            <editable mode="popup" template-id="popup-editor" /> 
        </kendo-grid>

        <script id="popup-editor" type="text/x-kendo-template">
            @Html.Partial("~/Views/Shared/EditorTemplates/CustomPopupEditor.cshtml")
        </script>
    ```
    {% endif %}
    ```C# GridController

        public ActionResult Read([DataSourceRequest] DataSourceRequest request)
        {
            return Json(gridService.Read().ToDataSourceResult(request));
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Update([DataSourceRequest] DataSourceRequest request, FileViewModel file)
        {
            if (file != null && ModelState.IsValid)
            {
                gridService.Update(file);
            }

            return Json(new[] {file}.ToDataSourceResult(request,ModelState));
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Create([DataSourceRequest] DataSourceRequest request, FileViewModel file)
        {
            if (file != null && ModelState.IsValid)
            {
                gridService.Create(file);
            }

            return Json(new[] { file }.ToDataSourceResult(request, ModelState));
        }

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Destroy([DataSourceRequest] DataSourceRequest request, FileViewModel file)
        {
            if (file != null)
            {
                gridService.Destroy(file);
            }

            return Json(new[] { file }.ToDataSourceResult(request, ModelState));
        }
    ```
    ```Model

        public class FileViewModel
        {
            public int FileId { get; set; }

            public string FileName { get; set; }
        }
    ```

1. Create the custom editor template `CustomPopupEditor.cshtml` in the `~/Views/Shared/EditorTemplates` folder. Define the `FileName` property as read-only, since it will be populated dynamically based on the uploaded file in the next Step. Also, handle the [`Success`](https://docs.telerik.com/aspnet-mvc/api/kendo.mvc.ui.fluent/uploadeventbuilder#successsystemstring) event of the Upload control to get the name of the uploaded file.

    ```Razor CustomPopupEditor.cshtml
        @model FileViewModel

        @Html.HiddenFor(model => model.FileId)

        @(Html.Kendo().TextBoxFor(m => m.FileName).Readonly(true))

        <br/><br/>
        
        @(Html.Kendo().Upload()
            .Name("file")
            .Multiple(false)
            .Async(a => a
                .Save("SaveFile", "Grid")
                .Remove("RemoveFile", "Grid")
                .AutoUpload(true)
            )
            .Validation(validation => validation.AllowedExtensions(new string[] { ".gif", ".jpg", ".jpeg", ".png" }))
            .Validation(validation => validation.MaxFileSize(3145728))
            .Events(ev => ev.Success("onUploadSuccess"))
        )
    ```

1. Set up the `Save` and `Remove` Action methods of the Upload.

    {% if site.core %}
    ```C# GridController
    public IWebHostingEnvironment WebHostEnvironment { get; set; }

    public GridController(IWebHostEnvironment webHostEnvironment)
    {
        WebHostEnvironment = webHostEnvironment;
    }

    public async Task<ActionResult> SaveFile(IEnumerable<IFormFile> files)
    {
        // The Name of the Upload component is "files".
        if (files != null)
        {
            foreach (var file in files)
            {
                var fileContent = ContentDispositionHeaderValue.Parse(file.ContentDisposition);

                // Some browsers send file names with full path.
                // We are only interested in the file name.
                var fileName = Path.GetFileName(fileContent.FileName.ToString().Trim('"'));
                var physicalPath = Path.Combine(WebHostEnvironment.WebRootPath, "App_Data", fileName);

                using (var fileStream = new FileStream(physicalPath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }
            }
        }

        // Return an empty string to signify success.
        return Content("");
    }

    public ActionResult RemoveFile(string[] fileNames)
    {
        // The parameter of the Remove action must be called "fileNames".

        if (fileNames != null)
        {
            foreach (var fullName in fileNames)
            {
                var fileName = Path.GetFileName(fullName);
                var physicalPath = Path.Combine(WebHostEnvironment.WebRootPath, "App_Data", fileName);

                // TODO: Verify user permissions.

                if (System.IO.File.Exists(physicalPath))
                {
                    System.IO.File.Delete(physicalPath);
                }
            }
        }

        // Return an empty string to signify success.
        return Content("");
    }
    ```
    {% else %}
    ```C# GridController
        public ActionResult SaveFile(HttpPostedFileBase file)
        {
            if (file != null)
            {
                //// Some browsers send file names with full path.
                //// We are only interested in the file name.
                var fileName = Path.GetFileName(file.FileName.Trim('"'));
                var physicalPath = Path.Combine(Server.MapPath("~/App_Data"), fileName);
                file.SaveAs(physicalPath);
            }

            // Return an empty string to signify success
            return Content("");
        }

        public ActionResult RemoveFile(string fileNames)
        {
            // The parameter of the Remove action must be called "fileNames"
            if (fileNames != null)
            {
                var fileName = Path.GetFileName(fileNames);
                var physicalPath = Path.Combine(Server.MapPath("~/App_Data"), fileName);

                // TODO: Verify user permissions
                if (System.IO.File.Exists(physicalPath))
                {
                    System.IO.File.Delete(physicalPath);
                }
            }

            // Return an empty string to signify success
            return Content("");
        }
    ```
    {% endif %}

1. Update the value of the `FileName` Model property with the name of the uploaded file in the Upload `Success` event handler. 

    ```
        <script>
            function onUploadSuccess(e) {
                var files = e.files;
                var grid = $("#grid").getKendoGrid(); // Get a reference to the Grid
                var fileNameTextBox = $("#FileName").data("kendoTextBox"); //Get a reference to the TextBox editor in the Popup template
                if (e.operation == "upload") {
                    var uploadedFileName = e.files[0].name; // Get the name of the successfully uploaded file.
                    fileNameTextBox.value(uploadedFileName); // Change the TextBox value based on the name of the uploaded file.
                    fileNameTextBox.trigger("change"); // It is required to trigger the 'change' event manually.
                    grid.editable.options.model.set("FileName", uploadedFileName); //Update the "FileName" Model property based on the uploaded file name.
                }
                if(e.operation == "remove") {
                    fileNameTextBox.value("");
                    fileNameTextBox.trigger("change");
                    grid.editable.options.model.set("FileName", "");
                }
            }
        </script>
    ```

## More {{ site.framework }} Upload Resources

* [{{ site.framework }} Upload Documentation]({%slug htmlhelpers_upload_aspnetcore%})

* [{{ site.framework }} Upload Demos](https://demos.telerik.com/{{ site.platform }}/upload/index)

{% if site.core %}
* [{{ site.framework }} Upload Product Page](https://www.telerik.com/aspnet-core-ui/upload)

* [Telerik UI for {{ site.framework }} Video Onboarding Course (Free for trial users and license holders)]({%slug virtualclass_uiforcore%})

* [Telerik UI for {{ site.framework }} Forums](https://www.telerik.com/forums/aspnet-core-ui)

{% else %}
* [{{ site.framework }} Upload Product Page](https://www.telerik.com/aspnet-mvc/upload)

* [Telerik UI for {{ site.framework }} Video Onboarding Course (Free for trial users and license holders)]({%slug virtualclass_uiformvc%})

* [Telerik UI for {{ site.framework }} Forums](https://www.telerik.com/forums/aspnet-mvc)
{% endif %}

## See Also

* [Client-Side API Reference of the Upload for {{ site.framework }}](https://docs.telerik.com/kendo-ui/api/javascript/ui/upload)
* [Server-Side API Reference of the Upload for {{ site.framework }}](https://docs.telerik.com/{{ site.platform }}/api/upload)
{% if site.core %}
* [Server-Side TagHelper API Reference of the Upload for {{ site.framework }}](https://docs.telerik.com/aspnet-core/api/taghelpers/upload)
{% endif %}
* [Telerik UI for {{ site.framework }} Breaking Changes]({%slug breakingchanges_2024%})
* [Telerik UI for {{ site.framework }} Knowledge Base](https://docs.telerik.com/{{ site.platform }}/knowledge-base)