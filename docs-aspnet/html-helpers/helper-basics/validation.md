---
title: Validation
page_title: Validation
description: "Get started with {{ site.product }} and use client-side validation."
slug: validation_aspnetmvc
previous_url: /validation, /getting-started/validation, /getting-started/helper-basics/validation
position: 5
---

# Validation

{{ site.product }} enables you to use client-side validation and provides hints on using the Kendo UI Validator and the default jQuery validation.

## Using the DataAnnotation Attributes

The Validator creates validation rules based on the unobtrusive HTML attributes. These unobtrusive attributes are generated by {{ site.framework }} based on the `DataAnnotation` attributes that are applied to the Model properties. The Validator also creates rules for the unobtrusive attributes that are generated implicitly by {{ site.framework }} for numbers and dates.

The following `DataAnnotation` attributes are supported:

- `Required`
- `StringLength`
- `Range`
- `RegularExpression`

To use the Validator with the `DataAnnotation` attributes:

1. Create a `class` and add the needed `DataAnnotation` attributes.

            public class OrderViewModel
            {
                [HiddenInput(DisplayValue = false)]
                public int OrderID { get; set; }

                [Required]
                [Display(Name = "Customer")]
                public string CustomerID { get; set; }

				[Required]
                [StringLength(15)]
                [Display(Name = "Ship Country")]
                public string ShipCountry { get; set; }

				[Required]
                [Range(1, int.MaxValue, ErrorMessage = "Freight should be greater than 1")]
                [DataType(DataType.Currency)]
                public decimal? Freight { get; set; }

				[Required]
                [Display(Name = "Order Date")]
                public DateTime? OrderDate { get; set; }
            }

1. Pass an instance of the model to the view.

           public ActionResult Create()
            {                
                return View(new OrderViewModel());
            }

1. Create the editors in the view based on the model and initialize the Validator on the form.

            @model OrderViewModel

            @using (Html.BeginForm()) {
                <fieldset>
                    <legend>Order</legend>

                    @Html.HiddenFor(model => model.OrderID)

                    <div class="editor-label">
                        @Html.LabelFor(model => model.CustomerID)
                    </div>
                    <div class="editor-field">
                        @(
                            Html.Kendo().DropDownListFor(model => model.CustomerID)
                                .OptionLabel("Select Customer")
                        )
                        @Html.ValidationMessageFor(model => model.CustomerID)
                    </div>

                    <div class="editor-label">
                        @Html.LabelFor(model => model.ShipCountry)
                    </div>
                    <div class="editor-field">
                        @Html.EditorFor(model => model.ShipCountry)
                        @Html.ValidationMessageFor(model => model.ShipCountry)
                    </div>

                    <div class="editor-label">
                        @Html.LabelFor(model => model.Freight)
                    </div>
                    <div class="editor-field">
                        @Html.Kendo().NumericTextBoxFor(model => model.Freight)
                        @Html.ValidationMessageFor(model => model.Freight)
                    </div>

                    <div class="editor-label">
                        @Html.LabelFor(model => model.OrderDate)
                    </div>
                    <div class="editor-field">
                        @Html.Kendo().DatePickerFor(model => model.OrderDate)
                        @Html.ValidationMessageFor(model => model.OrderDate)
                    </div>

                    <p>
                        <input type="submit" value="Save" />
                    </p>
                </fieldset>
            }

            <script>
                $(function () {
                    $("form").kendoValidator();
                });
            </script>

## Implementing Custom Attributes

To implement a custom validation attribute, include a `ShippedDate` field to the model and implement a `GreaterDateAttribute` attribute that will check whether the selected `ShippedDate` value is greater than the selected `OrderDate`.

{% if site.mvc %}

1. Create a `class` that inherits from `ValidationAttribute` and `IClientValidatable`, and implement the `IsValid` and `GetClientValidationRules` methods.

            [AttributeUsage(AttributeTargets.Property, AllowMultiple = false, Inherited = true)]
            public class GreaterDateAttribute : ValidationAttribute, IClientValidatable
            {
                public string EarlierDateField { get; set; }

                protected override ValidationResult IsValid(object value, ValidationContext validationContext)
                {
                    DateTime? date = value != null ? (DateTime?)value : null;
                    var earlierDateValue = validationContext.ObjectType.GetProperty(EarlierDateField)
                        .GetValue(validationContext.ObjectInstance, null);
                    DateTime? earlierDate = earlierDateValue != null ? (DateTime?)earlierDateValue : null;

                    if (date.HasValue && earlierDate.HasValue && date <= earlierDate)
                    {
                        return new ValidationResult(ErrorMessage);
                    }

                    return ValidationResult.Success;
                }

                public IEnumerable<ModelClientValidationRule> GetClientValidationRules(ModelMetadata metadata, ControllerContext context)
                {
                    var rule = new ModelClientValidationRule
                    {
                        ErrorMessage = ErrorMessage,
                        ValidationType = "greaterdate"
                    };

                    rule.ValidationParameters["earlierdate"] = EarlierDateField;

                    yield return rule;
                }
            }
{% else %}

