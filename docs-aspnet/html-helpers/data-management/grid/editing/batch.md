---
title: Batch
page_title: Batch Editing
description: "Enable cell edit mode and batch updates in Telerik UI Grid component for {{ site.framework }}."
slug: batchediting_grid_aspnetcore
position: 4
---

# Batch Editing

The Telerik UI Grid component for {{ site.framework }} enables you to implement cell editing and make and save batch updates.

For a runnable example, refer to the [demo on batch editing of the Grid](https://demos.telerik.com/{{ site.platform }}/grid/editing).

> Defining a Schema.Model.Id is mandatory for the proper execution of the Update, Create and Destroy of the Grid.

{% if site.mvc %}
1. Create a new ASP.NET MVC application. If you have installed the [Telerik UI for ASP.NET MVC Visual Studio Extensions]({% slug newprojectwizard_visualstudio_kendoui %}), create a Telerik UI for ASP.NET MVC application. Name the application `KendoGridBatchEditing`. If you decided not to use the Telerik UI for ASP.NET MVC Visual Studio Extensions, follow the steps from the [introductory article]({% slug gettingstarted_aspnetmvc %}) to add Telerik UI for ASP.NET MVC to the application.
1. Add a new `Entity Framework Data Model`. Right-click the `~/Models` folder in the solution explorer and pick **Add new item**. Choose **Data** > **ADO.NET Entity Data Model** in the **Add New Item** dialog. Name the model `Northwind.edmx` and click **Next**. This starts the **Entity Data Model Wizard**.

    ![{{ site.product_short }} A new entity data model](../images/grid-entity-data-model.png)

1. Pick the **Generate from database** option and click **Next**. Configure a connection to the Northwind database. Click **Next**.

    ![{{ site.product_short }} Choosing the connection](../images/grid-entity-data-model.png)

1. Choose the **Products** table from the **Which database objects do you want to include in your model?**. Leave all other options as they are set by default. Click **Finish**.

    ![{{ site.product_short }} Choosing the Products table in the database objects](../images/grid-binding-choose-database-objects.png)
{% endif %}

1. Add a new class to the `~/Models` folder. The following example uses the `ProductViewModel` name.

    ```C#
    public class ProductViewModel
    {
        public int ProductID { get; set; }
        // The ProductName property is required.
        [Required]
        public string ProductName { get; set; }
        // Use the Integer editor template for the UnitsInStock property.
        [UIHint("Integer")]
        public short? UnitsInStock { get; set; }
    }
    ```

1.  Open `HomeController.cs` and add a new action method which will return the **Products** as JSON. The Grid will make Ajax requests to this action.

    ```C#
    public ActionResult Products_Read([DataSourceRequest]DataSourceRequest request)
    {
        // ToDataSourceResult works with IEnumerable and IQueryable.
        using (var northwind = new NorthwindEntities())
        {
            IQueryable<Product> products = northwind.Products;
            DataSourceResult result = products.ToDataSourceResult(request);
            return Json(result);
        }
    }
    ```

1. Add a new action method to `HomeController.cs`. It will be responsible for saving the new data items. Name the method `Products_Create`.

    ```C#
    public ActionResult Products_Create([DataSourceRequest]DataSourceRequest request, [Bind(Prefix="models")]IEnumerable<ProductViewModel> products)
    {
        // Will keep the inserted entities here. Used to return the result later.
        var entities = new List<Product>();
        if (ModelState.IsValid)
        {
            using (var northwind = new NorthwindEntities())
            {
                foreach (var product in products)
                {
                    // Create a new Product entity and set its properties from the posted ProductViewModel.
                    var entity = new Product
                    {
                        ProductName = product.ProductName,
                        UnitsInStock = product.UnitsInStock
                    };
                    // Add the entity.
                    northwind.Products.Add(entity);
                    // Store the entity for later use.
                    entities.Add(entity);
                }
                // Insert the entities in the database.
                northwind.SaveChanges();
            }
        }
        // Return the inserted entities. The Grid needs the generated ProductID. Also return any validation errors.
        return Json(entities.ToDataSourceResult(request, ModelState, product => new ProductViewModel
        {
            ProductID = product.ProductID,
            ProductName = product.ProductName,
            UnitsInStock = product.UnitsInStock
        }));
    }
    ```

1. Add a new action method to `HomeController.cs`. It will be responsible for saving the updated data items. Name the method `Products_Update`.

    ```C#
    public ActionResult Products_Update([DataSourceRequest]DataSourceRequest request, [Bind(Prefix = "models")]IEnumerable<ProductViewModel> products)
    {
        // Will keep the updated entities here. Used to return the result later.
        var entities = new List<Product>();
        if (ModelState.IsValid)
        {
            using (var northwind = new NorthwindEntities())
            {
                foreach (var product in products)
                {
                    // Create a new Product entity and set its properties from the posted ProductViewModel.
                    var entity = new Product
                    {
                        ProductID = product.ProductID,
                        ProductName = product.ProductName,
                        UnitsInStock = product.UnitsInStock
                    };
                    // Store the entity for later use.
                    entities.Add(entity);
                    // Attach the entity.
                    northwind.Products.Attach(entity);
                    // Change its state to Modified so Entity Framework can update the existing product instead of creating a new one.
                    northwind.Entry(entity).State = EntityState.Modified;
                    // Or use ObjectStateManager if using a previous version of Entity Framework.
                    // northwind.ObjectStateManager.ChangeObjectState(entity, EntityState.Modified);
                }
                // Update the entities in the database.
                northwind.SaveChanges();
            }
        }
        // Return the updated entities. Also return any validation errors.
        return Json(entities.ToDataSourceResult(request, ModelState, product => new ProductViewModel
        {
            ProductID = product.ProductID,
            ProductName = product.ProductName,
            UnitsInStock = product.UnitsInStock
        }));
    }
    ```

1. Add a new action method to `HomeController.cs`. It will be responsible for saving the deleted data items. Name the method `Products_Destroy`.

    ```C#
    public ActionResult Products_Destroy([DataSourceRequest]DataSourceRequest request, [Bind(Prefix = "models")]IEnumerable<ProductViewModel> products)
    {
        // Will keep the destroyed entities here. Used to return the result later.
        var entities = new List<Product>();
        if (ModelState.IsValid)
        {
            using (var northwind = new NorthwindEntities())
            {
                foreach (var product in products)
                {
                    // Create a new Product entity and set its properties from the posted ProductViewModel.
                    var entity = new Product
                    {
                        ProductID = product.ProductID,
                        ProductName = product.ProductName,
                        UnitsInStock = product.UnitsInStock
                    };
                    // Store the entity for later use.
                    entities.Add(entity);
                    // Attach the entity.
                    northwind.Products.Attach(entity);
                    // Delete the entity.
                    northwind.Products.Remove(entity);
                    // Or use DeleteObject if using a previous version of Entity Framework.
                    // northwind.Products.DeleteObject(entity);
                }
                // Delete the entity in the database.
                northwind.SaveChanges();
            }
        }
        // Return the destroyed entities. Also return any validation errors.
        return Json(entities.ToDataSourceResult(request, ModelState, product => new ProductViewModel
        {
            ProductID = product.ProductID,
            ProductName = product.ProductName,
            UnitsInStock = product.UnitsInStock
        }));
    }
    ```

1. In the view, configure the Grid to use the action methods that were created in the previous steps. The `Create`, `Update`, and `Destroy` action methods have to return a collection with the modified or deleted records which will enable the DataSource to apply the changes accordingly. The `Create` method has to return a collection of the created records with the assigned ID field.

    ```HtmlHelper
        @(Html.Kendo().Grid<KendoGridBatchEditing.Models.ProductViewModel>()
                .Name("grid")
                .Columns(columns =>
                {
                    columns.Bound(product => product.ProductID).Width(100);
                    columns.Bound(product => product.ProductName);
                    columns.Bound(product => product.UnitsInStock).Width(250);
                    columns.Command(commands =>
                    {
                        commands.Destroy(); // The "destroy" command removes data items.
                    }).Title("Commands").Width(200);
                })
                .ToolBar(toolbar =>
                {
                    toolbar.Create(); // The "create" command adds new data items.
                    toolbar.Save(); // The "save" command saves the changed data items.
                })
                .Editable(editable => editable.Mode(GridEditMode.InCell)) // Use in-cell editing mode.
                .DataSource(dataSource =>
                    dataSource.Ajax()
                    .Batch(true) // Enable batch updates.
                    .Model(model =>
                    {
                        model.Id(product => product.ProductID); // Specify the property which is the unique identifier of the model.
                        model.Field(product => product.ProductID).Editable(false); // Make the ProductID property not editable.
                    })
                    .Create(create => create.Action("Products_Create", "Home")) // Action method invoked when the user saves a new data item.
                    .Read(read => read.Action("Products_Read", "Home"))  // Action method invoked when the Grid needs data.
                    .Update(update => update.Action("Products_Update", "Home"))  // Action method invoked when the user saves an updated data item.
                    .Destroy(destroy => destroy.Action("Products_Destroy", "Home")) // Action method invoked when the user removes a data item.
                )
                .Pageable()
        )
    ```
    {% if site.core %}
    ```TagHelper
        <kendo-grid name="grid" height="550">
            <datasource  page-size="20" type="DataSourceTagHelperType.Custom" custom-type="odata" batch="true">
                <transport>
                    <read url="https://demos.telerik.com/kendo-ui/service/Northwind.svc/Products" />
                    <update url="https://demos.telerik.com/kendo-ui/service/Northwind.svc/Products/Update"  />
                    <destroy url="https://demos.telerik.com/kendo-ui/service/Northwind.svc/Products/Destroy"   />
                    <create url="https://demos.telerik.com/kendo-ui/service/Northwind.svc/Products/Create" />
                </transport>
                <schema  >
                    <model id="ProductID">
                        <fields>
                            <field name="ProductName"></field>
                            <field name="UnitPrice" type="number"></field>
                            <field name="UnitsInStock" type="number"></field>
                        </fields>
                    </model>
                </schema>
            </datasource>
            <editable mode="incell" />
            <pageable button-count="5" refresh="true" page-sizes="new int[] { 5, 10, 20 }">
            </pageable>
            <toolbar> <!-- Enable the built-in grid's Toolbar commands "create", "save", and "cancel". -->
                <toolbar-button name="create" text="Add new record"></toolbar-button> <!-- Adds an empty row to the grid to create a new record. -->
                <toolbar-button name="save" text="Save Changes"></toolbar-button> <!-- Saves the new and the edited records. -->
                <toolbar-button name="cancel" text="Cancel Changes"></toolbar-button> <!-- Reverts any data changes done by the end user. -->
            </toolbar>
            <columns>
                <column field="ProductName" title="Product Name" width="240" />
                <column field="UnitPrice" title="Unit Price" />
                <column field="UnitsInStock" title="Units In Stock" />
                <column field="Discontinued" title="Discontinued" width="150" />
                <column>
                    <commands>
                        <column-command text="Delete" name="destroy"></column-command>
                    </commands>
                </column>
            </columns>
        </kendo-grid>
    ```
    {% endif %}

## See Also

{% if site.core %}
* [ASP.NET Core DataGrid Homepage](https://www.telerik.com/aspnet-core-ui/grid)
{% endif %}
* [Batch Editing by the Grid HtmlHelper for {{ site.framework }} (Demo)](https://demos.telerik.com/{{ site.platform }}/grid/editing)
* [Server-Side API](/api/grid)