1. Create a `class` that inherits from the `ValidationAttribute` class and implements the `IClientModelValidator` interface, and add the `IsValid` and `AddValidation` methods.

            [AttributeUsage(AttributeTargets.Property, AllowMultiple = false, Inherited = true)]
            public class GreaterDateAttribute : ValidationAttribute, IClientModelValidator
            {
                public string EarlierDateField { get; set; }

                protected override ValidationResult IsValid(object value, ValidationContext         validationContext)
                {
                    DateTime? date = value != null ? (DateTime?)value : null;
                    var earlierDateValue = validationContext.ObjectType.GetProperty(EarlierDateField)
                        .GetValue(validationContext.ObjectInstance, null);
                    DateTime? earlierDate = earlierDateValue != null ? (DateTime?)earlierDateValue : null;

                    if (date.HasValue && earlierDate.HasValue && date <= earlierDate)
                    {
                        return new ValidationResult(ErrorMessage);
                    }

                    return ValidationResult.Success;
                }

                public void AddValidation(ClientModelValidationContext context)
                {
                    MergeAttribute(context.Attributes, "data-val", "true");
                    var errorMessage = FormatErrorMessage(context.ModelMetadata.GetDisplayName());
                    MergeAttribute(context.Attributes, "data-val-greaterdate", errorMessage);

                    context.Attributes["earlierdate"] = EarlierDateField;
                }

                // Helper method
                private bool MergeAttribute(IDictionary<string, string> attributes, string key, string value)
                {
                    if (attributes.ContainsKey(key))
                    {
                        return false;
                    }
                    attributes.Add(key, value);
                    return true;
                }
            }

{% endif %}
2. Decorate the `ShippedDate` property with the newly implemented attribute.

            public class OrderViewModel
            {
                //omitted for brevity

                [Display(Name = "Order Date")]
                [DataType(DataType.Date)]
                public DateTime? OrderDate { get; set; }

                [GreaterDate(EarlierDateField = "OrderDate", ErrorMessage = "Shipped date should be after Order date")]
                [DataType(DataType.Date)]
                public DateTime? ShippedDate { get; set; }
            }

1. Implement a Validator rule that will handle all inputs with the `data-val-greaterdate` attribute.

            @model OrderViewModel

            @using (Html.BeginForm()) {
                <fieldset>
                    <legend>Order</legend>

                    @Html.HiddenFor(model => model.OrderID)

                    <div class="editor-label">
                        @Html.LabelFor(model => model.OrderDate)
                    </div>
                    <div class="editor-field">
                        @Html.DatePickerFor(model => model.OrderDate)
                        @Html.ValidationMessageFor(model => model.OrderDate)
                    </div>

                    <div class="editor-label">
                        @Html.LabelFor(model => model.ShippedDate)
                    </div>
                    <div class="editor-field">
                        @Html.DatePickerFor(model => model.ShippedDate)
                        @Html.ValidationMessageFor(model => model.ShippedDate)
                    </div>

                    <p>
                        <input type="submit" value="Save" />
                    </p>
                </fieldset>
            }

            {% if site.mvc %}
            <script>
                $(function () {
                    $("form").kendoValidator({
                        rules: {
                            greaterdate: function (input) {
                                if (input.is("[data-val-greaterdate]") && input.val() != "") {
                                    var date = kendo.parseDate(input.val()),
                                        earlierDate = kendo.parseDate($("[name='" + input.attr("data-val-greaterdate-earlierdate") + "']").val());
                                    return !date || !earlierDate || earlierDate.getTime() < date.getTime();
                                }

                                return true;
                            }
                        },
                        messages: {
                            greaterdate: function (input) {
                                return input.attr("data-val-greaterdate");
                            }
                        }
                    });
                });
            </script>
            {% else %}
            <script>
                $(function () {
                    $("form").kendoValidator({
                        rules: {
                            greaterdate: function (input) {
                                if (input.is("[data-val-greaterdate]") && input.val() != "") {
                                    var date = kendo.parseDate(input.val()),
                                        earlierDate = kendo.parseDate($("[name='" + input.attr("earlierdate") + "']").val());
                                    return !date || !earlierDate || earlierDate.getTime() < date.getTime();
                                }

                                return true;
                            }
                        },
                        messages: {
                            greaterdate: function (input) {
                                return input.attr("data-val-greaterdate");
                            }
                        }
                    });
                });
            </script>
            {% endif %}

3. To trigger the custom serve-side validation employed from the attribute, use the `ModelState.IsValid` property

            [HttpPost]
            public ActionResult Submit(OrderViewModel model)
            {
                if (!ModelState.IsValid)
                {
                    // Handle error
                }
        
                return View(model);
            }


## Applying Custom Attributes in Editable Helpers

Editable helpers, such as the Grid and ListView, initialize the Validator internally. To specify custom rules, you have to extend the built-in validation rules of the Validator. You can also use this approach to define rules after the scripts are included and to use them in all views.

    <script>
        (function ($, kendo) {
            $.extend(true, kendo.ui.validator, {
                rules: {
                    greaterdate: function (input) {
                        if (input.is("[data-val-greaterdate]") && input.val() != "") {
                            var date = kendo.parseDate(input.val()),
                                earlierDate = kendo.parseDate($("[name='" + input.attr("data-val-greaterdate-earlierdate") + "']").val());
                            return !date || !earlierDate || earlierDate.getTime() < date.getTime();
                        }

                        return true;
                    }
                },
                messages: {
                    greaterdate: function (input) {
                        return input.attr("data-val-greaterdate");
                    }
                }
            });
        })(jQuery, kendo);
    </script>

    @(
        Html.Kendo().Grid<OrderViewModel>()
            .Name("grid")
            .Columns(columns =>
                {
                    columns.Bound(o => o.OrderDate);
                    columns.Bound(o => o.ShippedDate);
                    columns.Command(command => command.Edit());
                })
            .DataSource(source => source
                .Ajax()
                .Model(model => model.Id(o => o.OrderID))
                .Read("Read", "Orders")
                .Update("Update", "Orders")
            )
    )

## Employing jQuery Validation

1. Add the latest version of the [`jquery.validate`](http://www.nuget.org/packages/jQuery.Validation/) and [`jquery.validate.unobtrusive`](http://www.nuget.org/packages/Microsoft.jQuery.Unobtrusive.Validation/) scripts to the project.
1. Include them in the view in which you want to validate the user input or in the layout.
1. After including the scripts, override the default `ignore` setting to enable the validation of the hidden elements&mdash;for example, helpers like the DropDownList and NumericTextBox have a hidden input to keep the value.

            <script src="@Url.Content("~/Scripts/jquery.validate.min.js")"></script>
            <script src="@Url.Content("~/Scripts/jquery.validate.unobtrusive.min.js")"></script>
            <script type="text/javascript">
                $.validator.setDefaults({
                    ignore: ""
                });
            </script>

1. Define the model and create the editors. For more information, refer to the [section on using the Validator with `DataAnnotation` attributes](#using-the-dataannotation-attributes).

{% if site.mvc %}
## Changing the Styles When Validation Errors Occur

The validation error classes are applied to the inputs that are validated so that the style will not be visible for helpers that use a hidden input to keep their value. To show an error style, copy the class to the visible helper by using the approach from the [`kendo-input-widgets-validation` sample project on GitHub](https://github.com/telerik/kendo-examples-asp-net-mvc).
{% endif %}

## See Also

{% if site.core %}
* [Telerik UI for ASP.NET Core Fundamentals]({% slug fundamentals_core %})
* [Telerik UI for ASP.NET Core Download and Installation]({% slug downloadinstall_aspnetcore %})
{% else %}
* [Telerik UI for ASP.NET MVC Fundamentals]({% slug fundamentals_aspnetmvc %})
* [Telerik UI for ASP.NET MVC Troubleshooting on Validation]({% slug troubleshooting_validation_aspnetmvc %})
* [Telerik UI for ASP.NET MVC Download and Installation]({% slug downloadinstall_aspnetcore %})
{% endif %}

